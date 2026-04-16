import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getForums, createForum } from '../api/forums'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Forums() {
  const [forums, setForums] = useState([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '', image: null })
  
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 9

  const { user } = useAuth()
  const { addToast } = useToast()

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchForums(currentPage)
    }, 400)
    return () => clearTimeout(delayDebounceFn)
  }, [search, currentPage])

  // Reiniciar página cuando se busca
  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const fetchForums = async (page = 1) => {
    setLoading(true)
    try {
      const res = await getForums({
        search: search,
        page: page,
        per_page: itemsPerPage
      })
      // Laravel paginate devuelve { data: [...], last_page: X }
      setForums(res.data.data || [])
      setTotalPages(res.data.last_page || 1)
    } catch (error) {
      console.error(error)
      addToast('Error al cargar los foros', 'error')
    } finally {
      setLoading(false)
    }
  }

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })

  const handleCreateForum = async (e) => {
    e.preventDefault()
    if (!formData.image) {
      showToast('La imagen es obligatoria', 'error')
      return
    }

    try {
      // Optimistic Update URL locally
      const objectUrl = URL.createObjectURL(formData.image)
      const optimisticForum = {
        id: `temp-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        image: objectUrl,
        user: user,
        reports_count: 0,
        createdAt: new Date().toISOString()
      }

      setForums([optimisticForum, ...forums])
      setShowModal(false)
      setFormData({ title: '', description: '', image: null })
      addToast('Foro creado exitosamente', 'success')
      
      const base64Image = await fileToBase64(formData.image)
      const payload = {
        title: formData.title,
        description: formData.description,
        image: base64Image
      }

      await createForum(payload)
      fetchForums(1) // Sync con backend real
    } catch (error) {
      console.error(error)
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message
      addToast(`Error: ${errorMsg}`, 'error')
      fetchForums(currentPage) // Revert changes si falla
    }
  }

  // No necesitamos filtrar en cliente ya que lo hace el servidor
  const displayForums = forums

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
      <header style={{ marginBottom: '32px', borderBottom: '1px solid rgba(200, 169, 110, 0.2)', paddingBottom: '16px' }}>
        <h1 style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: '42px', margin: '0 0 8px 0', textShadow: '0 0 20px rgba(200, 169, 110, 0.3)' }}>Foros de Investigación</h1>
        <p style={{ fontStyle: 'italic', color: 'rgba(200, 169, 110, 0.5)', margin: 0 }}>Visualizando casos e incidentes paranormales...</p>
      </header>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <input 
          type="text" 
          placeholder="Buscar foro..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: 'rgba(8, 4, 10, 0.8)',
            border: '1px solid rgba(200, 169, 110, 0.3)',
            color: '#c8a96e',
            padding: '10px 16px',
            fontFamily: "'IM Fell English', serif",
            width: '300px',
            outline: 'none',
          }}
        />
        {user && (
          <button style={{
            background: 'rgba(180, 50, 40, 0.1)',
            border: '1px solid rgba(180, 50, 40, 0.5)',
            color: '#f0d090',
            padding: '10px 24px',
            fontFamily: "'IM Fell English', serif",
            cursor: 'crosshair',
            transition: 'all 0.3s'
          }}
          onClick={() => setShowModal(true)}
          onMouseOver={e => e.target.style.background = 'rgba(180, 50, 40, 0.3)'}
          onMouseOut={e => e.target.style.background = 'rgba(180, 50, 40, 0.1)'}>
            Crear Foro
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#c8a96e', margin: '40px 0' }}>Sintonizando frecuencias de red...</p>
        ) : (
          <>
            {displayForums.map(forum => {
              const isTemp = String(forum.id).includes('temp');
              const cardContent = (
                <div style={{
                  background: 'rgba(15, 8, 18, 0.65)',
                  border: '1px solid rgba(200, 169, 110, 0.15)',
                  padding: '20px',
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'center',
                  transition: 'all 0.4s',
                  opacity: isTemp ? 0.6 : 1,
                  filter: isTemp ? 'grayscale(0.5)' : 'none',
                  cursor: isTemp ? 'progress' : 'pointer',
                }}
                onMouseOver={e => {
                  if (isTemp) return;
                  e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.6)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(200, 169, 110, 0.05)';
                }}
                onMouseOut={e => {
                  if (isTemp) return;
                  e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  {forum.image && (
                    <img 
                      src={forum.image.startsWith('blob:') || forum.image.startsWith('http') ? forum.image : `http://localhost:8000/storage/${forum.image}`} 
                      alt={forum.title}
                      style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(200, 169, 110, 0.3)' }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#e8c98e' }}>{forum.title} {isTemp && <span style={{fontSize: '12px', fontStyle: 'italic', color: '#ff4d4d'}}>(Creando...)</span>}</h3>
                    <div style={{ fontSize: '13px', color: '#e0cfa5', marginBottom: '8px' }}>
                      {forum.description.substring(0, 100)}...
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(200, 169, 110, 0.5)', fontStyle: 'italic', display: 'flex', gap: '16px' }}>
                      <span>Creado por: <strong style={{ color: 'rgba(200, 169, 110, 0.8)' }}>{forum.user?.username || 'Gnomo'}</strong></span>
                      <span>Reportes: {forum.reports_count || 0}</span>
                    </div>
                  </div>
                </div>
              );

              return isTemp ? (
                <div key={forum.id} style={{ pointerEvents: 'none' }}>
                  {cardContent}
                </div>
              ) : (
                <Link key={forum.id} to={`/forums/${forum.id}`} style={{ textDecoration: 'none' }}>
                  {cardContent}
                </Link>
              )
            })}
            
            {/* Controles de Paginación */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '40px', marginBottom: '20px' }}>
                <button 
                  disabled={currentPage === 1}
                  onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); window.scrollTo(0, 0); }}
                  style={{
                    background: 'transparent', color: currentPage === 1 ? '#555' : '#c8a96e', border: `1px solid ${currentPage === 1 ? '#555' : '#c8a96e'}`, padding: '8px 16px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontFamily: "'IM Fell English', serif", fontSize: '18px'
                  }}>
                  Anterior
                </button>
                <span style={{ fontSize: '16px', fontFamily: "'IM Fell English', serif", color: '#ffaa00' }}>
                  Página {currentPage} de {totalPages}
                </span>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); window.scrollTo(0, 0); }}
                  style={{
                    background: 'transparent', color: currentPage === totalPages ? '#555' : '#c8a96e', border: `1px solid ${currentPage === totalPages ? '#555' : '#c8a96e'}`, padding: '8px 16px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontFamily: "'IM Fell English', serif", fontSize: '18px'
                  }}>
                  Siguiente
                </button>
              </div>
            )}
            {displayForums.length === 0 && (
              <p style={{ textAlign: 'center', color: '#c8a96e55', marginTop: '40px' }}>No hay ecos registrados en esta frecuencia.</p>
            )}
          </>
        )}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <form onSubmit={handleCreateForum} style={{
            background: 'rgba(15, 8, 18, 0.95)', border: '1px solid rgba(200, 169, 110, 0.3)', padding: '32px', width: '400px', display: 'flex', flexDirection: 'column', gap: '16px'
          }}>
            <h2 style={{ fontFamily: "'UnifrakturMaguntia', serif", color: '#c8a96e', margin: '0 0 16px 0' }}>Nuevo Foro</h2>
            
            <input 
              required placeholder="Título" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              style={{ background: 'rgba(5, 3, 5, 0.8)', border: '1px solid rgba(200, 169, 110, 0.3)', color: '#c8a96e', padding: '10px' }}
            />
            <textarea 
              required placeholder="Descripción" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
              style={{ background: 'rgba(5, 3, 5, 0.8)', border: '1px solid rgba(200, 169, 110, 0.3)', color: '#c8a96e', padding: '10px', height: '100px', resize: 'vertical' }}
            />
            
            <label style={{ color: '#c8a96e', fontSize: '14px' }}>Imagen (Obligatoria)</label>
            <input 
              type="file" required accept="image/*" onChange={e => setFormData({...formData, image: e.target.files[0]})}
              style={{ color: '#c8a96e' }}
            />

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button type="submit" style={{ flex: 1, background: 'rgba(180, 50, 40, 0.2)', color: '#f0d090', border: '1px solid rgba(180, 50, 40, 0.5)', padding: '10px' }}>Crear Foro</button>
              <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, background: 'transparent', color: 'rgba(200,169,110,0.6)', border: '1px solid rgba(200,169,110,0.3)', padding: '10px' }}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}