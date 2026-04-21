import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataProvider'

export default function Invoices() {
  const {
    invoices,
    loadingInvoices: loading,
    invoicesPagination,
    refreshInvoices
  } = useData()

  const [currentPage, setCurrentPage] = useState(invoicesPagination.currentPage)
  const itemsPerPage = 5
  const navigate = useNavigate()

  useEffect(() => {
    refreshInvoices({ page: currentPage, per_page: itemsPerPage })
  }, [currentPage, refreshInvoices])

  const { totalPages } = invoicesPagination

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: "'IM Fell English', serif", fontSize: '48px', margin: '0 0 8px 0', color: '#c8a96e' }}>
          Contratos y Honorarios
        </h1>
        <p style={{ color: 'rgba(200, 169, 110, 0.5)', fontStyle: 'italic', letterSpacing: '0.1em' }}>
          El registro de encargos. Cada pacto tiene su costo en sangre (PAGADO).
        </p>
      </header>
      
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
         <button onClick={() => navigate('/products')} style={{ background: 'transparent', color: '#ffaa00', border: '1px solid #ffaa00', padding: '10px 20px', cursor: 'pointer', fontFamily: "'IM Fell English', serif", fontSize: '20px' }}>
           Regresar a la Armería
         </button>
      </div>

      {loading && invoices.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#c8a96e' }}>Invocando contratos del pasado...</p>
      ) : invoices.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#c8a96e' }}>No existen ritos consagrados en tu historia.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {invoices.map(invoice => (
            <div key={invoice.id} style={{
              background: 'rgba(8, 4, 10, 0.85)',
              border: '1px solid rgba(200, 169, 110, 0.3)',
              borderLeft: '4px solid #28a745',
              padding: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                  <h2 style={{ fontFamily: "'IM Fell English', serif", fontSize: '24px', color: '#e8c98e', margin: 0 }}>
                    Contrato #{invoice.id}
                  </h2>
                  <span style={{ 
                    fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em',
                    padding: '4px 8px', borderRadius: '4px',
                    background: 'rgba(40, 167, 69, 0.1)',
                    color: '#28a745',
                    border: '1px solid #28a745',
                  }}>
                    Sagrado / Pagado
                  </span>
                </div>
                <div style={{ color: 'rgba(200, 169, 110, 0.6)', fontSize: '13px', display: 'flex', gap: '24px', marginBottom: '12px' }}>
                  <span><strong>Identidad:</strong> {invoice.first_name} {invoice.last_name} ({invoice.dni})</span>
                  <span><strong>Sello Mortal:</strong> {new Date(invoice.created_at).toLocaleDateString()}</span>
                  <span><strong>Vía de Tributo:</strong> {invoice.payment_method ? invoice.payment_method.toUpperCase() : 'DESCONOCIDO'}</span>
                </div>
                
                <div style={{ color: '#c8a96e', fontSize: '14px', lineHeight: '1.5', margin: 0, marginTop: '10px', background: 'rgba(0,0,0,0.5)', padding: '10px' }}>
                   {invoice.details && invoice.details.map((d, i) => (
                      <div key={i}> - {d.quantity}x {d.title} (Impuesto Divino: {d.tax}%) | ${Number(d.price).toFixed(2)} unit. </div>
                   ))}
                </div>
              </div>
              <div style={{ paddingLeft: '32px', textAlign: 'right' }}>
                <span style={{ color: '#e8c98e', fontFamily: "'IM Fell English', serif", fontSize: '32px' }}>
                  ${Number(invoice.total).toFixed(2)}
                </span>
                <div style={{ marginTop: '10px' }}>
                  <button onClick={() => navigate(`/success/${invoice.id}`)} style={{
                      background: 'transparent', color: '#e8c98e', border: '1px solid #e8c98e', padding: '5px 10px', cursor: 'pointer', fontFamily: "'IM Fell English', serif", fontSize: '14px'
                  }}>
                    Ver Recibo Imperial
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '60px', marginBottom: '40px' }}>
          <button 
            disabled={currentPage === 1}
            onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); window.scrollTo(0, 0); }}
            style={{
              background: 'transparent', color: currentPage === 1 ? '#555' : '#c8a96e', border: `1px solid ${currentPage === 1 ? '#555' : '#c8a96e'}`, padding: '10px 20px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontFamily: "'IM Fell English', serif", fontSize: '20px'
            }}>
            Página Anterior
          </button>
          <span style={{ fontSize: '18px', fontFamily: "'IM Fell English', serif", color: '#ffaa00' }}>
            Página {currentPage} de {totalPages}
          </span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); window.scrollTo(0, 0); }}
            style={{
              background: 'transparent', color: currentPage === totalPages ? '#555' : '#c8a96e', border: `1px solid ${currentPage === totalPages ? '#555' : '#c8a96e'}`, padding: '10px 20px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontFamily: "'IM Fell English', serif", fontSize: '20px'
            }}>
            Siguiente Página
          </button>
        </div>
      )}
    </div>
  )
}