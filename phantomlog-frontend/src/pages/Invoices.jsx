import { useEffect, useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useData } from '../context/DataProvider'

const InvoiceSkeleton = () => (
  <div className="horror-card flex-between invoice-item-card mb-20">
    <div style={{ width: '60%' }}>
      <div className="skeleton skeleton-title" style={{ width: '100%', marginBottom: '10px' }}></div>
      <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
      <div className="skeleton skeleton-text" style={{ width: '40%', marginTop: '5px' }}></div>
    </div>
    <div className="text-right" style={{ width: '120px' }}>
      <div className="skeleton skeleton-title" style={{ width: '100%' }}></div>
      <div className="skeleton" style={{ width: '100%', height: '30px', marginTop: '10px' }}></div>
    </div>
  </div>
)

export default function Invoices() {
  const { invoices, loadingInvoices: loading, invoicesPagination, refreshInvoices } = useData()
  const [localSearch, setLocalSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const isFirstRender = useRef(true)

  useEffect(() => {
    setCurrentPage(1)
  }, [localSearch])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return // datos ya cargados por DataProvider
    }
    
    if (localSearch !== '') {
      const delayDebounceFn = setTimeout(() => {
        refreshInvoices({ search: localSearch, page: currentPage, per_page: 5 })
      }, 400)
      return () => clearTimeout(delayDebounceFn)
    } else {
      refreshInvoices({ search: '', page: currentPage, per_page: 5 })
    }
  }, [localSearch, currentPage, refreshInvoices])

  const { totalPages } = invoicesPagination

  return (
    <div className="page-container max-800">
      <header className="text-center mb-60">
        <h1 className="fs-42 ls-3">HISTORIAL DE CONTRATOS</h1>
        <p className="text-dim mt-5">Registros de transacciones y servicios paranormales.</p>
        
        <div className="flex-center mt-40">
           <input 
            type="text" 
            placeholder="BUSCAR POR Nº DE CONTRATO (INV-XXXX)..." 
            className="search-bar w-100 max-400 m-0"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="max-800">
        <div className={`column gap-20 loading-fade${loading && invoices.length > 0 ? ' is-loading' : ''}`}>
          {loading && invoices.length === 0 ? (
            [...Array(5)].map((_, i) => <InvoiceSkeleton key={i} />)
          ) : invoices.length === 0 ? (
            <div className="text-center border-dashed-accent p-40">NO SE HAN ENCONTRADO PACTOS CON ESE REGISTRO.</div>
          ) : (
            invoices.map(i => (
              <div key={i.id} className="horror-card flex-between invoice-item-card">
                <div>
                  <h2 className="m-0 mb-5 text-accent">CONTRATO #{i.n_invoice || i.id}</h2>
                  <p className="m-0 fs-14">FECHA: {new Date(i.created_at).toLocaleString()}</p>
                  <p className="m-0 fs-12 text-dim mt-5">CLIENTE: {i.first_name} {i.last_name}</p>
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
          <div className="pagination-controls mt-60">
            <button 
              disabled={currentPage === 1} 
              onClick={() => { setCurrentPage(p => p - 1); window.scrollTo(0,0); }}
            >
              🡄 ANTERIOR
            </button>
            <span className="bold fs-18">
              {currentPage} / {totalPages}
            </span>
            <button 
              disabled={currentPage === totalPages} 
              onClick={() => { setCurrentPage(p => p + 1); window.scrollTo(0,0); }}
            >
              SIGUIENTE 🡆
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
