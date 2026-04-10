import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const glitchFrames = [
  'PhantomLog',
  'Ph4nt0mL0g',
  'Ph̷a̸n̵t̶o̴m̷L̸o̵g̶',
  'Pħ₳ŇŦØmLØG',
  'PhantomLog',
  '̴̢̛P̸͔͝h̴̺͝a̵͇͠n̶̙͘t̸̻͝o̶͔͘m̵̺͝L̴̢͠o̸͚͘g̵̩͝',
  'PhantomLog',
]

const crypticMessages = [
  'Ellos no quieren que los encuentres.',
  'Ya saben que estás aquí.',
  'Cada avistamiento deja una huella.',
  'No mires hacia atrás.',
  'Llevan semanas siguiéndote.',
  'El registro ya tiene tu nombre.',
  'A las 3:17 AM vuelven.',
]

const floatingSymbols = ['☽', '✦', '⌖', '⋆', '⟁', '⊗', '◈', '⌬', '⟡', '✧', '⌘', '◉']

export default function Home() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const [glitchIndex, setGlitchIndex] = useState(0)
  const [msgIndex, setMsgIndex] = useState(0)
  const [msgVisible, setMsgVisible] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [eyePos, setEyePos] = useState({ x: 50, y: 50 })
  const [flicker, setFlicker] = useState(false)

  // Canvas fog / particles
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.5 + 0.3,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.6 + 0.1,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180, 140, 90, ${p.opacity})`
        ctx.fill()
        p.x += p.dx
        p.y += p.dy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // Entry animation
  useEffect(() => {
    setTimeout(() => setShowContent(true), 300)
  }, [])

  // Glitch title
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchIndex(i => (i + 1) % glitchFrames.length)
    }, 120)
    return () => clearInterval(interval)
  }, [])

  // Rotating cryptic messages
  useEffect(() => {
    const cycle = setInterval(() => {
      setMsgVisible(false)
      setTimeout(() => {
        setMsgIndex(i => (i + 1) % crypticMessages.length)
        setMsgVisible(true)
      }, 600)
    }, 3500)
    return () => clearInterval(cycle)
  }, [])

  // Random flicker
  useEffect(() => {
    const f = setInterval(() => {
      if (Math.random() < 0.15) {
        setFlicker(true)
        setTimeout(() => setFlicker(false), 80 + Math.random() * 120)
      }
    }, 800)
    return () => clearInterval(f)
  }, [])

  // Eye tracking
  useEffect(() => {
    const move = (e) => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      setEyePos({ x, y })
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  const pupilX = (eyePos.x - 50) * 0.06
  const pupilY = (eyePos.y - 50) * 0.06

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050305',
      color: '#c8a96e',
      fontFamily: "'IM Fell English', 'Palatino Linotype', Georgia, serif",
      overflow: 'hidden',
      position: 'relative',
      cursor: 'crosshair',
      opacity: flicker ? 0.92 : 1,
      transition: 'opacity 0.05s',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=UnifrakturMaguntia&display=swap');

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes msgFade {
          from { opacity: 0; transform: translateY(6px) skewX(-1deg); }
          to   { opacity: 1; transform: translateY(0) skewX(0deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.015); }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes rotateSlowRev {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes bloodDrip {
          0%   { height: 0;   opacity: 0.9; }
          80%  { height: 38px; opacity: 0.8; }
          100% { height: 38px; opacity: 0; }
        }
        @keyframes symbolFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50%       { transform: translateY(-18px) rotate(8deg); opacity: 0.6; }
        }
        @keyframes scanline {
          0%   { top: -5%; }
          100% { top: 105%; }
        }
        @keyframes borderGlow {
          0%, 100% { box-shadow: 0 0 8px rgba(140,30,20,0.4), inset 0 0 8px rgba(140,30,20,0.1); }
          50%       { box-shadow: 0 0 22px rgba(180,40,25,0.7), inset 0 0 14px rgba(180,40,25,0.2); }
        }
        @keyframes eyePulse {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(200,169,110,0.5)); }
          50%       { filter: drop-shadow(0 0 12px rgba(200,169,110,0.9)); }
        }

        .btn-enter {
          background: transparent;
          border: 1px solid rgba(200,169,110,0.35);
          color: #c8a96e;
          font-family: 'IM Fell English', serif;
          font-size: 13px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          padding: 14px 44px;
          cursor: crosshair;
          position: relative;
          overflow: hidden;
          transition: color 0.4s, border-color 0.4s;
        }
        .btn-enter::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(140,30,20,0);
          transition: background 0.4s;
        }
        .btn-enter:hover {
          color: #f0d090;
          border-color: rgba(200,80,60,0.7);
        }
        .btn-enter:hover::before {
          background: rgba(140,30,20,0.25);
        }
        .btn-enter:hover .drip {
          animation: bloodDrip 0.7s ease-in forwards;
        }

        .btn-ghost {
          background: transparent;
          border: none;
          color: rgba(200,169,110,0.4);
          font-family: 'IM Fell English', serif;
          font-size: 12px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: crosshair;
          text-decoration: underline;
          text-underline-offset: 4px;
          transition: color 0.3s;
          padding: 8px 20px;
        }
        .btn-ghost:hover { color: rgba(200,169,110,0.8); }

        .scanline {
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(to right, transparent, rgba(200,169,110,0.06), transparent);
          animation: scanline 7s linear infinite;
          pointer-events: none;
        }

        .symbol {
          position: absolute;
          font-size: 18px;
          color: rgba(200,169,110,0.18);
          animation: symbolFloat var(--dur, 5s) ease-in-out infinite;
          animation-delay: var(--delay, 0s);
          pointer-events: none;
          user-select: none;
        }

        .sigil-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(200,169,110,0.08);
        }
      `}</style>

      {/* Canvas particles */}
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />

      {/* Scanline */}
      <div className="scanline" style={{ zIndex: 1 }} />

      {/* Vignette */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(2,1,3,0.85) 100%)',
      }} />

      {/* Floating symbols */}
      {floatingSymbols.map((sym, i) => (
        <div key={i} className="symbol" style={{
          left: `${8 + (i * 8.2) % 88}%`,
          top: `${5 + (i * 13.7) % 85}%`,
          '--dur': `${4 + (i * 1.3) % 5}s`,
          '--delay': `${(i * 0.7) % 4}s`,
          zIndex: 2,
        }}>{sym}</div>
      ))}

      {/* Rotating sigil rings */}
      <div className="sigil-ring" style={{
        width: 500, height: 500,
        top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        animation: 'rotateSlow 40s linear infinite',
        zIndex: 2,
      }} />
      <div className="sigil-ring" style={{
        width: 380, height: 380,
        top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        border: '1px solid rgba(200,169,110,0.05)',
        animation: 'rotateSlowRev 28s linear infinite',
        zIndex: 2,
      }} />
      <div className="sigil-ring" style={{
        width: 640, height: 640,
        top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        border: '1px dashed rgba(200,169,110,0.04)',
        animation: 'rotateSlow 70s linear infinite',
        zIndex: 2,
      }} />

      {/* Main content */}
      <div style={{
        position: 'relative', zIndex: 10,
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px',
        opacity: showContent ? 1 : 0,
        transition: 'opacity 1.2s ease',
      }}>

        {/* Eye SVG */}
        <div style={{
          marginBottom: 32,
          animation: 'eyePulse 3s ease-in-out infinite',
          opacity: 0.85,
        }}>
          <svg width="80" height="44" viewBox="0 0 80 44" fill="none">
            <ellipse cx="40" cy="22" rx="38" ry="19" stroke="rgba(200,169,110,0.5)" strokeWidth="1"/>
            <ellipse cx="40" cy="22" rx="26" ry="13" stroke="rgba(200,169,110,0.25)" strokeWidth="0.5"/>
            <circle cx={40 + pupilX * 6} cy={22 + pupilY * 4} r="10" fill="rgba(200,169,110,0.15)" stroke="rgba(200,169,110,0.6)" strokeWidth="1"/>
            <circle cx={40 + pupilX * 6} cy={22 + pupilY * 4} r="5" fill="rgba(10,5,5,0.95)"/>
            <circle cx={40 + pupilX * 6 + 1.5} cy={22 + pupilY * 4 - 1.5} r="1.5" fill="rgba(200,169,110,0.9)"/>
            {/* lashes */}
            {[-28,-18,-8,0,8,18,28].map((ox, i) => (
              <line key={i}
                x1={40 + ox} y1={3}
                x2={40 + ox * 0.7} y2={10}
                stroke="rgba(200,169,110,0.3)" strokeWidth="0.8"/>
            ))}
          </svg>
        </div>

        {/* Fraktur title */}
        <div style={{
          fontFamily: "'UnifrakturMaguntia', serif",
          fontSize: 'clamp(52px, 9vw, 96px)',
          letterSpacing: '0.04em',
          color: '#c8a96e',
          textShadow: '0 0 40px rgba(200,169,110,0.25), 0 0 80px rgba(200,80,40,0.12)',
          marginBottom: 8,
          animation: 'fadeInUp 1.4s ease both',
          lineHeight: 1,
          userSelect: 'none',
        }}>
          {glitchFrames[glitchIndex]}
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: '11px',
          letterSpacing: '0.45em',
          textTransform: 'uppercase',
          color: 'rgba(200,169,110,0.45)',
          marginBottom: 48,
          animation: 'fadeInUp 1.4s 0.3s ease both',
          fontFamily: "'IM Fell English', serif",
          fontStyle: 'italic',
        }}>
          Registro de lo que no debería existir
        </div>

        {/* Ornamental divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          marginBottom: 48,
          animation: 'fadeIn 1.8s 0.5s ease both',
          opacity: 0,
        }}>
          <div style={{ width: 60, height: 1, background: 'linear-gradient(to right, transparent, rgba(200,169,110,0.4))' }} />
          <span style={{ fontSize: 18, color: 'rgba(200,169,110,0.5)' }}>⌖</span>
          <div style={{ width: 60, height: 1, background: 'linear-gradient(to left, transparent, rgba(200,169,110,0.4))' }} />
        </div>

        {/* Cryptic rotating message */}
        <div style={{
          height: 28,
          marginBottom: 56,
          animation: 'fadeIn 1.8s 0.6s ease both',
          opacity: 0,
        }}>
          <p style={{
            fontSize: '13px',
            fontStyle: 'italic',
            color: 'rgba(180,60,40,0.75)',
            letterSpacing: '0.06em',
            textAlign: 'center',
            margin: 0,
            opacity: msgVisible ? 1 : 0,
            transform: msgVisible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}>
            {crypticMessages[msgIndex]}
          </p>
        </div>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 16,
          animation: 'fadeInUp 1.4s 0.8s ease both',
          opacity: 0,
        }}>
          <button className="btn-enter" onClick={() => navigate('/register')}>
            {/* blood drip decoration */}
            {[12, 28, 44, 60, 76, 90].map((left, i) => (
              <span key={i} className="drip" style={{
                position: 'absolute', top: 0,
                left: `${left}%`,
                width: '1.5px',
                background: 'linear-gradient(to bottom, rgba(180,30,20,0.8), transparent)',
                height: 0,
                pointerEvents: 'none',
              }} />
            ))}
            Unirse al registro
          </button>

          <button className="btn-ghost" onClick={() => navigate('/login')}>
            Ya tengo acceso
          </button>
        </div>

        {/* Bottom warning */}
        <div style={{
          position: 'absolute', bottom: 32,
          left: 0, right: 0,
          textAlign: 'center',
          fontSize: '10px',
          letterSpacing: '0.3em',
          color: 'rgba(200,169,110,0.18)',
          fontFamily: "'IM Fell English', serif",
          animation: 'fadeIn 2.5s 1.2s ease both',
          opacity: 0,
        }}>
          NO SOMOS RESPONSABLES DE LO QUE ENCUENTRES
        </div>

        {/* Corner sigils */}
        {['top:20px;left:20px', 'top:20px;right:20px', 'bottom:20px;left:20px', 'bottom:20px;right:20px'].map((pos, i) => (
          <div key={i} style={{
            position: 'fixed',
            ...Object.fromEntries(pos.split(';').map(p => p.split(':'))),
            width: 40, height: 40,
            opacity: 0.2,
            zIndex: 5,
          }}>
            <svg viewBox="0 0 40 40" fill="none">
              <line x1="0" y1="0" x2="12" y2="0" stroke="#c8a96e" strokeWidth="1"/>
              <line x1="0" y1="0" x2="0" y2="12" stroke="#c8a96e" strokeWidth="1"/>
              {i === 1 || i === 3 ? (
                <>
                  <line x1="40" y1="0" x2="28" y2="0" stroke="#c8a96e" strokeWidth="1"/>
                  <line x1="40" y1="0" x2="40" y2="12" stroke="#c8a96e" strokeWidth="1"/>
                </>
              ) : null}
            </svg>
          </div>
        ))}
      </div>
    </div>
  )
}