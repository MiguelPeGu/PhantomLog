import { useEffect, useState } from 'react'
import { addToCart } from '../api/cart'
import { useToast } from '../context/ToastContext'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useData } from '../context/DataProvider'
import ShimmerImage from '../components/ShimmerImage'

const ProductSkeleton = () => (
  <div className="horror-card column p-0 overflow-hidden">
    <div className="skeleton" style={{ width: '100%', height: '250px' }}></div>
    <div className="card-padding">
      <div className="skeleton skeleton-title" style={{ width: '80%' }}></div>
      <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
      <div className="skeleton skeleton-text" style={{ width: '100%', height: '40px', marginTop: '20px' }}></div>
    </div>
  </div>
)

export default function Products() {
  const {
    products,
    loadingProducts: loading,
    productsPagination,
    refreshProducts,
    globalSearch,
    setGlobalSearch,
    productCategories: categories
  } = useData()
  const { addToast } = useToast()
  const { setCartCount } = useCart()

  const [currentPage, setCurrentPage] = useState(1)
  const [category, setCategory] = useState('ALL')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('newest')
  const [activeFilters, setActiveFilters] = useState({ category: 'ALL', minPrice: '', maxPrice: '', sort: 'newest' })
  const [addingId, setAddingId] = useState(null)
  const [fading, setFading] = useState(false)

  const applyFilters = () => {
    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      addToast("EL PRECIO MÍNIMO NO PUEDE SER MAYOR AL MÁXIMO", "error")
      return
    }
    setActiveFilters({ category, minPrice, maxPrice, sort })
    setCurrentPage(1)
  }

  const resetFilters = () => {
    setCategory('ALL')
    setMinPrice('')
    setMaxPrice('')
    setSort('newest')
    setActiveFilters({ category: 'ALL', minPrice: '', maxPrice: '', sort: 'newest' })
    setGlobalSearch('')
    setCurrentPage(1)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [globalSearch])

  useEffect(() => {
    const params = {
      search: globalSearch,
      page: currentPage,
      per_page: 9,
      sort: activeFilters.sort
    }
    if (activeFilters.category !== 'ALL') params.category = activeFilters.category
    if (activeFilters.minPrice) params.min_price = activeFilters.minPrice
    if (activeFilters.maxPrice) params.max_price = activeFilters.maxPrice

    const handler = setTimeout(() => {
      refreshProducts(params)
    }, globalSearch ? 400 : 0)

    return () => clearTimeout(handler)
  }, [globalSearch, currentPage, activeFilters, refreshProducts])

  useEffect(() => {
    if (!loading) {
      setFading(false)
    }
  }, [loading])

  const handlePageChange = (newPage) => {
    setFading(true)
    setCurrentPage(newPage)
    window.scrollTo(0, 0)
  }

  const handleBuy = async (productId) => {
    setAddingId(productId)
    try {
      const res = await addToCart(productId, 1)
      addToast("Objeto guardado en tu contenedor.", "success")
      if (res.data?.items) {
        setCartCount(res.data.items.reduce((acc, item) => acc + item.quantity, 0))
      }
    } catch (e) {
      const msg = e.response?.data?.message || "Error al añadir."
      addToast(msg.toUpperCase(), "error")
    } finally {
      setAddingId(null)
    }
  }

  const { totalPages } = productsPagination

  return (
    <div className="page-container">
      <header className="mb-100 text-center">
        <h1>SUMINISTROS ARCANOS</h1>
        <p className="text-dim italic">EQUIPAMIENTO VITAL CONTRA LA OSCURIDAD.</p>
      </header>

      <div className="max-1200">
        <div className="flex-center align-start gap-40">
          {/* Sidebar de Filtros */}
          <aside className="horror-card sticky-sidebar max-250 p-20">
            <h3 className="mb-20 border-bottom pb-10">ORDENAR POR</h3>
            <div className="column gap-10 mb-50">
              {[
                { id: 'newest', label: 'NOVEDADES' },
                { id: 'popular', label: 'MÁS VENDIDOS' },
                { id: 'price_asc', label: 'MENOR PRECIO' },
                { id: 'price_desc', label: 'MAYOR PRECIO' }
              ].map(sortOption => (
                <button
                  key={sortOption.id}
                  onClick={() => setSort(sortOption.id)}
                  className={`${sort === sortOption.id ? 'primary' : 'outline-red'} text-left fs-11 p-8-12`}
                >
                  {sortOption.label}
                </button>
              ))}
            </div>

            <h3 className="mb-20 mt-40 border-bottom pb-10">CATEGORÍAS</h3>
            <div className="column gap-10 mb-50">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`${category === cat ? 'primary' : 'outline-red'} text-left fs-11 p-8-12`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <h3 className="mb-20 mt-40 border-bottom pb-10">PRECIO</h3>
            <div className="column gap-15 mb-50">
              <div className="form-group">
                <label className="form-label fs-9 mb-5">PRECIO MÍNIMO</label>
                <div className="price-input-wrapper">
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="w-100 fs-12 p-10-30-10-10"
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                  />
                  <span className="price-symbol">€</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label fs-9 mb-5">PRECIO MÁXIMO</label>
                <div className="price-input-wrapper">
                  <input
                    type="number"
                    min="0"
                    placeholder="999"
                    className="w-100 fs-12 p-10-30-10-10"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                  />
                  <span className="price-symbol">€</span>
                </div>
              </div>
            </div>

            <button onClick={applyFilters} className="primary w-100 bold p-12 mt-20">
              APLICAR FILTROS
            </button>

            <button
              onClick={resetFilters}
              className="outline w-100 mt-20 fs-10 ls-2 p-10"
            >
              RESETEAR FILTROS
            </button>
          </aside>

          {/* Lista de Productos */}
          <div className="flex-1">
            <div className={`grid-catalog mb-60 loading-fade${fading ? ' is-loading' : ''}`}>
              {loading && products.length === 0 ? (
                [...Array(6)].map((_, i) => <ProductSkeleton key={i} />)
              ) : products.length === 0 ? (
                <div className="text-center fs-24 p-100 italic" style={{ gridColumn: '1/-1' }}>No se han detectado objetos con ese patrón.</div>
              ) : (
                products.map(p => (
                  <div key={p.id} className="horror-card product-catalog-card column p-0 overflow-hidden">
                    <Link to={`/products/${p.id}`} className="product-img-container block no-underline relative">
                      <ShimmerImage
                        src={p.image?.startsWith('http') ? p.image : `http://localhost:8000/storage/${p.image}`}
                        alt={p.title}
                        objectFit="cover"
                      />
                      {p.category && (
                        <div className="absolute-br" style={{ bottom: '15px', right: '15px' }}>
                          <span className="status-badge active fs-9 ls-1">{p.category.toUpperCase()}</span>
                        </div>
                      )}
                    </Link>
                    <div className="column flex-1 justify-between card-padding" style={{ padding: '25px' }}>
                      <div className="mb-20">
                        <Link to={`/products/${p.id}`} className="no-underline block mb-15">
                          <h3 className="pointer fs-20 m-0 text-normal hover-accent ls-1" style={{ minHeight: '48px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {p.title.toUpperCase()}
                          </h3>
                        </Link>
                        <div className="flex align-center justify-between">
                          <div className="column">
                            <span className="fs-10 text-muted ls-2 mb-5">PRECIO CONSAGRADO</span>
                            <span className="fs-28 text-accent bold">{Number(p.price).toFixed(2)}€</span>
                          </div>
                          <div className="text-right">
                             <div className="fs-10 text-muted mb-5">DISPONIBILIDAD</div>
                             <div className={`fs-14 bold ${p.stock > 10 ? 'text-normal' : 'text-accent'}`}>{p.stock} UNID.</div>
                          </div>
                        </div>
                      </div>
                      <button
                        disabled={p.stock <= 0 || addingId === p.id}
                        onClick={() => handleBuy(p.id)}
                        className={`btn primary w-100 p-12 ${p.stock <= 0 ? 'opacity-05' : ''}`}
                        style={{ borderRadius: '0', border: '1px solid var(--accent)' }}
                      >
                        {addingId === p.id ? 'VINCULANDO...' : p.stock <= 0 ? 'EXISTENCIAS AGOTADAS' : 'AÑADIR AL CONTENEDOR'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {totalPages > 1 && (
              <div className="pagination-controls">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  🡄 ANTERIOR
                </button>
                <span className="bold fs-18">
                  {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  SIGUIENTE 🡆
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}