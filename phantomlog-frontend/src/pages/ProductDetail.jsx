import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getProduct } from '../api/products'
import { addToCart } from '../api/cart'
import { useToast } from '../context/ToastContext'
import { useCart } from '../context/CartContext'

import ShimmerImage from '../components/ShimmerImage'
import NotFound from './NotFound'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const { setCartCount } = useCart()

  useEffect(() => {
    getProduct(id).then(res => setProduct(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  const handleBuy = async () => {
    if (isAdding) return
    setIsAdding(true)
    try {
      const res = await addToCart(product.id, 1)
      if (res.data?.items) {
        const total = res.data.items.reduce((acc, item) => acc + item.quantity, 0)
        setCartCount(total)
      }
      addToast("AÑADIDO AL CONTENEDOR", "success")
    } catch (e) { 
      const msg = e.response?.data?.message || "Error al añadir";
      addToast(msg.toUpperCase(), "error") 
    } finally {
      setIsAdding(false)
    }
  }

  if (notFound) return <NotFound />
  if (loading) return <div className="text-normal text-center mt-50">CARGANDO...</div>
  if (!product) return null

  return (
    <div className="page-container">
      <Link 
        to="/products" 
        className="btn mb-20 flex-center gap-10"
      >
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
    </div>
  );
}
