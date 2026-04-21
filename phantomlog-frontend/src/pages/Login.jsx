import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/forums')
    } catch (err) {
      setError(err.response?.data?.message || 'Identidad no reconocida en nuestros archivos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English&family=UnifrakturMaguntia&display=swap');
        
        body { margin: 0; background: #080508; }
        
        .login-card {
          animation: fadeIn 0.8s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .input-group label {
          display: block;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(200, 169, 110, 0.5);
          margin-bottom: 8px;
        }

        .phantom-input {
          width: 100%;
          background: rgba(20, 15, 25, 0.6);
          border: 1px solid rgba(200, 169, 110, 0.2);
          padding: 12px 16px;
          color: #e8c98e;
          font-family: 'IM Fell English', serif;
          font-size: 16px;
          outline: none;
          transition: all 0.3s;
          box-sizing: border-box;
        }

        .phantom-input:focus {
          border-color: #c8a96e;
          background: rgba(30, 25, 35, 0.8);
          box-shadow: 0 0 15px rgba(200, 169, 110, 0.1);
        }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: transparent;
          border: 1px solid #c8a96e;
          color: #c8a96e;
          font-family: 'IM Fell English', serif;
          font-size: 18px;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 10px;
        }

        .submit-btn:hover:not(:disabled) {
          background: #c8a96e;
          color: #080508;
          box-shadow: 0 0 20px rgba(200, 169, 110, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .footer-link {
          color: rgba(200, 169, 110, 0.6);
          text-decoration: none;
          transition: color 0.3s;
          font-size: 14px;
        }

        .footer-link:hover {
          color: #c8a96e;
          text-decoration: underline;
        }
      `}</style>

      <div className="login-card" style={styles.card}>
        <header style={styles.header}>
          <h1 style={styles.title}>PhantomLog</h1>
          <p style={styles.subtitle}>EL ARCHIVO ETERNO</p>
          <div style={styles.divider}></div>
        </header>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="input-group">
            <label>Identificador de Acceso (Email)</label>
            <input
              className="phantom-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="investigador@phantomlog.com"
              required
            />
          </div>

          <div className="input-group" style={{ marginTop: '10px' }}>
            <label>Sello de Seguridad (Contraseña)</label>
            <input
              className="phantom-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div style={styles.errorBox}>
              {error}
            </div>
          )}

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? 'Validando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <footer style={styles.footer}>
          <p>¿Aún no registrado en el archivo?</p>
          <Link to="/register" className="footer-link">Solicitar alta de investigador</Link>
          <div style={{ marginTop: '20px' }}>
            <Link to="/" className="footer-link" style={{ fontSize: '11px', opacity: 0.5 }}>← Regresar al Umbral</Link>
          </div>
        </footer>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'IM Fell English', serif",
    color: '#c8a96e',
    background: 'radial-gradient(circle at center, #1a101a 0%, #080508 100%)',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    background: 'rgba(10, 7, 10, 0.95)',
    border: '1px solid rgba(200, 169, 110, 0.2)',
    padding: '50px 40px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
    textAlign: 'center',
  },
  header: {
    marginBottom: '35px',
  },
  title: {
    fontFamily: "'UnifrakturMaguntia', serif",
    fontSize: '48px',
    margin: '0',
    color: '#c8a96e',
    textShadow: '0 0 20px rgba(200, 169, 110, 0.4)',
  },
  subtitle: {
    fontSize: '12px',
    letterSpacing: '5px',
    margin: '10px 0 0 0',
    opacity: 0.6,
  },
  divider: {
    width: '60px',
    height: '1px',
    background: '#c8a96e',
    margin: '25px auto 0 auto',
    opacity: 0.4,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    textAlign: 'left',
  },
  errorBox: {
    background: 'rgba(255, 0, 0, 0.05)',
    border: '1px solid rgba(255, 0, 0, 0.2)',
    color: '#ff6666',
    padding: '12px',
    fontSize: '14px',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    marginTop: '40px',
    fontSize: '14px',
    opacity: 0.8,
  }
}