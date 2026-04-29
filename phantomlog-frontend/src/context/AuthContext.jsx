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
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const { data } = await apiLogin({ email, password })
    localStorage.setItem('token', data.token)
    setUser(data.user)
  }

  const logout = async () => {
    await apiLogout()
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
