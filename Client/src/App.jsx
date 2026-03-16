import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router'
import Navbar from './components/Navbar'
import DealsPage from './components/DealsPage'
import WishlistPage from './components/WishlistPage'
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
