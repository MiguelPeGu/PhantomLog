import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Home() {
  const [flickerOpacity, setFlickerOpacity] = useState(0)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [theme] = useState(localStorage.getItem('phantom-theme') || 'dark')

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode')
    } else {
      document.body.classList.remove('light-mode')
    }
  }, [theme])

  useEffect(() => {
    let isMounted = true;

    const runSequence = async () => {
      while (isMounted) {
        setFlickerOpacity(0);
        const waitTime = Math.random() * 500 + 1000;
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
      <div
        className="flicker-overlay bg-flicker-space"
        style={{
          backgroundImage: theme === 'light' ? 'url("/girl-home.png")' : 'url("/boy.png")',
          opacity: flickerOpacity,
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'var(--flicker-size)',
          backgroundAttachment: 'fixed',
        }}
      />

      <div className="relative w-100 flex-center column z-2">
        <h1 className="hero-title">
          PHANTOMLOG
        </h1>
        <p className="hero-subtitle mb-40">NO DEBERÍAS ESTAR AQUÍ</p>

        <div className="flex-center w-100 gap-30">
          <Link
            to="/register"
            className="btn primary hero-btn"
          >
            ENTRAR
          </Link>
          <Link
            to="/login"
            className="btn outline-red hero-btn"
          >
            LOGIN
          </Link>
        </div>
      </div>

      <div className="system-status-footer">
        SYSTEM.ACCESS_DENIED // ERROR_00X12 // ALMA_NO_DETECTADA
      </div>
    </div>
  )
}
