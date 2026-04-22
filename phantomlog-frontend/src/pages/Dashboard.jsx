import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  const modules = [
    {
      title: 'Archivos de Foros',
      desc: 'Consulta los reportes y testimonios de la comunidad sobre lo inexplicable.',
      path: '/forums',
      icon: '◈',
      color: '#c8a96e'
    },
    {
      title: 'Expediciones',
      desc: 'Participa en misiones de campo para documentar fenómenos activos.',
      path: '/expeditions',
      icon: '⌖',
      color: '#b43228'
    },
    {
      title: 'Bestiario de Fantasmas',
      desc: 'Estudia las entidades clasificadas y sus peligros asociados.',
      path: '/phantoms',
      icon: '☽',
      color: '#8a6ea8'
    },
    {
      title: 'Suministros Arcanos',
      desc: 'Adquiere el equipo necesario para tus investigaciones de campo.',
      path: '/products',
      icon: '✦',
      color: '#6e8ca8'
    }
  ]

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transition: 'opacity 1s ease',
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <style>{`
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          margin-top: 50px;
        }

        .dashboard-card {
          background: rgba(15, 10, 15, 0.7);
          border: 1px solid rgba(200, 169, 110, 0.15);
          padding: 40px;
          text-decoration: none;
          color: inherit;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          backdrop-filter: blur(5px);
        }

        .dashboard-card:hover {
          border-color: #c8a96e;
          transform: translateY(-10px);
          background: rgba(30, 20, 30, 0.8);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(200, 169, 110, 0.1);
        }

        .dashboard-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; width: 100%; height: 2px;
          background: linear-gradient(90deg, transparent, #c8a96e, transparent);
          transform: translateX(-100%);
          transition: transform 0.6s;
        }

        .dashboard-card:hover::before {
          transform: translateX(100%);
        }

        .card-icon {
          font-size: 40px;
          margin-bottom: 20px;
          opacity: 0.8;
          transition: transform 0.4s;
        }

        .dashboard-card:hover .card-icon {
          transform: scale(1.2) rotate(10deg);
          opacity: 1;
        }

        .card-title {
          font-family: var(--heading);
          font-size: 28px;
          margin-bottom: 15px;
          color: #c8a96e;
        }

        .card-desc {
          font-size: 14px;
          line-height: 1.6;
          color: rgba(200, 169, 110, 0.6);
        }

        .welcome-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .welcome-title {
          font-family: var(--heading);
          font-size: clamp(40px, 6vw, 70px);
          font-weight: 700;
          margin-bottom: 10px;
          color: #c8a96e;
          text-shadow: 0 0 20px rgba(200, 169, 110, 0.3);
        }

        .welcome-subtitle {
          font-size: 12px;
          letter-spacing: 6px;
          text-transform: uppercase;
          color: rgba(200, 169, 110, 0.5);
        }

        .welcome-intro {
          max-width: 700px;
          margin: 40px auto 0;
          font-size: 18px;
          line-height: 1.8;
          color: rgba(200, 169, 110, 0.8);
          font-family: var(--sans);
        }

        .divider-ornament {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin: 30px 0;
        }

        .ornament-line {
          height: 1px;
          width: 100px;
          background: linear-gradient(to right, transparent, rgba(200, 169, 110, 0.3), transparent);
        }
      `}</style>

      <header className="welcome-header">
        <h1 className="welcome-title">Bienvenido, Investigador</h1>
        <p className="welcome-subtitle">Has ingresado al Archivo Eterno</p>
        
        <div className="divider-ornament">
          <div className="ornament-line"></div>
          <span style={{ color: 'rgba(200, 169, 110, 0.5)' }}>❦</span>
          <div className="ornament-line"></div>
        </div>

        <p className="welcome-intro">
          PhantomLog no es solo una base de datos; es el registro viviente de aquello que la ciencia oficial prefiere ignorar. 
          Aquí, cada reporte es una pieza de un rompecabezas oscuro que estamos construyendo juntos. 
          Explora los foros para compartir tus hallazgos, únete a expediciones activas o adquiere el equipo necesario para sobrevivir a la noche.
        </p>
      </header>

      <div className="dashboard-grid">
        {modules.map((m, i) => (
          <Link key={i} to={m.path} className="dashboard-card">
            <div className="card-icon" style={{ color: m.color }}>{m.icon}</div>
            <h2 className="card-title">{m.title}</h2>
            <p className="card-desc">{m.desc}</p>
          </Link>
        ))}
      </div>

      <footer style={{ marginTop: '80px', textAlign: 'center', opacity: 0.3, fontSize: '12px', letterSpacing: '2px' }}>
        EL REGISTRO CONTINÚA CRECIENDO • SE DISCRETO
      </footer>
    </div>
  )
}
