import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { addToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      addToast('ACCESO CONCEDIDO', 'success')
      navigate('/dashboard')
    } catch (err) { 
      addToast('CREDENCIALES INVÁLIDAS', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#000',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Elemento decorativo de fondo */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundImage: 'radial-gradient(circle, #050000 0%, #000 70%)',
        zIndex: 0
      }} />

      <form onSubmit={handleSubmit} style={{ 
        border: '1px solid #f00', 
        padding: '50px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '25px', 
        background: 'rgba(0,0,0,0.95)',
        width: '100%',
        maxWidth: '400px',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 0 50px rgba(255, 0, 0, 0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <h1 style={{ color: '#f00', margin: 0, fontSize: '42px', letterSpacing: '5px' }}>IDENTIFICARSE</h1>
          <p style={{ color: '#060', fontSize: '12px', marginTop: '5px' }}>INGRESE AL ARCHIVO CENTRAL</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ color: '#0f0', fontSize: '12px', fontWeight: 'bold' }}>CREDENC_ID (EMAIL)</label>
          <input 
            type="email" 
            placeholder="investigador@phantomlog.com" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            style={{ 
              background: '#000', 
              border: '1px solid #060', 
              color: '#0f0', 
              padding: '15px',
              fontFamily: 'monospace',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ color: '#0f0', fontSize: '12px', fontWeight: 'bold' }}>ACCESS_KEY (PASSWORD)</label>
          <input 
            type="password" 
            placeholder="********" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            style={{ 
              background: '#000', 
              border: '1px solid #060', 
              color: '#0f0', 
              padding: '15px',
              fontFamily: 'monospace',
              outline: 'none'
            }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '15px', 
            background: '#f00', 
            color: '#000', 
            border: 'none', 
            fontWeight: 'bold', 
            fontSize: '18px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {loading ? 'AUTENTICANDO...' : 'INICIAR SESIÓN'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <Link to="/register" style={{ color: '#0f0', fontSize: '12px', textDecoration: 'none', opacity: 0.7 }}>
            ¿SIN CREDENCIALES? <span style={{ color: '#f00', textDecoration: 'underline' }}>REGISTRAR NUEVA ALMA</span>
          </Link>
        </div>
      </form>

      <div style={{ position: 'absolute', bottom: '20px', color: '#040', fontSize: '10px', letterSpacing: '2px' }}>
        RESTRICTED AREA // AUTH_SERVER_v2.01
      </div>
    </div>
  )
}
