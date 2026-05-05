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
    <div className="page-container relative vh100">
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
      <div className="relative column align-start pl-0 z-2">
        <h1 className="text-left ml-0">PANEL DE CONTROL</h1>
        <p className="ls-2 text-left ml-0">Bienvenido, investigador <span className="text-accent">{user?.username?.toUpperCase()}</span>. Selecciona un módulo de acceso.</p>
        
        <div className="column mt-60 w-100 max-400 gap-20 ml-0">
          {modules.map((m, i) => (
            <Link key={i} to={m.path} className="horror-card column p-20-30">
              <h2 className="fs-24 m-0">{m.title}</h2>
              <p className="text-dim m-0 fs-12">{m.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="system-status-footer text-right right-20">
        TERMINAL.STATUS: ONLINE // ENCRYPTED_CONNECTION
      </div>
    </div>
  )
}
