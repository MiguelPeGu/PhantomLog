import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const omens = [
  'Tu nombre quedará grabado para siempre.',
  'No hay vuelta atrás una vez que firmes.',
  'El registro te reclamará.',
  'Algo te observa mientras escribes.',
]

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const canvasRef = useRef(null)

  const [form, setForm] = useState({
    dni: '', username: '', firstname: '', lastname: '',
    email: '', password: '', password_confirmation: '',
    address: '', postalCode: '',
  })
  const [error, setError]     = useState('')
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [omenIdx, setOmenIdx] = useState(0)
  const [omenVisible, setOmenVisible] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [shake, setShake]     = useState(false)
  const [step, setStep]       = useState(1) // 2-step form

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      r: Math.random() * 1.2 + 0.2, dx: (Math.random() - 0.5) * 0.25,
      dy: (Math.random() - 0.5) * 0.15, o: Math.random() * 0.5 + 0.1,
    }))
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180,140,90,${p.o})`; ctx.fill()
        p.x += p.dx; p.y += p.dy
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  useEffect(() => { setTimeout(() => setShowContent(true), 200) }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setOmenVisible(false)
      setTimeout(() => { setOmenIdx(i => (i + 1) % omens.length); setOmenVisible(true) }, 500)
    }, 4000)
    return () => clearInterval(t)
  }, [])

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const validateStep1 = () => {
    const errs = {}
    if (!form.dni.trim())       errs.dni = 'Requerido'
    if (!form.username.trim())  errs.username = 'Requerido'
    if (!form.firstname.trim()) errs.firstname = 'Requerido'
    if (!form.lastname.trim())  errs.lastname = 'Requerido'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (validateStep1()) setStep(2)
    else { setShake(true); setTimeout(() => setShake(false), 600) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.email.trim())    errs.email = 'Requerido'
    if (form.password.length < 8) errs.password = 'Mínimo 8 caracteres'
    if (form.password !== form.password_confirmation) errs.password_confirmation = 'No coinciden'
    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      setShake(true); setTimeout(() => setShake(false), 600); return
    }

    setLoading(true); setError('')
    try {
      const { register } = await import('../api/auth')
      await register(form)
      await login(form.email, form.password)
      navigate('/forums')
    } catch (err) {
      setShake(true); setTimeout(() => setShake(false), 600)
      const serverErrors = err.response?.data?.errors
      if (serverErrors) setErrors(serverErrors)
      else setError(err.response?.data?.message || 'El ritual ha fallado.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = (field) => ({
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(10,6,12,0.8)',
    border: `1px solid ${errors[field] ? 'rgba(180,40,20,0.7)' : 'rgba(200,169,110,0.2)'}`,
    color: '#c8a96e',
    fontFamily: "'IM Fell English', serif",
    fontSize: 15, padding: '12px 14px',
    outline: 'none', letterSpacing: '0.03em',
  })

  const labelStyle = {
    display: 'block', fontSize: 10, letterSpacing: '0.35em',
    textTransform: 'uppercase', color: 'rgba(200,169,110,0.4)',
    marginBottom: 7,
  }

  const fieldErrorStyle = {
    fontSize: 11, fontStyle: 'italic',
    color: 'rgba(200,50,30,0.8)',
    marginTop: 5, letterSpacing: '0.03em',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050305',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'IM Fell English', 'Palatino Linotype', Georgia, serif",
      color: '#c8a96e', overflow: 'hidden', position: 'relative',
      cursor: 'crosshair', padding: '24px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=UnifrakturMaguntia&display=swap');
        @keyframes scanline { 0%{top:-2%} 100%{top:102%} }
        @keyframes shake {
          0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)}
        }
        @keyframes rotateSlow {
          from{transform:translate(-50%,-50%) rotate(0deg)}
          to{transform:translate(-50%,-50%) rotate(360deg)}
        }
        @keyframes fadeSlide {
          from{opacity:0;transform:translateX(20px)}
          to{opacity:1;transform:translateX(0)}
        }
        @keyframes errorPulse {
          0%,100%{opacity:1} 50%{opacity:0.6}
        }
        .phantom-input {
          width:100%; box-sizing:border-box;
          background:rgba(10,6,12,0.8);
          border:1px solid rgba(200,169,110,0.2);
          color:#c8a96e;
          font-family:'IM Fell English',serif;
          font-size:15px; padding:12px 14px; outline:none;
          letter-spacing:0.03em;
          transition:border-color 0.3s, box-shadow 0.3s;
        }
        .phantom-input::placeholder { color:rgba(200,169,110,0.22); font-style:italic; }
        .phantom-input:focus {
          border-color:rgba(200,169,110,0.55);
          box-shadow:0 0 16px rgba(200,169,110,0.07);
        }
        .phantom-input.err { border-color:rgba(180,40,20,0.7); }
        .submit-btn {
          width:100%; background:transparent;
          border:1px solid rgba(200,169,110,0.3);
          color:#c8a96e; font-family:'IM Fell English',serif;
          font-size:13px; letter-spacing:0.3em; text-transform:uppercase;
          padding:15px; cursor:crosshair; transition:all 0.4s; position:relative;
        }
        .submit-btn:hover:not(:disabled) {
          border-color:rgba(180,50,30,0.7); color:#f0d090;
          box-shadow:0 0 20px rgba(140,30,20,0.3);
          background:rgba(140,30,20,0.15);
        }
        .submit-btn:disabled { opacity:0.4; cursor:not-allowed; }
        .back-btn {
          background:transparent; border:none;
          color:rgba(200,169,110,0.35); font-family:'IM Fell English',serif;
          font-size:12px; letter-spacing:0.2em; cursor:crosshair;
          text-transform:uppercase; padding:0; transition:color 0.3s;
        }
        .back-btn:hover { color:rgba(200,169,110,0.7); }
        .step-indicator {
          display:inline-block; width:8px; height:8px;
          border:1px solid rgba(200,169,110,0.4); margin:0 4px;
          transition:background 0.4s, border-color 0.4s;
        }
        .step-indicator.active {
          background:rgba(200,169,110,0.6);
          border-color:rgba(200,169,110,0.8);
        }
      `}</style>

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
        position:'fixed', width:520, height:520, top:'50%', left:'50%',
        border:'1px solid rgba(200,169,110,0.04)', borderRadius:'50%',
        animation:'rotateSlow 55s linear infinite', zIndex:2, pointerEvents:'none',
      }} />

      {/* Card */}
      <div style={{
        position:'relative', zIndex:10, width:'100%', maxWidth:460,
        opacity: showContent ? 1 : 0,
        transform: showContent ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 1s ease, transform 1s ease',
        animation: shake ? 'shake 0.5s ease' : 'none',
      }}>
        {/* Corner ornaments */}
        {['top:0;left:0', 'top:0;right:0', 'bottom:0;left:0', 'bottom:0;right:0'].map((pos, i) => (
          <div key={i} style={{
            position:'absolute', width:18, height:18, zIndex:1,
            ...(pos.split(';').reduce((acc, s) => { const [k,v] = s.split(':'); acc[k]=v; return acc }, {})),
          }}>
            <svg viewBox="0 0 18 18" fill="none" style={{
              width:'100%',height:'100%',
              transform: i===1?'scaleX(-1)':i===2?'scaleY(-1)':i===3?'scale(-1)':'none'
            }}>
              <line x1="0" y1="0" x2="11" y2="0" stroke="rgba(200,169,110,0.35)" strokeWidth="1"/>
              <line x1="0" y1="0" x2="0" y2="11" stroke="rgba(200,169,110,0.35)" strokeWidth="1"/>
            </svg>
          </div>
        ))}

        <div style={{
          border:'1px solid rgba(200,169,110,0.1)',
          background:'rgba(8,4,10,0.88)',
          padding:'44px 40px',
          backdropFilter:'blur(4px)',
        }}>
          {/* Header */}
          <div style={{ textAlign:'center', marginBottom:28 }}>
            <div style={{
              fontFamily:"'UnifrakturMaguntia',serif", fontSize:34,
              color:'#c8a96e', textShadow:'0 0 30px rgba(200,169,110,0.2)',
              marginBottom:6, lineHeight:1,
            }}>PhantomLog</div>
            <div style={{
              fontSize:10, letterSpacing:'0.4em', textTransform:'uppercase',
              color:'rgba(200,169,110,0.3)', fontStyle:'italic', marginBottom:14,
            }}>El ritual de inscripción</div>
            <div style={{ display:'flex', alignItems:'center', gap:12, justifyContent:'center', marginBottom:14 }}>
              <div style={{ width:35, height:'1px', background:'linear-gradient(to right, transparent, rgba(200,169,110,0.3))' }} />
              <span style={{ color:'rgba(200,169,110,0.35)', fontSize:13 }}>⌖</span>
              <div style={{ width:35, height:'1px', background:'linear-gradient(to left, transparent, rgba(200,169,110,0.3))' }} />
            </div>
            {/* Step indicators */}
            <div style={{ display:'flex', justifyContent:'center', gap:4 }}>
              <div className={`step-indicator ${step >= 1 ? 'active' : ''}`} />
              <div className={`step-indicator ${step >= 2 ? 'active' : ''}`} />
            </div>
          </div>

          {/* Omen */}
          <div style={{ height:18, marginBottom:24, textAlign:'center' }}>
            <p style={{
              margin:0, fontSize:12, fontStyle:'italic',
              color:'rgba(180,60,40,0.65)', letterSpacing:'0.04em',
              opacity: omenVisible ? 1 : 0,
              transform: omenVisible ? 'translateY(0)' : 'translateY(5px)',
              transition:'opacity 0.5s, transform 0.5s',
            }}>{omens[omenIdx]}</p>
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div style={{ animation:'fadeSlide 0.4s ease' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                <div>
                  <label style={labelStyle}>Nombre</label>
                  <input className={`phantom-input${errors.firstname?' err':''}`} placeholder="Nombre"
                    value={form.firstname} onChange={set('firstname')} />
                  {errors.firstname && <p style={fieldErrorStyle}>{errors.firstname}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Apellido</label>
                  <input className={`phantom-input${errors.lastname?' err':''}`} placeholder="Apellido"
                    value={form.lastname} onChange={set('lastname')} />
                  {errors.lastname && <p style={fieldErrorStyle}>{errors.lastname}</p>}
                </div>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={labelStyle}>Nombre de invocar</label>
                <input className={`phantom-input${errors.username?' err':''}`} placeholder="username"
                  value={form.username} onChange={set('username')} />
                {errors.username && <p style={fieldErrorStyle}>{errors.username}</p>}
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={labelStyle}>DNI</label>
                <input className={`phantom-input${errors.dni?' err':''}`} placeholder="12345678A"
                  value={form.dni} onChange={set('dni')} />
                {errors.dni && <p style={fieldErrorStyle}>{errors.dni}</p>}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:14, marginBottom:24 }}>
                <div>
                  <label style={labelStyle}>Dirección</label>
                  <input className="phantom-input" placeholder="Calle..." value={form.address} onChange={set('address')} />
                </div>
                <div>
                  <label style={labelStyle}>C.P.</label>
                  <input className="phantom-input" placeholder="29000" value={form.postalCode} onChange={set('postalCode')} />
                </div>
              </div>
              <button className="submit-btn" onClick={handleNext}>
                Continuar el ritual →
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <form onSubmit={handleSubmit} style={{ animation:'fadeSlide 0.4s ease' }}>
              <div style={{ marginBottom:14 }}>
                <label style={labelStyle}>Correo</label>
                <input className={`phantom-input${errors.email?' err':''}`} type="email"
                  placeholder="tu@correo.com" value={form.email} onChange={set('email')} />
                {errors.email && <p style={fieldErrorStyle}>{errors.email}</p>}
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={labelStyle}>Contraseña</label>
                <input className={`phantom-input${errors.password?' err':''}`} type="password"
                  placeholder="Mínimo 8 caracteres" value={form.password} onChange={set('password')} />
                {errors.password && <p style={fieldErrorStyle}>{errors.password}</p>}
              </div>
              <div style={{ marginBottom:24 }}>
                <label style={labelStyle}>Confirmar contraseña</label>
                <input className={`phantom-input${errors.password_confirmation?' err':''}`} type="password"
                  placeholder="Repite la contraseña" value={form.password_confirmation}
                  onChange={set('password_confirmation')} />
                {errors.password_confirmation && <p style={fieldErrorStyle}>{errors.password_confirmation}</p>}
              </div>

              {error && (
                <div style={{
                  fontSize:12, fontStyle:'italic', color:'rgba(200,50,30,0.9)',
                  textAlign:'center', padding:'10px', marginBottom:16,
                  border:'1px solid rgba(180,40,20,0.3)', background:'rgba(100,10,5,0.2)',
                  animation:'errorPulse 2s ease infinite', letterSpacing:'0.04em',
                }}>{error}</div>
              )}

              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <button className="submit-btn" type="submit" disabled={loading}>
                  {loading ? 'Sellando el pacto...' : 'Firmar el registro'}
                </button>
                <button type="button" className="back-btn" onClick={() => setStep(1)}>
                  ← Volver
                </button>
              </div>
            </form>
          )}

          {/* Footer */}
          <div style={{
            marginTop:24, paddingTop:18,
            borderTop:'1px solid rgba(200,169,110,0.07)',
            textAlign:'center',
          }}>
            <p style={{ margin:0, fontSize:12, color:'rgba(200,169,110,0.28)', fontStyle:'italic' }}>
              ¿Ya tienes acceso?{' '}
              <Link to="/login" style={{
                color:'rgba(200,169,110,0.55)', textDecoration:'underline',
                textUnderlineOffset:3, transition:'color 0.3s',
              }}>Entrar</Link>
            </p>
          </div>
        </div>

        <div style={{ textAlign:'center', marginTop:18 }}>
          <Link to="/" style={{
            fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase',
            color:'rgba(200,169,110,0.18)', textDecoration:'none', transition:'color 0.3s',
          }}>← Volver al inicio</Link>
        </div>
      </div>
    </div>
  )
}