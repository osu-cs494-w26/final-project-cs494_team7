import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router'
import Navbar from './components/Navbar'
import DealsPage from './components/DealsPage'
import WishlistPage from './components/WishlistPage'

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
      <RouterProvider router={router} />
  )
}

export default App
