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
    dni: '', first_name: '', last_name: '', address: '',
    mobile: '', card: '', expiry: '', cvv: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('credito')

  useEffect(() => {
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
    getCart().then(res => {
      if (!res.data.items?.length) navigate('/products')
      else setCartData(res.data)
    }).finally(() => setLoading(false))
  }, [navigate])

  const handleProcess = async (e) => {
    e.preventDefault()
    if (isSubmitting) return;
    setIsSubmitting(true)
    
    try {
      const resp = await createInvoice({
        ...formData,
        payment_method: paymentMethod,
        items: cartData.items.map(item => ({ product_id: item.product.id, quantity: item.quantity }))
      })
      
      setGhostLoading(true)
      await clearCart()
      await fetchGlobalCart()
      setTimeout(() => navigate(`/success/${resp.data.id}`), 3000)
    } catch (err) {
      setIsSubmitting(false)
      addToast("Error al procesar el pacto.", "error")
    }
  }

  if (loading || !cartData) return <div style={{ color: '#0f0', textAlign: 'center', marginTop: '50px' }}>SINCRONIZANDO PACTO...</div>

  if (ghostLoading) {
    return (
      <div style={{ textAlign: 'center', color: '#0f0', marginTop: '100px' }}>
        <h1 style={{ color: '#f00', fontSize: '32px' }}>FORMALIZANDO EL CONTRATO...</h1>
        <div style={{ fontSize: '120px', animation: 'float 2s infinite' }}>👻</div>
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-30px); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="page-container" style={{ maxWidth: '1100px' }}>
      <header className="text-center mb-40">
        <h1>SELLAR PACTO (CHECKOUT)</h1>
        <p style={{ color: 'var(--text-dim)' }}>Finaliza la ceremonia de intercambio.</p>
      </header>

      <div className="flex-center" style={{ gap: '40px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Formulario */}
        <div className="horror-card" style={{ flex: '2', padding: '30px' }}>
          <h2 style={{ marginBottom: '20px' }}>IDENTIDAD DEL INVOCADOR</h2>
          <form onSubmit={handleProcess} className="column" style={{ gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">DNI / DOCUMENTO</label>
                <input required value={formData.dni} onChange={e => setFormData({...formData, dni: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">TELÉFONO</label>
                <input required value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">NOMBRE</label>
                <input required value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">APELLIDOS</label>
                <input required value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">DIRECCIÓN DE ENTREGA</label>
              <input required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>

            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--text-muted)' }}>
              <h2 style={{ marginBottom: '20px' }}>OFRENDA MONETARIA</h2>
              <label className="form-label">MÉTODO DE PAGO</label>
              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} style={{ width: '100%', marginBottom: '20px' }}>
                <option value="credito">Tarjeta de Crédito</option>
                <option value="debito">Tarjeta de Débito</option>
                <option value="bizum">Bizum</option>
              </select>

              {paymentMethod !== 'bizum' && (
                <div className="column" style={{ gap: '15px' }}>
                  <input placeholder="Nº TARJETA (XXXX XXXX XXXX XXXX)" required value={formData.card} onChange={e => setFormData({...formData, card: e.target.value})} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <input placeholder="MM/AA" required value={formData.expiry} onChange={e => setFormData({...formData, expiry: e.target.value})} />
                    <input placeholder="CVV" required value={formData.cvv} onChange={e => setFormData({...formData, cvv: e.target.value})} />
                  </div>
                </div>
              )}
            </div>

            <button type="submit" disabled={isSubmitting} className="primary" style={{ 
              marginTop: '20px', padding: '15px', fontSize: '20px'
            }}>
              {isSubmitting ? 'PROCESANDO...' : `CONSECRAR PAGO: ${Number(cartData.totalWithTax || 0).toFixed(2)}€`}
            </button>
          </form>
        </div>

        {/* Sidebar Resumen */}
        <div className="horror-card" style={{ flex: '1', padding: '30px', height: 'fit-content' }}>
          <h2 style={{ marginBottom: '20px' }}>RESUMEN DEL RITUAL</h2>
          {cartData.items.map(item => (
            <div key={item.id} className="flex-center" style={{ justifyContent: 'space-between', borderBottom: '1px solid var(--text-muted)', paddingBottom: '10px', marginBottom: '10px' }}>
              <span>{item.quantity}x {item.product.title}</span>
              <span style={{ color: 'var(--accent)' }}>{(item.product.price * item.quantity).toFixed(2)}€</span>
            </div>
          ))}
          <div className="mt-40" style={{ textAlign: 'right' }}>
            <p style={{ margin: 0 }}>SUBTOTAL: {Number(cartData.totalWithoutTax || 0).toFixed(2)}€</p>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-dim)' }}>IMPUESTOS (21%): {Number(cartData.totalWithTax - cartData.totalWithoutTax || 0).toFixed(2)}€</p>
            <h3 style={{ color: 'var(--text)', fontSize: '24px', marginTop: '10px' }}>TOTAL: {Number(cartData.totalWithTax || 0).toFixed(2)}€</h3>
          </div>
        </div>
      </div>
    </div>
  )
}
