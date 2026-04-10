const mockProducts = [
  { id: 1, name: 'Medallón de San Benito', category: 'Protección', price: '150 魂', desc: 'Aleja entidades de Categoría I y II. Forjado en plata y bendecido.' },
  { id: 2, name: 'Sal Gema Purificada', category: 'Consumible', price: '20 魂', desc: 'Disuasorio temporal para apariciones y sombras. Purifica áreas pequeñas.' },
  { id: 3, name: 'Caja de Contención S.C.', category: 'Contención', price: '850 魂', desc: 'Capaz de atrapar y aislar ecos residuales tras ritos de dominancia.' },
  { id: 4, name: 'Lector EMF Modificado', category: 'Equipamiento', price: '300 魂', desc: 'Detecta picos electromagnéticos residuales de presencias no corpóreas.' },
]

export default function Products() {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: '48px', margin: '0 0 8px 0', color: '#c8a96e' }}>
          Armería Esotérica
        </h1>
        <p style={{ color: 'rgba(200, 169, 110, 0.5)', fontStyle: 'italic', letterSpacing: '0.1em' }}>
          Equipamiento vital. Porque la mente sola no basta contra la oscuridad.
        </p>
      </header>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '32px'
      }}>
        {mockProducts.map(product => (
          <div key={product.id} style={{
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
              <span style={{ fontSize: '48px', color: 'rgba(200, 169, 110, 0.1)', fontFamily: "'UnifrakturMaguntia', serif" }}>
                ⚜
              </span>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h2 style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: '24px', color: '#e8c98e', margin: '0 0 4px 0' }}>
                  {product.name}
                </h2>
                <span style={{ color: '#ffaa00', fontFamily: "'UnifrakturMaguntia', serif", fontSize: '20px' }}>
                  {product.price}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                <span style={{ color: 'rgba(200, 169, 110, 0.6)' }}>Clase: {product.category}</span>
              </div>
              <p style={{ color: '#c8a96e', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
                {product.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}