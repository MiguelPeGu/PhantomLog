import { useEffect, useState } from 'react'
import { addToCart } from '../api/cart'
import { useToast } from '../context/ToastContext'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useData } from '../context/DataProvider'

export default function Products() {
  const { products, loadingProducts: loading, productsPagination, refreshProducts, globalSearch, setGlobalSearch } = useData()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const { setCartCount } = useCart()
  
  const [currentPage, setCurrentPage] = useState(1)
  const [category, setCategory] = useState('ALL')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [activeFilters, setActiveFilters] = useState({ category: 'ALL', minPrice: '', maxPrice: '' })
  const [addingId, setAddingId] = useState(null)
  const [categories, setCategories] = useState(['ALL'])

  // Extraer categorías dinámicamente del backend si no están definidas
  useEffect(() => {
    if (products.length > 0) {
      const uniqueCats = ['ALL', ...new Set(products.map(p => p.category?.toUpperCase()).filter(Boolean))]
      // Solo actualizamos si las categorías son diferentes para evitar loops
      if (uniqueCats.length > categories.length) {
        setCategories(uniqueCats)
      }
    }
  }, [products, categories.length])

  const applyFilters = () => {
    setActiveFilters({ category, minPrice, maxPrice });
    setCurrentPage(1);
  };

  // Reset page to 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [globalSearch]);

  // Effect for both search and page changes
  useEffect(() => {
    // Evitar recarga redundante al montar si ya tenemos productos y estamos en estado inicial
    const isInitialDefault = globalSearch === '' && 
                            currentPage === 1 && 
                            activeFilters.category === 'ALL' && 
                            !activeFilters.minPrice && 
                            !activeFilters.maxPrice;

    if (isInitialDefault && products.length > 0) return;

    const params = { 
      search: globalSearch, 
      page: currentPage, 
      per_page: 9 
    };
    if (activeFilters.category !== 'ALL') params.category = activeFilters.category;
    if (activeFilters.minPrice) params.min_price = activeFilters.minPrice;
    if (activeFilters.maxPrice) params.max_price = activeFilters.maxPrice;

    if (globalSearch !== '') {
      const delayDebounceFn = setTimeout(() => {
        refreshProducts(params);
      }, 400);
      return () => clearTimeout(delayDebounceFn);
    } else {
      refreshProducts(params);
    }
  }, [globalSearch, currentPage, activeFilters, refreshProducts]);

  const handleBuy = async (productId) => {
    setAddingId(productId)
    try {
      const res = await addToCart(productId, 1)
      addToast("Objeto guardado en tu contenedor.", "success")
      if (res.data?.items) {
        setCartCount(res.data.items.reduce((acc, item) => acc + item.quantity, 0))
      }
    } catch (e) { 
      const msg = e.response?.data?.message || "Error al añadir.";
      addToast(msg.toUpperCase(), "error") 
    }
    finally { setAddingId(null) }
  }

  const { totalPages } = productsPagination

  return (
    <div className="page-container">
      <header className="mb-100 text-center">
        <h1>SUMINISTROS ARCANOS</h1>
        <p style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>Equipamiento vital contra la oscuridad.</p>
      </header>

      <div className="flex-center" style={{ alignItems: 'flex-start', gap: '40px' }}>
        {/* Sidebar de Filtros */}
        <aside className="horror-card" style={{ width: '250px', padding: '20px', position: 'sticky', top: '100px', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>CATEGORÍAS</h3>
          <div className="column" style={{ gap: '10px', marginBottom: '30px' }}>
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setCategory(cat)}
                className={category === cat ? 'primary' : 'outline-red'}
                style={{ textAlign: 'left', padding: '8px 12px', fontSize: '11px' }}
              >
                {cat}
              </button>
            ))}
          </div>

          <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>PRECIO</h3>
          <div className="column" style={{ gap: '15px', marginBottom: '30px' }}>
            <div className="relative flex-center" style={{ width: '100%' }}>
              <input 
                type="number" 
                placeholder="MIN" 
                value={minPrice} 
                onChange={e => setMinPrice(e.target.value)}
                style={{ padding: '10px 30px 10px 10px', fontSize: '12px', width: '100%' }}
              />
              <span style={{ position: 'absolute', right: '10px', color: 'var(--text-dim)', fontSize: '12px' }}>€</span>
            </div>
            <div className="relative flex-center" style={{ width: '100%' }}>
              <input 
                type="number" 
                placeholder="MAX" 
                value={maxPrice} 
                onChange={e => setMaxPrice(e.target.value)}
                style={{ padding: '10px 30px 10px 10px', fontSize: '12px', width: '100%' }}
              />
              <span style={{ position: 'absolute', right: '10px', color: 'var(--text-dim)', fontSize: '12px' }}>€</span>
            </div>
          </div>

          <button onClick={applyFilters} className="primary" style={{ width: '100%', padding: '12px', fontWeight: 'bold' }}>
            APLICAR FILTROS
          </button>
        </aside>

        {/* Lista de Productos */}
        <div style={{ flex: 1 }}>
          {loading && products.length === 0 ? (
            <div className="text-center" style={{ fontSize: '20px', padding: '100px', color: 'var(--text)' }}>Invocando objetos...</div>
          ) : (
            <>
              <div className="grid-3" style={{ opacity: loading ? 0.4 : 1, transition: 'opacity 0.2s' }}>
                {products.map(p => (
                  <div key={p.id} className="horror-card column" style={{ padding: '0', overflow: 'hidden' }}>
                    <div onClick={() => navigate(`/products/${p.id}`)} style={{ 
                      width: '100%', height: '200px', cursor: 'pointer', 
                      background: '#111', borderBottom: '1px solid var(--border)' 
                    }}>
                      <img 
                        src={p.image?.startsWith('http') ? p.image : `http://localhost:8000/storage/${p.image}`} 
                        alt={p.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                    <div className="column" style={{ padding: '20px', flex: 1, justifyContent: 'space-between' }}>
                      <div>
                        <h3 onClick={() => navigate(`/products/${p.id}`)} style={{ cursor: 'pointer', fontSize: '18px', margin: '0 0 10px 0' }}>{p.title.toUpperCase()}</h3>
                        <div className="flex-center" style={{ justifyContent: 'space-between', marginBottom: '15px' }}>
                          <span style={{ fontSize: '20px', color: 'var(--accent)', fontWeight: 'bold' }}>{Number(p.price).toFixed(2)}€</span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>STOCK: {p.stock}</span>
                        </div>
                      </div>
                      <button 
                        disabled={p.stock <= 0 || addingId === p.id}
                        onClick={() => handleBuy(p.id)} 
                        className="horror-card"
                        style={{ 
                          background: 'var(--card-bg)',
                          width: '100%', padding: '10px', cursor: p.stock <= 0 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {addingId === p.id ? 'AÑADIENDO...' : p.stock <= 0 ? 'SIN EXISTENCIAS' : 'ADQUIRIR'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-60 flex-center" style={{ gap: '20px' }}>
                  <button 
                    disabled={currentPage === 1} 
                    onClick={() => { setCurrentPage(p => p - 1); window.scrollTo(0,0); }}
                  >
                    🡄 ANTERIOR
                  </button>
                  <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
                    {currentPage} / {totalPages}
                  </span>
                  <button 
                    disabled={currentPage === totalPages} 
                    onClick={() => { setCurrentPage(p => p + 1); window.scrollTo(0,0); }}
                  >
                    SIGUIENTE 🡆
                  </button>
                </div>
              )}
            </>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center" style={{ border: '1px dashed var(--accent)', padding: '100px', color: 'var(--accent)' }}>
              NO SE HAN ENCONTRADO RELIQUIAS EN ESTE SECTOR DEL ARCHIVO.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
