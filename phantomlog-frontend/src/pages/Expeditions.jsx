import { Link } from 'react-router-dom'

const mockExpeditions = [
  { id: 101, name: 'Sanatorio Waverly Hills', date: '31/10/2026', status: 'Planificada' },
  { id: 102, name: 'Penitenciaría Estatal del Este', date: '15/09/2026', status: 'Completada' },
  { id: 103, name: 'Bosque Aokigahara', date: '04/11/2026', status: 'Necesita Personal' },
  { id: 104, name: 'Hospital Abandonado de Linda Vista', date: 'En curso...', status: 'Pérdida de señal' },
]

export default function Expeditions() {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: '#f00' }}>EXPEDICIONES</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {mockExpeditions.map(exp => (
          <Link key={exp.id} to={`/expeditions/${exp.id}`} style={{ border: '1px solid #060', padding: '15px', textDecoration: 'none', background: '#000' }}>
            <h3 style={{ color: '#f00', margin: 0 }}>{exp.name}</h3>
            <p style={{ color: '#0f0', fontSize: '12px' }}>{exp.date}</p>
            <div style={{ color: '#fff', fontSize: '10px', background: '#300', padding: '2px', textAlign: 'center' }}>{exp.status}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
