import { createBrowserRouter, RouterProvider } from 'react-router'
import AppLayout from './components/AppLayout'
import HomePage from './components/HomePage'
import DealsPage from './components/DealsPage'
import WishlistPage from './components/WishlistPage'
import UsersPage from './components/UsersPage'
import LoginPage from './components/LoginPage'
import ErrorPage from './components/ErrorPage'
import store from './redux/store'
import { Provider } from 'react-redux'

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true, element: <HomePage />
        },
        {
          path: "deals",
          element: <DealsPage />
        },
        {
          path: "wishlist",
          children: [
            {
              index: true,
              element: <WishlistPage />
            },
            {
              path: ":username",
              element: <WishlistPage />
            }
          ]
        },
        {
          path: "users",
          element: <UsersPage />
        },
        {
          path: "login",
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
