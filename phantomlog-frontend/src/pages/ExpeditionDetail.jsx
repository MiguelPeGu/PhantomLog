import { useParams, Link } from 'react-router-dom'

const mockExpedition = {
  id: 104,
  name: 'Hospital Abandonado de Linda Vista',
  date: 'En curso...',
  status: 'Pérdida de señal',
  members: ['Valerie K.', 'Marcus T.', 'Elena V.', 'Jacob R.', 'Investigator_09'],
  log: [
    { time: '22:00', note: 'Equipo insertado con éxito en el ala pediátrica.' },
    { time: '23:15', note: 'Caída de temperatura masiva registrada. Los radios tienen interferencia.' },
    { time: '01:45', note: 'Marcus reporta escuchar niños llorando. Grabadoras activadas.' },
    { time: '02:30', note: 'Señal de video perdida en cámara 4. Último fotograma muestra anomalía negra de 2.5 metros.' },
    { time: '02:33', note: '-- PÉRDIDA DE SEÑAL TOTAL --' },
  ]
}

export default function ExpeditionDetail() {
  const { id } = useParams()

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>
      <Link to="/expeditions" style={{
        textDecoration: 'none', color: 'rgba(200, 169, 110, 0.5)', fontSize: '14px', marginBottom: '24px', display: 'inline-block'
      }}>
        ← Volver a Expediciones
      </Link>

      <div style={{
        background: 'rgba(10, 5, 12, 0.85)',
        border: '1px solid rgba(200, 30, 20, 0.6)',
        padding: '32px',
        marginBottom: '32px',
        boxShadow: '0 0 30px rgba(200, 30, 20, 0.1) inset'
      }}>
        <div style={{
          background: 'rgba(200, 30, 20, 0.2)', color: '#ff4d4d', display: 'inline-block',
          padding: '4px 12px', fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase',
          marginBottom: '16px', border: '1px solid rgba(200, 30, 20, 0.8)'
        }}>
          ESTADO: {mockExpedition.status}
        </div>

        <h1 style={{ fontFamily: "var(--heading)", fontSize: '42px', color: '#c8a96e', margin: '0 0 16px 0' }}>
          {mockExpedition.name}
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', paddingBottom: '24px', borderBottom: '1px solid rgba(200, 169, 110, 0.2)', marginBottom: '24px' }}>
          <div>
            <h4 style={{ color: 'rgba(200, 169, 110, 0.6)', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Integrantes</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#f0d090' }}>
              {mockExpedition.members.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'rgba(200, 169, 110, 0.6)', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Cronología</h4>
            <p style={{ margin: 0, color: '#f0d090' }}>Inicio: {mockExpedition.date}</p>
          </div>
        </div>

        <div>
          <h3 style={{ fontFamily: "var(--heading)", fontSize: '28px', color: '#c8a96e', borderBottom: '1px solid rgba(200, 169, 110, 0.2)', paddingBottom: '8px' }}>
            Bitácora de Observación
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            {mockExpedition.log.map((entry, idx) => (
              <div key={idx} style={{
                background: entry.note.includes('PÉRDIDA') ? 'rgba(200, 30, 20, 0.2)' : 'rgba(15, 8, 18, 0.5)',
                borderLeft: entry.note.includes('PÉRDIDA') ? '2px solid #ff4d4d' : '2px solid rgba(200, 169, 110, 0.5)',
                padding: '12px 16px',
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: '14px',
                color: entry.note.includes('PÉRDIDA') ? '#ff4d4d' : '#e0cfa5'
              }}>
                <strong style={{ color: 'rgba(200, 169, 110, 0.7)', marginRight: '16px' }}>[{entry.time}]</strong>
                {entry.note}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
