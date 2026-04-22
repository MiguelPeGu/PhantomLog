import { Link } from 'react-router-dom'

const mockExpeditions = [
  { id: 101, name: 'Sanatorio Waverly Hills', date: '31/10/2026', status: 'Planificada', members: 4 },
  { id: 102, name: 'Penitenciaría Estatal del Este', date: '15/09/2026', status: 'Completada', members: 3 },
  { id: 103, name: 'Bosque Aokigahara', date: '04/11/2026', status: 'Necesita Personal', members: 2 },
  { id: 104, name: 'Hospital Abandonado de Linda Vista', date: 'En curso...', status: 'Pérdida de señal', members: 5 },
]

export default function Expeditions() {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: "var(--heading)", fontSize: '48px', margin: '0 0 8px 0', color: '#c8a96e' }}>
          Registro de Expediciones
        </h1>
        <p style={{ color: 'rgba(200, 169, 110, 0.5)', fontStyle: 'italic', letterSpacing: '0.1em' }}>
          El historial de nuestras incursiones en la oscuridad.
        </p>
      </header>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px'
      }}>
        {mockExpeditions.map(exp => (
          <Link key={exp.id} to={`/expeditions/${exp.id}`} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(8, 4, 10, 0.8)',
              border: '1px solid rgba(200, 169, 110, 0.2)',
              position: 'relative',
              overflow: 'hidden',
              padding: '24px',
              height: '100%',
              transition: 'all 0.4s ease'
            }}
            onMouseOver={e => {
              e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.8)'
              e.currentTarget.style.background = 'rgba(15, 8, 18, 0.9)'
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.2)'
              e.currentTarget.style.background = 'rgba(8, 4, 10, 0.8)'
            }}>
              
              <div style={{
                position: 'absolute', top: 0, right: 0, padding: '4px 12px',
                fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em',
                background: exp.status === 'Completada' ? 'rgba(50, 200, 100, 0.1)' : 
                            exp.status === 'Pérdida de señal' ? 'rgba(200, 30, 20, 0.3)' : 'rgba(200, 169, 110, 0.1)',
                color: exp.status === 'Completada' ? '#8fff8f' : 
                       exp.status === 'Pérdida de señal' ? '#ff4d4d' : '#f0d090'
              }}>
                {exp.status}
              </div>

              <h2 style={{ fontFamily: "var(--heading)", fontSize: '24px', color: '#e8c98e', marginTop: '16px', marginBottom: '8px' }}>
                {exp.name}
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: 'rgba(200, 169, 110, 0.7)' }}>
                <span><strong>Fecha:</strong> {exp.date}</span>
                <span><strong>Integrantes:</strong> {exp.members} investigadores</span>
              </div>

              <div style={{ marginTop: '24px', borderTop: '1px dashed rgba(200, 169, 110, 0.2)', paddingTop: '16px', textAlign: 'center', fontSize: '12px', letterSpacing: '0.2em', opacity: 0.5 }}>
                INSPECCIONAR EXPEDIENTE
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
