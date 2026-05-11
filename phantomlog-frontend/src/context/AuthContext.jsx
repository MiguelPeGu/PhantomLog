import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { me, login as apiLogin, logout as apiLogout, updateProfile as apiUpdateProfile } from '../api/auth'
import Loader from '../components/Loader'
import { useToast } from './ToastContext'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { addToast } = useToast()
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('auth_user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    const res = await me()
    setUser(res.data)
    return res.data
  }, [])

  useEffect(() => {
    if (localStorage.getItem('token')) {
      refreshUser()
        .catch((err) => {
          if (err?.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('auth_user')
            setUser(null)
            addToast('SESION EXPIRADA. INICIA SESION DE NUEVO.', 'error')
            return
          }
          // Error transitorio (red/servidor): mantener usuario cacheado si existe.
          const cachedUser = localStorage.getItem('auth_user')
          if (!cachedUser) {
            addToast('NO SE PUDIERON SINCRONIZAR LOS DATOS DEL PERFIL.', 'error')
          }
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('auth_user')
    }
  }, [user])

  const login = async (email, password) => {
    const { data } = await apiLogin({ email, password })
    localStorage.setItem('token', data.token)
    try {
      await refreshUser()
    } catch {
      setUser(data.user)
    }
  }

  const logout = async () => {
    try {
      await apiLogout()
    } catch (err) {
      addToast("ERROR AL CERRAR SESIÓN. EL SERVIDOR NO RESPONDE.", "error")
    }
    localStorage.removeItem('token')
    localStorage.removeItem('auth_user')
    setUser(null)
  }

  const updateUser = async (data) => {
    const res = await apiUpdateProfile(data)
    setUser(res.data)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading, refreshUser }}>
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
