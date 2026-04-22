import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { register } from '../api/auth'
import { useToast } from '../context/ToastContext'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { addToast } = useToast()
  const [form, setForm] = useState({
    dni: '', username: '', firstname: '', lastname: '',
    email: '', password: '', password_confirmation: '',
    address: '', postalCode: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(form)
      await login(form.email, form.password)
      addToast('CUENTA CREADA CON ÉXITO', 'success')
      navigate('/dashboard')
    } catch (err) { 
      const errorMsg = err.response?.data?.message || 'ERROR EN EL REGISTRO'
      addToast(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#000',
      padding: '40px 20px',
      position: 'relative'
    }}>
      <form onSubmit={handleSubmit} style={{ 
        border: '1px solid #f00', 
        padding: '40px', 
        background: 'rgba(0,0,0,0.95)', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '20px', 
        width: '100%',
        maxWidth: '700px',
        boxShadow: '0 0 50px rgba(255, 0, 0, 0.1)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <h1 style={{ color: '#f00', margin: 0, fontSize: '36px', letterSpacing: '4px' }}>NUEVO REGISTRO</h1>
          <p style={{ color: '#060', fontSize: '12px' }}>CONSIENTE SU ENTRADA EN EL SISTEMA</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Columna 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ color: '#0f0', fontSize: '11px', fontWeight: 'bold' }}>NOMBRE</label>
              <input 
                placeholder="Nombre" 
                onChange={e => setForm({...form, firstname: e.target.value})} 
                required 
                style={{ background: '#000', border: '1px solid #060', color: '#0f0', padding: '12px' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ color: '#0f0', fontSize: '11px', fontWeight: 'bold' }}>APELLIDOS</label>
              <input 
                placeholder="Apellidos" 
                onChange={e => setForm({...form, lastname: e.target.value})} 
                required 
                style={{ background: '#000', border: '1px solid #060', color: '#0f0', padding: '12px' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ color: '#0f0', fontSize: '11px', fontWeight: 'bold' }}>NOMBRE DE USUARIO</label>
              <input 
                placeholder="GhostHunter_99" 
                onChange={e => setForm({...form, username: e.target.value})} 
                required 
                style={{ background: '#000', border: '1px solid #060', color: '#0f0', padding: '12px' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ color: '#0f0', fontSize: '11px', fontWeight: 'bold' }}>DNI / ID FISCAL</label>
              <input 
                placeholder="12345678X" 
                onChange={e => setForm({...form, dni: e.target.value})} 
                required 
                style={{ background: '#000', border: '1px solid #060', color: '#0f0', padding: '12px' }}
              />
            </div>
          </div>

          {/* Columna 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ color: '#0f0', fontSize: '11px', fontWeight: 'bold' }}>CORREO ELECTRÓNICO</label>
              <input 
                type="email" 
                placeholder="email@ejemplo.com" 
                onChange={e => setForm({...form, email: e.target.value})} 
                required 
                style={{ background: '#000', border: '1px solid #060', color: '#0f0', padding: '12px' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ color: '#0f0', fontSize: '11px', fontWeight: 'bold' }}>DIRECCIÓN DE RESIDENCIA</label>
              <input 
                placeholder="Calle del Terror, 13" 
                onChange={e => setForm({...form, address: e.target.value})} 
                required 
                style={{ background: '#000', border: '1px solid #060', color: '#0f0', padding: '12px' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ color: '#0f0', fontSize: '11px', fontWeight: 'bold' }}>CÓDIGO POSTAL</label>
              <input 
                placeholder="28001" 
                onChange={e => setForm({...form, postalCode: e.target.value})} 
                required 
                style={{ background: '#000', border: '1px solid #060', color: '#0f0', padding: '12px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ color: '#0f0', fontSize: '11px', fontWeight: 'bold' }}>CONTRASEÑA</label>
                <input 
                  type="password" 
                  placeholder="****" 
                  onChange={e => setForm({...form, password: e.target.value})} 
                  required 
                  style={{ background: '#000', border: '1px solid #060', color: '#0f0', padding: '12px' }}
                />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ color: '#0f0', fontSize: '11px', fontWeight: 'bold' }}>CONFIRMAR</label>
                <input 
                  type="password" 
                  placeholder="****" 
                  onChange={e => setForm({...form, password_confirmation: e.target.value})} 
                  required 
                  style={{ background: '#000', border: '1px solid #060', color: '#0f0', padding: '12px' }}
                />
              </div>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            marginTop: '20px',
            padding: '18px', 
            background: '#f00', 
            color: '#000', 
            border: 'none', 
            fontWeight: 'bold', 
            fontSize: '18px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 0 20px rgba(255, 0, 0, 0.2)'
          }}
        >
          {loading ? 'REGISTRANDO ALMA...' : 'CREAR NUEVA CUENTA'}
        </button>

        <div style={{ textAlign: 'center' }}>
          <Link to="/login" style={{ color: '#0f0', fontSize: '12px', textDecoration: 'none', opacity: 0.7 }}>
            ¿YA TIENES CREDENCIALES? <span style={{ color: '#f00', textDecoration: 'underline' }}>ACCEDER</span>
          </Link>
        </div>
      </form>
    </div>
  )
}
