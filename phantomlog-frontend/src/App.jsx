import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { CartProvider } from './context/CartContext'
import { DataProvider } from './context/DataProvider'
import PrivateRoute from './components/PrivateRoute'
import PhantomLayout from './components/PhantomLayout'
import LoadingTrigger from './components/LoadingTrigger'

import Home           from './pages/Home'
import Login          from './pages/Login'
import Register       from './pages/Register'
import Forums         from './pages/Forums'
import ForumDetail    from './pages/ForumDetail'
import ReportDetail   from './pages/ReportDetail'
import Expeditions    from './pages/Expeditions'
import ExpeditionDetail from './pages/ExpeditionDetail'
import Phantoms       from './pages/Phantoms'
import PhantomDetail  from './pages/PhantomDetail'
import Products       from './pages/Products'
import ProductDetail  from './pages/ProductDetail'
import Cart           from './pages/Cart'
import Checkout       from './pages/Checkout'
import Invoices       from './pages/Invoices'
import SuccessInvoice from './pages/SuccessInvoice'
import Dashboard      from './pages/Dashboard'
import Profile        from './pages/Profile'
import NotFound       from './pages/NotFound'

export const router = createBrowserRouter([
  {
    element: (
      <>
        <LoadingTrigger />
        <Outlet />
      </>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        element: <PrivateRoute><PhantomLayout /></PrivateRoute>,
        children: [
          { path: "forums", element: <Forums /> },
          { path: "forums/:id", element: <ForumDetail /> },
          { path: "forums/:id/reports/:reportId", element: <ReportDetail /> },
          { path: "expeditions", element: <Expeditions /> },
          { path: "expeditions/:id", element: <ExpeditionDetail /> },
          { path: "phantoms", element: <Phantoms /> },
          { path: "phantoms/:id", element: <PhantomDetail /> },
          { path: "products", element: <Products /> },
          { path: "products/:id", element: <ProductDetail /> },
          { path: "cart", element: <Cart /> },
          { path: "checkout", element: <Checkout /> },
          { path: "success/:id", element: <SuccessInvoice /> },
           { path: "invoices", element: <Invoices /> },
           { path: "dashboard", element: <Dashboard /> },
           { path: "profile", element: <Profile /> },
         ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ]
  }
])

export default function App() {
  return null; // The app is handled by RouterProvider in main.jsx
}
