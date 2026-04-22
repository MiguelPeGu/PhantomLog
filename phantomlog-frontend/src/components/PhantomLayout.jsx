import { useEffect, useRef, useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

export default function PhantomLayout() {
  const canvasRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const { cartCount } = useCart()
  const { addToast } = useToast()
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.2,
      dx: (Math.random() - 0.5) * 0.25,
      dy: (Math.random() - 0.5) * 0.15,
      o: Math.random() * 0.5 + 0.1,
    }))
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180,140,90,${p.o})`; ctx.fill()
        p.x += p.dx; p.y += p.dy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  useEffect(() => { setShowContent(true) }, [])

  const handleLogout = async () => {
    addToast("Sellando el expediente y borrando rastros...", "info")
    setShowContent(false) // Desvanecer contenido antes de salir
    
    setTimeout(async () => {
      try {
        if (logout) await logout()
      } catch {
        // ignore
      } finally {
        navigate('/login')
      }
    }, 800)
  }

  const navLinks = [
    { name: 'Foros', path: '/forums' },
    { name: 'Expediciones', path: '/expeditions' },
    { name: 'Fantasmas', path: '/phantoms' },
    { name: 'Productos', path: '/products' },
    { name: 'Facturas', path: '/invoices' },
  ]

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleNavClick = (path) => {
    setIsMenuOpen(false)
    navigate(path)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050305',
      color: '#c8a96e',
      fontFamily: "var(--sans)",
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <style>{`
        @keyframes scanline {
          0% { top:-2%; } 100% { top:102%; }
        }
        @keyframes rotateSlow {
          from { transform:translate(-50%,-50%) rotate(0deg); }
          to   { transform:translate(-50%,-50%) rotate(360deg); }
        }
        
        .phantom-nav {
          position: relative;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 40px;
          background: rgba(8, 4, 10, 0.9);
          border-bottom: 1px solid rgba(200, 169, 110, 0.1);
          backdrop-filter: blur(12px);
        }

        .nav-logo {
          font-family: var(--heading);
          font-weight: 700;
          font-size: 28px;
          color: #c8a96e;
          text-decoration: none;
          text-shadow: 0 0 15px rgba(200, 169, 110, 0.4);
          z-index: 101;
        }

        /* Hamburger Button */
        .hamburger {
          width: 30px;
          height: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          cursor: pointer;
          z-index: 101;
          transition: transform 0.3s ease;
        }

        .hamburger:hover {
          transform: scale(1.1);
        }

        .hamburger span {
          display: block;
          width: 100%;
          height: 2px;
          background: #c8a96e;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 0 5px rgba(200, 169, 110, 0.3);
        }

        .hamburger.open span:nth-child(1) {
          transform: translateY(9px) rotate(45deg);
        }
        .hamburger.open span:nth-child(2) {
          opacity: 0;
          transform: translateX(-20px);
        }
        .hamburger.open span:nth-child(3) {
          transform: translateY(-9px) rotate(-45deg);
        }

        /* Menu Overlay */
        .menu-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(5, 3, 5, 0.98);
          z-index: 90;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: all 0.6s cubic-bezier(0.77, 0, 0.175, 1);
          backdrop-filter: blur(20px);
        }

        .menu-overlay.open {
          opacity: 1;
          visibility: visible;
        }

        .menu-links {
          display: flex;
          flex-direction: column;
          gap: 30px;
          text-align: center;
          transform: translateY(30px);
          transition: transform 0.6s cubic-bezier(0.77, 0, 0.175, 1);
        }

        .menu-overlay.open .menu-links {
          transform: translateY(0);
        }

        .menu-link {
          font-family: var(--heading);
          font-weight: 600;
          font-size: 42px;
          color: rgba(200, 169, 110, 0.4);
          text-decoration: none;
          transition: all 0.4s ease;
          letter-spacing: 2px;
          position: relative;
        }

        .menu-link:hover, .menu-link.active {
          color: #c8a96e;
          text-shadow: 0 0 25px rgba(200, 169, 110, 0.5);
          transform: scale(1.1);
        }

        .menu-link::after {
          content: '—';
          position: absolute;
          left: -40px;
          opacity: 0;
          transition: all 0.3s;
        }
        .menu-link:hover::after {
          opacity: 1;
          left: -30px;
        }

        .logout-btn {
          background: transparent;
          border: 1px solid rgba(180, 50, 40, 0.4);
          color: rgba(180, 50, 40, 0.8);
          font-family: var(--sans);
          font-size: 14px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 8px 24px;
          cursor: crosshair;
          transition: all 0.3s ease;
          margin-top: 20px;
        }

        .logout-btn:hover {
          background: rgba(180, 50, 40, 0.15);
          color: #ff6b5a;
          border-color: rgba(180, 50, 40, 0.8);
          box-shadow: 0 0 10px rgba(180, 50, 40, 0.3);
        }

        .phantom-content {
          flex: 1;
          position: relative;
          z-index: 10;
          padding: 40px;
          overflow-y: auto;
          opacity: 0;
          transition: opacity 1s ease;
        }

        .phantom-content.visible {
          opacity: 1;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: rgba(5, 3, 5, 0.9); }
        ::-webkit-scrollbar-thumb { background: rgba(200, 169, 110, 0.2); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(200, 169, 110, 0.4); }
      `}</style>

      {/* Background Elements */}
      <canvas ref={canvasRef} style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }} />
      
      <div style={{
        position:'fixed', left:0, right:0, height:'2px', zIndex:1, pointerEvents:'none',
        background:'linear-gradient(to right, transparent, rgba(200,169,110,0.05), transparent)',
        animation:'scanline 8s linear infinite',
      }} />

      <div style={{
        position:'fixed', inset:0, zIndex:1, pointerEvents:'none',
        background:'radial-gradient(ellipse at center, transparent 20%, rgba(2,1,3,0.92) 100%)',
      }} />
      
      <div style={{
        position:'fixed', width:700, height:700,
        top:'50%', left:'50%',
        border:'1px dashed rgba(200,169,110,0.03)',
        borderRadius:'50%',
        animation:'rotateSlow 90s linear infinite',
        zIndex:2, pointerEvents:'none',
      }} />

      {/* Navbar */}
      <nav className="phantom-nav">
        <Link to="/dashboard" className="nav-logo">PhantomLog</Link>
        
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            <Link to="/cart" className="nav-link" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: '#c8a96e', zIndex: 101 }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '28px', height: '28px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>

              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-10px',
                  background: '#ff2222',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontFamily: 'sans-serif',
                  fontWeight: 'bold',
                  boxShadow: '0 0 10px rgba(255, 34, 34, 0.8)'
                }}>
                  {cartCount}
                </span>
              )}
            </Link>

            <div className={`hamburger ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
              <span></span>
              <span></span>
              <span></span>
            </div>
        </div>
      </nav>

      {/* Menu Overlay */}
      <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`}>
        <div className="menu-links">
          <button onClick={() => handleNavClick('/dashboard')} className={`menu-link ${location.pathname === '/dashboard' ? 'active' : ''}`} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Inicio</button>
          {navLinks.map(link => (
            <button 
              key={link.path} 
              onClick={() => handleNavClick(link.path)}
              className={`menu-link ${location.pathname.startsWith(link.path) ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {link.name}
            </button>
          ))}
          <button onClick={handleLogout} className="logout-btn">
            Abandonar Archivo
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className={`phantom-content ${showContent ? 'visible' : ''}`}>
        <Outlet />
      </main>

    </div>
  )
}
