import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  const { user } = useAuth()
  const [flickerOpacity, setFlickerOpacity] = useState(0)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const modules = [
    { title: 'FOROS', path: '/forums', desc: 'Reportes de la comunidad.' },
    { title: 'EXPEDICIONES', path: '/expeditions', desc: 'Misiones de campo.' },
    { title: 'BESTIARIO', path: '/phantoms', desc: 'Entidades clasificadas.' },
    { title: 'PRODUCTOS', path: '/products', desc: 'Equipo de investigacion.' }
  ]

  // Lógica de secuencia de terror (Aparición -> Parpadeo -> Desaparición)
  useEffect(() => {
    let isMounted = true;

    const runSequence = async () => {
      while (isMounted) {
        // 1. ESPERA RANDOM (1 a 5 segundos)
        setFlickerOpacity(0);
        const waitTime = Math.random() * 4000 + 1000;
        await new Promise(r => setTimeout(r, waitTime));
        if (!isMounted) break;

        // 2. PARPADEO RANDOM (2 a 6 veces)
        const flickerCount = Math.floor(Math.random() * 5) + 2;
        for (let i = 0; i < flickerCount; i++) {
          // Encendido
          setFlickerOpacity(Math.random() * 0.4 + 0.1);
          setOffset({ x: Math.random() * 10 - 5, y: Math.random() * 10 - 5 });
          await new Promise(r => setTimeout(r, 80));
          
          // Apagado rápido
          setFlickerOpacity(0);
          await new Promise(r => setTimeout(r, 60));
          if (!isMounted) break;
        }

        // 3. APARICIÓN BREVE FINAL (Opcional para dar más miedo antes de irse)
        setFlickerOpacity(0.2);
        await new Promise(r => setTimeout(r, 200));
        setFlickerOpacity(0);
      }
    };

    runSequence();
    return () => { isMounted = false; };
  }, []);

  return (
    <div style={{ padding: '20px', position: 'relative', minHeight: '80vh' }}>
      {/* Fondo con secuencia de terror programada */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url("/girl.png")',
        backgroundSize: '55%', 
        backgroundPosition: '90% -100%', // Anclada a la derecha y abajo
        zIndex: 1, 
        pointerEvents: 'none',
        opacity: flickerOpacity,
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: flickerOpacity === 0 ? 'opacity 0.3s' : 'none', 
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }} />

      {/* CONTENIDO */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <h1 style={{ color: '#f00', fontSize: '48px', margin: '0 0 10px 0' }}>PANEL DE CONTROL</h1>
        <p style={{ color: '#0f0', letterSpacing: '2px' }}>Bienvenido, investigador <span style={{ color: '#f00' }}>{user?.username?.toUpperCase()}</span>. Selecciona un módulo de acceso.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginTop: '60px', maxWidth: '600px', marginLeft: '100px' }}>
          {modules.map((m, i) => (
            <Link key={i} to={m.path} style={{ 
              border: '1px solid #060', 
              padding: '30px', 
              textDecoration: 'none', 
              background: 'rgba(0,0,0,0.92)',
              transition: 'all 0.3s',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#0f0'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#060'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <h2 style={{ color: '#f00', margin: '0 0 10px 0', fontSize: '28px' }}>{m.title}</h2>
              <p style={{ color: '#0f0', fontSize: '14px', margin: 0 }}>{m.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: '20px', right: '20px', color: '#040', fontSize: '12px', zIndex: 3 }}>
        TERMINAL.STATUS: ONLINE // ENCRYPTED_CONNECTION
      </div>
    </div>
  )
}
