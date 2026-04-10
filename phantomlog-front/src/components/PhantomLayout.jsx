import { useEffect, useRef, useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PhantomLayout() {
  const canvasRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const [showContent, setShowContent] = useState(false)

  // Canvas fog
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
      background: '#050305',
      color: '#c8a96e',
      fontFamily: "'IM Fell English', 'Palatino Linotype', Georgia, serif",
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=UnifrakturMaguntia&display=swap');

        @keyframes scanline {
          0% { top:-2%; } 100% { top:102%; }
        }
        @keyframes rotateSlow {
          from { transform:translate(-50%,-50%) rotate(0deg); }
          to   { transform:translate(-50%,-50%) rotate(360deg); }
        }
        
        .phantom-nav {
          position: relative;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          background: rgba(8, 4, 10, 0.85);
          border-bottom: 1px solid rgba(200, 169, 110, 0.15);
          backdrop-filter: blur(8px);
        }

        .nav-logo {
          font-family: 'UnifrakturMaguntia', serif;
          font-size: 24px;
          color: #c8a96e;
          text-decoration: none;
          text-shadow: 0 0 15px rgba(200, 169, 110, 0.4);
        }

        .nav-links {
          display: flex;
          gap: 24px;
        }

        .nav-link {
          color: rgba(200, 169, 110, 0.6);
          text-decoration: none;
          font-size: 14px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition: all 0.3s ease;
          position: relative;
          padding-bottom: 4px;
        }

        .nav-link:hover, .nav-link.active {
          color: #f0d090;
          text-shadow: 0 0 8px rgba(200, 169, 110, 0.5);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(200, 169, 110, 0.8), transparent);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }
        .nav-link:hover::after, .nav-link.active::after {
          transform: scaleX(1);
        }

        .logout-btn {
          background: transparent;
          border: 1px solid rgba(180, 50, 40, 0.4);
          color: rgba(180, 50, 40, 0.8);
          font-family: 'IM Fell English', serif;
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 6px 16px;
          cursor: crosshair;
          transition: all 0.3s ease;
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

        /* Custom Scrollbar for the main wrapper */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(5, 3, 5, 0.9);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(200, 169, 110, 0.2);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(200, 169, 110, 0.4);
        }
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
        <Link to="/forums" className="nav-logo">PhantomLog</Link>
        
        <div className="nav-links">
          {navLinks.map(link => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`nav-link ${location.pathname.startsWith(link.path) ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <button onClick={handleLogout} className="logout-btn">
          Abandonar
        </button>
      </nav>

      {/* Main Content Area */}
      <main className={`phantom-content ${showContent ? 'visible' : ''}`}>
        <Outlet />
      </main>

    </div>
  )
}
