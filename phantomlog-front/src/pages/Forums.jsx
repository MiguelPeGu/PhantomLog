import { Link } from 'react-router-dom'
import { useState } from 'react'

const mockForums = [
  { id: 1, title: 'Anomalía térmica en el pabellón B', replies: 42, author: 'Investigator_09', date: 'Hace 2 horas', threatLevel: 'Alta' },
  { id: 2, title: 'Psicofonía clara captada en el sótano', replies: 15, author: 'WhisperCatcher', date: 'Hace 5 horas', threatLevel: 'Media' },
  { id: 3, title: 'Sombras residuales o pura sugestión?', replies: 108, author: 'SkepticalGhost', date: 'Ayer', threatLevel: 'Baja' },
  { id: 4, title: 'El reloj se detiene a las 03:00 AM exactamente', replies: 6, author: 'WatcherInTheDark', date: 'Ayer', threatLevel: 'Desconocido' },
]

export default function Forums() {
  const [search, setSearch] = useState('')

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px', borderBottom: '1px solid rgba(200, 169, 110, 0.2)', paddingBottom: '16px' }}>
        <h1 style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: '42px', margin: '0 0 8px 0', textShadow: '0 0 20px rgba(200, 169, 110, 0.3)' }}>Foros de Investigación</h1>
        <p style={{ fontStyle: 'italic', color: 'rgba(200, 169, 110, 0.5)', margin: 0 }}>Compartiendo registros de lo inexplicable...</p>
      </header>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <input 
          type="text" 
          placeholder="Buscar registros..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: 'rgba(8, 4, 10, 0.8)',
            border: '1px solid rgba(200, 169, 110, 0.3)',
            color: '#c8a96e',
            padding: '10px 16px',
            fontFamily: "'IM Fell English', serif",
            width: '300px',
            outline: 'none',
          }}
        />
        <button style={{
          background: 'rgba(180, 50, 40, 0.1)',
          border: '1px solid rgba(180, 50, 40, 0.5)',
          color: '#f0d090',
          padding: '10px 24px',
          fontFamily: "'IM Fell English', serif",
          cursor: 'crosshair',
          transition: 'all 0.3s'
        }}
        onMouseOver={e => e.target.style.background = 'rgba(180, 50, 40, 0.3)'}
        onMouseOut={e => e.target.style.background = 'rgba(180, 50, 40, 0.1)'}>
          Nuevo Reporte
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {mockForums.filter(f => f.title.toLowerCase().includes(search.toLowerCase())).map(forum => (
          <Link key={forum.id} to={`/forums/${forum.id}`} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(15, 8, 18, 0.65)',
              border: '1px solid rgba(200, 169, 110, 0.15)',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'all 0.4s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.6)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(200, 169, 110, 0.05)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#e8c98e' }}>{forum.title}</h3>
                <div style={{ fontSize: '12px', color: 'rgba(200, 169, 110, 0.5)', fontStyle: 'italic', display: 'flex', gap: '16px' }}>
                  <span>Escrito por: <strong style={{ color: 'rgba(200, 169, 110, 0.8)' }}>{forum.author}</strong></span>
                  <span>{forum.date}</span>
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', color: '#c8a96e', marginBottom: '4px' }}>{forum.replies} respuestas</div>
                <div style={{ 
                  fontSize: '11px', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.1em',
                  color: forum.threatLevel === 'Alta' ? '#ff4d4d' : 
                         forum.threatLevel === 'Media' ? '#ffaa00' : 'rgba(200, 169, 110, 0.6)'
                }}>
                  Amenaza: {forum.threatLevel}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}