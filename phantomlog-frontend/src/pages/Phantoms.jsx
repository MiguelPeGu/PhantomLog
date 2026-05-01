import { Link } from 'react-router-dom'
import { useData } from '../context/DataProvider'

export default function Phantoms() {
  const { phantoms } = useData()

  return (
    <div className="page-container">
      <div style={{ borderBottom: '1px solid var(--text-muted)', paddingBottom: '20px', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '42px', letterSpacing: '8px' }}>EL BESTIARIO</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '14px', marginTop: '5px' }}>BASE DE DATOS DE ENTIDADES CLASIFICADAS // ACCESO NIVEL 4</p>
      </div>

      <div className="grid-3">
        {phantoms.map(p => (
          <Link 
            key={p.id} 
            to={`/phantoms/${p.id}`} 
            className="horror-card"
            style={{ 
              background: 'rgba(0,10,0,0.4)',
            }}
          >
            <div className="flex-center mb-10" style={{ justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0, fontSize: '24px', letterSpacing: '2px' }}>{p.name.toUpperCase()}</h2>
              <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>TYPE: {p.type.toUpperCase()}</span>
            </div>
            
            <div style={{ fontSize: '11px', borderTop: '1px solid #111', paddingTop: '10px' }}>
              <strong style={{ color: 'var(--text-muted)' }}>EVIDENCIA:</strong><br />
              {p.evidence}
            </div>

            <div style={{ 
              position: 'absolute', 
              bottom: '10px', 
              right: '10px', 
              color: '#020', 
              fontSize: '24px', 
              opacity: 0.2,
              fontWeight: 'bold'
            }}>
              ?
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
