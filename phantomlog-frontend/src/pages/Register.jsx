import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { register } from '../api/auth'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({
    dni: '', username: '', firstname: '', lastname: '',
    email: '', password: '', password_confirmation: '',
    address: '', postalCode: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setServerError('')
    setErrors({})

    try {
      await register(form)
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors)
      } else {
        setServerError(err.response?.data?.message || 'Error al completar el registro.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=UnifrakturMaguntia&display=swap');

        .register-container {
          min-height: 100vh;
          background: #050305;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--sans);
          color: #c8a96e;
          padding: 20px;
        }

        .register-card {
          width: 100%;
          max-width: 500px;
          background: rgba(8, 4, 10, 0.95);
          border: 1px solid rgba(200, 169, 110, 0.1);
          padding: 40px;
          position: relative;
          backdrop-filter: blur(8px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .register-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .register-title {
          font-family: var(--heading);
          font-weight: 700;
          font-size: 38px;
          margin: 0;
          color: #c8a96e;
        }

        .register-subtitle {
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(200, 169, 110, 0.4);
          margin-top: 5px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group.full {
          grid-column: span 2;
        }

        label {
          display: block;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 5px;
          color: rgba(200, 169, 110, 0.6);
        }

        input {
          width: 100%;
          background: rgba(20, 15, 25, 0.8);
          border: 1px solid rgba(200, 169, 110, 0.2);
          color: #c8a96e;
          padding: 10px 12px;
          font-family: var(--sans);
          font-size: 15px;
          outline: none;
          transition: border-color 0.3s;
          box-sizing: border-box;
        }

        input:focus {
          border-color: rgba(200, 169, 110, 0.6);
        }

        .error-text {
          color: #ff4444;
          font-size: 11px;
          margin-top: 4px;
          font-style: italic;
        }

        .server-error {
          background: rgba(255, 0, 0, 0.05);
          border: 1px solid rgba(255, 0, 0, 0.2);
          color: #ff4444;
          padding: 10px;
          text-align: center;
          margin-bottom: 20px;
          font-size: 13px;
        }

        .submit-btn {
          width: 100%;
          background: transparent;
          border: 1px solid #c8a96e;
          color: #c8a96e;
          padding: 12px;
          font-family: var(--heading);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 10px;
        }

        .submit-btn:hover:not(:disabled) {
          background: #c8a96e;
          color: #050305;
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .footer-links {
          margin-top: 25px;
          text-align: center;
          font-size: 13px;
          color: rgba(200, 169, 110, 0.4);
        }

        .footer-links a {
          color: #c8a96e;
          text-decoration: none;
          margin-left: 5px;
        }

        .footer-links a:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .form-grid { grid-template-columns: 1fr; }
          .form-group.full { grid-column: span 1; }
        }
      `}</style>

      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">PhantomLog</h1>
          <p className="register-subtitle">Forma parte del ritual</p>
        </div>

        {serverError && <div className="server-error">{serverError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre</label>
              <input value={form.firstname} onChange={set('firstname')} placeholder="Tu nombre" required />
              {errors.firstname && <div className="error-text">{errors.firstname[0]}</div>}
            </div>
            <div className="form-group">
              <label>Apellidos</label>
              <input value={form.lastname} onChange={set('lastname')} placeholder="Tus apellidos" required />
              {errors.lastname && <div className="error-text">{errors.lastname[0]}</div>}
            </div>

            <div className="form-group">
              <label>Usuario</label>
              <input value={form.username} onChange={set('username')} placeholder="Pseudónimo" required />
              {errors.username && <div className="error-text">{errors.username[0]}</div>}
            </div>
            <div className="form-group">
              <label>DNI</label>
              <input value={form.dni} onChange={set('dni')} placeholder="Identificación" required />
              {errors.dni && <div className="error-text">{errors.dni[0]}</div>}
            </div>

            <div className="form-group full">
              <label>Correo Electrónico</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="alma@ejemplo.com" required />
              {errors.email && <div className="error-text">{errors.email[0]}</div>}
            </div>

            <div className="form-group full">
              <label>Dirección</label>
              <input value={form.address} onChange={set('address')} placeholder="Calle, Número..." required />
              {errors.address && <div className="error-text">{errors.address[0]}</div>}
            </div>

            <div className="form-group full">
              <label>Código Postal</label>
              <input value={form.postalCode} onChange={set('postalCode')} placeholder="29000" required />
              {errors.postalCode && <div className="error-text">{errors.postalCode[0]}</div>}
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input type="password" value={form.password} onChange={set('password')} placeholder="••••••••" required />
              {errors.password && <div className="error-text">{errors.password[0]}</div>}
            </div>
            <div className="form-group">
              <label>Repetir Contraseña</label>
              <input type="password" value={form.password_confirmation} onChange={set('password_confirmation')} placeholder="••••••••" required />
              {errors.password_confirmation && <div className="error-text">{errors.password_confirmation[0]}</div>}
            </div>
          </div>

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? 'Procesando...' : 'Registrarse'}
          </button>
        </form>

        <div className="footer-links">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </div>
      </div>
    </div>
  )
}
