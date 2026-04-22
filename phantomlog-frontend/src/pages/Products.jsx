import { useEffect, useState } from 'react'
import { addToCart } from '../api/cart'
import { useToast } from '../context/ToastContext'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useData } from '../context/DataProvider'

export default function Products() {
  const { products, loadingProducts: loading, productsPagination, refreshProducts } = useData()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const { setCartCount } = useCart()
  
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [addingId, setAddingId] = useState(null)

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      refreshProducts({ search: searchTerm, page: currentPage, per_page: 9 })
    }, 400)
    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, currentPage, refreshProducts])

  const handleBuy = async (productId) => {
    setAddingId(productId)
    try {
      const res = await addToCart(productId, 1)
      addToast("Objeto guardado en tu contenedor.", "success")
      if (res.data?.items) {
        setCartCount(res.data.items.reduce((acc, item) => acc + item.quantity, 0))
      }
    } catch (e) { addToast("Error al añadir.", "error") }
    finally { setAddingId(null) }
  }

  const { totalPages } = productsPagination

  return (
    <div style={{ padding: '20px', color: '#0f0' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ color: '#f00', fontSize: '48px', margin: '0' }}>SUMINISTROS ARCANOS</h1>
        <p style={{ color: '#060', fontStyle: 'italic' }}>Equipamiento vital contra la oscuridad.</p>
      </header>

      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'center' }}>
        <input 
          placeholder="Buscar reliquias..." 
          value={searchTerm} 
          onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
          style={{ 
            width: '100%', maxWidth: '400px', 
            background: '#000', border: '1px solid #0f0', 
            color: '#0f0', padding: '15px', fontSize: '18px' 
          }}
        />
      </div>

      {loading && products.length === 0 ? (
        <div style={{ textAlign: 'center', fontSize: '20px' }}>Invocando objetos...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
            {products.map(p => (
              <div key={p.id} style={{ 
                background: '#000', border: '1px solid #060', 
                padding: '20px', display: 'flex', gap: '20px' 
              }}>
                <div onClick={() => navigate(`/products/${p.id}`)} style={{ 
                  width: '120px', height: '120px', cursor: 'pointer', 
                  border: '1px solid #040', background: '#111', flexShrink: 0 
                }}>
                  <img 
                    src={p.image?.startsWith('http') ? p.image : `http://localhost:8000/storage/${p.image}`} 
                    alt={p.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 onClick={() => navigate(`/products/${p.id}`)} style={{ color: '#f00', margin: '0 0 5px 0', cursor: 'pointer' }}>{p.title}</h3>
                    <p style={{ color: '#0f0', fontWeight: 'bold', margin: '0' }}>${p.price}</p>
                    <p style={{ fontSize: '10px', color: '#040', margin: '5px 0' }}>STOCK: {p.stock}</p>
                  </div>
                  <button 
                    disabled={p.stock <= 0 || addingId === p.id}
                    onClick={() => handleBuy(p.id)} 
                    style={{ 
                      background: 'none', border: '1px solid #0f0', 
                      color: '#0f0', cursor: 'pointer', padding: '5px' 
                    }}
                  >
                    {addingId === p.id ? 'AÑADIENDO...' : p.stock <= 0 ? 'SIN STOCK' : 'ADQUIRIR'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
              <button 
                disabled={currentPage === 1} 
                onClick={() => { setCurrentPage(p => p - 1); window.scrollTo(0,0); }}
                style={{ background: 'none', border: '1px solid #0f0', color: '#0f0', padding: '10px 20px', cursor: 'pointer' }}
              >
                🡄 ANTERIOR
              </button>
              <span style={{ color: '#f00', fontWeight: 'bold', fontSize: '18px' }}>
                PÁGINA {currentPage} DE {totalPages}
              </span>
              <button 
                disabled={currentPage === totalPages} 
                onClick={() => { setCurrentPage(p => p + 1); window.scrollTo(0,0); }}
                style={{ background: 'none', border: '1px solid #0f0', color: '#0f0', padding: '10px 20px', cursor: 'pointer' }}
              >
                SIGUIENTE 🡆
              </button>
            </div>
          )}
        </>
      )}

      {!loading && products.length === 0 && (
        <div style={{ textAlign: 'center', border: '1px dashed #f00', padding: '40px', color: '#f00' }}>
          NO SE HAN ENCONTRADO RELIQUIAS EN LA BASE DE DATOS.
        </div>
      )}
    </div>
  )
}
