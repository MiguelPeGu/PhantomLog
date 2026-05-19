import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from './Loader'

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return null

  if (!localStorage.getItem('token')) return <Navigate to="/" replace />

  // Hay token pero usuario aún no disponible (p.ej. red lenta): mantener sesión.
  if (!user) return <Loader />

  return children
}
