const mockPhantoms = [
  { id: 1, type: 'Poltergeist', class: 'Categoría IV', threat: 'Alta', desc: 'Entidad cinética capaz de manipular materia física consciente y agresivamente. Común en hogares con adolescentes.' },
  { id: 2, type: 'Banshee', class: 'Categoría III', threat: 'Mortal', desc: 'Aparición femenina cuya vocalización augura muerte inminente o causa daño acústico fatal.' },
  { id: 3, type: 'Sombra', class: 'Categoría II', threat: 'Media', desc: 'Entidades bidimensionales observadas en visión periférica. Se alimentan de miedo y bajan ligeramente la temperatura local.' },
  { id: 4, type: 'Eco Residual', class: 'Categoría I', threat: 'Nula', desc: 'Impresión energética sin consciencia atrapada en un bucle temporal debido a un evento traumático.' },
]

export default function Phantoms() {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: "var(--heading)", fontSize: '48px', margin: '0 0 8px 0', color: '#c8a96e' }}>
          El Bestiario
        </h1>
        <p style={{ color: 'rgba(200, 169, 110, 0.5)', fontStyle: 'italic', letterSpacing: '0.1em' }}>
          Conoce a lo que te enfrentas. El registro vital de tipologías anómalas.
        </p>
      </header>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '32px'
      }}>
        {mockPhantoms.map(phantom => (
          <div key={phantom.id} style={{
            background: 'rgba(8, 4, 10, 0.85)',
            border: '1px solid rgba(200, 169, 110, 0.3)',
            padding: '24px',
            display: 'flex',
            gap: '24px',
            alignItems: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ 
              width: '120px', height: '120px', 
              border: '1px solid rgba(200, 169, 110, 0.5)',
              background: 'radial-gradient(circle, rgba(100, 100, 100, 0.2) 0%, rgba(0, 0, 0, 0.8) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,1)'
            }}>
              <span style={{ fontSize: '48px', color: 'rgba(200, 169, 110, 0.1)', fontFamily: "var(--heading)" }}>
                ?
              </span>
            </div>

            <div style={{ flex: 1 }}>
              <h2 style={{ fontFamily: "var(--heading)", fontSize: '28px', color: '#e8c98e', margin: '0 0 4px 0' }}>
                {phantom.type}
              </h2>
              <div style={{ display: 'flex', gap: '16px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                <span style={{ color: 'rgba(200, 169, 110, 0.6)' }}>{phantom.class}</span>
                <span style={{ 
                  color: phantom.threat === 'Mortal' ? '#ff4d4d' : 
                         phantom.threat === 'Alta' ? '#ffaa00' : 
                         phantom.threat === 'Media' ? '#e8c98e' : 'rgba(200, 169, 110, 0.4)' 
                }}>
                  Peligro: {phantom.threat}
                </span>
              </div>
              <p style={{ color: '#c8a96e', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
                {phantom.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
