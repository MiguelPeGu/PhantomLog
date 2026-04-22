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
    <div style={{ padding: '20px', color: '#0f0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button 
        onClick={() => navigate('/invoices')} 
        style={{ 
          background: 'none', border: '1px solid #0f0', color: '#0f0', 
          padding: '10px 20px', cursor: 'pointer', marginBottom: '30px',
          alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '10px'
        }}
      >
        🡄 VOLVER AL HISTORIAL
      </button>
      <div style={{ 
        width: '100%', maxWidth: '800px', background: '#000', border: '2px solid #060', 
        padding: '40px', position: 'relative', boxShadow: '0 0 50px rgba(0, 255, 0, 0.1)' 
      }}>
        <header style={{ borderBottom: '2px solid #0f0', paddingBottom: '20px', marginBottom: '30px', textAlign: 'center' }}>
          <h1 style={{ color: '#f00', fontSize: '42px', margin: 0 }}>PHANTOMLOG CORP.</h1>
          <p style={{ color: '#060', margin: '5px 0' }}>FACTURA DE TRANSACCIÓN ARCANO-DERECHO</p>
          <div style={{ position: 'absolute', top: '10px', right: '10px', border: '2px solid #f00', color: '#f00', padding: '5px 10px', borderRadius: '5px', transform: 'rotate(15deg)', fontWeight: 'bold' }}>SELLADO</div>
        </header>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <div>
            <h3 style={{ color: '#0f0', textDecoration: 'underline' }}>INVOCADOR:</h3>
            <p style={{ margin: '5px 0' }}>{invoice.first_name} {invoice.last_name}</p>
            <p style={{ margin: '5px 0' }}>{invoice.address}</p>
            <p style={{ margin: '5px 0' }}>DNI: {invoice.dni}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h3 style={{ color: '#0f0' }}>FACTURA #{invoice.n_invoice || invoice.id}</h3>
            <p style={{ margin: '5px 0' }}>FECHA: {new Date(invoice.created_at).toLocaleDateString()}</p>
            <p style={{ margin: '5px 0' }}>MÉTODO: {invoice.payment_method?.toUpperCase()}</p>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #0f0', color: '#f00' }}>
              <th style={{ textAlign: 'left', padding: '10px' }}>OBJETO</th>
              <th style={{ textAlign: 'center', padding: '10px' }}>CANT.</th>
              <th style={{ textAlign: 'right', padding: '10px' }}>PRECIO</th>
              <th style={{ textAlign: 'right', padding: '10px' }}>IVA</th>
              <th style={{ textAlign: 'right', padding: '10px' }}>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {invoice.details?.map(d => (
              <tr key={d.id} style={{ borderBottom: '1px solid #040' }}>
                <td style={{ padding: '10px' }}>{d.product_name || (d.product?.title)}</td>
                <td style={{ textAlign: 'center', padding: '10px' }}>{d.quantity}</td>
                <td style={{ textAlign: 'right', padding: '10px' }}>${d.price}</td>
                <td style={{ textAlign: 'right', padding: '10px' }}>{d.tax}%</td>
                <td style={{ textAlign: 'right', padding: '10px' }}>${(d.price * d.quantity * (1 + d.tax/100)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '2px solid #0f0', paddingTop: '20px' }}>
          <div style={{ width: '250px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>SUBTOTAL:</span>
              <span>${invoice.subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>IMPUESTOS:</span>
              <span>${(invoice.total - invoice.subtotal).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '24px', color: '#f00', fontWeight: 'bold' }}>
              <span>TOTAL:</span>
              <span>${invoice.total}</span>
            </div>
          </div>
        </div>

        <footer style={{ marginTop: '50px', textAlign: 'center', fontSize: '12px', color: '#060' }}>
          <p>ESTE DOCUMENTO ES UNA PRUEBA DE TU VÍNCULO CON PHANTOMLOG CORP. NO HAY DEVOLUCIONES TRAS EL SELLO.</p>
          <div style={{ marginTop: '20px', border: '1px solid #040', display: 'inline-block', padding: '10px' }}>
            SELLO DE AUTENTICIDAD: {Math.random().toString(36).substring(7).toUpperCase()}
          </div>
        </footer>
      </div>

      <div style={{ marginTop: '30px', display: 'flex', gap: '20px' }}>
        <button onClick={() => window.print()} style={{ background: 'none', border: '1px solid #0f0', color: '#0f0', padding: '10px 30px' }}>IMPRIMIR ARCHIVO</button>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 30px' }}>REGRESAR AL DASHBOARD</button>
      </div>
    </div>
  )
}
