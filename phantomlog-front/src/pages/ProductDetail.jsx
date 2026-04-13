import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProduct } from '../api/products'
import { addToCart } from '../api/cart'
import { useToast } from '../context/ToastContext'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  
  const { fetchGlobalCart } = useCart()

  useEffect(() => {
    getProduct(id)
      .then(res => setProduct(res.data))
      .catch(err => {
        console.error(err)
        addToast("El oráculo no pudo encontrar este artefacto.", "error")
        navigate('/products')
      })
      .finally(() => setLoading(false))
  }, [id, navigate, addToast])

  const handleBuy = async () => {
    if (product.stock <= 0) {
      addToast("Las sombras se han llevado este artefacto. (Sin stock)", "error")
      return;
    }
    setAdding(true)
    try {
      await addToCart(product.id, 1)
      await fetchGlobalCart()
      addToast("Objeto guardado en tu contenedor (Carrito).", "info")
    } catch (e) {
      console.error(e)
      addToast(e.response?.data?.message || "Error al intentar sellar el objeto en tu contenedor.", "error")
    } finally {
      setAdding(false)
    }
  }

  if (loading) return <p style={{ textAlign: 'center', color: '#c8a96e', marginTop: '50px' }}>Invocando visión detallada...</p>
  if (!product) return null

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', color: '#c8a96e', fontFamily: "'IM Fell English', serif" }}>
      
      <button onClick={() => navigate('/products')} style={{
        background: 'transparent',
        color: '#ffaa00',
        border: 'none',
        padding: '0',
        cursor: 'pointer',
        fontFamily: "'IM Fell English', serif",
        fontSize: '18px',
        marginBottom: '20px',
        textDecoration: 'underline'
      }}>
        ← Retornar al Catálogo de Artefactos
      </button>

      <div style={{
        display: 'flex', gap: '50px', background: 'rgba(8, 4, 10, 0.85)',
        border: '1px solid rgba(200, 169, 110, 0.3)', padding: '40px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.8)', flexWrap: 'wrap'
      }}>
        
        {/* Columna Izquierda: Galería Central */}
        <div style={{
          flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'stretch'
        }}>
          <div style={{ 
            width: '100%', minHeight: '500px',
            border: '2px solid rgba(200, 169, 110, 0.5)',
            background: 'radial-gradient(circle, rgba(100, 100, 100, 0.2) 0%, rgba(0, 0, 0, 0.9) 100%)',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {product.image ? (
              <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: '100px', color: 'rgba(200, 169, 110, 0.1)' }}>
                ⚜
              </span>
            )}
          </div>
        </div>

        {/* Columna Derecha: Información Principal y Buy Box aglomerado */}
        <div style={{ flex: '1.2', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div>
            <h1 style={{ fontSize: '42px', color: '#e8c98e', margin: '0 0 10px 0', lineHeight: '1.2' }}>
              {product.title}
            </h1>
            
            <div style={{ 
              display: 'flex', gap: '20px', fontSize: '14px', textTransform: 'uppercase', 
              letterSpacing: '0.05em', color: 'rgba(200, 169, 110, 0.6)', borderBottom: '1px solid rgba(200, 169, 110, 0.2)',
              paddingBottom: '15px', marginBottom: '20px'
            }}>
              <span><strong>SKU:</strong> {product.sku}</span>
              <span><strong>Providencia:</strong> {product.provider}</span>
            </div>

            <div style={{ fontSize: '20px', lineHeight: '1.6', color: '#d3c1a3', whiteSpace: 'pre-line' }}>
              <p style={{ margin: '0 0 20px 0' }}>{product.description || "Las sombras ocultan las propiedades de este objeto sagrado."}</p>
            </div>
          </div>

          {/* Caja de Compra (Buy Box estilo e-commerce) inferior derecha */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.6)', border: '1px solid #c8a96e',
            padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px'
          }}>
            
            <div style={{ fontSize: '16px', color: '#c8a96e' }}>
              <div>Precio Base del Artefacto:</div>
              <div style={{ fontSize: '48px', color: '#ffaa00', margin: '5px 0' }}>
                ${Number(product.price).toFixed(2)}
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(200, 169, 110, 0.6)' }}>
                (Total con impuesto ritual: ${(product.price * (1 + (product.tax / 100))).toFixed(2)})
              </div>
            </div>

            <div style={{ color: product.stock > 0 ? '#28a745' : '#ff4444', fontSize: '20px', fontWeight: 'bold' }}>
              {product.stock > 0 ? `En Existencia (${product.stock} disponibles)` : 'Sin Unidades Físicas (Agotado)'}
            </div>

            <p style={{ fontSize: '14px', margin: 0, color: 'rgba(200, 169, 110, 0.7)', lineHeight: '1.5' }}>
               Vendido por <strong>PhantomLog Corp.</strong><br/>
               Custodiado por <strong>El Gremio de Caza</strong><br/>
               Envío Astral Disponible a través de los velos.
            </p>

            <button 
              onClick={handleBuy} 
              style={{
                background: 'transparent',
                color: '#ffaa00',
                border: '1px solid #ffaa00',
                padding: '15px 20px',
                cursor: 'pointer',
                fontFamily: "'IM Fell English', serif",
                fontSize: '20px',
                fontWeight: 'bold',
                transition: 'background 0.3s'
            }}>
              {adding ? 'Invocando...' : 'Añadir al carrito'}
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}
