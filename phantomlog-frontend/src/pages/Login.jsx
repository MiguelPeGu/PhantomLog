import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const { addToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [theme] = useState(localStorage.getItem('phantom-theme') || 'dark')

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode')
    } else {
      document.body.classList.remove('light-mode')
    }
  }, [theme])

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      addToast('ACCESO CONCEDIDO', 'success')
    } catch (err) { 
      const errorMsg = err.response?.data?.message || 'CREDENCIALES INVÁLIDAS'
      addToast(errorMsg.toUpperCase(), 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="vh100 flex-center relative overflow-hidden">
      {}
      <div className="absolute-full bg-radial-horror z-0" />

      <form onSubmit={handleSubmit} className="horror-form">
        <div className="text-center mb-10">
          <h1>IDENTIFICARSE</h1>
          <p className="text-dim ls-2 mt-10 fs-12">INGRESE AL ARCHIVO CENTRAL</p>
        </div>

        <div className="form-group">
          <label className="form-label">CREDENC_ID (EMAIL)</label>
          <input 
            type="email" 
            placeholder="investigador@phantomlog.com" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label className="form-label">ACCESS_KEY (PASSWORD)</label>
          <input 
            type="password" 
            placeholder="********" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="primary large"
        >
          {loading ? 'AUTENTICANDO...' : 'INICIAR SESIÓN'}
        </button>

        <div className="text-center mt-10">
          <Link to="/register" className="fs-12 opacity-07">
            ¿SIN CREDENCIALES? <span className="text-accent underline">REGISTRAR NUEVA ALMA</span>
          </Link>
        </div>
      </form>

      <div className="system-status-footer fs-10">
        RESTRICTED AREA // AUTH_SERVER_v2.01
      </div>
    </div>
  )
}
