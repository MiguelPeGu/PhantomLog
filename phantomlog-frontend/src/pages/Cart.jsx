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
      addToast("Error en la sincronización.", "error");
    } finally {
      setUpdatingState(prev => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    }
  }

  if (loading) return <div style={{ color: '#0f0', textAlign: 'center', marginTop: '50px' }}>INSPECCIONANDO EL VACÍO...</div>

  const items = cartData?.items || []

  return (
    <div style={{ padding: '20px', color: '#0f0' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#f00', fontSize: '48px', margin: 0 }}>EL CONTENEDOR</h1>
        <p style={{ color: '#060' }}>Tus adquisiciones a la espera de ser consagradas.</p>
      </header>

      <button 
        onClick={() => navigate('/products')} 
        style={{ 
          background: 'none', border: '1px solid #0f0', color: '#0f0', 
          padding: '10px 20px', cursor: 'pointer', marginBottom: '20px',
          display: 'flex', alignItems: 'center', gap: '10px'
        }}
      >
        🡄 VOLVER AL CATÁLOGO
      </button>
      
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', border: '1px dashed #f00', padding: '40px' }}>
          <p>Tu contenedor está vacío de ecos.</p>
          <button onClick={() => navigate('/products')} style={{ marginTop: '20px' }}>VOLVER A LA ARMERÍA</button>
        </div>
      ) : (
        <div style={{ maxWidth: '900px', margin: '0 auto', background: '#000', border: '1px solid #060', padding: '30px' }}>
          {items.map(item => (
            <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #040', padding: '15px 0' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: '#f00', margin: '0 0 5px 0' }}>{item.product.title}</h3>
                <p style={{ margin: 0, fontSize: '14px' }}>COSTO: ${item.product.price}</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', border: '1px solid #060', background: '#111', opacity: updatingState[item.product.id] ? 0.5 : 1 }}>
                  <button onClick={() => handleUpdate(item.product.id, 'sub')} style={{ padding: '5px 15px', border: 'none', background: 'none', color: '#0f0' }}>-</button>
                  <span style={{ padding: '5px 10px', borderLeft: '1px solid #060', borderRight: '1px solid #060', minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                  <button onClick={() => handleUpdate(item.product.id, 'add')} style={{ padding: '5px 15px', border: 'none', background: 'none', color: '#0f0' }}>+</button>
                </div>
                <button 
                  onClick={() => handleUpdate(item.product.id, 'rem')} 
                  style={{ 
                    background: 'none', border: '1px solid #f00', color: '#f00', 
                    padding: '5px 15px', minWidth: '120px' 
                  }}
                >
                  {updatingState[item.product.id] === 'rem' ? 'ELIMINANDO...' : 'ELIMINAR'}
                </button>
              </div>
            </div>
          ))}

          <div style={{ marginTop: '30px', textAlign: 'right' }}>
            <p style={{ margin: '0', fontSize: '16px' }}>SUBTOTAL: ${cartData.totalWithoutTax}</p>
            <h2 style={{ color: '#f00', fontSize: '32px', margin: '5px 0' }}>TOTAL: ${cartData.totalWithTax}</h2>
            
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
              <button onClick={() => navigate('/products')} style={{ background: 'none', border: '1px solid #0f0', color: '#0f0', padding: '10px 20px' }}>SEGUIR BUSCANDO</button>
              <button onClick={() => navigate('/checkout')} style={{ padding: '10px 20px', fontSize: '18px', fontWeight: 'bold' }}>SELLAR PACTO (CHECKOUT)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
