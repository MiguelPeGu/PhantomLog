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
    <div style={{ padding: '20px', color: '#0f0' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ color: '#f00', fontSize: '48px', margin: '0' }}>HISTORIAL DE PACTOS</h1>
        <p style={{ color: '#060' }}>Registro de transacciones selladas en el archivo.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px', margin: '0 auto' }}>
        {invoices.length === 0 ? (
          <div style={{ textAlign: 'center', border: '1px dashed #f00', padding: '40px' }}>NO EXISTEN PACTOS SELLADOS.</div>
        ) : (
          invoices.map(i => (
            <div key={i.id} style={{ 
              border: '1px solid #060', borderLeft: '5px solid #0f0', 
              padding: '20px', background: '#000', 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
            }}>
              <div>
                <h2 style={{ color: '#f00', margin: '0 0 5px 0' }}>CONTRATO #{i.n_invoice || i.id}</h2>
                <p style={{ margin: '0', fontSize: '14px' }}>FECHA: {new Date(i.created_at).toLocaleString()}</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#060' }}>METODO: {i.payment_method?.toUpperCase()}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f0', marginBottom: '10px' }}>${i.total}</div>
                <button onClick={() => navigate(`/success/${i.id}`)}>VER DETALLE</button>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
          <button disabled={currentPage === 1} onClick={() => { setCurrentPage(p => p - 1); window.scrollTo(0,0); }}>🡄 ANTERIOR</button>
          <span style={{ color: '#f00', fontWeight: 'bold' }}>PÁGINA {currentPage} DE {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => { setCurrentPage(p => p + 1); window.scrollTo(0,0); }}>SIGUIENTE 🡆</button>
        </div>
      )}
    </div>
  )
}
