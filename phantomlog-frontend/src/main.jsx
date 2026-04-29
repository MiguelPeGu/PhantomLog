import { StrictMode } from 'react'
import './index.css'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataProvider'
import { ToastProvider } from './context/ToastContext'
import { CartProvider } from './context/CartContext'
import { router } from './App.jsx'
import { LoadingProvider } from './context/LoadingContext'
import LoadingScreen from './components/LoadingScreen'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <LoadingProvider>
        <LoadingScreen />
        <AuthProvider>
          <DataProvider>
            <CartProvider>
              <RouterProvider router={router} />
            </CartProvider>
          </DataProvider>
        </AuthProvider>
      </LoadingProvider>
    </ToastProvider>
  </StrictMode>
)
