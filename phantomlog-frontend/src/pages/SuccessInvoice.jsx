import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getInvoice } from '../api/invoices'

export default function SuccessInvoice() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  const fetchInvoice = async () => {
    try {
      const res = await getInvoice(id)
      setInvoice(res.data)
    } catch (err) {
      console.error(err)
      navigate('/invoices')
    } finally {
      setLoading(false)
    }
  }

  fetchInvoice()
}, [id, navigate])
  if (loading) return <p style={{ textAlign: 'center', color: '#c8a96e' }}>Invocando la factura de sangre...</p>
  if (!invoice) return null

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', background: '#eaddc5', color: '#1a1412', padding: '40px', fontFamily: "var(--sans)", boxShadow: '0 0 20px rgba(0,0,0,0.8)' }}>
      <div style={{ textAlign: 'center', borderBottom: '2px dashed #1a1412', paddingBottom: '20px', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '40px', margin: '0 0 10px 0' }}>Armería Esotérica - Extracto de Compra</h1>
        <p style={{ margin: 0, fontStyle: 'italic' }}>El contrato ha sido sellado satisfactoriamente.</p>
        <h2 style={{ margin: '10px 0 0 0', textTransform: 'uppercase' }}>Factura Nº {invoice.n_invoice}</h2>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', fontSize: '18px' }}>
        <div>
          <strong>Identidad:</strong> {invoice.first_name} {invoice.last_name} ({invoice.dni})<br />
          <strong>Destino:</strong> {invoice.address}
        </div>
        <div style={{ textAlign: 'right' }}>
          <strong>Fecha del Sello:</strong> {new Date(invoice.created_at).toLocaleString()}<br />
          <strong>Estado:</strong> PAGADO<br />
          <strong>Vía de Pacto:</strong> {invoice.payment_method ? invoice.payment_method.toUpperCase() : 'DESCONOCIDO'}
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px', fontSize: '18px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #1a1412' }}>
            <th style={{ textAlign: 'left', padding: '10px 0' }}>Ítem</th>
            <th style={{ textAlign: 'center', padding: '10px 0' }}>Cantidad</th>
            <th style={{ textAlign: 'right', padding: '10px 0' }}>Precio Unit.</th>
            <th style={{ textAlign: 'right', padding: '10px 0' }}>Total (c/tax)</th>
          </tr>
        </thead>
        <tbody>
          {invoice.details && invoice.details.map((d, i) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(26,20,18,0.2)' }}>
              <td style={{ padding: '10px 0' }}>{d.title}</td>
              <td style={{ textAlign: 'center', padding: '10px 0' }}>{d.quantity}</td>
              <td style={{ textAlign: 'right', padding: '10px 0' }}>${Number(d.price).toFixed(2)}</td>
              <td style={{ textAlign: 'right', padding: '10px 0' }}>${Number(d.total_with_tax).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ textAlign: 'right', fontSize: '24px', fontWeight: 'bold', marginBottom: '40px' }}>
        Tributo Final Pagado: ${Number(invoice.total).toFixed(2)}
      </div>

      <div style={{ textAlign: 'center', gap: '20px', display: 'flex', justifyContent: 'center' }} className="no-print">
        <button onClick={() => window.print()} style={{
          background: '#1a1412', color: '#eaddc5', border: 'none', padding: '10px 20px', cursor: 'pointer', fontFamily: "var(--sans)", fontSize: '20px', fontWeight: 'bold'
        }}>
          Imprimir Pergamino (Factura)
        </button>
        <button onClick={() => navigate('/products')} style={{
          background: 'transparent', color: '#1a1412', border: '2px solid #1a1412', padding: '10px 20px', cursor: 'pointer', fontFamily: "var(--sans)", fontSize: '20px', fontWeight: 'bold'
        }}>
          Volver a la Armería
        </button>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          body { background: #eaddc5; }
          .no-print { display: none !important; }
          div[style*="max-width: 800px"] {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              visibility: visible;
              box-shadow: none !important;
          }
          div[style*="max-width: 800px"] * { visibility: visible; }
        }
      `}</style>
    </div>
  )
}
