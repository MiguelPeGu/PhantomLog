import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const whispers = [
  'Introduce tus credenciales... si te atreves.',
  'Te estamos esperando.',
  'El registro nunca olvida.',
  'Bienvenido de nuevo. Te echábamos de menos.',
]

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const canvasRef = useRef(null)

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [whisperIdx, setWhisperIdx] = useState(0)
  const [whisperVisible, setWhisperVisible] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [shake, setShake] = useState(false)

  // Canvas fog
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.2 + 0.2,
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

  useEffect(() => { setTimeout(() => setShowContent(true), 200) }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setWhisperVisible(false)
      setTimeout(() => { setWhisperIdx(i => (i + 1) % whispers.length); setWhisperVisible(true) }, 500)
    }, 4000)
    return () => clearInterval(t)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/forums')
    } catch (err) {
      setShake(true)
      setTimeout(() => setShake(false), 600)
      setError(err.response?.data?.message || 'Las sombras no te reconocen.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050305',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'IM Fell English', 'Palatino Linotype', Georgia, serif",
      color: '#c8a96e',
      overflow: 'hidden',
      position: 'relative',
      cursor: 'crosshair',
      padding: '24px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=UnifrakturMaguntia&display=swap');

        @keyframes fadeInUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity:0; } to { opacity:1; }
        }
        @keyframes scanline {
          0% { top:-2%; } 100% { top:102%; }
        }
        @keyframes shake {
          0%,100% { transform:translateX(0); }
          20%     { transform:translateX(-8px); }
          40%     { transform:translateX(8px); }
          60%     { transform:translateX(-5px); }
          80%     { transform:translateX(5px); }
        }
        @keyframes borderPulse {
          0%,100% { border-color: rgba(200,169,110,0.25); }
          50%     { border-color: rgba(200,169,110,0.6); }
        }
        @keyframes errorPulse {
          0%,100% { opacity:1; }
          50%     { opacity:0.6; }
        }
        @keyframes rotateSlow {
          from { transform:translate(-50%,-50%) rotate(0deg); }
          to   { transform:translate(-50%,-50%) rotate(360deg); }
        }

        .phantom-input {
          width: 100%;
          background: rgba(10,6,12,0.8);
          border: 1px solid rgba(200,169,110,0.2);
          border-radius: 0;
          color: #c8a96e;
          font-family: 'IM Fell English', serif;
          font-size: 15px;
          padding: 14px 16px;
          outline: none;
          transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
          letter-spacing: 0.04em;
          box-sizing: border-box;
        }
        .phantom-input::placeholder {
          color: rgba(200,169,110,0.25);
          font-style: italic;
        }
        .phantom-input:focus {
          border-color: rgba(200,169,110,0.6);
          background: rgba(15,8,18,0.95);
          box-shadow: 0 0 20px rgba(200,169,110,0.08), inset 0 0 10px rgba(200,169,110,0.03);
        }

        .submit-btn {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(200,169,110,0.3);
          color: #c8a96e;
          font-family: 'IM Fell English', serif;
          font-size: 13px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          padding: 15px;
          cursor: crosshair;
          transition: all 0.4s;
          position: relative;
          overflow: hidden;
        }
        .submit-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(140,30,20,0);
          transition: background 0.4s;
        }
        .submit-btn:hover:not(:disabled) {
          border-color: rgba(180,50,30,0.7);
          color: #f0d090;
          box-shadow: 0 0 20px rgba(140,30,20,0.3);
        }
        .submit-btn:hover:not(:disabled)::after {
          background: rgba(140,30,20,0.2);
        }
        .submit-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>

      <canvas ref={canvasRef} style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }} />

      {/* Scanline */}
      <div style={{
        position:'fixed', left:0, right:0, height:'2px', zIndex:1, pointerEvents:'none',
        background:'linear-gradient(to right, transparent, rgba(200,169,110,0.05), transparent)',
        animation:'scanline 8s linear infinite',
      }} />

      {/* Vignette */}
      <div style={{
        position:'fixed', inset:0, zIndex:1, pointerEvents:'none',
        background:'radial-gradient(ellipse at center, transparent 20%, rgba(2,1,3,0.92) 100%)',
      }} />

      {/* Rotating ring */}
      <div style={{
        position:'fixed', width:520, height:520,
        top:'50%', left:'50%',
        border:'1px solid rgba(200,169,110,0.05)',
        borderRadius:'50%',
        animation:'rotateSlow 50s linear infinite',
        zIndex:2, pointerEvents:'none',
      }} />

      {/* Card */}
      <div style={{
        position:'relative', zIndex:10,
        width:'100%', maxWidth:420,
        opacity: showContent ? 1 : 0,
        transform: showContent ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 1s ease, transform 1s ease',
        animation: shake ? 'shake 0.5s ease' : 'none',
      }}>

        {/* Corner decorations */}
        {[
          'top:0;left:0',
          'top:0;right:0;transform:scaleX(-1)',
          'bottom:0;left:0;transform:scaleY(-1)',
          'bottom:0;right:0;transform:scale(-1)',
        ].map((style, i) => (
          <div key={i} style={{
            position:'absolute', width:20, height:20, zIndex:1,
            ...Object.fromEntries(style.split(';').map(s => s.split(':').map((v,i) => i===0 ? v.trim() : v.trim()))),
          }}>
            <svg viewBox="0 0 20 20" fill="none" style={{width:'100%',height:'100%'}}>
              <line x1="0" y1="0" x2="12" y2="0" stroke="rgba(200,169,110,0.4)" strokeWidth="1"/>
              <line x1="0" y1="0" x2="0" y2="12" stroke="rgba(200,169,110,0.4)" strokeWidth="1"/>
            </svg>
          </div>
        ))}

        <div style={{
          border:'1px solid rgba(200,169,110,0.12)',
          background:'rgba(8,4,10,0.85)',
          padding:'48px 40px',
          backdropFilter:'blur(4px)',
        }}>

          {/* Header */}
          <div style={{ textAlign:'center', marginBottom:36 }}>
            <div style={{
              fontFamily:"'UnifrakturMaguntia', serif",
              fontSize:38,
              color:'#c8a96e',
              textShadow:'0 0 30px rgba(200,169,110,0.2)',
              marginBottom:8,
              lineHeight:1,
            }}>PhantomLog</div>

            <div style={{
              fontSize:11,
              letterSpacing:'0.4em',
              textTransform:'uppercase',
              color:'rgba(200,169,110,0.35)',
              fontStyle:'italic',
              marginBottom:16,
            }}>Acceso restringido</div>

            {/* Ornament */}
            <div style={{ display:'flex', alignItems:'center', gap:12, justifyContent:'center' }}>
              <div style={{ width:40, height:'1px', background:'linear-gradient(to right, transparent, rgba(200,169,110,0.3))' }} />
              <span style={{ color:'rgba(200,169,110,0.4)', fontSize:14 }}>✦</span>
              <div style={{ width:40, height:'1px', background:'linear-gradient(to left, transparent, rgba(200,169,110,0.3))' }} />
            </div>
          </div>

          {/* Whisper */}
          <div style={{ height:20, marginBottom:28, textAlign:'center' }}>
            <p style={{
              margin:0, fontSize:12, fontStyle:'italic',
              color:'rgba(180,60,40,0.65)',
              letterSpacing:'0.05em',
              opacity: whisperVisible ? 1 : 0,
              transform: whisperVisible ? 'translateY(0)' : 'translateY(5px)',
              transition:'opacity 0.5s, transform 0.5s',
            }}>
              {whispers[whisperIdx]}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div>
              <label style={{
                display:'block', fontSize:10, letterSpacing:'0.35em',
                textTransform:'uppercase', color:'rgba(200,169,110,0.4)',
                marginBottom:8,
              }}>Correo</label>
              <input
                className="phantom-input"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                required
              />
            </div>

            <div>
              <label style={{
                display:'block', fontSize:10, letterSpacing:'0.35em',
                textTransform:'uppercase', color:'rgba(200,169,110,0.4)',
                marginBottom:8,
              }}>Contraseña</label>
              <input
                className="phantom-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                required
              />
            </div>

            {error && (
              <div style={{
                fontSize:12, fontStyle:'italic',
                color:'rgba(200,50,30,0.9)',
                textAlign:'center',
                padding:'10px',
                border:'1px solid rgba(180,40,20,0.3)',
                background:'rgba(100,10,5,0.2)',
                animation:'errorPulse 2s ease infinite',
                letterSpacing:'0.04em',
              }}>
                {error}
              </div>
            )}

            <div style={{ marginTop:8 }}>
              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? 'Verificando identidad...' : 'Entrar'}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div style={{
            marginTop:28,
            paddingTop:20,
            borderTop:'1px solid rgba(200,169,110,0.08)',
            textAlign:'center',
          }}>
            <p style={{
              margin:0, fontSize:12,
              color:'rgba(200,169,110,0.3)',
              fontStyle:'italic',
            }}>
              ¿Primera vez aquí?{' '}
              <Link to="/register" style={{
                color:'rgba(200,169,110,0.6)',
                textDecoration:'underline',
                textUnderlineOffset:3,
                transition:'color 0.3s',
              }}>
                Únete al registro
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div style={{ textAlign:'center', marginTop:20 }}>
          <Link to="/" style={{
            fontSize:10, letterSpacing:'0.3em',
            textTransform:'uppercase',
            color:'rgba(200,169,110,0.2)',
            textDecoration:'none',
            transition:'color 0.3s',
          }}>
            ← Volver
          </Link>
        </div>
      </div>
    </div>
  )
}