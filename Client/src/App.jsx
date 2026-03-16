import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router'
import Navbar from './components/Navbar'
import DealsPage from './components/DealsPage'
import WishlistPage from './components/WishlistPage'
import UsersPage from './components/UsersPage'
import LoginPage from './components/LoginPage'
import store from './redux/store'
import { Provider } from 'react-redux'

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navbar />,
      children: [
        {
          path: "/deals",
          element: <DealsPage />
        },
        {
          path: "/wishlist",
          element: <WishlistPage />
        },
        {
          path: "/users",
          element: <UsersPage />
        },
        {
          path: "/login",
          element: <LoginPage />
        }
      ]
    }
  ])

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  )
}

export default App
