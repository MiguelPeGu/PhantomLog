import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataProvider'
import { ToastProvider } from './context/ToastContext'
import { CartProvider } from './context/CartContext'
import { router } from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <AuthProvider>
        <DataProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </DataProvider>
      </AuthProvider>
    </ToastProvider>
  </StrictMode>
)