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
    <div className="flex-center column vh100 text-center bg-black p-20">
      <div className="relative">
        <h1 className="fs-120 m-0 text-accent text-shadow-horror font-mono">
          {glitchText}
        </h1>
        <div className="scanline-overlay" />
      </div>
      
      <h2 className="text-normal mt-20 ls-4">ACCESO DENEGADO // RUTA NO ENCONTRADA</h2>
      <p className="text-dim max-500 m-20-0 lh-1-6">
        Has cruzado el velo hacia un sector inexistente del archivo. 
        La entidad que buscas no reside en esta dimensión de datos.
      </p>

      <div className="column gap-15 mt-40">
        <Link to="/dashboard" className="primary p-15-40 bold no-underline">
          RETORNAR AL PANEL DE CONTROL
        </Link>
        <p className="fs-10 text-muted">
          ERR_CODE: [NULL_POINTER_EXCEPTION] // SECTOR_LOST
        </p>
      </div>
    </div>
  )
}
