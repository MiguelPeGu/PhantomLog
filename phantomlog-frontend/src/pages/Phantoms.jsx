const mockPhantoms = [
  { id: 1, type: 'Poltergeist', class: 'Categoría IV', threat: 'Alta' },
  { id: 2, type: 'Banshee', class: 'Categoría III', threat: 'Mortal' },
  { id: 3, type: 'Sombra', class: 'Categoría II', threat: 'Media' },
  { id: 4, type: 'Eco Residual', class: 'Categoría I', threat: 'Nula' },
]

export default function Phantoms() {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: '#f00' }}>EL BESTIARIO</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {mockPhantoms.map(p => (
          <div key={p.id} style={{ border: '1px solid #060', padding: '15px', background: '#000' }}>
            <h2 style={{ color: '#f00', margin: '0 0 5px 0' }}>{p.type}</h2>
            <p style={{ color: '#0f0', fontSize: '12px' }}>{p.class}</p>
            <p style={{ color: p.threat === 'Mortal' ? '#f00' : '#0f0', fontSize: '12px', fontWeight: 'bold' }}>PELIGRO: {p.threat}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
