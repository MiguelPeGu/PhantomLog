import { useEffect, useState } from 'react'
import { getCart, clearCart } from '../api/cart'
import { createInvoice } from '../api/invoices'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useCart } from '../context/CartContext'

export default function Checkout() {
  const [cartData, setCartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [ghostLoading, setGhostLoading] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToast } = useToast()
  const { fetchGlobalCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    dni: '',
    first_name: '',
    last_name: '',
    address: '',
    mobile: '',
    card: '',
    expiry: '',
    cvv: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('credito')

  useEffect(() => {
    // Auto-fill from user context if available
    if (user) {
      setFormData(prev => ({
        ...prev,
        dni: user.dni || '',
        first_name: user.firstname || '',
        last_name: user.lastname || '',
        address: user.address || '',
        mobile: user.mobile || ''
      }))
    }
  }, [user])

  useEffect(() => {
    getCart()
      .then(res => {
        if (!res.data.items || res.data.items.length === 0) {
          navigate('/products')
        } else {
          setCartData(res.data)
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [navigate])

  const handleProcess = async (e) => {
    e.preventDefault()
    if (isSubmitting) return;
    setIsSubmitting(true)
    
    // Map items to match what API expects: { product_id, quantity }
    const items = cartData.items.map(item => ({
      product_id: item.product.id,
      quantity: item.quantity
    }))

    try {
      const resp = await createInvoice({
        dni: formData.dni,
        first_name: formData.first_name,
        last_name: formData.last_name,
        address: formData.address,
        payment_method: paymentMethod,
        items
      })
      
      await clearCart()
      await fetchGlobalCart()
      addToast("El contrato fue sellado con éxito.", "info")
      
      // Activar animación fantasma durante 5 segundos
      setGhostLoading(true)
      setTimeout(() => {
        navigate(`/success/${resp.data.id}`)
      }, 5000)

    } catch (err) {
      console.error(err)
      setIsSubmitting(false)
      addToast("Las sombras oscurecieron el trámite. Ocurrió un error al procesar el pago.", "error")
    }
  }

  if (loading || !cartData) return <p style={{ textAlign: 'center', color: '#c8a96e' }}>Sincronizando contrato...</p>

  if (ghostLoading) {
    return (
      <div style={{ textAlign: 'center', color: '#e8c98e', margin: '100px auto' }}>
        <h2 style={{ fontFamily: "'IM Fell English', serif", fontSize: '32px' }}>Formalizando el Contrato en el Más Allá...</h2>
        <div style={{ fontSize: '100px', animation: 'float 2s ease-in-out infinite, fade 5s forwards', display: 'inline-block' }}>
          👻
        </div>
        <style>{`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-30px); }
            100% { transform: translateY(0px); }
          }
          @keyframes fade {
            0% { opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { opacity: 0; }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', color: '#c8a96e' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: "'IM Fell English', serif", fontSize: '48px', margin: '0 0 8px 0', color: '#c8a96e' }}>
          Sellar Contrato (Checkout)
        </h1>
        <p style={{ color: 'rgba(200, 169, 110, 0.5)', fontStyle: 'italic', letterSpacing: '0.1em' }}>
          Finaliza la ceremonia de intercambio. Consagra el rito de pago.
        </p>
      </header>

      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
        <div style={{ flex: '2', background: 'rgba(8, 4, 10, 0.85)', border: '1px solid rgba(200, 169, 110, 0.3)', padding: '24px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)' }}>
          <h2 style={{ fontFamily: "'IM Fell English', serif", fontSize: '24px', color: '#e8c98e', marginBottom: '20px' }}>Datos de Identidad (Secreto Mágico)</h2>
          <form onSubmit={handleProcess} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <label style={{ fontSize: '14px', color: '#e8c98e' }}>Documento de Identidad (Grito/DNI)</label>
            <input required value={formData.dni} onChange={e => setFormData({...formData, dni: e.target.value})} style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid #c8a96e', color: '#fff', padding: '10px' }} />
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '14px', color: '#e8c98e' }}>Nombre de Sangre</label>
                <input required value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid #c8a96e', color: '#fff', padding: '10px' }} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '14px', color: '#e8c98e' }}>Apellido Herrante</label>
                <input required value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid #c8a96e', color: '#fff', padding: '10px' }} />
              </div>
            </div>

            <label style={{ fontSize: '14px', color: '#e8c98e' }}>Morada Final (Dirección de Envío)</label>
            <input required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid #c8a96e', color: '#fff', padding: '10px' }} />

            <label style={{ fontSize: '14px', color: '#e8c98e' }}>Teléfono Móvil (Contacto de Sangre)</label>
            <input required value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid #c8a96e', color: '#fff', padding: '10px' }} />
            
            <div style={{ borderTop: '1px solid rgba(200, 169, 110, 0.3)', marginTop: '10px', paddingTop: '20px' }}>
               <h2 style={{ fontFamily: "'IM Fell English', serif", fontSize: '24px', color: '#e8c98e', marginBottom: '20px' }}>Ofrenda Monetaria</h2>
               
               <label style={{ fontSize: '14px', color: '#e8c98e' }}>Método de Invocación (Pago)</label>
               <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} style={{ background: 'rgba(0,0,0,0.5)', border: '1px dashed #c8a96e', color: '#fff', padding: '10px', width: '100%', marginBottom: '16px', fontFamily: "'IM Fell English', serif", fontSize: '16px' }}>
                 <option value="credito">Tarjeta de Crédito</option>
                 <option value="debito">Tarjeta de Débito</option>
                 <option value="bizum">Bizum</option>
               </select>

               {paymentMethod === 'bizum' ? (
                 <p style={{ color: '#ffaa00', fontStyle: 'italic', fontSize: '15px' }}>
                   * (Se usará el teléfono móvil seleccionado para continuar con el pago)
                 </p>
               ) : (
                 <>
                   <label style={{ fontSize: '14px', color: '#e8c98e' }}>Número de Tarjeta</label>
                   <input placeholder="XXXX-XXXX-XXXX-XXXX" required value={formData.card} onChange={e => setFormData({...formData, card: e.target.value})} style={{ background: 'rgba(0,0,0,0.5)', border: '1px dashed #c8a96e', color: '#fff', padding: '10px', width: '100%', marginBottom: '16px' }} />
                   
                   <div style={{ display: 'flex', gap: '16px' }}>
                     <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                       <label style={{ fontSize: '14px', color: '#e8c98e' }}>Fecha de Caducidad</label>
                       <input placeholder="MM/AA" required value={formData.expiry} onChange={e => setFormData({...formData, expiry: e.target.value})} style={{ background: 'rgba(0,0,0,0.5)', border: '1px dashed #c8a96e', color: '#fff', padding: '10px' }} />
                     </div>
                     <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                       <label style={{ fontSize: '14px', color: '#e8c98e' }}>CVV</label>
                       <input placeholder="123" required value={formData.cvv} onChange={e => setFormData({...formData, cvv: e.target.value})} style={{ background: 'rgba(0,0,0,0.5)', border: '1px dashed #c8a96e', color: '#fff', padding: '10px' }} />
                     </div>
                   </div>
                 </>
               )}
            </div>

            <button type="submit" disabled={isSubmitting} style={{
              background: isSubmitting ? '#555' : '#ffaa00', color: '#000', border: 'none', padding: '15px 20px', cursor: isSubmitting ? 'wait' : 'pointer', fontFamily: "'IM Fell English', serif", fontSize: '20px', fontWeight: 'bold', marginTop: '20px'
            }}>
              {isSubmitting ? 'Procesando...' : `Consagrar Compra: $${Number(cartData.totalWithTax).toFixed(2)}`}
            </button>
          </form>
        </div>

        <div style={{ flex: '1', background: 'rgba(8, 4, 10, 0.85)', border: '1px solid rgba(200, 169, 110, 0.3)', padding: '24px' }}>
          <h2 style={{ fontFamily: "'IM Fell English', serif", fontSize: '24px', color: '#e8c98e', marginBottom: '20px' }}>Resumen del Ritual</h2>
          {cartData.items.map((item, idx) => (
             <div key={idx} style={{ borderBottom: '1px solid rgba(200, 169, 110, 0.2)', paddingBottom: '10px', marginBottom: '10px' }}>
                <div style={{ color: '#e8c98e' }}>{item.quantity}x {item.product.title}</div>
                <div style={{ fontSize: '14px', color: '#c8a96e', textAlign: 'right' }}>${(item.product.price * item.quantity).toFixed(2)}</div>
             </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontWeight: 'bold', fontSize: '18px', color: '#ffaa00' }}>
            <span>Tributo Final</span>
            <span>${Number(cartData.totalWithTax).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
