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
      {/* Elemento decorativo de fondo */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundImage: 'radial-gradient(circle, #050000 0%, #000 70%)',
        zIndex: 0
      }} />

      <form onSubmit={handleSubmit} className="horror-form">
        <div className="text-center mb-10">
          <h1>IDENTIFICARSE</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '12px', marginTop: '5px' }}>INGRESE AL ARCHIVO CENTRAL</p>
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
          className="primary"
          style={{ padding: '15px', fontSize: '18px' }}
        >
          {loading ? 'AUTENTICANDO...' : 'INICIAR SESIÓN'}
        </button>

        <div className="text-center mt-10">
          <Link to="/register" style={{ fontSize: '12px', opacity: 0.7 }}>
            ¿SIN CREDENCIALES? <span style={{ color: 'var(--accent)', textDecoration: 'underline' }}>REGISTRAR NUEVA ALMA</span>
          </Link>
        </div>
      </form>

      <div className="system-status-footer" style={{ fontSize: '10px' }}>
        RESTRICTED AREA // AUTH_SERVER_v2.01
      </div>
    </div>
  )
}
