import { useParams, Link } from 'react-router-dom'

const mockThread = {
  id: 1,
  title: 'Anomalía térmica en el pabellón B',
  author: 'Investigator_09',
  date: 'Hace 2 horas',
  content: 'Al ingresar al pabellón B, detectamos una caída abrupta de temperatura (desde 18°C a 4°C en 3 segundos). Los equipos EMF marcaron picos de 14mG. ¿Alguien más ha registrado este comportamiento en las áreas de aislamiento?',
  replies: [
    { id: 101, author: 'SkepticalGhost', date: 'Hace 1 hora', content: 'Podría ser una corriente de aire frío por la ventilación sur. Revisa los ductos.' },
    { id: 102, author: 'WhisperCatcher', date: 'Hace 30 minutos', content: 'No lo creo. Ayer capté un EVP que decía "Frío... mucho frío" exactamente en esa misma zona.' },
  ]
}

export default function ForumDetail() {
  const { id } = useParams()
  // Utilizaremos el mock de manera genérica para la vista sin importar "id"
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>
      <Link to="/forums" style={{
        textDecoration: 'none',
        color: 'rgba(200, 169, 110, 0.5)',
        fontSize: '14px',
        marginBottom: '24px',
        display: 'inline-block',
        transition: 'color 0.3s'
      }} 
      onMouseOver={e => e.target.style.color = '#c8a96e'}
      onMouseOut={e => e.target.style.color = 'rgba(200, 169, 110, 0.5)'}>
        ← Volver a los Foros
      </Link>

      <div style={{
        background: 'rgba(10, 5, 12, 0.85)',
        border: '1px solid rgba(200, 169, 110, 0.3)',
        padding: '32px',
        marginBottom: '32px'
      }}>
        <h1 style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: '36px', color: '#c8a96e', margin: '0 0 16px 0' }}>
          {mockThread.title}
        </h1>
        <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: 'rgba(200, 169, 110, 0.4)', fontStyle: 'italic', marginBottom: '24px', borderBottom: '1px solid rgba(200, 169, 110, 0.1)', paddingBottom: '16px' }}>
          <span>Posteado por <strong style={{color: '#f0d090'}}>{mockThread.author}</strong></span>
          <span>{mockThread.date}</span>
        </div>
        <p style={{ lineHeight: '1.6', fontSize: '18px', color: '#e0cfa5' }}>
          {mockThread.content}
        </p>
      </div>

      <h3 style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: '24px', color: 'rgba(200, 169, 110, 0.6)', borderBottom: '1px solid rgba(200, 169, 110, 0.2)', paddingBottom: '8px' }}>
        Respuestas ({mockThread.replies.length})
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
        {mockThread.replies.map(r => (
          <div key={r.id} style={{
            background: 'rgba(15, 8, 18, 0.5)',
            borderLeft: '2px solid rgba(200, 169, 110, 0.3)',
            padding: '16px 24px'
          }}>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'rgba(200, 169, 110, 0.5)', marginBottom: '12px' }}>
              <span style={{ color: '#e8c98e', fontWeight: 'bold' }}>{r.author}</span>
              <span>{r.date}</span>
            </div>
            <p style={{ margin: 0, color: '#c8a96e', lineHeight: '1.5', fontSize: '16px' }}>{r.content}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px' }}>
        <textarea 
          placeholder="Añadir una respuesta al registro..."
          style={{
            width: '100%',
            height: '120px',
            background: 'rgba(5, 3, 5, 0.8)',
            border: '1px solid rgba(200, 169, 110, 0.3)',
            color: '#c8a96e',
            padding: '16px',
            fontFamily: "'IM Fell English', serif",
            fontSize: '16px',
            outline: 'none',
            resize: 'vertical',
            boxSizing: 'border-box'
          }}
        />
        <button style={{
          marginTop: '12px',
          background: 'rgba(200, 169, 110, 0.1)',
          border: '1px solid rgba(200, 169, 110, 0.6)',
          color: '#f0d090',
          padding: '10px 32px',
          fontFamily: "'IM Fell English', serif",
          fontSize: '16px',
          cursor: 'crosshair',
          transition: 'all 0.3s'
        }}
        onMouseOver={e => e.target.style.background = 'rgba(200, 169, 110, 0.2)'}
        onMouseOut={e => e.target.style.background = 'rgba(200, 169, 110, 0.1)'}>
          Responder
        </button>
      </div>
    </div>
  )
}