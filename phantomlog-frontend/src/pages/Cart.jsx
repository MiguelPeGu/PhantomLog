import { useEffect, useState } from 'react'
import { getCart, subtractCart, addToCart, removeCart } from '../api/cart'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const [cartData, setCartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updatingState, setUpdatingState] = useState({})
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { setCartCount } = useCart()

  const loadCartData = async () => {
    const res = await getCart()
    setCartData(res.data)
    setCartCount(res.data.items.reduce((acc, i) => acc + i.quantity, 0))
    return res.data
  }

  const fetchCart = async () => {
    setLoading(true)
    try { await loadCartData() }
    catch { addToast("Error al invocar el contenedor.", "error") }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchCart() }, [])

  const handleUpdate = async (productId, intent) => {
    if (updatingState[productId]) return;

    if (intent === 'rem') {
      if (!window.confirm("¿CONFIRMAS QUE DESEAS PURGAR ESTA OFRENDA DEL CONTENEDOR?")) {
        return;
      }
    }

    const currentItem = cartData?.items.find(item => item.product.id === productId);
    if (intent === 'add' && currentItem && currentItem.quantity >= currentItem.product.stock) {
      addToast("Has alcanzado el límite de existencias.", "error");
      return;
    }

    setUpdatingState(prev => ({ ...prev, [productId]: intent }));

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
        return { ...prev, items: prev.items.filter(item => item.product.id !== productId) };
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
      await loadCartData();
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

  if (loading) {
    return (
      <div className="page-container mx-auto" style={{ maxWidth: '900px' }}>
        <header className="text-center mb-40">
          <div className="skeleton mx-auto mb-10" style={{ width: '260px', height: '44px' }}></div>
          <div className="skeleton mx-auto" style={{ width: '200px', height: '18px' }}></div>
        </header>
        <div className="skeleton mb-40" style={{ width: '200px', height: '36px', borderRadius: '4px' }}></div>

        <div className="horror-card p-30">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="cart-item-row flex-center" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '20px' }}>
              <div className="flex-1">
                <div className="skeleton skeleton-title mb-5" style={{ width: '55%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '30%' }}></div>
              </div>
              <div className="flex-center gap-20">
                <div className="skeleton" style={{ width: '110px', height: '40px', borderRadius: '4px' }}></div>
                <div className="skeleton" style={{ width: '110px', height: '40px', borderRadius: '4px' }}></div>
              </div>
            </div>
          ))}

          <div className="cart-totals-panel">
            <div className="skeleton skeleton-text mb-5" style={{ width: '160px' }}></div>
            <div className="skeleton skeleton-text mb-5" style={{ width: '200px' }}></div>
            <div className="skeleton mt-10 mb-15" style={{ width: '220px', height: '36px' }}></div>
            <div className="flex-center justify-end gap-15 mt-60">
              <div className="skeleton" style={{ width: '150px', height: '44px', borderRadius: '4px' }}></div>
              <div className="skeleton" style={{ width: '220px', height: '44px', borderRadius: '4px' }}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const items = cartData?.items || []

  return (
    <div className="page-container mx-auto" style={{ maxWidth: '900px' }}>
      <header className="text-center mb-40">
        <h1>EL CONTENEDOR</h1>
        <p className="text-dim">Tus adquisiciones a la espera de ser consagradas.</p>
      </header>

      <Link 
        to="/products" 
        className="btn mb-40 flex-center gap-10"
      >
        🡄 VOLVER AL CATÁLOGO
      </Link>
      
      {items.length === 0 ? (
        <div className="text-center column align-center p-60">
          <img 
            src="/ghost-shopping.png" 
            alt="Vacio" 
            className="mb-40 opacity-04 mx-auto" 
            style={{ width: '250px', filter: 'grayscale(1) brightness(0.9)' }} 
          />
          <p className="fs-24 ls-2 text-dim">Tu contenedor está vacío de ecos.</p>
        </div>
      ) : (
        <div className="horror-card p-30">
          {items.map(item => (
            <div key={item.product.id} className="cart-item-row flex-center">
              <div className="flex-1">
                <h3 className="m-0 mb-5">{item.product.title}</h3>
                <p className="m-0 fs-14">COSTO: {Number(item.product.price).toFixed(2)}€</p>
              </div>

              <div className="flex-center gap-20">
                <div className={`cart-qty-selector flex-center ${updatingState[item.product.id] ? 'opacity-05' : ''}`}>
                  <button onClick={() => handleUpdate(item.product.id, 'sub')} className="cart-action-btn p-5-15">-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleUpdate(item.product.id, 'add')} className="cart-action-btn p-5-15">+</button>
                </div>
                <button 
                  onClick={() => handleUpdate(item.product.id, 'rem')} 
                  className="outline-red p-5-15 min-w-120"
                >
                  {updatingState[item.product.id] === 'rem' ? 'ELIMINANDO...' : 'ELIMINAR'}
                </button>
              </div>
            </div>
          ))}

          <div className="cart-totals-panel">
            <p className="m-0 fs-16">SUBTOTAL: {Number(cartData.totalWithoutTax || 0).toFixed(2)}€</p>
            <p className="m-0 fs-16 text-dim">IMPUESTOS (21%): {Number(cartData.totalWithTax - cartData.totalWithoutTax || 0).toFixed(2)}€</p>
            <h2 className="fs-32 m-5-0">TOTAL: {Number(cartData.totalWithTax || 0).toFixed(2)}€</h2>
            
            <div className="mt-60 flex-center justify-end gap-15">
              <Link to="/products" className="btn">SEGUIR BUSCANDO</Link>
              <Link to="/checkout" className="btn primary fs-18 p-10-20">SELLAR PACTO (CHECKOUT)</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}