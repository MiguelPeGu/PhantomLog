import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const [glitchText, setGlitchText] = useState('404')
  
  useEffect(() => {
    const chars = '014'
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setGlitchText(
          Array(3)
            .fill(0)
            .map(() => chars[Math.floor(Math.random() * chars.length)])
            .join('')
        )
        setTimeout(() => setGlitchText('404'), 100)
      }
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex-center column vh100 text-center" style={{ background: '#000', padding: '20px' }}>
      <div style={{ position: 'relative' }}>
        <h1 style={{ 
          fontSize: '120px', 
          margin: 0, 
          color: 'var(--accent)', 
          textShadow: '0 0 20px rgba(255, 0, 0, 0.5)',
          fontFamily: 'var(--mono)'
        }}>
          {glitchText}
        </h1>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(transparent, rgba(255,0,0,0.1), transparent)',
          animation: 'scanline 2s linear infinite',
          pointerEvents: 'none'
        }} />
      </div>
      
      <h2 style={{ color: 'var(--text)', marginTop: '20px', letterSpacing: '4px' }}>ACCESO DENEGADO // RUTA NO ENCONTRADA</h2>
      <p style={{ color: 'var(--text-dim)', maxWidth: '500px', margin: '20px 0', lineHeight: '1.6' }}>
        Has cruzado el velo hacia un sector inexistente del archivo. 
        La entidad que buscas no reside en esta dimensión de datos.
      </p>

      <div className="column" style={{ gap: '15px', marginTop: '40px' }}>
        <Link to="/dashboard" className="primary" style={{ padding: '15px 40px', fontWeight: 'bold' }}>
          RETORNAR AL PANEL DE CONTROL
        </Link>
        <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
          ERR_CODE: [NULL_POINTER_EXCEPTION] // SECTOR_LOST
        </p>
      </div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  )
}
