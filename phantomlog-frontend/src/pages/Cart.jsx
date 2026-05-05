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

    // Pedir confirmación ANTES del update optimista si la intención es borrar
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

    setUpdatingState(prev => ({ ...prev, [productId]: intent })); //explicame esto porque no entiendo prev

    // Optimistic Update
    setCartData(prev => {
      if (!prev) return prev;
      const newItems = prev.items.map(item => {
        if (item.product.id === productId) {
          if (intent === 'add') return { ...item, quantity: item.quantity + 1 };
          if (intent === 'sub') return { ...item, quantity: Math.max(0, item.quantity - 1) }; // por que es max y no min
        }
        return item;
      }).filter(item => item.quantity > 0); //sigo sin entender que hace y para que sirve prev

      if (intent === 'rem') {
        return { ...prev, items: prev.items.filter(item => item.product.id !== productId) };
      }
      return { ...prev, items: newItems };// explicame prev
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

  if (loading) return <div className="mt-50 text-normal text-center">INSPECCIONANDO EL VACÍO...</div>

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
