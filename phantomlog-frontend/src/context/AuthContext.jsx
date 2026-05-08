import { createContext, useContext, useState, useEffect } from 'react'
import { me, login as apiLogin, logout as apiLogout, updateProfile as apiUpdateProfile } from '../api/auth'
import Loader from '../components/Loader'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (localStorage.getItem('token')) {
      me()
        .then(res => setUser(res.data))
        .catch((err) => {
          if (err?.response?.status === 401) {
            localStorage.removeItem('token')
          }
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const { data } = await apiLogin({ email, password })
    localStorage.setItem('token', data.token)
    // Cargamos el usuario completo con relaciones desde /me en lugar de data.user
    try {
      const meRes = await me()
      setUser(meRes.data)
    } catch {
      setUser(data.user)
    }
  }

  const logout = async () => {
    try {
      await apiLogout()
    } catch {
      // ignore
    }
    localStorage.removeItem('token')
    setUser(null)
  }

  const updateUser = async (data) => {
    const res = await apiUpdateProfile(data)
    setUser(res.data)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
