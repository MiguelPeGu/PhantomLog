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
  
  const { user } = useAuth()
  const { showToast } = useToast()

  useEffect(() => {
    fetchForums()
  }, [])

  const fetchForums = async () => {
    try {
      const res = await getForums()
      setForums(res.data)
    } catch (error) {
      console.error(error)
      showToast('Error al cargar los foros', 'error')
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
      showToast('Foro creado exitosamente', 'success')
      
      const base64Image = await fileToBase64(formData.image)
      const payload = {
        title: formData.title,
        description: formData.description,
        image: base64Image
      }

      await createForum(payload)
      fetchForums() // Sync con backend real
    } catch (error) {
      console.error(error)
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message
      const errorDetails = JSON.stringify(error.response?.data?.errors || {})
      showToast(`Error: ${errorMsg} ${errorDetails}`, 'error')
      fetchForums() // Revert changes si falla
    }
  }

  const normalizeText = (text) => text ? text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : ''

  const filteredForums = forums.filter(f => normalizeText(f.title).includes(normalizeText(search)))

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
        {filteredForums.map(forum => {
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