import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProduct } from '../api/products'
import { addToCart } from '../api/cart'
import { useToast } from '../context/ToastContext'
import { useCart } from '../context/CartContext'

import ShimmerImage from '../components/ShimmerImage'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const { fetchGlobalCart } = useCart()

  useEffect(() => {
    getProduct(id).then(res => setProduct(res.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false))
  }, [id])

  const handleBuy = async () => {
    try {
      await addToCart(product.id, 1)
      await fetchGlobalCart()
      addToast("Añadido", "success")
    } catch (e) { addToast("Error", "error") }
  }

  if (loading) return <div style={{ color: '#0f0' }}>CARGANDO...</div>
  if (!product) return null

  return (
    <div style={{ padding: '20px', color: '#0f0' }}>
      <button 
        onClick={() => navigate('/products')} 
        style={{ 
          background: 'none', border: '1px solid #0f0', color: '#0f0', 
          padding: '10px 20px', cursor: 'pointer', marginBottom: '20px',
          display: 'flex', alignItems: 'center', gap: '10px'
        }}
      >
        🡄 VOLVER AL CATÁLOGO
      </button>
      <div style={{ border: '1px solid #060', padding: '20px', marginTop: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ width: '300px', height: '300px' }}>
          <ShimmerImage 
            src={product.image?.startsWith('http') ? product.image : `http://localhost:8000/storage/${product.image}`} 
            alt={product.title} 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          />
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ color: '#f00' }}>{product.title}</h1>
          <p>{product.description}</p>
          <h2 style={{ color: '#0f0' }}>${product.price}</h2>
          <p style={{ color: product.stock > 0 ? '#0f0' : '#f00' }}>STOCK: {product.stock}</p>
          <button onClick={handleBuy} disabled={product.stock <= 0}>COMPRAR</button>
        </div>
      </div>
    </div>
  )
}
