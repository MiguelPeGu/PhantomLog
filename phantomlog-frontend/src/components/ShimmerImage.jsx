import { useState, useEffect, useRef } from 'react'

const ShimmerImage = ({ src, alt, style, className = "", objectFit = "cover" }) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setLoaded(true)
    }
  }, [src])

  return (
    <div className={`shimmer-container ${className}`} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: 'var(--bg)', ...style }}>
      {!loaded && !error && (
        <div className="shimmer" style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          zIndex: 1,
          opacity: 0.5
        }} />
      )}
      
      {error && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--card-bg)', color: 'var(--text-muted)', fontSize: '12px',
          zIndex: 2
        }}>
          Imagen no disponible
        </div>
      )}

      <img 
        ref={imgRef}
        src={src} 
        alt={alt} 
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{ 
          width: '100%',
          height: '100%',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
          display: error ? 'none' : 'block',
          objectFit: objectFit,
          verticalAlign: 'middle'
        }} 
      />
    </div>
  )
}
export default ShimmerImage
