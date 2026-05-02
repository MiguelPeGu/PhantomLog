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
    <div className="page-container relative" style={{ minHeight: '80vh', marginLeft: '70px', maxWidth: '100%' }}>
      {/* Fondo con secuencia de terror programada */}
      <div 
        className="flicker-overlay"
        style={{
          backgroundImage: 'var(--flicker-img)',
          backgroundPosition: 'var(--flicker-pos)',
          opacity: flickerOpacity,
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          transition: flickerOpacity === 0 ? 'opacity 0.3s' : 'none',
        }} 
      />

      {/* CONTENIDO */}
      <div className="relative column" style={{ zIndex: 2, alignItems: 'flex-start', paddingLeft: '0' }}>
        <h1 style={{ textAlign: 'left', marginLeft: '0' }}>PANEL DE CONTROL</h1>
        <p style={{ letterSpacing: '2px', textAlign: 'left', marginLeft: '0' }}>Bienvenido, investigador <span style={{ color: 'var(--accent)' }}>{user?.username?.toUpperCase()}</span>. Selecciona un módulo de acceso.</p>
        
        <div className="column mt-60 w-100" style={{ maxWidth: '400px', gap: '20px', marginLeft: '0' }}>
          {modules.map((m, i) => (
            <Link key={i} to={m.path} className="horror-card column" style={{ padding: '20px 30px' }}>
              <h2 style={{ fontSize: '24px', margin: 0 }}>{m.title}</h2>
              <p style={{ fontSize: '12px', margin: 0, color: 'var(--text-dim)' }}>{m.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="system-status-footer" style={{ textAlign: 'right', right: '20px' }}>
        TERMINAL.STATUS: ONLINE // ENCRYPTED_CONNECTION
      </div>
    </div>
  )
}
