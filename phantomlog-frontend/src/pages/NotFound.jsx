import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const [glitchText, setGlitchText] = useState('404')
  
  useEffect(() => {
    const chars = '014' // Caracteres que usaremos para el efecto de error
    
    const interval = setInterval(() => {
      // 1. Solo hay un 20% de probabilidad (Math.random > 0.8) de que ocurra el "glitch"
      if (Math.random() > 0.6) {
        
        // 2. Generamos un código aleatorio de 3 caracteres (Ej: "041")
        let randomText = ''
        for(let i = 0; i < 3; i++) {
          const randomIndex = Math.floor(Math.random() * chars.length)
          randomText += chars[randomIndex]
        }
        
        // 3. Actualizamos el texto con el código aleatorio
        setGlitchText(randomText)
        
        // 4. Después de solo 100 milisegundos, volvemos a poner "404"
        setTimeout(() => setGlitchText('404'), 100)
      }
    }, 500)

    // Limpieza al desmontar el componente para evitar errores de memoria
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
