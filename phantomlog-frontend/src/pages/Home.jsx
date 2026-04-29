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
    <div style={{
      height: '100vh',
      background: '#000',
      color: '#0f0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Fondo del chico con parpadeo y repetición controlada */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url("/boy.png")',   
        backgroundSize: '55%', 
        backgroundRepeat: 'space', 
        backgroundPosition: 'center',
        opacity: flickerOpacity,
        zIndex: 0,
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        pointerEvents: 'none'
      }} />

      <div style={{ 
        zIndex: 1, 
        position: 'relative', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        width: '100%' 
      }}>
        <h1 style={{ 
          color: '#f00', 
          fontSize: '100px', 
          marginBottom: '10px', 
          textShadow: '0 0 30px #f00',
          letterSpacing: '10px'
        }}>
          PHANTOMLOG
        </h1>
        <p style={{ color: '#0f0', letterSpacing: '8px', fontSize: '20px', marginBottom: '40px' }}>NO DEBERÍAS ESTAR AQUÍ</p>
        
        {/* BOTONES CENTRADOS */}
        <div style={{ 
          display: 'flex', 
          gap: '30px', 
          justifyContent: 'center',
          width: '100%'
        }}>
          <button 
            onClick={() => navigate('/register')} 
            style={{ 
              padding: '20px 40px', 
              fontSize: '24px', 
              background: '#0f0', 
              color: '#000', 
              border: 'none', 
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(0, 255, 0, 0.4)'
            }}
          >
            ENTRAR
          </button>
          <button 
            onClick={() => navigate('/login')} 
            style={{ 
              padding: '20px 40px', 
              fontSize: '24px', 
              background: 'none', 
              color: '#f00', 
              border: '2px solid #f00',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            LOGIN
          </button>
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: '30px', width: '100%', textAlign: 'center', color: '#040', fontSize: '12px', letterSpacing: '3px' }}>
        SYSTEM.ACCESS_DENIED // ERROR_00X12 // ALMA_NO_DETECTADA
      </div>
    </div>
  )
}
