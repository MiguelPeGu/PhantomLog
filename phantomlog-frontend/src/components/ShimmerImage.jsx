import { useState, useLayoutEffect, useRef } from 'react'

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
  const imgRef = useRef(null)

  // Estado de carga y error de la imagen
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  // Validamos que el src exista y no venga como string inválido
  const hasSrc = src && src !== 'null' && src !== 'undefined'

  /**
   * useLayoutEffect:
   * Detecta si la imagen ya estaba cacheada por el navegador
   * para evitar mostrar el shimmer innecesariamente.
   */
  useLayoutEffect(() => {
    if (!hasSrc) {
      setLoaded(false)
      setError(false)
      return
    }

    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true)
    } else {
      setLoaded(false)
      setError(false)
    }
  }, [src, hasSrc])

  return (
    <div
      className={`shimmer-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: 'var(--bg)',
        ...style
      }}
    >

      {/* Placeholder si no hay imagen */}
      {!hasSrc && NO_IMAGE_PLACEHOLDER}

      {/* Skeleton shimmer mientras carga */}
      {hasSrc && !loaded && !error && (
        <div
          className="shimmer-box"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1
          }}
        />
      )}

      {/* Fallback visual si falla la carga */}
      {hasSrc && error && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--card-bg)',
          color: 'var(--text-muted)',
          fontSize: '12px',
          letterSpacing: '1px'
        }}>
          SIN IMAGEN
        </div>
      )}

      {/* Imagen principal */}
      {hasSrc && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{
            position: 'relative',
            zIndex: 0,
            width: '100%',
            height: '100%',
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