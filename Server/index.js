const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const mariadb = require("mariadb");
const env = require("dotenv");
const path = require("path");
const MySQLStore = require("express-mysql-session")(session);

// Load environment variables
env.config();

// Config
const Port = 5000;

// Connect to database
const db_options = {
  host: process.env.db_host || "localhost",
  user: process.env.db_user || "root",
  password: process.env.db_password || "root",
  port: Number(process.env.db_port) || 3306,
  database: process.env.db_database || "CS494_Final",
};
const Pool = mariadb.createPool(db_options);

// Setup database in-case it's not already setup.
(async () => {
  let conn;

  try {
    conn = await Pool.getConnection();
    await conn.importFile({
      file: path.join(__dirname, "schema.sql"),
    });
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
})();

// App initialization
const App = express();

// Setup middleware
App.use(express.json());

// CORS middleware to allow credentials from frontend
App.use((req, res, next) => {
  const allowedOrigin = process.env.ENVIRONMENT === 'production' 
    ? 'https://gamedeals.top'
    : 'http://localhost:5173';
  
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const sessionStore = new MySQLStore(db_options);
App.use(
  session({
    secret:
      process.env.session_secret ||
      "DingoOcelotBullBuffaloWhaleCrowWolverineShrewJackalBasilisk",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      sameSite: 'Lax',
      secure: process.env.ENVIRONMENT === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  }),
);

// Custom middleware for checking authentication
const Authenticated = (req, res, next) => {
  if (req.session.Authenticated === true) {
    next();
  } else {
    res.status(401).send();
    return;
  }
};

// Api endpoints

App.get("/", (req, res) => {
  res.status(200).send();
});

// {User, Pass}
App.post("/signup", async (req, res) => {
  if (!req.body.User || !req.body.Pass || req.body.User.includes(" ")) {
    res.status(400).send(); // Malformed
    return;
  }

  // Hash password
  let hash;
  try {
    hash = await bcrypt.hash(req.body.Pass, 10);
  } catch (err) {
    res.status(500).send(); // Internal Server Error
    throw err;
  }

  let conn;

  try {
    conn = await Pool.getConnection();

    await conn.query("INSERT INTO User (Username, Password) VALUES (?, ?);", [
      req.body.User,
      hash,
    ]);

    req.session.regenerate((err) => {
      if (err) {
        res.status(500).send(); // Internal Server Error
        throw err;
      }

      req.session.Authenticated = true;
      req.session.Username = req.body.User;
      res.status(200).send(); // Success
    });
  } catch (err) {
    if (err.errno === 1062) {
      res.status(409).send(); // Primary key conflict, user already exists
    } else {
      res.status(500).send(); // Internal Server Error
    }
    throw err;
  } finally {
    if (conn) conn.release();
  }
});

// {User, Pass}
App.post("/signin", async (req, res) => {
  if (!req.body.User || !req.body.Pass) {
    res.status(400).send(); // Malformed
    return;
  }

  // Retrieve hash for given user
  let hash;
  let conn;
  try {
    conn = await Pool.getConnection();

    const response = await conn.query(
      "SELECT Password FROM User WHERE Username = ?",
      [req.body.User],
    );

    if (response.length != 1) {
      res.status(401).send(); // Unauthorized
      return;
    }

    hash = response[0]["Password"];
  } catch (err) {
    res.status(500).send(); // Internal Server Error
    throw err;
  } finally {
    if (conn) conn.release();
  }

  // Compare the hash
  if (!bcrypt.compareSync(req.body.Pass, hash)) {
    // Invalid password
    res.status(401).send(); // Unauthorized
    return;
  }

  // Successfully validated

  req.session.regenerate((err) => {
    if (err) {
      res.status(500).send(); // Internal Server Error
      return;
    }

    req.session.Authenticated = true;
    req.session.Username = req.body.User;
    res.status(200).send(); // Success
  });
});

App.get("/signout", Authenticated, (req, res) => {
  req.session.destroy((err) => {
    if (err)
      res.status(500).send(); // Internal Server Error
    else res.status(200).send(); // Success
  });
});

// Get current session username, can also be useful to determine if user is signed in
App.get("/session", async (req, res) => {
  if (req.session.Authenticated) {
    res.status(200).json({ username: req.session.Username }); // Success
  } else {
    res.status(401).send(); // Unauthorized, who are you? No session
  }
});

// Yes, the user is already authenticated to access this endpoint, as an additional security feature so users can't accidentally delete their account,
// they should be prompted to re-enter their username and password as a confirmation that they want to delete their account.
// {User, Pass}
App.post("/delete", Authenticated, async (req, res) => {
  // Compare username to authenticated user
  if (req.body.User != req.session.Username) {
    res.status(400).send();
    return;
  }
  console.log("User Matches");

  // Retrieve hash for given user
  let hash;
  let conn;
  try {
    conn = await Pool.getConnection();

    const response = await conn.query(
      "SELECT Password FROM User WHERE Username = ?",
      [req.body.User],
    );

    if (response.length != 1) {
      res.status(401).send(); // Unauthorized
      return;
    }

    hash = response[0]["Password"];
  } catch (err) {
    if (conn) conn.release();
    res.status(500).send(); // Internal Server Error
    throw err;
  }

  // Compare the hash
  if (!bcrypt.compareSync(req.body.Pass, hash)) {
    // Invalid password
    res.status(400).send(); // Malformed, user in confirmation did not enter their proper password
    return;
  }

  console.log("Hash Matches");

  try {
    await conn.query("DELETE FROM User WHERE Username = ?", [
      req.session.Username,
    ]);
    req.session.Authenticated = false;
    res.status(200).send();
  } catch (err) {
    res.status(500).send(); // Internal Server Error
    throw err;
  } finally {
    if (conn) conn.release();
  }
});

App.get("/wishlist/:user", async (req, res) => {
  let conn;
  let queryUsername = req.session.Username;

  try {
    conn = await Pool.getConnection();

    // If user is authenticated as the user being queried, no need to check if
    // the wishlist is public.

    if (
      !req.session.Authenticated ||
      req.params.user !== req.session.Username
    ) {
      const publicity_result = await conn.query(
        "SELECT Username, WishlistPublic FROM User WHERE Username = ?",
        [req.params.user],
      );

      if (publicity_result.length > 1) {
        console.log(publicity_result)
        res.status(500).send(); // Internal Server Error
        throw new Error(
          "Something went wrong. Fetching user wishlist publicity returned more than one value?",
        );
      } else if (publicity_result.length === 0) {
        res.status(404).send(); // Not Found
        throw new Error(
          `User ${req.params.user} does not exist. Failed to fetch wishlist.`,
        );
      }

      if (publicity_result[0]["WishlistPublic"] === false) {
        res.status(404).send(); // Wishlist not public, don't give requesting client any information that this user even exists.
        throw new Error(
          `User ${req.params.user} does not have a public wishlist.`,
        );
      }

      queryUsername = publicity_result[0]["Username"]
    }

    // If we've gotten here, the wishlist is either public, or the wishlist being requested
    // belongs to the currently authenticated user

    const result = await conn.query(
      "SELECT * FROM Wishlist WHERE UserID = UsernameToUserID(?) ORDER BY DateAdded ASC",
      [queryUsername],
    );

    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(); // Internal Server Error
    throw err;
  } finally {
    if (conn) conn.release();
  }
});

App.get("/wishlist", Authenticated, async (req, res) => {
  let conn;

  try {
    conn = await Pool.getConnection();

    const result = await conn.query(
      "SELECT * FROM Wishlist WHERE UserID = UsernameToUserID(?) ORDER BY DateAdded ASC",
      [req.session.Username],
    );

    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(); // Internal Server Error
    throw err;
  } finally {
    if (conn) conn.release();
  }
});

// {CheapsharkGameID}
App.post("/wishlist/insert", Authenticated, async (req, res) => {
  if (!req.body.CheapsharkGameID) {
    res.status(400).send(); // Malformed Request
    return;
  }

  let conn;

  try {
    conn = await Pool.getConnection();

    await conn.query(
      "INSERT INTO Wishlist (UserID, CheapsharkGameID) VALUES (UsernameToUserID(?), ?);",
      [req.session.Username, req.body.CheapsharkGameID],
    );

    res.status(200).send(); // Success
  } catch (err) {
    if (err.errno === 1062) {
      res.status(200).send(); // Success (Already Exists)
    } else {
      res.status(500).send(); // Internal Server Error
      throw err;
    }
  } finally {
    if (conn) conn.release();
  }
});

// {CheapsharkGameID}
App.post("/wishlist/delete", Authenticated, async (req, res) => {
  if (!req.body.CheapsharkGameID) {
    res.status(400).send(); // Malformed Request
    return;
  }

  let conn;

  try {
    conn = await Pool.getConnection();

    await conn.query(
      "DELETE FROM Wishlist WHERE UserID = UsernameToUserID(?) AND CheapsharkGameID = ?",
      [req.session.Username, req.body.CheapsharkGameID],
    );

    res.status(200).send(); // Success
  } catch (err) {
    res.status(500).send(); // Internal Server Error
    throw err;
  } finally {
    if (conn) conn.release();
  }
});

// {IsPublic}
App.post("/wishlist/publicity", Authenticated, async (req, res) => {
  if (typeof req.body.IsPublic !== "boolean") {
    res.status(400).send(); // Malformed Request
    return;
  }

  let conn;

  try {
    conn = await Pool.getConnection();

    await conn.query("UPDATE User SET WishlistPublic = ? WHERE Username = ?", [
      req.body.IsPublic,
      req.session.Username,
    ]);

    res.status(200).send(); // Success
  } catch (err) {
    res.status(500).send(); // Internal Server Error
    throw err;
  } finally {
    if (conn) conn.release();
  }
});

// Search for users that have a public wishlist
App.get("/user/:query", async (req, res) => {

  let conn;

  try {
    
    conn = await Pool.getConnection();

    const result = await conn.query(
      "SELECT * FROM User WHERE WishlistPublic = 1 AND Username LIKE ?",
      [`${req.params.query}%`]
    )

    res.status(200).send(result)
  } catch (err) {
    res.status(500).send() // Internal Server Error
    throw err;
  } finally {
    if (conn) conn.release()
  }
})

App.use((req, res) => {
  res.status(404).send()
})

// Start server
App.listen(Port, () => {
  console.log(`Listening on port ${Port}`);
});
