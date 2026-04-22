import { useState } from 'react'

const ShimmerImage = ({ src, alt, style, className = "" }) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#121012' }} className={className}>
      <style>{`
        .shimmer-effect {
          background: #1a151a;
          background-image: linear-gradient(
            to right, 
            #1a151a 0%, 
            #3a2a3a 20%, 
            #1a151a 40%, 
            #1a151a 100%
          );
          background-repeat: no-repeat;
          background-size: 800px 100%;
          animation: shimmer-animation 2s linear infinite forwards;
        }

        @keyframes shimmer-animation {
          0% { background-position: -468px 0; }
          100% { background-position: 468px 0; }
        }
      `}</style>
      {!loaded && !error && (
        <div className="shimmer-effect" style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          zIndex: 1
        }} />
      )}
      
      {error && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#1a151a', color: 'rgba(200, 169, 110, 0.2)', fontSize: '12px'
        }}>
          Imagen no disponible
        </div>
      )}

      <img 
        src={src} 
        alt={alt} 
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{ 
          ...style, 
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
          display: error ? 'none' : 'block'
        }} 
      />
    </div>
  )
}
export default ShimmerImage
