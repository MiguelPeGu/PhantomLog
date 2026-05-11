import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProduct, getRelatedProducts } from '../api/products'
import { addToCart } from '../api/cart'
import { useToast } from '../context/ToastContext'
import { useCart } from '../context/CartContext'

import ShimmerImage from '../components/ShimmerImage'
import NotFound from './NotFound'

const RelatedSkeleton = () => (
  <div className="horror-card column p-0 overflow-hidden" style={{ minWidth: 0 }}>
    <div className="skeleton" style={{ width: '100%', height: '180px' }}></div>
    <div className="card-padding">
      <div className="skeleton skeleton-title" style={{ width: '80%' }}></div>
      <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
      <div className="skeleton skeleton-text" style={{ width: '100%', height: '36px', marginTop: '12px' }}></div>
    </div>
  </div>
)

export default function ProductDetail() {
  const { id } = useParams()
  const { addToast } = useToast()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loadingRelated, setLoadingRelated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [addingRelatedId, setAddingRelatedId] = useState(null)
  const { setCartCount } = useCart()

  useEffect(() => {
    setLoading(true)
    setProduct(null)
    setRelated([])
    setNotFound(false)

    getProduct(id)
      .then(res => {
        setProduct(res.data)
        setLoadingRelated(true)
        getRelatedProducts(id)
          .then(r => setRelated(r.data))
          .catch(() => setRelated([]))
          .finally(() => setLoadingRelated(false))
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  const handleBuy = async () => {
    if (isAdding) return
    setIsAdding(true)
    try {
      const res = await addToCart(product.id, 1)
      if (res.data?.items) {
        setCartCount(res.data.items.reduce((acc, item) => acc + item.quantity, 0))
      }
      addToast("AÑADIDO AL CONTENEDOR", "success")
    } catch (e) {
      const msg = e.response?.data?.message || "Error al añadir"
      addToast(msg.toUpperCase(), "error")
    } finally {
      setIsAdding(false)
    }
  }

  const handleBuyRelated = async (productId) => {
    setAddingRelatedId(productId)
    try {
      const res = await addToCart(productId, 1)
      if (res.data?.items) {
        setCartCount(res.data.items.reduce((acc, item) => acc + item.quantity, 0))
      }
      addToast("AÑADIDO AL CONTENEDOR", "success")
    } catch (e) {
      const msg = e.response?.data?.message || "Error al añadir"
      addToast(msg.toUpperCase(), "error")
    } finally {
      setAddingRelatedId(null)
    }
  }

  if (notFound) return <NotFound />

  if (loading) {
    return (
      <div className="page-container">
        <div className="max-900 mx-auto">
          <div className="skeleton mb-20" style={{ width: '160px', height: '36px', borderRadius: '4px' }}></div>
          <div className="horror-card product-detail-card p-0 overflow-hidden">
            <div className="product-detail-grid">
              <div className="product-image-large">
                <div className="skeleton w-100 h-100" style={{ minHeight: '450px' }}></div>
              </div>
              <div className="product-info-panel column p-40">
                <div className="pl-40">
                  <div className="skeleton skeleton-title mb-20" style={{ width: '30%', height: '20px' }}></div>
                  <div className="skeleton skeleton-title mb-40" style={{ width: '80%', height: '50px' }}></div>
                </div>
                
                <div className="column gap-20 mb-40 flex-1">
                  <div className="skeleton skeleton-text" style={{ width: '100%' }}></div>
                  <div className="skeleton skeleton-text" style={{ width: '95%' }}></div>
                  <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
                  
                  <div className="grid-2 gap-20 mt-20">
                    <div className="skeleton" style={{ height: '60px' }}></div>
                    <div className="skeleton" style={{ height: '60px' }}></div>
                  </div>
                </div>

                <div className="flex-center justify-between border-top pt-30">
                  <div className="column">
                    <div className="skeleton mb-5" style={{ width: '80px', height: '15px' }}></div>
                    <div className="skeleton" style={{ width: '120px', height: '40px' }}></div>
                  </div>
                  <div className="skeleton" style={{ width: '200px', height: '54px', borderRadius: '4px' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="page-container">
      <Link to="/products" className="btn mb-20 flex-center gap-10">
        🡄 VOLVER AL CATÁLOGO
      </Link>

      <div className="max-900 mx-auto">
        <div className="horror-card product-detail-card p-0 overflow-hidden">
          <div className="product-detail-grid">
            <div className="product-image-large">
              <ShimmerImage
                src={product.image?.startsWith('http') ? product.image : `http://localhost:8000/storage/${product.image}`}
                alt={product.title}
                objectFit="cover"
              />
            </div>
            <div className="product-info-panel column p-40">
              <div className="mb-40 pl-40">
                <span className="status-badge active fs-10 ls-2 mb-15 inline-block">{product.category?.toUpperCase() || 'RELIQUIA'}</span>
                <h1 className="text-accent fs-42 m-0 ls-2">{product.title.toUpperCase()}</h1>
              </div>

              <div className="column gap-20 mb-40 flex-1">
                <div className="border-accent-left-3 pl-40">
                  <h4 className="fs-11 text-muted ls-2 mb-10">DESCRIPCIÓN DEL ARTEFACTO</h4>
                  <p className="lh-1-8 text-dim fs-15 m-0">{product.description}</p>
                </div>

                <div className="grid-2 gap-20 mt-20">
                  <div className="stat-box">
                    <h4 className="fs-10 text-muted ls-1 mb-5">ESTADO FISCAL</h4>
                    <div className="fs-14 bold text-normal">CONSAGRADO (+{product.tax}%)</div>
                  </div>
                  <div className="stat-box">
                    <h4 className="fs-10 text-muted ls-1 mb-5">DISPONIBILIDAD</h4>
                    <div className={`fs-14 bold ${product.stock > 0 ? 'text-normal' : 'text-accent'}`}>
                      {product.stock > 0 ? `${product.stock} UNIDADES` : 'AGOTADO'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-top pt-30 flex-between align-center">
                <div className="column">
                  <span className="fs-11 text-muted ls-2 mb-5">PRECIO TOTAL</span>
                  <h2 className="text-normal m-0 fs-32">{Number(product.price).toFixed(2)}€</h2>
                </div>
                
                <button
                  className={`primary p-15-40 ${isAdding ? 'opacity-05' : ''}`}
                  style={{ minWidth: '200px' }}
                  onClick={handleBuy}
                  disabled={product.stock <= 0 || isAdding}
                >
                  {isAdding ? 'SINCRONIZANDO...' : product.stock > 0 ? 'ADQUIRIR' : 'SIN STOCK'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {(loadingRelated || related.length > 0) && (
        <section style={{ marginTop: '60px' }}>
          <h2 className="fs-24 ls-3 border-bottom pb-15 mb-40">OBJETOS QUE TE PODRÍAN INTERESAR</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '20px'
          }}>
            {loadingRelated
              ? [...Array(5)].map((_, i) => <RelatedSkeleton key={i} />)
              : related.map(p => (
                <div key={p.id} className="horror-card column p-0 overflow-hidden" style={{ minWidth: 0 }}>
                  <Link to={`/products/${p.id}`} className="block no-underline" style={{ height: '180px', overflow: 'hidden' }}>
                    <ShimmerImage
                      src={p.image?.startsWith('http') ? p.image : `http://localhost:8000/storage/${p.image}`}
                      alt={p.title}
                      objectFit="cover"
                    />
                  </Link>
                  <div className="column flex-1 justify-between card-padding">
                    <div>
                      <Link to={`/products/${p.id}`} className="no-underline block mb-10">
                        <h3 className="pointer fs-14 m-0 text-normal hover-accent line-clamp-2">{p.title.toUpperCase()}</h3>
                      </Link>
                      <div className="flex-center justify-between mb-10">
                        <span className="fs-18 text-accent bold">{Number(p.price).toFixed(2)}€</span>
                        <span className="fs-10 text-muted">STOCK: {p.stock}</span>
                      </div>
                    </div>
                    <button
                      disabled={p.stock <= 0 || addingRelatedId === p.id}
                      onClick={() => handleBuyRelated(p.id)}
                      className={`horror-card w-100 p-8 fs-11 ${p.stock <= 0 ? 'opacity-02' : 'pointer'}`}
                    >
                      {addingRelatedId === p.id ? 'AÑADIENDO...' : p.stock <= 0 ? 'SIN STOCK' : 'ADQUIRIR'}
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        </section>
      )}
    </div>
  )
}