import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
  const { fetchGlobalCart } = useCart()

  useEffect(() => {
    getProduct(id).then(res => setProduct(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  const handleBuy = async () => {
    try {
      await addToCart(product.id, 1)
      await fetchGlobalCart()
      addToast("Añadido", "success")
    } catch (e) { 
      const msg = e.response?.data?.message || "Error al añadir";
      addToast(msg.toUpperCase(), "error") 
    }
  }

  if (notFound) return <NotFound />
  if (loading) return <div style={{ color: 'var(--text)' }}>CARGANDO...</div>
  if (!product) return null

  return (
    <div className="page-container">
      <button 
        onClick={() => navigate('/products')} 
        className="mb-20 flex-center gap-10"
      >
        🡄 VOLVER AL CATÁLOGO
      </button>

      <div className="horror-card product-detail-grid">
        <div className="product-image-large">
          <ShimmerImage 
            src={product.image?.startsWith('http') ? product.image : `http://localhost:8000/storage/${product.image}`} 
            alt={product.title} 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          />
        </div>
        <div className="product-info-panel column">
          <h1 style={{ color: 'var(--accent)', marginBottom: '20px' }}>{product.title.toUpperCase()}</h1>
          <p style={{ lineHeight: '1.6', color: 'var(--text-dim)', marginBottom: '30px' }}>{product.description}</p>
          
          <div className="flex-center justify-between mt-auto" style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
            <h2 style={{ color: 'var(--text)', margin: 0 }}>{Number(product.price).toFixed(2)}€</h2>
            <span style={{ color: product.stock > 0 ? 'var(--text)' : 'var(--accent)', fontSize: '12px' }}>
              DISPONIBILIDAD: {product.stock > 0 ? product.stock : 'AGOTADO'}
            </span>
          </div>

          <button 
            className="primary mt-20" 
            style={{ padding: '15px' }}
            onClick={handleBuy} 
            disabled={product.stock <= 0}
          >
            {product.stock > 0 ? 'ADQUIRIR RELIQUIA' : 'FUERA DE STOCK'}
          </button>
        </div>
      </div>
    </div>
  );
}
