import { useEffect, useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

export default function PhantomLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { cartCount } = useCart()
  const { addToast } = useToast()
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
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#0f0',
      fontFamily: 'sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header Simple */}
      <header style={{
        padding: '10px 20px',
        borderBottom: '2px solid #040',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#000'
      }}>
        <Link to="/dashboard" style={{ color: '#f00', textDecoration: 'none', fontWeight: 'bold', fontSize: '24px' }}>PHANTOMLOG</Link>
        
        <nav style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {navLinks.map(link => (
            <Link 
              key={link.path} 
              to={link.path} 
              style={{ 
                color: location.pathname.startsWith(link.path) ? '#0f0' : '#060', 
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/cart" style={{ color: '#0f0', textDecoration: 'none', position: 'relative' }}>
            CARRITO ({cartCount})
          </Link>
          <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #f00', color: '#f00', padding: '2px 5px', fontSize: '12px' }}>SALIR</button>
        </nav>
      </header>

      {/* Content Area */}
      <main style={{ padding: '20px', opacity: showContent ? 1 : 0, transition: 'opacity 0.5s' }}>
        <Outlet />
      </main>
    </div>
  )
}
