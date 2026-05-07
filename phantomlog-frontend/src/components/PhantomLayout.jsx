import { useData } from '../context/DataProvider'
import { useEffect, useState } from 'react'
import { Outlet, Link, useLocation, useNavigate, useNavigation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

export default function PhantomLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const navigation = useNavigation()
  const { logout, user } = useAuth()
  const { cartCount } = useCart()
  const { addToast } = useToast()
  const { globalSearch, setGlobalSearch } = useData()
  const [showContent, setShowContent] = useState(false)

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])
  
  // Theme Management
  const [theme, setTheme] = useState(localStorage.getItem('phantom-theme') || 'dark')
  
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode')
    } else {
      document.body.classList.remove('light-mode')
    }
  }, [theme])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('phantom-theme', newTheme)
  }

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
  ]

  return (
    <div key={theme} className="column min-vh100" style={{ background: 'var(--bg)' }}>
      {/* Header Estilo Amazon/Horror */}
      <header className="main-header header-grid">
        <div className="header-left gap-20">
          <Link to="/dashboard" className="header-logo">PHANTOMLOG</Link>
          <button 
            onClick={toggleTheme} 
            className="flex-center theme-toggle-btn" 
            title={theme === 'dark' ? 'Activar modo clínico' : 'Activar modo original'}
          >
            {theme === 'dark' ? '🔆' : '🌑'}
          </button>
          
          {user?.role === 'admin' && (
            <a 
              href="http://localhost:8000/admin" 
              className="btn fs-11 p-8-15 no-underline flex-center gap-8 border-1"
            >
              <span className="ls-1">PANEL ADMIN</span>
            </a>
          )}
        </div>

        <div className="header-search-container" style={{ flex: '0 0 400px', maxWidth: '600px', margin: '0 20px' }}>
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
        
        <nav className="header-right nav-links gap-20">
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
          <Link to="/cart" className="nav-link relative flex-center gap-5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          
          <Link to="/profile" className="flex-center gap-10" style={{ borderLeft: '1px solid var(--border)', paddingLeft: '20px', marginLeft: '10px' }}>
            <div className="header-avatar-circle">
              {user?.img ? (
                <img 
                  src={user.img.startsWith('http') || user.img.startsWith('data:') ? user.img : `http://localhost:8000/storage/${user.img}`} 
                  alt="Profile" 
                  className="w-100 h-100 object-cover" 
                  onError={(e) => {
                    console.error("ERROR: Header avatar failed to load:", e.target.src);
                    e.target.style.display = 'none';
                    e.target.parentElement.innerText = user.username[0].toUpperCase();
                  }}
                />
              ) : (
                <span className="text-normal fs-14 bold">{user?.username?.[0].toUpperCase()}</span>
              )}
            </div>
          </Link>
        </nav>
      </header>

      {/* Content Area */}
      <main className={`flex-1 ${!showContent ? 'opacity-0' : ''}`}>
        <Outlet />
      </main>

      {/* Global Footer */}
      <footer className="main-footer">
        <div className="footer-content grid-3">
          <div className="footer-section">
            <h4 className="footer-title">PHANTOMLOG</h4>
            <p>Monitoreando el velo desde 1994.</p>
            <p>Todos los derechos reservados // Código: 0x8842</p>
          </div>
          <div className="footer-section">
            <h4 className="footer-title">ACCESO RÁPIDO</h4>
            <div className="column gap-5">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path}>{link.name}</Link>
              ))}
            </div>
          </div>
          <div className="footer-section">
            <h4 className="footer-title">ESTADO DEL SISTEMA</h4>
            <p className="text-normal">● SERVIDORES: ONLINE</p>
            <p className="text-normal">● CONEXIÓN: ENCRIPTADA</p>
            <p className="text-accent">● AMENAZAS: ACTIVAS</p>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} PHANTOMLOG - NO MIRES ATRÁS.
        </div>
      </footer>
    </div>
  )
}
