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
        <div className="skeleton mb-20" style={{ width: '160px', height: '36px', borderRadius: '4px' }}></div>
        <div className="horror-card product-detail-grid">
          <div className="product-image-large">
            <div className="skeleton w-100 h-100" style={{ minHeight: '400px' }}></div>
          </div>
          <div className="product-info-panel column">
            <div className="skeleton skeleton-title mb-20" style={{ width: '75%', height: '40px' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '100%' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '95%' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
            <div className="skeleton skeleton-text mb-30" style={{ width: '60%' }}></div>
            <div className="flex-center justify-between mt-auto border-top pt-20">
              <div className="skeleton" style={{ width: '100px', height: '32px' }}></div>
              <div className="skeleton" style={{ width: '120px', height: '20px' }}></div>
            </div>
            <div className="skeleton w-100 mt-20" style={{ height: '54px', borderRadius: '4px' }}></div>
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

      <div className="horror-card product-detail-grid">
        <div className="product-image-large">
          <ShimmerImage
            src={product.image?.startsWith('http') ? product.image : `http://localhost:8000/storage/${product.image}`}
            alt={product.title}
            objectFit="contain"
          />
        </div>
        <div className="product-info-panel column">
          <h1 className="text-accent mb-20">{product.title.toUpperCase()}</h1>
          <p className="lh-1-6 text-dim mb-30">{product.description}</p>

          <div className="flex-center justify-between mt-auto border-top pt-20">
            <h2 className="text-normal m-0">{Number(product.price).toFixed(2)}€</h2>
            <span className={`fs-12 ${product.stock > 0 ? 'text-normal' : 'text-accent'}`}>
              DISPONIBILIDAD: {product.stock > 0 ? product.stock : 'AGOTADO'}
            </span>
          </div>

          <button
            className={`primary mt-20 p-15 ${isAdding ? 'opacity-05' : ''}`}
            onClick={handleBuy}
            disabled={product.stock <= 0 || isAdding}
          >
            {isAdding ? 'AÑADIENDO...' : product.stock > 0 ? 'ADQUIRIR RELIQUIA' : 'FUERA DE STOCK'}
          </button>
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