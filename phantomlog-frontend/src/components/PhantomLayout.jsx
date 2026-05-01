import { useData } from '../context/DataProvider'
import { useEffect, useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

export default function PhantomLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const { cartCount } = useCart()
  const { addToast } = useToast()
  const { globalSearch, setGlobalSearch } = useData()
  const [showContent, setShowContent] = useState(false)

  useEffect(() => { setShowContent(true) }, [])

  const handleLogout = async () => {
    addToast("Cerrando sesión...", "info")
    try {
      if (logout) await logout()
    } catch {
      // ignore
    } finally {
      navigate('/login')
    }
  }

  const navLinks = [
    { name: 'Foros', path: '/forums' },
    { name: 'Expediciones', path: '/expeditions' },
    { name: 'Fantasmas', path: '/phantoms' },
    { name: 'Productos', path: '/products' },
    { name: 'Facturas', path: '/invoices' },
  ]

  return (
    <div className="column" style={{ minHeight: '100vh' }}>
      {/* Header Estilo Amazon/Horror */}
      <header className="main-header" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
        <div style={{ justifySelf: 'start' }}>
          <Link to="/dashboard" style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '24px', letterSpacing: '2px' }}>PHANTOMLOG</Link>
        </div>

        <div className="header-search-container" style={{ width: '400px' }}>
          <input 
            type="text" 
            placeholder="BUSCAR PRODUCTOS..." 
            value={globalSearch}
            onChange={(e) => {
              const val = e.target.value
              setGlobalSearch(val)
              if (val.trim() !== '' && location.pathname !== '/products') {
                navigate('/products')
              }
            }}
            className="header-search-input"
          />
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        
        <nav className="nav-links" style={{ justifySelf: 'end' }}>
          {navLinks.map(link => (
            <Link 
              key={link.path} 
              to={link.path} 
              className="nav-link"
              style={{ 
                color: location.pathname.startsWith(link.path) ? 'var(--text)' : 'var(--text-muted)', 
              }}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/cart" className="nav-link" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          
          <Link to="/profile" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            borderLeft: '1px solid #222', 
            paddingLeft: '15px' 
          }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: 'var(--text-muted)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              overflow: 'hidden',
              border: '1px solid var(--text)'
            }}>
              {user?.img ? (
                <img src={user.img} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ color: 'var(--text)', fontSize: '14px', fontWeight: 'bold' }}>{user?.username?.[0].toUpperCase()}</span>
              )}
            </div>
          </Link>
        </nav>
      </header>

      {/* Content Area */}
      <main style={{ opacity: showContent ? 1 : 0, transition: 'opacity 0.5s', flex: 1 }}>
        <Outlet />
      </main>

      {/* Global Footer */}
      <footer className="main-footer">
        <div className="footer-content grid-3">
          <div className="footer-section">
            <h4 className="footer-title">PHANTOMLOG CORP</h4>
            <p>Monitoreando el velo desde 1994.</p>
            <p>Todos los derechos reservados // Código: 0x8842</p>
          </div>
          <div className="footer-section">
            <h4 className="footer-title">ACCESO RÁPIDO</h4>
            <div className="column" style={{ gap: '5px' }}>
              <Link to="/products">Armería</Link>
              <Link to="/forums">Archivo de Testimonios</Link>
              <Link to="/expeditions">Calendario de Incursión</Link>
            </div>
          </div>
          <div className="footer-section">
            <h4 className="footer-title">ESTADO DEL SISTEMA</h4>
            <p style={{ color: '#0f0' }}>● SERVIDORES: ONLINE</p>
            <p style={{ color: '#0f0' }}>● CONEXIÓN: ENCRIPTADA</p>
            <p style={{ color: 'var(--accent)' }}>● AMENAZAS: ACTIVAS</p>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} PHANTOMLOG - NO MIRES ATRÁS.
        </div>
      </footer>
    </div>
  )
}
