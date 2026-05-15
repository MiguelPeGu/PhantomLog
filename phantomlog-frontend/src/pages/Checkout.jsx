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
    dni: '', first_name: '', last_name: '', address: '', postal_code: '',
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
        postal_code: user.postalCode || '',
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

  const validateForm = () => {
    const dniRegex = /^[0-9]{8}[A-Z]$/i
    if (!dniRegex.test(formData.dni)) {
      addToast("DNI INVÁLIDO (8 NÚMEROS + 1 LETRA)", "error")
      return false
    }
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
    if (!nameRegex.test(formData.first_name) || !nameRegex.test(formData.last_name)) {
      addToast("EL NOMBRE Y APELLIDOS NO PUEDEN CONTENER NÚMEROS", "error")
      return false
    }
    const phoneRegex = /^[0-9]+$/
    if (!phoneRegex.test(formData.mobile)) {
      addToast("EL TELÉFONO DEBE SER SOLO NÚMEROS", "error")
      return false
    }
    if (!phoneRegex.test(formData.postal_code) || formData.postal_code.length !== 5) {
      addToast("CÓDIGO POSTAL INVÁLIDO (5 NÚMEROS)", "error")
      return false
    }
    const addressRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s,.\-\/ºª]+$/
    if (!addressRegex.test(formData.address)) {
      addToast("LA DIRECCIÓN CONTIENE CARACTERES NO PERMITIDOS", "error")
      return false
    }

    if (paymentMethod !== 'bizum') {
      const cardRegex = /^[0-9]{16}$/
      const expiryRegex = /^[0-9]{2}\/[0-9]{2}$/
      const cvvRegex = /^[0-9]{3}$/
      
      const cleanCard = formData.card.replace(/\s/g, '')
      if (!cardRegex.test(cleanCard)) {
        addToast("Nº DE TARJETA INVÁLIDO (16 NÚMEROS)", "error")
        return false
      }
      if (!expiryRegex.test(formData.expiry)) {
        addToast("FECHA DE CADUCIDAD INVÁLIDA (MM/AA)", "error")
        return false
      }
      if (!cvvRegex.test(formData.cvv)) {
        addToast("CVV INVÁLIDO (3 NÚMEROS)", "error")
        return false
      }
    }
    return true
  }

  const handleProcess = async (e) => {
    e.preventDefault()
    if (isSubmitting) return;
    if (!validateForm()) return;
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
      setTimeout(() => navigate(`/success/${resp.data.id}`), 500)
    } catch (err) {
      setIsSubmitting(false)
      const msg = err.response?.data?.message || "Error al procesar el pacto."
      addToast(msg.toUpperCase(), "error")
    }
  }

  if (loading || !cartData) {
    return (
      <div className="page-container mx-auto" style={{ maxWidth: '1100px' }}>
        <header className="text-center mb-40">
          <div className="skeleton mx-auto mb-10" style={{ width: '320px', height: '44px' }}></div>
          <div className="skeleton mx-auto" style={{ width: '220px', height: '18px' }}></div>
        </header>
        <div className="flex-center align-start gap-40 wrap grid-2-1">
          {/* Formulario */}
          <div className="horror-card flex-2 p-30">
            <div className="skeleton mb-25" style={{ width: '280px', height: '32px' }}></div>
            <div className="column gap-20">
              <div className="grid-2 gap-20">
                <div className="column gap-10">
                  <div className="skeleton" style={{ width: '120px', height: '14px' }}></div>
                  <div className="skeleton" style={{ height: '44px', borderRadius: '4px' }}></div>
                </div>
                <div className="column gap-10">
                  <div className="skeleton" style={{ width: '100px', height: '14px' }}></div>
                  <div className="skeleton" style={{ height: '44px', borderRadius: '4px' }}></div>
                </div>
              </div>
              <div className="grid-2 gap-20">
                <div className="column gap-10">
                  <div className="skeleton" style={{ width: '80px', height: '14px' }}></div>
                  <div className="skeleton" style={{ height: '44px', borderRadius: '4px' }}></div>
                </div>
                <div className="column gap-10">
                  <div className="skeleton" style={{ width: '110px', height: '14px' }}></div>
                  <div className="skeleton" style={{ height: '44px', borderRadius: '4px' }}></div>
                </div>
              </div>
              <div className="column gap-10">
                <div className="skeleton" style={{ width: '160px', height: '14px' }}></div>
                <div className="skeleton w-100" style={{ height: '44px', borderRadius: '4px' }}></div>
              </div>
              <div className="column gap-10">
                <div className="skeleton" style={{ width: '40px', height: '14px' }}></div>
                <div className="skeleton" style={{ width: '100px', height: '44px', borderRadius: '4px' }}></div>
              </div>
            </div>

            <div className="mt-40 pt-20 border-top">
              <div className="skeleton mb-25" style={{ width: '240px', height: '32px' }}></div>
              <div className="skeleton mb-15" style={{ width: '140px', height: '14px' }}></div>
              <div className="skeleton w-100 mb-30" style={{ height: '44px', borderRadius: '4px' }}></div>
              
              <div className="column gap-15">
                <div className="skeleton w-100" style={{ height: '44px', borderRadius: '4px' }}></div>
                <div className="grid-2 gap-20">
                  <div className="skeleton" style={{ height: '44px', borderRadius: '4px' }}></div>
                  <div className="skeleton" style={{ height: '44px', borderRadius: '4px' }}></div>
                </div>
              </div>
            </div>

            <div className="skeleton w-100 mt-40" style={{ height: '58px', borderRadius: '4px' }}></div>
          </div>

          {/* Sidebar */}
          <div className="horror-card flex-1 p-30 h-fit">
            <div className="skeleton mb-25" style={{ width: '220px', height: '32px' }}></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-center justify-between mb-15">
                <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '25%' }}></div>
              </div>
            ))}
            <div className="mt-40 text-right">
              <div className="skeleton skeleton-text mb-8" style={{ width: '140px', marginLeft: 'auto' }}></div>
              <div className="skeleton skeleton-text mb-15" style={{ width: '180px', marginLeft: 'auto' }}></div>
              <div className="skeleton mt-10" style={{ width: '200px', height: '36px', marginLeft: 'auto' }}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (ghostLoading) {
    return (
      <div className="mt-100 text-normal text-center">
        <h1 className="text-accent fs-32">FORMALIZANDO EL CONTRATO...</h1>
        <div className="fs-120 animate-float">👻</div>
      </div>
    )
  }

  return (
    <div className="page-container mx-auto" style={{ maxWidth: '1100px' }}>
      <header className="text-center mb-40">
        <h1>TERMINAR EL PAGO</h1>
        <p className="text-dim">Finaliza la ceremonia de intercambio.</p>
      </header>

      <div className="flex-center align-start gap-40 wrap grid-2-1">
        {/* Formulario */}
        <div className="horror-card flex-2 p-30">
          <h2 className="mb-20">IDENTIDAD DEL INVOCADOR</h2>
          <form onSubmit={handleProcess} className="column gap-20">
            <div className="grid-2 gap-20">
              <div className="form-group">
                <label className="form-label">DNI / DOCUMENTO</label>
                <input required placeholder="12345678X" value={formData.dni} onChange={e => setFormData({...formData, dni: e.target.value.toUpperCase()})} />
              </div>
              <div className="form-group">
                <label className="form-label">TELÉFONO</label>
                <input required placeholder="600000000" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value.replace(/\D/g,'')})} />
              </div>
            </div>

            <div className="grid-2 gap-20">
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
              <input required placeholder="Calle, Número, Piso" className="w-100" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>
            
            <div className="form-group">
              <label className="form-label">C.P.</label>
              <input required placeholder="28001" maxLength="5" value={formData.postal_code} onChange={e => setFormData({...formData, postal_code: e.target.value.replace(/\D/g,'')})} />
            </div>

            <div className="mt-20 pt-20 border-top">
              <h2 className="mb-20">OFRENDA MONETARIA</h2>
              <label className="form-label">MÉTODO DE PAGO</label>
              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-100 mb-20">
                <option value="credito">Tarjeta de Crédito</option>
                <option value="debito">Tarjeta de Débito</option>
                <option value="bizum">Bizum</option>
              </select>

              {paymentMethod !== 'bizum' && (
                <div className="column gap-15">
                  <input placeholder="Nº TARJETA (16 DÍGITOS)" required maxLength="19" value={formData.card} onChange={e => setFormData({...formData, card: e.target.value.replace(/\D/g,'').replace(/(\d{4})/g,'$1 ').trim()})} />
                  <div className="grid-2 gap-20">
                    <input placeholder="MM/AA" required maxLength="5" value={formData.expiry} onChange={e => {
                      let val = e.target.value.replace(/\D/g,'')
                      if (val.length > 2) val = val.slice(0,2) + '/' + val.slice(2,4)
                      setFormData({...formData, expiry: val})
                    }} />
                    <input placeholder="CVV" required maxLength="3" value={formData.cvv} onChange={e => setFormData({...formData, cvv: e.target.value.replace(/\D/g,'')})} />
                  </div>
                </div>
              )}
            </div>

            <button type="submit" disabled={isSubmitting} className="primary mt-20 fs-20 p-15">
              {isSubmitting ? 'PROCESANDO...' : `TERMINAR PAGO: ${Number(cartData.totalWithTax || 0).toFixed(2)}€`}
            </button>
          </form>
        </div>

        {/* Sidebar Resumen */}
        <div className="horror-card flex-1 p-30 h-fit">
          <h2 className="mb-20">RESUMEN DEL RITUAL</h2>
          {cartData.items.map(item => (
            <div key={item.id} className="checkout-summary-item flex-center">
              <span>{item.quantity}x {item.product.title}</span>
              <span className="text-accent">{(item.product.price * item.quantity).toFixed(2)}€</span>
            </div>
          ))}
          <div className="mt-40 text-right">
            <p className="m-0">SUBTOTAL: {Number(cartData.totalWithoutTax || 0).toFixed(2)}€</p>
            <p className="m-0 fs-14 text-dim">IMPUESTOS (21%): {Number(cartData.totalWithTax - cartData.totalWithoutTax || 0).toFixed(2)}€</p>
            <h3 className="text-normal fs-24 mt-10">TOTAL: {Number(cartData.totalWithTax || 0).toFixed(2)}€</h3>
          </div>
        </div>
      </div>
    </div>
  )
}
