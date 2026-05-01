import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getInvoice } from '../api/invoices'

export default function SuccessInvoice() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getInvoice(id).then(res => setInvoice(res.data))
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  if (loading) return <div style={{ color: '#0f0', textAlign: 'center', marginTop: '50px' }}>DESENCRIPTANDO FACTURA...</div>
  if (!invoice) return null

  return (
    <div className="page-container flex-center column">
      <button 
        onClick={() => navigate('/invoices')} 
        className="mb-40"
        style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '10px' }}
      >
        🡄 VOLVER AL HISTORIAL
      </button>
      
      <div className="horror-card max-800" style={{ padding: '40px' }}>
        <header className="invoice-header">
          <h1 style={{ fontSize: '42px' }}>PHANTOMLOG CORP.</h1>
          <p style={{ color: 'var(--text-dim)', margin: '5px 0' }}>FACTURA DE TRANSACCIÓN ARCANO-DERECHO</p>
          <div className="status-badge closed" style={{ position: 'absolute', top: '10px', right: '10px', transform: 'rotate(15deg)', fontSize: '14px', padding: '5px 15px' }}>SELLADO</div>
        </header>

        <div className="flex-center justify-between mb-40 align-start">
          <div>
            <h3 style={{ textDecoration: 'underline', marginBottom: '10px' }}>INVOCADOR:</h3>
            <p style={{ margin: '5px 0' }}>{invoice.first_name} {invoice.last_name}</p>
            <p style={{ margin: '5px 0' }}>{invoice.address}</p>
            <p style={{ margin: '5px 0' }}>DNI: {invoice.dni}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h3>FACTURA #{invoice.n_invoice || invoice.id}</h3>
            <p style={{ margin: '5px 0' }}>FECHA: {new Date(invoice.created_at).toLocaleDateString()}</p>
            <p style={{ margin: '5px 0' }}>MÉTODO: {invoice.payment_method?.toUpperCase()}</p>
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
                <td>{d.product_name || (d.product?.title)}</td>
                <td className="text-center">{d.quantity}</td>
                <td className="text-right">{Number(d.price).toFixed(2)}€</td>
                <td className="text-right">{d.tax}%</td>
                <td className="text-right">{(Number(d.price) * d.quantity * (1 + Number(d.tax)/100)).toFixed(2)}€</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex-center justify-end invoice-footer">
          <div style={{ width: '250px' }}>
            <div className="flex-center justify-between mb-10">
              <span>SUBTOTAL:</span>
              <span>{Number(invoice.subtotal).toFixed(2)}€</span>
            </div>
            <div className="flex-center justify-between mb-10">
              <span>IMPUESTOS:</span>
              <span>{(Number(invoice.total) - Number(invoice.subtotal)).toFixed(2)}€</span>
            </div>
            <div className="flex-center justify-between mt-10" style={{ fontSize: '24px', color: 'var(--accent)', fontWeight: 'bold' }}>
              <span>TOTAL:</span>
              <span>{Number(invoice.total).toFixed(2)}€</span>
            </div>
          </div>
        </div>

        <footer style={{ marginTop: '50px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
          <p>ESTE DOCUMENTO ES UNA PRUEBA DE TU VÍNCULO CON PHANTOMLOG CORP. NO HAY DEVOLUCIONES TRAS EL SELLO.</p>
          <div style={{ marginTop: '20px', border: '1px solid var(--border)', display: 'inline-block', padding: '10px' }}>
            SELLO DE AUTENTICIDAD: {Math.random().toString(36).substring(7).toUpperCase()}
          </div>
        </footer>
      </div>

      <div className="mt-60 flex-center" style={{ gap: '20px' }}>
        <button onClick={() => window.print()} className="outline-red" style={{ padding: '10px 30px' }}>IMPRIMIR ARCHIVO</button>
        <button onClick={() => navigate('/dashboard')} className="primary" style={{ padding: '10px 30px' }}>VOLVER AL INICIO</button>
      </div>
    </div>
  )
}
