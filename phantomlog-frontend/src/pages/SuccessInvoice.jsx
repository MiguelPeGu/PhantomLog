import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getInvoice } from '../api/invoices'
import NotFound from './NotFound'

export default function SuccessInvoice() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    getInvoice(id).then(res => setInvoice(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="page-container flex-center column">
        <div className="skeleton mb-40" style={{ width: '200px', height: '36px', borderRadius: '4px' }}></div>
        <div className="horror-card max-800 p-40 w-100">
          {/* Header */}
          <div className="invoice-header mb-40">
            <div className="skeleton mx-auto mb-10" style={{ width: '260px', height: '44px' }}></div>
            <div className="skeleton mx-auto mb-10" style={{ width: '220px', height: '18px' }}></div>
            <div className="skeleton mx-auto" style={{ width: '100px', height: '30px', borderRadius: '4px' }}></div>
          </div>

          {/* Datos cliente */}
          <div className="flex-center justify-between mb-40 align-start">
            <div>
              <div className="skeleton mb-10" style={{ width: '120px', height: '20px' }}></div>
              <div className="skeleton skeleton-text mb-5" style={{ width: '180px' }}></div>
              <div className="skeleton skeleton-text mb-5" style={{ width: '200px' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '120px' }}></div>
            </div>
            <div>
              <div className="skeleton mb-5" style={{ width: '160px', height: '20px' }}></div>
              <div className="skeleton skeleton-text mb-5" style={{ width: '140px' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '120px' }}></div>
            </div>
          </div>

          {/* Tabla */}
          <div className="skeleton w-100 mb-10" style={{ height: '44px' }}></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-center justify-between mb-10 p-10" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '8%' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '10%' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '8%' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '12%' }}></div>
            </div>
          ))}

          {/* Totales */}
          <div className="flex-center justify-end mt-40">
            <div style={{ width: '250px' }}>
              <div className="skeleton skeleton-text mb-10" style={{ width: '100%' }}></div>
              <div className="skeleton skeleton-text mb-10" style={{ width: '100%' }}></div>
              <div className="skeleton mt-10" style={{ width: '100%', height: '32px' }}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  if (notFound || !invoice) return <NotFound />

  return (
    <div className="page-container flex-center column">
      <Link
        to="/invoices"
        className="btn mb-40 flex-center gap-10"
      >
        🡄 VOLVER AL HISTORIAL
      </Link>

      <div className="horror-card max-800 p-40">
        <header className="invoice-header">
          <h1 className="fs-42">PHANTOMLOG CORP.</h1>
          <p className="text-dim m-5-0">FACTURA DE TRANSACCIÓN ARCANO-DERECHO</p>
          <div className="status-badge closed invoice-seal">SELLADO</div>
        </header>

        <div className="flex-center justify-between mb-40 align-start">
          <div>
            <h3 className="underline mb-10">INVOCADOR:</h3>
            <p className="m-5-0">{invoice.first_name} {invoice.last_name}</p>
            <p className="m-5-0">{invoice.address}</p>
            <p className="m-5-0">DNI: {invoice.dni}</p>
          </div>
          <div className="text-right">
            <h3>FACTURA #{invoice.n_invoice || invoice.id}</h3>
            <p className="m-5-0">FECHA: {new Date(invoice.created_at).toLocaleDateString()}</p>
            <p className="m-5-0">MÉTODO: {invoice.payment_method?.toUpperCase()}</p>
          </div>
        </div>

        <table className="invoice-table mb-40">
          <thead>
            <tr>
              <th>OBJETO</th>
              <th className="text-center">CANT.</th>
              <th className="text-right">PRECIO</th>
              <th className="text-right">IVA</th>
              <th className="text-right">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {invoice.details?.map(d => (
              <tr key={d.id}>
                <td>{d.title}</td>
                <td className="text-center">{d.quantity}</td>
                <td className="text-right">{Number(d.price).toFixed(2)}€</td>
                <td className="text-right">{d.tax}%</td>
                <td className="text-right">{Number(d.total_with_tax).toFixed(2)}€</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex-center justify-end invoice-footer border-top pt-30 mt-10">
          <div className="w-300">
            <div className="flex-center justify-between mb-15">
              <span className="text-dim fs-14 ls-1">SUBTOTAL ARCANO:</span>
              <span className="fs-18">{Number(invoice.subtotal || 0).toFixed(2)}€</span>
            </div>
            <div className="flex-center justify-between mb-20">
              <span className="text-dim fs-14 ls-1">TASA DE SACRIFICIO ({invoice.tax}%):</span>
              <span className="fs-18">{(Number(invoice.total || 0) - Number(invoice.subtotal || 0)).toFixed(2)}€</span>
            </div>
            <div className="flex-center justify-between border-top pt-20 mt-10" style={{ borderTopWidth: '2px', borderTopColor: 'var(--text)' }}>
              <span className="bold fs-16 ls-2">TOTAL FINAL:</span>
              <span className="fs-36 bold text-accent" style={{ textShadow: '0 0 15px rgba(255, 0, 0, 0.3)' }}>
                {Number(invoice.total || 0).toFixed(2)}€
              </span>
            </div>
          </div>
        </div>

        <footer className="mt-50 text-center fs-12 text-muted">
          <p>ESTE DOCUMENTO ES UNA PRUEBA DE TU VÍNCULO CON PHANTOMLOG CORP. NO HAY DEVOLUCIONES TRAS EL SELLO.</p>
          <div className="auth-stamp">
            SELLO DE AUTENTICIDAD: {Math.random().toString(36).substring(7).toUpperCase()}
          </div>
        </footer>
      </div>

      <div className="mt-60 flex-center gap-20">
        <button onClick={() => window.print()} className="outline-red p-10-30">IMPRIMIR ARCHIVO</button>
        <Link to="/dashboard" className="btn primary p-10-30">VOLVER AL INICIO</Link>
      </div>
    </div>
  )
}
