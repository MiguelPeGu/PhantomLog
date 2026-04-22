import { useEffect, useState } from 'react'
import { addToCart } from '../api/cart'
import { useToast } from '../context/ToastContext'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useData } from '../context/DataProvider'

export default function Products() {
  const { 
    products, 
    loadingProducts: loading, 
    productsPagination, 
    refreshProducts 
  } = useData()
  
  const { addToast } = useToast()
  const navigate = useNavigate()
  const { fetchGlobalCart, setCartCount } = useCart()
  
  const [currentPage, setCurrentPage] = useState(productsPagination.currentPage)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [addingId, setAddingId] = useState(null)

  const itemsPerPage = 9

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      refreshProducts({ 
        search: searchTerm, 
        sort: sortBy,
        page: currentPage,
        per_page: itemsPerPage 
      })
    }, 400)
    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, sortBy, currentPage, refreshProducts])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, sortBy])

  const handleBuy = async (productId, stock) => {
    if (stock <= 0) {
      addToast("Las sombras se han llevado este artefacto. (Sin stock)", "error")
      return;
    }
    setAddingId(productId)
    addToast("Invocando objeto...", "info")

    try {
      const res = await addToCart(productId, 1)
      addToast("Objeto guardado en tu contenedor (Carrito).", "info")
      if (res.data && res.data.items) {
        const totalItems = res.data.items.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(totalItems);
      }
    } catch (e) {
      console.error(e)
      addToast(e.response?.data?.message || "Error al intentar sellar el objeto en tu contenedor.", "error")
    } finally {
      setAddingId(null)
    }
  }

  const { totalPages } = productsPagination

  return (
    <div style={{ maxWidth: '100%', padding: '0 40px', color: '#c8a96e', boxSizing: 'border-box' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: "var(--sans)", fontSize: '48px', margin: '0 0 8px 0', color: '#c8a96e' }}>
          Armería Esotérica
        </h1>
        <p style={{ color: 'rgba(200, 169, 110, 0.5)', fontStyle: 'italic', letterSpacing: '0.1em' }}>
          Equipamiento vital. Porque la mente sola no basta contra la oscuridad.
        </p>
      </header>

      <div style={{
        display: 'flex', gap: '20px', marginBottom: '40px', justifyContent: 'center', flexWrap: 'wrap'
      }}>
        <input 
          type="text"
          placeholder="Buscar reliquias por voz del espíritu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            background: 'rgba(8, 4, 10, 0.85)',
            border: '1px solid rgba(200, 169, 110, 0.3)',
            color: '#c8a96e',
            padding: '12px 20px',
            fontFamily: "var(--sans)",
            fontSize: '18px',
            width: '100%',
            maxWidth: '400px',
            outline: 'none'
          }}
        />
        
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            background: 'rgba(8, 4, 10, 0.85)',
            border: '1px solid rgba(200, 169, 110, 0.3)',
            color: '#c8a96e',
            padding: '12px 20px',
            fontFamily: "var(--sans)",
            fontSize: '18px',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="latest">Ordenar por...</option>
          <option value="price_asc">Precio: Menor a Mayor</option>
          <option value="price_desc">Precio: Mayor a Menor</option>
          <option value="popular">Por Popularidad (más usados)</option>
        </select>
      </div>

      {loading && products.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Aguardando revelación...</p>
      ) : (
        <>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px'
          }}>
            {products.map(product => (
              <div key={product.id} style={{
              background: 'rgba(8, 4, 10, 0.85)',
              border: '1px solid rgba(200, 169, 110, 0.3)',
              padding: '24px',
              display: 'flex',
              gap: '30px',
              alignItems: 'flex-start',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
            }}>
              <div onClick={() => navigate(`/products/${product.id}`)} style={{ 
                width: '180px', height: '180px', cursor: 'pointer',
                border: '1px solid rgba(200, 169, 110, 0.5)',
                background: 'radial-gradient(circle, rgba(100, 100, 100, 0.2) 0%, rgba(0, 0, 0, 0.8) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,1)',
                flexShrink: 0, overflow: 'hidden'
              }}>
                {product.image ? (
                  <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '48px', color: 'rgba(200, 169, 110, 0.1)', fontFamily: "var(--sans)" }}>
                    No hay imagen disponible
                  </span>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h2 onClick={() => navigate(`/products/${product.id}`)} style={{ fontFamily: "var(--sans)", fontSize: '28px', color: '#e8c98e', margin: '0 0 8px 0', cursor: 'pointer', lineHeight: '1.2' }}>
                    {product.title}
                  </h2>
                  <span style={{ color: '#ffaa00', fontFamily: "var(--sans)", fontSize: '20px' }}>
                    ${Number(product.price).toFixed(2)}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                  <span style={{ color: 'rgba(200, 169, 110, 0.6)' }}>Proveedor: {product.provider} | Stock: {product.stock}</span>
                </div>
                <p style={{ color: '#c8a96e', fontSize: '14px', lineHeight: '1.5', margin: '0 0 16px 0' }}>
                  {product.description || "Propiedades desconocidas."}
                </p>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => navigate(`/products/${product.id}`)} style={{
                    background: 'transparent',
                    color: '#e8c98e',
                    border: '1px solid #e8c98e',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontFamily: "var(--sans)",
                    fontSize: '18px'
                  }}>
                    Inspeccionar
                  </button>
                  <button 
                    disabled={product.stock <= 0 || addingId === product.id}
                    onClick={() => handleBuy(product.id, product.stock)} style={{
                    background: product.stock <= 0 ? 'transparent' : 'transparent',
                    color: product.stock <= 0 ? '#555' : '#ffaa00',
                    border: product.stock <= 0 ? '1px solid #555' : '1px solid #ffaa00',
                    padding: '8px 16px',
                    cursor: product.stock <= 0 ? 'not-allowed' : 'pointer',
                    fontFamily: "var(--sans)",
                    fontSize: '18px'
                  }}>
                    {product.stock <= 0 
                      ? 'Sin stock' 
                      : addingId === product.id 
                        ? 'Invocando...' 
                        : 'Añadir al carrito'}
                  </button>
                </div>
              </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '60px', marginBottom: '40px' }}>
              <button 
                disabled={currentPage === 1}
                onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); window.scrollTo(0, 0); }}
                style={{
                  background: 'transparent', color: currentPage === 1 ? '#555' : '#c8a96e', border: `1px solid ${currentPage === 1 ? '#555' : '#c8a96e'}`, padding: '10px 20px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontFamily: "var(--sans)", fontSize: '20px'
                }}>
                Página Anterior
              </button>
              <span style={{ fontSize: '18px', fontFamily: "var(--sans)", color: '#ffaa00' }}>
                Página {currentPage} de {totalPages}
              </span>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); window.scrollTo(0, 0); }}
                style={{
                  background: 'transparent', color: currentPage === totalPages ? '#555' : '#c8a96e', border: `1px solid ${currentPage === totalPages ? '#555' : '#c8a96e'}`, padding: '10px 20px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontFamily: "var(--sans)", fontSize: '20px'
                }}>
                Siguiente Página
              </button>
            </div>
          )}
          {products.length === 0 && !loading && (
            <p style={{ textAlign: 'center', color: '#888' }}>El sensor EMF no capta ninguna reliquia con esos parámetros.</p>
          )}
        </>
      )}
    </div>
  )
}
