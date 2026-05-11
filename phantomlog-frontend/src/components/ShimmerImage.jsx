import { useState, useEffect, useRef } from 'react'

const NO_IMAGE_PLACEHOLDER = (
  <div style={{
    width: '100%', height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--card-bg)', color: 'var(--text-muted)', fontSize: '12px',
    letterSpacing: '1px'
  }}>
    SIN IMAGEN
  </div>
)

const ShimmerImage = ({ src, alt, style, className = "", objectFit = "cover" }) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const imgRef = useRef(null)

  // Si no hay src, mostrar placeholder directamente — sin ciclo de shimmer
  const hasSrc = src && src !== 'null' && src !== 'undefined'

  useEffect(() => {
    if (!hasSrc) return
    setLoaded(false)
    setError(false)
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true)
    }
  }, [src, hasSrc])

  return (
    <div className={`shimmer-container ${className}`} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: 'var(--bg)', ...style }}>

      {/* Sin src: placeholder inmediato, sin shimmer */}
      {!hasSrc && NO_IMAGE_PLACEHOLDER}

      {/* Con src: shimmer solo mientras no ha cargado, se desmonta al cargar */}
      {hasSrc && !loaded && !error && (
        <div className="shimmer-box" style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          zIndex: 1
        }} />
      )}

      {hasSrc && error && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--card-bg)', color: 'var(--text-muted)', fontSize: '12px',
          letterSpacing: '1px'
        }}>
          SIN IMAGEN
        </div>
      )}

      {hasSrc && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{
            position: 'relative', zIndex: 0,
            width: '100%', height: '100%',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.4s ease-in-out',
            display: 'block',
            objectFit: objectFit,
            verticalAlign: 'middle'
          }}
        />
      )}
    </div>
  )
}
export default ShimmerImage
