import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataProvider'

export default function Invoices() {
  const { invoices, loadingInvoices: loading, invoicesPagination, refreshInvoices } = useData()
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    refreshInvoices({ page: currentPage, per_page: 5 })
  }, [currentPage, refreshInvoices])

  const { totalPages } = invoicesPagination

  if (loading && invoices.length === 0) return <div style={{ color: '#0f0', textAlign: 'center', marginTop: '50px' }}>INVOCANDO CONTRATOS...</div>

  return (
    <div className="page-container">
      <header className="mb-40 text-center">
        <h1>HISTORIAL DE PACTOS</h1>
        <p style={{ color: 'var(--text-dim)' }}>Registro de transacciones selladas en el archivo.</p>
      </header>

      <div className="column" style={{ gap: '20px', maxWidth: '800px', margin: '0 auto' }}>
        {invoices.length === 0 ? (
          <div className="text-center" style={{ border: '1px dashed var(--accent)', padding: '40px' }}>NO EXISTEN PACTOS SELLADOS.</div>
        ) : (
          invoices.map(i => (
            <div key={i.id} className="horror-card flex-center" style={{ 
              borderLeft: '5px solid var(--text)', 
              justifyContent: 'space-between', padding: '20px'
            }}>
              <div>
                <h2 style={{ margin: '0 0 5px 0' }}>CONTRATO #{i.n_invoice || i.id}</h2>
                <p style={{ margin: '0', fontSize: '14px' }}>FECHA: {new Date(i.created_at).toLocaleString()}</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: 'var(--text-dim)' }}>METODO: {i.payment_method?.toUpperCase()}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text)', marginBottom: '10px' }}>{i.total}€</div>
                <button onClick={() => navigate(`/success/${i.id}`)}>VER DETALLE</button>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-60 flex-center" style={{ gap: '20px' }}>
          <button disabled={currentPage === 1} onClick={() => { setCurrentPage(p => p - 1); window.scrollTo(0,0); }}>🡄 ANTERIOR</button>
          <span style={{ fontWeight: 'bold' }}>PÁGINA {currentPage} DE {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => { setCurrentPage(p => p + 1); window.scrollTo(0,0); }}>SIGUIENTE 🡆</button>
        </div>
      )}
    </div>
  )
}
