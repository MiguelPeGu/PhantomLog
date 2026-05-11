import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from './Loader'

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  // Mientras AuthContext verifica el token con me(), no renderizar nada
  if (loading) return null

  // Sin token → definitivamente no autenticado → ir a home
  if (!localStorage.getItem('token')) return <Navigate to="/" replace />

  // Hay token pero usuario aún no disponible (p.ej. red lenta): mantener sesión.
  if (!user) return <Loader />

  return children
}
