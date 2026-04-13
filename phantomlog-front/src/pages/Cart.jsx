import { useEffect, useState } from 'react'
import { getCart, subtractCart, addToCart, removeCart } from '../api/cart'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import { useCart } from '../context/CartContext'
import './Cart.css'

export default function Cart() {
  const [cartData, setCartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { fetchGlobalCart } = useCart()

  const fetchCart = (silent = false) => {
    if (!silent) setLoading(true)
    getCart()
      .then(res => setCartData(res.data))
      .catch(err => {
        console.error(err)
        if (!silent) addToast("Error al invocar el contenedor.", "error")
      })
      .finally(() => { if (!silent) setLoading(false) })
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const handleUpdate = async (productId, intent) => {
    if (intent === 'add') {
      const item = cartData?.items.find(i => i.product.id === productId)
      if (item && item.quantity >= item.product.stock) {
        addToast("No es sagrado. Has superado el stock disponible de esta reliquia.", "error")
        return;
      }
    }

    try {
      if (intent === 'add') await addToCart(productId, 1)
      if (intent === 'sub') await subtractCart(productId)
      if (intent === 'rem') await removeCart(productId)
      
      // Fetch silently from server to update state without flashing loading screen
      fetchCart(true)
      await fetchGlobalCart() // Update the layout badge globally
    } catch (e) {
      console.error(e)
      addToast(e.response?.data?.message || "Error al procesar el ajuste en el backend.", "error")
    }
  }

  if (loading) return <p style={{ textAlign: 'center', color: '#c8a96e' }}>Inspeccionando el vacío...</p>

  const items = cartData?.items || []

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', color: '#c8a96e' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: "'IM Fell English', serif", fontSize: '48px', margin: '0 0 8px 0', color: '#c8a96e' }}>
          El Contenedor (Carrito)
        </h1>
        <p style={{ color: 'rgba(200, 169, 110, 0.5)', fontStyle: 'italic', letterSpacing: '0.1em' }}>
          Tus adquisiciones a la espera de ser cristalizadas en tu inventario.
        </p>
      </header>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center' }}>
          <p>Tu contenedor está vacío de ecos.</p>
          <button onClick={() => navigate('/products')} style={{
            background: 'transparent', color: '#ffaa00', border: '1px solid #ffaa00', padding: '10px 20px', cursor: 'pointer',
            fontFamily: "'IM Fell English', serif", fontSize: '20px', marginTop: '20px'
          }}>
            Regresar a la Armería
          </button>
        </div>
      ) : (
        <div style={{ background: 'rgba(8, 4, 10, 0.85)', border: '1px solid rgba(200, 169, 110, 0.3)', padding: '24px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)' }}>
          {items.map((item, idx) => {
             const product = item.product;
             return (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(200, 169, 110, 0.2)', padding: '16px 0' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: "'IM Fell English', serif", fontSize: '24px', color: '#e8c98e', margin: '0 0 4px 0' }}>
                    {product.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#c8a96e' }}>Costo Base: ${Number(product.price).toFixed(2)}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ border: '1px solid rgba(200, 169, 110, 0.5)', display: 'flex', alignItems: 'center' }}>
                    <button className="cart-action-btn border-right" onClick={() => handleUpdate(product.id, 'sub')} style={{ padding: '5px 15px' }}>-</button>
                    <span style={{ padding: '0 10px' }}>{item.quantity}</span>
                    <button className="cart-action-btn border-left" onClick={() => handleUpdate(product.id, 'add')} style={{ padding: '5px 15px' }}>+</button>
                  </div>
                  <button onClick={() => handleUpdate(product.id, 'rem')} style={{ 
                    background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', padding: '5px 10px', cursor: 'pointer', fontFamily: "'IM Fell English', serif"
                  }}>Descartar</button>
                </div>
              </div>
             )
          })}
          
          <div style={{ marginTop: '30px', borderTop: '2px solid rgba(200, 169, 110, 0.5)', paddingTop: '20px', textAlign: 'right' }}>
            <p style={{ fontSize: '16px' }}>Valor de Ofrenda (Sin Impuestos): ${Number(cartData.totalWithoutTax).toFixed(2)}</p>
            <p style={{ fontSize: '24px', fontFamily: "'IM Fell English', serif", color: '#ffaa00' }}>Invocación Final (Total): ${Number(cartData.totalWithTax).toFixed(2)}</p>
            
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
              <button onClick={() => navigate('/products')} style={{
                background: 'transparent', color: '#c8a96e', border: '1px solid #c8a96e', padding: '10px 20px', cursor: 'pointer', fontFamily: "'IM Fell English', serif", fontSize: '20px'
              }}>
                Continuar Observando
              </button>
              <button onClick={() => navigate('/checkout')} style={{
                background: '#ffaa00', color: '#000', border: 'none', padding: '10px 20px', cursor: 'pointer', fontFamily: "'IM Fell English', serif", fontSize: '20px', fontWeight: 'bold'
              }}>
                Sellar Contrato (Checkout)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
