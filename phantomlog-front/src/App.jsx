import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import PhantomLayout from './components/PhantomLayout'

import Home           from './pages/Home'
import Login          from './pages/Login'
import Register       from './pages/Register'
import Forums         from './pages/Forums'
import ForumDetail    from './pages/ForumDetail'
import Expeditions    from './pages/Expeditions'
import ExpeditionDetail from './pages/ExpeditionDetail'
import Phantoms       from './pages/Phantoms'
import Products       from './pages/Products'
import Invoices       from './pages/Invoices'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Página de inicio — pública */}
          <Route path="/"         element={<Home />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Páginas privadas */}
          <Route element={<PrivateRoute><PhantomLayout /></PrivateRoute>}>
            <Route path="/forums"          element={<Forums />} />
            <Route path="/forums/:id"      element={<ForumDetail />} />
            <Route path="/expeditions"     element={<Expeditions />} />
            <Route path="/expeditions/:id" element={<ExpeditionDetail />} />
            <Route path="/phantoms"        element={<Phantoms />} />
            <Route path="/products"        element={<Products />} />
            <Route path="/invoices"        element={<Invoices />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}