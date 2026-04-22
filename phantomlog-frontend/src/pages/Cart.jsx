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
  const { fetchGlobalCart, setCartCount } = useCart()
  const [updatingState, setUpdatingState] = useState({}) // { [id]: 'add' | 'sub' | 'rem' }

  //no recargamos la página entera, solo lo necesario
  const fetchCart = async (silent = false) => {
    if (!silent) setLoading(true)

    try {
      const res = await getCart()
      setCartData(res.data)
    } catch (err) {
      if (!silent) {
        addToast("Error al invocar el contenedor.", "error")
      }
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])
  // Actualización optimista con validación de stock y control de concurrencia
  const handleUpdate = async (productId, intent) => {
    // Si ya se está actualizando este ítem, ignoramos clics extra
    if (updatingState[productId]) return;

    const currentItem = cartData?.items.find(i => i.product.id === productId);

    // Validación de Stock en el Cliente
    if (intent === 'add' && currentItem) {
      if (currentItem.quantity >= currentItem.product.stock) {
        addToast("Has alcanzado el límite de existencias de este objeto sagrado.", "error");
        return;
      }
    }

    // Registramos la acción en curso para el feedback visual
    setUpdatingState(prev => ({ ...prev, [productId]: intent }));

    // Actualizamos el estado de forma "optimista" para que el número cambie YA
    setCartData(prev => {
      if (!prev) return prev;
      const newItems = prev.items.map(item => {
        if (item.product.id === productId) {
          if (intent === 'add') return { ...item, quantity: item.quantity + 1 };
          if (intent === 'sub') return { ...item, quantity: Math.max(0, item.quantity - 1) };
        }
        return item;
      }).filter(item => item.quantity > 0);

      if (intent === 'rem') {
        return { ...prev, items: prev.items.filter(i => i.product.id !== productId) };
      }
      return { ...prev, items: newItems };
    });

    try {
      let res;
      if (intent === 'add') res = await addToCart(productId, 1);
      if (intent === 'sub') res = await subtractCart(productId);
      if (intent === 'rem') res = await removeCart(productId);

      // Sincronizamos con la respuesta real del servidor (para totales y stock)
      setCartData(res.data);
      
      // Sincronización local rápida del contador en el Header
      if (res.data && res.data.items) {
        const totalItems = res.data.items.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(totalItems);
      }
    } catch (e) {
      console.error(e);
      await fetchCart(true); 
      addToast(e.response?.data?.message || "Error al procesar el ajuste.", "error");
    } finally {
      // Limpiamos el estado de actualización
      setUpdatingState(prev => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    }
  }

  if (loading) return <p style={{ textAlign: 'center', color: '#c8a96e' }}>Inspeccionando el vacío...</p>

  const items = cartData?.items || []

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', color: '#c8a96e' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: "var(--sans)", fontSize: '48px', margin: '0 0 8px 0', color: '#c8a96e' }}>
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
            fontFamily: "var(--sans)", fontSize: '20px', marginTop: '20px'
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
                  <h3 style={{ fontFamily: "var(--sans)", fontSize: '24px', color: '#e8c98e', margin: '0 0 4px 0' }}>
                    {product.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#c8a96e' }}>Costo Base: ${Number(product.price).toFixed(2)}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ border: '1px solid rgba(200, 169, 110, 0.5)', display: 'flex', alignItems: 'center', opacity: updatingState[product.id] ? 0.5 : 1 }}>
                    <button
                      className="cart-action-btn border-right"
                      disabled={!!updatingState[product.id]}
                      onClick={() => handleUpdate(product.id, 'sub')}
                      style={{ padding: '5px 15px' }}
                    >-</button>
                    <span style={{ padding: '0 10px', minWidth: '25px', textAlign: 'center' }}>{item.quantity}</span>
                    <button
                      className="cart-action-btn border-left"
                      disabled={!!updatingState[product.id] || item.quantity >= product.stock}
                      onClick={() => handleUpdate(product.id, 'add')}
                      style={{
                        padding: '5px 15px',
                        cursor: (item.quantity >= product.stock) ? 'not-allowed' : 'pointer',
                        color: (item.quantity >= product.stock) ? '#555' : '#ffaa00'
                      }}
                    >+</button>
                  </div>
                  <button
                    disabled={!!updatingState[product.id]}
                    onClick={() => handleUpdate(product.id, 'rem')}
                    style={{
                      background: 'transparent',
                      color: updatingState[product.id] ? '#555' : '#ff4444',
                      border: `1px solid ${updatingState[product.id] ? '#555' : '#ff4444'}`,
                      padding: '5px 20px',
                      cursor: updatingState[product.id] ? 'default' : 'pointer',
                      fontFamily: "var(--sans)",
                      minWidth: '130px' // Para que el botón no cambie de tamaño al cambiar el texto
                    }}>
                      {updatingState[product.id] === 'rem' ? 'Descartando...' : 
                       updatingState[product.id] === 'add' ? 'Añadiendo...' :
                       updatingState[product.id] === 'sub' ? 'Sustrayendo...' : 'Descartar'}
                  </button>
                </div>
              </div>
            )
          })}

          <div style={{ marginTop: '30px', borderTop: '2px solid rgba(200, 169, 110, 0.5)', paddingTop: '20px', textAlign: 'right' }}>
            <p style={{ fontSize: '16px' }}>Valor de Ofrenda (Sin Impuestos): ${Number(cartData.totalWithoutTax).toFixed(2)}</p>
            <p style={{ fontSize: '24px', fontFamily: "var(--sans)", color: '#ffaa00' }}>Invocación Final (Total): ${Number(cartData.totalWithTax).toFixed(2)}</p>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
              <button onClick={() => navigate('/products')} style={{
                background: 'transparent', color: '#c8a96e', border: '1px solid #c8a96e', padding: '10px 20px', cursor: 'pointer', fontFamily: "var(--sans)", fontSize: '20px'
              }}>
                Continuar Observando
              </button>
              <button onClick={() => navigate('/checkout')} style={{
                background: '#ffaa00', color: '#000', border: 'none', padding: '10px 20px', cursor: 'pointer', fontFamily: "var(--sans)", fontSize: '20px', fontWeight: 'bold'
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
