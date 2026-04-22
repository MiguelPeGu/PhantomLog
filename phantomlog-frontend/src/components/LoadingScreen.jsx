import { useLoading } from '../context/LoadingContext'

export default function LoadingScreen() {
  const { isLoading } = useLoading()

  if (!isLoading) return null

  return (
    <div className="loading-overlay">
      <style>{`
        .loading-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #050305;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: overlayFadeIn 0.5s ease-out forwards;
          backdrop-filter: blur(10px);
        }

        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .loading svg polyline {
          fill: none;
          stroke-width: 3;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .loading svg polyline#back {
          fill: none;
          stroke: #ff4d5033;
        }

        .loading svg polyline#front {
          fill: none;
          stroke: #ff4d4f;
          stroke-dasharray: 48, 144;
          stroke-dashoffset: 192;
          animation: dash_682 1.4s linear infinite;
        }

        @keyframes dash_682 {
          72.5% {
            opacity: 0;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        .loading-text {
          position: absolute;
          bottom: 20%;
          font-family: var(--heading);
          font-weight: 700;
          color: #ff4d4f;
          font-size: 1.5rem;
          letter-spacing: 5px;
          text-shadow: 0 0 10px rgba(255, 77, 79, 0.5);
          animation: pulse 2s infinite;
          text-transform: uppercase;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
      
      <div className="loading">
        <svg width="120px" height="90px" viewBox="0 0 64 48">
          <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="back"></polyline>
          <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="front"></polyline>
        </svg>
      </div>
      
      <div className="loading-text">Cargando Archivos...</div>
    </div>
  )
}
