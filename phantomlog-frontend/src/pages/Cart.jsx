import { useEffect, useState } from 'react'
import { getCart, subtractCart, addToCart, removeCart } from '../api/cart'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const [cartData, setCartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updatingState, setUpdatingState] = useState({}) // { [id]: 'add' | 'sub' | 'rem' }
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { setCartCount } = useCart()

  const fetchCart = async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const res = await getCart()
      setCartData(res.data)
      setCartCount(res.data.items.reduce((acc, i) => acc + i.quantity, 0))
    } catch (err) {
      if (!silent) addToast("Error al invocar el contenedor.", "error")
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => { fetchCart() }, [])

  const handleUpdate = async (productId, intent) => {
    if (updatingState[productId]) return;

    const currentItem = cartData?.items.find(i => i.product.id === productId);
    if (intent === 'add' && currentItem && currentItem.quantity >= currentItem.product.stock) {
      addToast("Has alcanzado el límite de existencias.", "error");
      return;
    }

    setUpdatingState(prev => ({ ...prev, [productId]: intent }));

    // Optimistic Update
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
      
      setCartData(res.data);
      if (res.data?.items) {
        setCartCount(res.data.items.reduce((acc, i) => acc + i.quantity, 0));
      }
    } catch (e) {
      await fetchCart(true); 
      const msg = e.response?.data?.message || "Error en la sincronización.";
      addToast(msg.toUpperCase(), "error");
    } finally {
      setUpdatingState(prev => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    }
  }

  if (loading) return <div style={{ color: 'var(--text)', textAlign: 'center', marginTop: '50px' }}>INSPECCIONANDO EL VACÍO...</div>

  const items = cartData?.items || []

  return (
    <div className="page-container">
      <header className="text-center mb-40">
        <h1>EL CONTENEDOR</h1>
        <p style={{ color: 'var(--text-dim)' }}>Tus adquisiciones a la espera de ser consagradas.</p>
      </header>

      <button 
        onClick={() => navigate('/products')} 
        className="mb-40"
        style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
      >
        🡄 VOLVER AL CATÁLOGO
      </button>
      
      {items.length === 0 ? (
        <div className="text-center" style={{ border: '1px dashed var(--accent)', padding: '40px' }}>
          <p>Tu contenedor está vacío de ecos.</p>
          <button onClick={() => navigate('/products')} className="mt-10">VOLVER A LA ARMERÍA</button>
        </div>
      ) : (
        <div className="horror-card" style={{ maxWidth: '900px', margin: '0 auto', padding: '30px' }}>
          {items.map(item => (
            <div key={item.product.id} className="flex-center" style={{ justifyContent: 'space-between', borderBottom: '1px solid var(--text-muted)', padding: '15px 0' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 5px 0' }}>{item.product.title}</h3>
                <p style={{ margin: 0, fontSize: '14px' }}>COSTO: {Number(item.product.price).toFixed(2)}€</p>
              </div>

              <div className="flex-center" style={{ gap: '20px' }}>
                <div className="flex-center" style={{ border: '1px solid var(--border)', background: 'var(--bg)', opacity: updatingState[item.product.id] ? 0.5 : 1 }}>
                  <button onClick={() => handleUpdate(item.product.id, 'sub')} className="cart-action-btn" style={{ padding: '5px 15px' }}>-</button>
                  <span style={{ padding: '5px 10px', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                  <button onClick={() => handleUpdate(item.product.id, 'add')} className="cart-action-btn" style={{ padding: '5px 15px' }}>+</button>
                </div>
                <button 
                  onClick={() => handleUpdate(item.product.id, 'rem')} 
                  className="outline-red"
                  style={{ padding: '5px 15px', minWidth: '120px' }}
                >
                  {updatingState[item.product.id] === 'rem' ? 'ELIMINANDO...' : 'ELIMINAR'}
                </button>
              </div>
            </div>
          ))}

          <div className="mt-60" style={{ textAlign: 'right' }}>
            <p style={{ margin: '0', fontSize: '16px' }}>SUBTOTAL: {Number(cartData.totalWithoutTax || 0).toFixed(2)}€</p>
            <p style={{ margin: '0', fontSize: '16px', color: 'var(--text-dim)' }}>IMPUESTOS (21%): {Number(cartData.totalWithTax - cartData.totalWithoutTax || 0).toFixed(2)}€</p>
            <h2 style={{ fontSize: '32px', margin: '5px 0' }}>TOTAL: {Number(cartData.totalWithTax || 0).toFixed(2)}€</h2>
            
            <div className="mt-60 flex-center" style={{ justifyContent: 'flex-end', gap: '15px' }}>
              <button onClick={() => navigate('/products')}>SEGUIR BUSCANDO</button>
              <button onClick={() => navigate('/checkout')} className="primary" style={{ padding: '10px 20px', fontSize: '18px' }}>SELLAR PACTO (CHECKOUT)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
