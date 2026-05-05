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

  const validateForm = () => {
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
    if (!nameRegex.test(form.firstname)) {
      addToast('EL NOMBRE NO PUEDE CONTENER NÚMEROS NI SÍMBOLOS.', 'error')
      return false
    }
    if (!nameRegex.test(form.lastname)) {
      addToast('LOS APELLIDOS NO PUEDEN CONTENER NÚMEROS NI SÍMBOLOS.', 'error')
      return false
    }
    if (form.password.length < 8) {
      addToast('LA CONTRASEÑA DEBE TENER AL MENOS 8 CARACTERES.', 'error')
      return false
    }
    if (form.password !== form.password_confirmation) {
      addToast('LAS CONTRASEÑAS NO COINCIDEN.', 'error')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    try {
      await register(form)
      await login(form.email, form.password)
      addToast('EXPEDIENTE CREADO. BIENVENIDO AL SISTEMA.', 'success')
    } catch (err) { 
      const errors = err.response?.data?.errors
      if (errors) {
        const firstError = Object.values(errors)[0][0]
        addToast(firstError.toUpperCase(), 'error')
      } else {
        const msg = err.response?.data?.message || 'ERROR CRÍTICO EN EL REGISTRO'
        addToast(msg.toUpperCase(), 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-center relative vh100 p-40-20">
      <form onSubmit={handleSubmit} className="horror-form max-700">
        <div className="text-center mb-10">
          <h1>NUEVO REGISTRO</h1>
          <p className="text-dim ls-2 fs-12">CONSIENTE SU ENTRADA EN EL SISTEMA</p>
        </div>

        <div className="grid-2">
          {/* Columna 1 */}
          <div className="column gap-15">
            <div className="form-group gap-5">
              <label className="form-label small-label">NOMBRE</label>
              <input 
                placeholder="Nombre" 
                onChange={e => setForm({...form, firstname: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group gap-5">
              <label className="form-label small-label">APELLIDOS</label>
              <input 
                placeholder="Apellidos" 
                onChange={e => setForm({...form, lastname: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group gap-5">
              <label className="form-label small-label">NOMBRE DE USUARIO</label>
              <input 
                placeholder="GhostHunter_99" 
                onChange={e => setForm({...form, username: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group gap-5">
              <label className="form-label small-label">DNI / ID FISCAL</label>
              <input 
                placeholder="12345678X" 
                onChange={e => setForm({...form, dni: e.target.value})} 
                required 
              />
            </div>
          </div>

          {/* Columna 2 */}
          <div className="column gap-15">
            <div className="form-group gap-5">
              <label className="form-label small-label">CORREO ELECTRÓNICO</label>
              <input 
                type="email" 
                placeholder="email@ejemplo.com" 
                onChange={e => setForm({...form, email: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group gap-5">
              <label className="form-label small-label">DIRECCIÓN DE RESIDENCIA</label>
              <input 
                placeholder="Calle del Terror, 13" 
                onChange={e => setForm({...form, address: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group gap-5">
              <label className="form-label small-label">CÓDIGO POSTAL</label>
              <input 
                placeholder="28001" 
                onChange={e => setForm({...form, postalCode: e.target.value})} 
                required 
              />
            </div>
            <div className="flex-wrap gap-10">
              <div className="form-group flex-1 gap-5 min-w-140">
                <label className="form-label small-label">CONTRASEÑA</label>
                <input 
                  type="password" 
                  placeholder="****" 
                  onChange={e => setForm({...form, password: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group flex-1 gap-5 min-w-140">
                <label className="form-label small-label nowrap">CONFIRMAR CONTRASEÑA</label>
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
          className="primary large mt-20"
        >
          {loading ? 'REGISTRANDO ALMA...' : 'CREAR NUEVA CUENTA'}
        </button>

        <div className="text-center">
          <Link to="/login" className="fs-12 opacity-07">
            ¿YA TIENES CREDENCIALES? <span className="text-accent underline">ACCEDER</span>
          </Link>
        </div>
      </form>
    </div>
  )
}
