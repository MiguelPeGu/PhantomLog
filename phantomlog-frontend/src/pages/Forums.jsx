import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { createForum } from '../api/forums'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useData } from '../context/DataProvider'

export default function Forums() {
  const { 
    forums, 
    loadingForums: loading, 
    forumsPagination, 
    refreshForums 
  } = useData()
  
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '', image: null })
  
  const [currentPage, setCurrentPage] = useState(forumsPagination.currentPage)
  const itemsPerPage = 9

  const { user } = useAuth()
  const { addToast } = useToast()

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      refreshForums({
        search: search,
        page: currentPage,
        per_page: itemsPerPage
      })
    }, 400)
    return () => clearTimeout(delayDebounceFn)
  }, [search, currentPage, refreshForums])

  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })

  const handleCreateForum = async (e) => {
    e.preventDefault()
    if (!formData.image) {
      addToast('La imagen es obligatoria', 'error')
      return
    }

    try {
      const objectUrl = URL.createObjectURL(formData.image)
      
      setShowModal(false)
      addToast('Registrando expediente...', 'info')
      
      const base64Image = await fileToBase64(formData.image)
      const payload = {
        title: formData.title,
        description: formData.description,
        image: base64Image
      }

      await createForum(payload)
      addToast('Foro creado exitosamente', 'success')
      setFormData({ title: '', description: '', image: null })
      refreshForums({ page: 1, per_page: itemsPerPage })
    } catch (error) {
      console.error(error)
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message
      addToast(`Error: ${errorMsg}`, 'error')
    }
  }

  const { totalPages } = forumsPagination

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
        {loading && forums.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#c8a96e', margin: '40px 0' }}>Sintonizando frecuencias de red...</p>
        ) : (
          <>
            {forums.map(forum => (
              <Link key={forum.id} to={`/forums/${forum.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'rgba(15, 8, 18, 0.65)',
                  border: '1px solid rgba(200, 169, 110, 0.15)',
                  padding: '20px',
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'center',
                  transition: 'all 0.4s',
                  cursor: 'pointer',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.6)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(200, 169, 110, 0.05)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  {forum.image && (
                    <img 
                      src={
                        forum.image.startsWith('blob:') || forum.image.startsWith('http') 
                          ? forum.image 
                          : forum.image.startsWith('images/') 
                            ? `http://localhost:8000/${forum.image}` 
                            : `http://localhost:8000/storage/${forum.image}`
                      } 
                      alt={forum.title}
                      style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(200, 169, 110, 0.3)' }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#e8c98e' }}>{forum.title}</h3>
                    <div style={{ fontSize: '13px', color: '#e0cfa5', marginBottom: '8px' }}>
                      {forum.description.substring(0, 100)}...
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(200, 169, 110, 0.5)', fontStyle: 'italic', display: 'flex', gap: '16px' }}>
                      <span>Creado por: <strong style={{ color: 'rgba(200, 169, 110, 0.8)' }}>{forum.user?.username || 'Investigador'}</strong></span>
                      <span>Reportes: {forum.reports_count || 0}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            
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
            {forums.length === 0 && !loading && (
              <p style={{ textAlign: 'center', color: '#c8a96e55', marginTop: '40px' }}>No hay ecos registrados en esta frecuencia.</p>
            )}
          </>
        )}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
          backdropFilter: 'blur(8px)'
        }}>
          <form onSubmit={handleCreateForum} style={{
            background: 'rgba(15, 8, 18, 0.95)', 
            border: '1px solid rgba(200, 169, 110, 0.3)', 
            padding: '40px', 
            width: '450px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '24px',
            boxShadow: '0 0 50px rgba(0,0,0,1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, rgba(200,169,110,0.5), transparent)' }}></div>
            
            <h2 style={{ 
              fontFamily: "'UnifrakturMaguntia', serif", 
              color: '#c8a96e', 
              margin: '0', 
              fontSize: '32px',
              textAlign: 'center',
              textShadow: '0 0 10px rgba(200, 169, 110, 0.3)'
            }}>Apertura de Nuevo Expediente</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'rgba(200, 169, 110, 0.6)', fontSize: '13px', fontFamily: "'IM Fell English', serif", textTransform: 'uppercase', letterSpacing: '1px' }}>Título de la Investigación</label>
              <input 
                required placeholder="Ej: Las Luces de Heisler..." value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                style={{ 
                  background: 'rgba(5, 3, 5, 0.8)', 
                  border: '1px solid rgba(200, 169, 110, 0.2)', 
                  color: '#e8c98e', 
                  padding: '12px',
                  fontFamily: "'IM Fell English', serif",
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(200, 169, 110, 0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(200, 169, 110, 0.2)'}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'rgba(200, 169, 110, 0.6)', fontSize: '13px', fontFamily: "'IM Fell English', serif", textTransform: 'uppercase', letterSpacing: '1px' }}>Descripción del Fenómeno</label>
              <textarea 
                required placeholder="Relata los antecedentes conocidos..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                style={{ 
                  background: 'rgba(5, 3, 5, 0.8)', 
                  border: '1px solid rgba(200, 169, 110, 0.2)', 
                  color: '#e8c98e', 
                  padding: '12px', 
                  height: '120px', 
                  resize: 'none',
                  fontFamily: "'IM Fell English', serif",
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(200, 169, 110, 0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(200, 169, 110, 0.2)'}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'rgba(200, 169, 110, 0.6)', fontSize: '13px', fontFamily: "'IM Fell English', serif", textTransform: 'uppercase', letterSpacing: '1px' }}>Evidencia Pictórica</label>
              <div style={{ 
                position: 'relative', 
                border: '1px dashed rgba(200, 169, 110, 0.3)', 
                padding: '15px', 
                textAlign: 'center',
                background: 'rgba(200, 169, 110, 0.02)'
              }}>
                <input 
                  type="file" required accept="image/*" onChange={e => setFormData({...formData, image: e.target.files[0]})}
                  style={{ color: '#c8a96e', fontSize: '14px', width: '100%' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              <button type="submit" style={{ 
                flex: 1, 
                background: 'rgba(180, 50, 40, 0.2)', 
                color: '#f0d090', 
                border: '1px solid rgba(180, 50, 40, 0.5)', 
                padding: '14px',
                cursor: 'crosshair',
                fontFamily: "'IM Fell English', serif",
                fontSize: '18px',
                transition: 'all 0.3s'
              }}
              onMouseOver={e => e.target.style.background = 'rgba(180, 50, 40, 0.4)'}
              onMouseOut={e => e.target.style.background = 'rgba(180, 50, 40, 0.2)'}>
                Registrar Foro
              </button>
              <button type="button" onClick={() => setShowModal(false)} style={{ 
                flex: 1, 
                background: 'transparent', 
                color: 'rgba(200,169,110,0.5)', 
                border: '1px solid rgba(200,169,110,0.2)', 
                padding: '14px',
                cursor: 'pointer',
                fontFamily: "'IM Fell English', serif",
                fontSize: '18px'
              }}>
                Descartar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}