import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { register } from '../api/auth'
import { useToast } from '../context/ToastContext'

export default function Register() {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const { addToast } = useToast()
  const [form, setForm] = useState({
    dni: '', username: '', firstname: '', lastname: '',
    email: '', password: '', password_confirmation: '',
    address: '', postalCode: '',
  })
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
      await register(form)
      await login(form.email, form.password)
      addToast('CUENTA CREADA CON ÉXITO', 'success')
    } catch (err) { 
      let errorMsg = err.response?.data?.message || 'ERROR EN EL REGISTRO'
      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0]
        errorMsg = firstError
      }
      addToast(errorMsg.toUpperCase(), 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-center relative" style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <form onSubmit={handleSubmit} className="horror-form" style={{ maxWidth: '700px' }}>
        <div className="text-center mb-10">
          <h1>NUEVO REGISTRO</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '12px' }}>CONSIENTE SU ENTRADA EN EL SISTEMA</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Columna 1 */}
          <div className="column" style={{ gap: '15px' }}>
            <div className="form-group" style={{ gap: '5px' }}>
              <label className="form-label" style={{ fontSize: '11px' }}>NOMBRE</label>
              <input 
                placeholder="Nombre" 
                onChange={e => setForm({...form, firstname: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group" style={{ gap: '5px' }}>
              <label className="form-label" style={{ fontSize: '11px' }}>APELLIDOS</label>
              <input 
                placeholder="Apellidos" 
                onChange={e => setForm({...form, lastname: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group" style={{ gap: '5px' }}>
              <label className="form-label" style={{ fontSize: '11px' }}>NOMBRE DE USUARIO</label>
              <input 
                placeholder="GhostHunter_99" 
                onChange={e => setForm({...form, username: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group" style={{ gap: '5px' }}>
              <label className="form-label" style={{ fontSize: '11px' }}>DNI / ID FISCAL</label>
              <input 
                placeholder="12345678X" 
                onChange={e => setForm({...form, dni: e.target.value})} 
                required 
              />
            </div>
          </div>

          {/* Columna 2 */}
          <div className="column" style={{ gap: '15px' }}>
            <div className="form-group" style={{ gap: '5px' }}>
              <label className="form-label" style={{ fontSize: '11px' }}>CORREO ELECTRÓNICO</label>
              <input 
                type="email" 
                placeholder="email@ejemplo.com" 
                onChange={e => setForm({...form, email: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group" style={{ gap: '5px' }}>
              <label className="form-label" style={{ fontSize: '11px' }}>DIRECCIÓN DE RESIDENCIA</label>
              <input 
                placeholder="Calle del Terror, 13" 
                onChange={e => setForm({...form, address: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group" style={{ gap: '5px' }}>
              <label className="form-label" style={{ fontSize: '11px' }}>CÓDIGO POSTAL</label>
              <input 
                placeholder="28001" 
                onChange={e => setForm({...form, postalCode: e.target.value})} 
                required 
              />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <div className="form-group" style={{ flex: '1 1 140px', gap: '5px' }}>
                <label className="form-label" style={{ fontSize: '11px' }}>CONTRASEÑA</label>
                <input 
                  type="password" 
                  placeholder="****" 
                  onChange={e => setForm({...form, password: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group" style={{ flex: '1 1 140px', gap: '5px' }}>
                <label className="form-label" style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>CONFIRMAR CONTRASEÑA</label>
                <input 
                  type="password" 
                  placeholder="****" 
                  onChange={e => setForm({...form, password_confirmation: e.target.value})} 
                  required 
                />
              </div>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="primary"
          style={{ marginTop: '20px', padding: '18px', fontSize: '18px' }}
        >
          {loading ? 'REGISTRANDO ALMA...' : 'CREAR NUEVA CUENTA'}
        </button>

        <div className="text-center">
          <Link to="/login" style={{ fontSize: '12px', opacity: 0.7 }}>
            ¿YA TIENES CREDENCIALES? <span style={{ color: 'var(--accent)', textDecoration: 'underline' }}>ACCEDER</span>
          </Link>
        </div>
      </form>
    </div>
  )
}
