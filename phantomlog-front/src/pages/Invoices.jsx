const mockInvoices = [
  { id: 101, client: 'Familia Von Graff', date: '1899-10-31', status: 'Pagado', amount: '500 魂', desc: 'Exorcismo preventivo en mansión ancestral.' },
  { id: 102, client: 'Orden del Alba', date: '1900-02-15', status: 'Pendiente', amount: '1200 魂', desc: 'Contención de espectro clase III en orfanato abandonado.' },
  { id: 103, client: 'Cementerio de las Ánimas', date: '1900-05-01', status: 'Cancelado', amount: '0 魂', desc: 'Falsa alarma, solo eran saqueadores de tumbas.' },
]

export default function Invoices() {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: '48px', margin: '0 0 8px 0', color: '#c8a96e' }}>
          Contratos y Honorarios
        </h1>
        <p style={{ color: 'rgba(200, 169, 110, 0.5)', fontStyle: 'italic', letterSpacing: '0.1em' }}>
          El registro de encargos. Cada vida salvada tiene su precio.
        </p>
      </header>

      <div style={{
        display: 'flex', flexDirection: 'column', gap: '20px'
      }}>
        {mockInvoices.map(invoice => (
          <div key={invoice.id} style={{
            background: 'rgba(8, 4, 10, 0.85)',
            border: '1px solid rgba(200, 169, 110, 0.3)',
            borderLeft: invoice.status === 'Pagado' ? '4px solid #28a745' :
                        invoice.status === 'Pendiente' ? '4px solid #ffaa00' : '4px solid #ff4d4d',
            padding: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                <h2 style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: '24px', color: '#e8c98e', margin: 0 }}>
                  Contrato #{invoice.id}
                </h2>
                <span style={{ 
                  fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em',
                  padding: '4px 8px', borderRadius: '4px',
                  background: invoice.status === 'Pagado' ? 'rgba(40, 167, 69, 0.1)' :
                              invoice.status === 'Pendiente' ? 'rgba(255, 170, 0, 0.1)' : 'rgba(255, 77, 77, 0.1)',
                  color: invoice.status === 'Pagado' ? '#28a745' :
                         invoice.status === 'Pendiente' ? '#ffaa00' : '#ff4d4d',
                  border: invoice.status === 'Pagado' ? '1px solid #28a745' :
                          invoice.status === 'Pendiente' ? '1px solid #ffaa00' : '1px solid #ff4d4d',
                }}>
                  {invoice.status}
                </span>
              </div>
              <div style={{ color: 'rgba(200, 169, 110, 0.6)', fontSize: '13px', display: 'flex', gap: '24px', marginBottom: '12px' }}>
                <span><strong>Cliente:</strong> {invoice.client}</span>
                <span><strong>Fecha:</strong> {invoice.date}</span>
              </div>
              <p style={{ color: '#c8a96e', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
                {invoice.desc}
              </p>
            </div>
            <div style={{ paddingLeft: '32px', textAlign: 'right' }}>
              <span style={{ color: '#e8c98e', fontFamily: "'UnifrakturMaguntia', serif", fontSize: '32px' }}>
                {invoice.amount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}