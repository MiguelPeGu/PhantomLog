import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useData } from '../context/DataProvider'

export default function Invoices() {
  const { invoices, loadingInvoices: loading, invoicesPagination, refreshInvoices } = useData() //recordar mirar lo del usedata
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    refreshInvoices({ page: currentPage, per_page: 5 })
  }, [currentPage, refreshInvoices])

  const { totalPages } = invoicesPagination

  if (loading && invoices.length === 0) return <div className="mt-50 text-normal text-center">INVOCANDO CONTRATOS...</div>

  return (
    <div className="page-container mx-auto" style={{ maxWidth: '800px' }}>
      <header className="mb-40 text-center">
        <h1>HISTORIAL DE PACTOS</h1>
        <p className="text-dim">Registro de transacciones selladas en el archivo.</p>
      </header>

      <div className="column gap-20">
        {invoices.length === 0 ? (
          <div className="text-center border-dashed-accent p-40">NO EXISTEN PACTOS SELLADOS.</div>
        ) : (
          invoices.map(i => (
            <div key={i.id} className="horror-card flex-between invoice-item-card mb-20">
              <div>
                <h2 className="m-0 mb-5">CONTRATO #{i.n_invoice || i.id}</h2>
                <p className="m-0 fs-14">FECHA: {new Date(i.created_at).toLocaleString()}</p>
                <p className="m-5-0 fs-12 text-dim">METODO: {i.payment_method?.toUpperCase()}</p>
              </div>
              <div className="text-right">
                <div className="fs-24 bold text-normal mb-10">{i.total}€</div>
                <Link to={`/success/${i.id}`} className="btn">VER DETALLE</Link>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button disabled={currentPage === 1} onClick={() => { setCurrentPage(p => p - 1); window.scrollTo(0,0); }}>🡄 ANTERIOR</button>
          <span className="bold">PÁGINA {currentPage} DE {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => { setCurrentPage(p => p + 1); window.scrollTo(0,0); }}>SIGUIENTE 🡆</button>
        </div>
      )}
    </div>
  )
}
