import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Home() {
  const navigate = useNavigate()
  const [flickerOpacity, setFlickerOpacity] = useState(0)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  // Lógica de secuencia de terror (Aparición -> Parpadeo -> Desaparición)
  useEffect(() => {
    let isMounted = true;

    const runSequence = async () => {
      while (isMounted) {
        setFlickerOpacity(0);
        const waitTime = Math.random() * 4000 + 1000;
        await new Promise(r => setTimeout(r, waitTime));
        if (!isMounted) break;

        const flickerCount = Math.floor(Math.random() * 5) + 2;
        for (let i = 0; i < flickerCount; i++) {
          setFlickerOpacity(Math.random() * 0.4 + 0.1);
          setOffset({ x: Math.random() * 10 - 5, y: Math.random() * 10 - 5 });
          await new Promise(r => setTimeout(r, 80));
          
          setFlickerOpacity(0);
          await new Promise(r => setTimeout(r, 60));
          if (!isMounted) break;
        }

        setFlickerOpacity(0.2);
        await new Promise(r => setTimeout(r, 200));
        setFlickerOpacity(0);
      }
    };

    runSequence();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="vh100 flex-center column text-center relative overflow-hidden">
      {/* Fondo del chico con parpadeo y repetición controlada */}
      <div 
        className="flicker-overlay"
        style={{
          backgroundImage: 'url("/boy.png")',   
          backgroundRepeat: 'space', 
          backgroundPosition: 'center',
          opacity: flickerOpacity,
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }} 
      />

      <div className="relative w-100 flex-center column" style={{ zIndex: 1 }}>
        <h1 style={{ 
          fontSize: '100px', 
          textShadow: '0 0 30px var(--accent)',
          letterSpacing: '10px'
        }}>
          PHANTOMLOG
        </h1>
        <p style={{ letterSpacing: '8px', fontSize: '20px' }} className="mb-40">NO DEBERÍAS ESTAR AQUÍ</p>
        
        {/* BOTONES CENTRADOS */}
        <div className="flex-center w-100" style={{ gap: '30px' }}>
          <button 
            onClick={() => navigate('/register')} 
            className="primary"
            style={{ padding: '20px 40px', fontSize: '24px' }}
          >
            ENTRAR
          </button>
          <button 
            onClick={() => navigate('/login')} 
            className="outline-red"
            style={{ padding: '20px 40px', fontSize: '24px' }}
          >
            LOGIN
          </button>
        </div>
      </div>

      <div className="system-status-footer" style={{ bottom: '30px' }}>
        SYSTEM.ACCESS_DENIED // ERROR_00X12 // ALMA_NO_DETECTADA
      </div>
    </div>
  )
}
