import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { createForum, deleteForum, updateForum } from '../api/forums'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useData } from '../context/DataProvider'
import ShimmerImage from '../components/ShimmerImage'

export default function Forums() {
  const navigate = useNavigate()
  const { 
    forums, 
    loadingForums: loading, 
    forumsPagination, 
    refreshForums 
  } = useData()
  
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentEditId, setCurrentEditId] = useState(null)
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
    
    try {
      setShowModal(false)
      
      if (isEditing) {
        addToast('Actualizando expediente...', 'info')
        await updateForum(currentEditId, {
          title: formData.title,
          description: formData.description
        })
        addToast('Foro actualizado exitosamente', 'success')
      } else {
        if (!formData.image) {
          addToast('La imagen es obligatoria', 'error')
          return
        }
        addToast('Registrando expediente...', 'info')
        const base64Image = await fileToBase64(formData.image)
        const payload = {
          title: formData.title,
          description: formData.description,
          image: base64Image
        }
        await createForum(payload)
        addToast('Foro creado exitosamente', 'success')
      }
      
      setFormData({ title: '', description: '', image: null })
      setIsEditing(false)
      setCurrentEditId(null)
      refreshForums({ page: currentPage, per_page: itemsPerPage })
    } catch (error) {
      console.error(error)
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message
      addToast(`Error: ${errorMsg}`, 'error')
    }
  }

  const handleDeleteForum = async (id) => {
    console.log('Delete requested for:', id)
    if (!window.confirm('¿Confirmar eliminación permanente del expediente?')) return
    
    try {
      addToast('Eliminando...', 'info')
      await deleteForum(id)
      addToast('Expediente borrado', 'success')
      refreshForums({ page: currentPage, per_page: itemsPerPage })
    } catch (error) {
      console.error('Delete error:', error)
      addToast('Error al borrar', 'error')
    }
  }

  const openEditModal = (e, forum) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setFormData({ title: forum.title, description: forum.description, image: null })
    setIsEditing(true)
    setCurrentEditId(forum.id)
    setShowModal(true)
  }

  const { totalPages } = forumsPagination

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
      <header style={{ marginBottom: '40px', borderBottom: '1px solid rgba(200, 169, 110, 0.1)', paddingBottom: '24px', textAlign: 'center' }}>
        <h1 style={{ 
          fontFamily: "var(--heading)", 
          fontWeight: 700,
          fontSize: '48px', 
          margin: '0 0 12px 0', 
          textShadow: '0 0 30px rgba(200, 169, 110, 0.2)' 
        }}>Foros de Investigación</h1>
        <p style={{ 
          color: 'rgba(200, 169, 110, 0.6)', 
          margin: 0,
          fontSize: '18px',
          fontFamily: "var(--sans)",
          letterSpacing: '1px'
        }}>Archivo central de incidentes paranormales documentados</p>
      </header>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '32px',
        gap: '20px'
      }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <input 
            type="text" 
            placeholder="Filtrar por título o descripción..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: 'rgba(15, 10, 15, 0.8)',
              border: '1px solid rgba(200, 169, 110, 0.2)',
              color: '#c8a96e',
              padding: '12px 20px 12px 40px',
              fontFamily: "var(--sans)",
              width: '100%',
              borderRadius: '8px',
              outline: 'none',
              transition: 'all 0.3s'
            }}
            onFocus={e => e.target.style.borderColor = '#c8a96e'}
            onBlur={e => e.target.style.borderColor = 'rgba(200, 169, 110, 0.2)'}
          />
          <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '20px', color: 'rgba(200, 169, 110, 0.4)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {user && (
          <button style={{
            background: 'linear-gradient(135deg, rgba(180, 50, 40, 0.2), rgba(180, 50, 40, 0.1))',
            border: '1px solid rgba(180, 50, 40, 0.4)',
            color: '#f0d090',
            padding: '12px 32px',
            fontFamily: "var(--heading)",
            fontWeight: 600,
            fontSize: '16px',
            borderRadius: '8px',
            cursor: 'crosshair',
            transition: 'all 0.3s',
            whiteSpace: 'nowrap'
          }}
          onClick={() => setShowModal(true)}
          onMouseOver={e => {
            e.target.style.background = 'rgba(180, 50, 40, 0.3)';
            e.target.style.transform = 'scale(1.02)';
          }}
          onMouseOut={e => {
            e.target.style.background = 'rgba(180, 50, 40, 0.2)';
            e.target.style.transform = 'scale(1)';
          }}>
            Nuevo Expediente
          </button>
        )}
      </div>

      {/* Forums Feed (Steam/Instagram Style) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
        {loading && forums.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px 0' }}>
            <div className="loader-pulse"></div>
            <p style={{ color: '#c8a96e', marginTop: '20px', fontFamily: "var(--sans)" }}>Accediendo a las frecuencias de red...</p>
          </div>
        ) : (
          <>
            {forums.map(forum => (
              <article 
                key={forum.id} 
                onClick={() => navigate(`/forums/${forum.id}`)}
                style={{
                  background: 'rgba(15, 12, 18, 0.8)',
                  border: '1px solid rgba(200, 169, 110, 0.1)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                  backdropFilter: 'blur(10px)',
                  position: 'relative',
                  cursor: 'pointer'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = '#c8a96e';
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(200, 169, 110, 0.1)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                
                {/* Floating Management Buttons */}
                {user && String(user.id) === String(forum.user_id) && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    style={{ 
                      position: 'absolute', 
                      top: '12px', 
                      right: '12px', 
                      display: 'flex', 
                      gap: '8px', 
                      zIndex: 100 
                    }}
                  >
                    <button 
                      onClick={(e) => { e.stopPropagation(); openEditModal(e, forum); }}
                      style={{ 
                        background: 'rgba(20, 15, 25, 0.9)', 
                        border: '1px solid rgba(200, 169, 110, 0.3)', 
                        color: '#c8a96e', 
                        cursor: 'pointer', 
                        padding: '8px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s',
                        backdropFilter: 'blur(4px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                      }}
                      onMouseOver={e => { e.currentTarget.style.borderColor = '#c8a96e'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.3)'; e.currentTarget.style.transform = 'scale(1)'; }}
                      title="Editar"
                    >
                      <svg style={{ width: '18px', pointerEvents: 'none' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteForum(forum.id); }}
                      style={{ 
                        background: 'rgba(40, 10, 15, 0.9)', 
                        border: '1px solid rgba(255, 77, 79, 0.3)', 
                        color: '#ff4d4f', 
                        cursor: 'pointer', 
                        padding: '8px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s',
                        backdropFilter: 'blur(4px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                      }}
                      onMouseOver={e => { e.currentTarget.style.borderColor = '#ff4d4f'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255, 77, 79, 0.3)'; e.currentTarget.style.transform = 'scale(1)'; }}
                      title="Eliminar"
                    >
                      <svg style={{ width: '18px', pointerEvents: 'none' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Card Header (Author Info) */}
                <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(200, 169, 110, 0.05)', position: 'relative', zIndex: 2 }}>
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '50%', 
                    background: 'rgba(200, 169, 110, 0.1)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(200, 169, 110, 0.2)',
                    color: '#c8a96e', fontWeight: 'bold', fontSize: '12px'
                  }}>
                    {forum.user?.username?.charAt(0).toUpperCase() || 'P'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#c8a96e', fontSize: '13px', fontWeight: 600, fontFamily: "var(--sans)" }}>
                      {forum.user?.username || 'Investigador'}
                    </div>
                    <div style={{ color: 'rgba(200, 169, 110, 0.4)', fontSize: '11px', fontFamily: "var(--sans)" }}>
                      {new Date(forum.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Card Media - Standard Image (No Shimmer) */}
                <div style={{ position: 'relative', paddingTop: '65%', overflow: 'hidden', background: '#000' }}>
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
                      style={{ 
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                        objectFit: 'cover'
                      }}
                    />
                  )}
                </div>

                {/* Card Content */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ 
                    margin: '0 0 12px 0', 
                    fontSize: '22px', 
                    color: '#e8c98e', 
                    fontFamily: "var(--heading)",
                    fontWeight: 600,
                    lineHeight: 1.2
                  }}>{forum.title}</h3>
                  
                  <p style={{ 
                    fontSize: '14px', 
                    color: 'rgba(200, 169, 110, 0.7)', 
                    marginBottom: '20px',
                    lineHeight: 1.6,
                    fontFamily: "var(--sans)",
                    flex: 1
                  }}>
                    {forum.description.length > 100 
                      ? `${forum.description.substring(0, 100)}...` 
                      : forum.description}
                  </p>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(200, 169, 110, 0.05)',
                    color: 'rgba(200, 169, 110, 0.5)',
                    fontSize: '13px',
                    fontFamily: "var(--sans)"
                  }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg style={{ width: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        {forum.reports_count || 0}
                      </span>
                    </div>
                    <span style={{ color: '#c8a96e', fontWeight: 500 }}>Explorar →</span>
                  </div>
                </div>
              </article>
            ))}
            
            {totalPages > 1 && (
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px', marginTop: '48px', marginBottom: '40px' }}>
                <button 
                  disabled={currentPage === 1}
                  onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{
                    background: 'transparent', 
                    color: currentPage === 1 ? '#444' : '#c8a96e', 
                    border: `1px solid ${currentPage === 1 ? '#222' : '#c8a96e44'}`, 
                    padding: '10px 24px', 
                    borderRadius: '8px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer', 
                    fontFamily: "var(--sans)", 
                    fontSize: '16px',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={e => !currentPage === 1 && (e.target.style.borderColor = '#c8a96e')}
                  onMouseOut={e => !currentPage === 1 && (e.target.style.borderColor = '#c8a96e44')}>
                  Anterior
                </button>
                <span style={{ fontSize: '16px', fontFamily: "var(--sans)", color: 'rgba(200, 169, 110, 0.6)' }}>
                  <strong style={{ color: '#c8a96e' }}>{currentPage}</strong> / {totalPages}
                </span>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{
                    background: 'transparent', 
                    color: currentPage === totalPages ? '#444' : '#c8a96e', 
                    border: `1px solid ${currentPage === totalPages ? '#222' : '#c8a96e44'}`, 
                    padding: '10px 24px', 
                    borderRadius: '8px',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', 
                    fontFamily: "var(--sans)", 
                    fontSize: '16px',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={e => !currentPage === totalPages && (e.target.style.borderColor = '#c8a96e')}
                  onMouseOut={e => !currentPage === totalPages && (e.target.style.borderColor = '#c8a96e44')}>
                  Siguiente
                </button>
              </div>
            )}
            {forums.length === 0 && !loading && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', color: 'rgba(200, 169, 110, 0.3)', fontFamily: "var(--sans)" }}>
                No se han encontrado registros en esta frecuencia.
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(5, 3, 5, 0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
          backdropFilter: 'blur(15px)'
        }}>
          <form onSubmit={handleCreateForum} style={{
            background: '#0c0a0c', 
            border: '1px solid rgba(200, 169, 110, 0.2)', 
            padding: '48px', 
            borderRadius: '20px',
            width: '100%',
            maxWidth: '500px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '24px',
            boxShadow: '0 20px 60px rgba(0,0,0,1)',
            position: 'relative'
          }}>
            <button 
              type="button" 
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'rgba(200, 169, 110, 0.4)', cursor: 'pointer', fontSize: '24px' }}
            >
              ×
            </button>
            
            <header style={{ textAlign: 'center' }}>
              <h2 style={{ 
                color: '#c8a96e', 
                margin: '0 0 8px 0', 
                fontSize: '32px',
                fontWeight: 700
              }}>{isEditing ? 'Editar Expediente' : 'Nuevo Expediente'}</h2>
              <p style={{ color: 'rgba(200, 169, 110, 0.5)', fontSize: '14px', fontFamily: "var(--sans)" }}>{isEditing ? 'Modifica la información del archivo' : 'Documenta un nuevo fenómeno para el archivo'}</p>
            </header>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'rgba(200, 169, 110, 0.6)', fontSize: '12px', fontWeight: 600, fontFamily: "var(--sans)", textTransform: 'uppercase', letterSpacing: '1px' }}>Título de la Investigación</label>
              <input 
                required placeholder="Ej: Las Luces de Heisler..." value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                style={{ 
                  background: 'rgba(255, 255, 255, 0.03)', 
                  border: '1px solid rgba(200, 169, 110, 0.1)', 
                  color: '#e8c98e', 
                  padding: '14px 18px',
                  fontFamily: "var(--sans)",
                  fontSize: '16px',
                  borderRadius: '10px',
                  outline: 'none',
                  transition: 'all 0.3s'
                }}
                onFocus={e => e.target.style.borderColor = '#c8a96e'}
                onBlur={e => e.target.style.borderColor = 'rgba(200, 169, 110, 0.1)'}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'rgba(200, 169, 110, 0.6)', fontSize: '12px', fontWeight: 600, fontFamily: "var(--sans)", textTransform: 'uppercase', letterSpacing: '1px' }}>Descripción de los Hechos</label>
              <textarea 
                required placeholder="Relata los antecedentes conocidos..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                style={{ 
                  background: 'rgba(255, 255, 255, 0.03)', 
                  border: '1px solid rgba(200, 169, 110, 0.1)', 
                  color: '#e8c98e', 
                  padding: '14px 18px', 
                  height: '140px', 
                  resize: 'none',
                  fontFamily: "var(--sans)",
                  fontSize: '16px',
                  borderRadius: '10px',
                  outline: 'none',
                  transition: 'all 0.3s'
                }}
                onFocus={e => e.target.style.borderColor = '#c8a96e'}
                onBlur={e => e.target.style.borderColor = 'rgba(200, 169, 110, 0.1)'}
              />
            </div>
            
            {!isEditing && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: 'rgba(200, 169, 110, 0.6)', fontSize: '12px', fontWeight: 600, fontFamily: "var(--sans)", textTransform: 'uppercase', letterSpacing: '1px' }}>Evidencia Pictórica</label>
                <div style={{ 
                  position: 'relative', 
                  border: '2px dashed rgba(200, 169, 110, 0.15)', 
                  borderRadius: '12px',
                  padding: '24px', 
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.02)',
                  transition: 'all 0.3s'
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.4)'}
                onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.15)'}>
                  <input 
                    type="file" required accept="image/*" onChange={e => setFormData({...formData, image: e.target.files[0]})}
                    style={{ color: '#c8a96e', fontSize: '14px', cursor: 'pointer' }}
                  />
                </div>
              </div>
            )}

            <button type="submit" style={{ 
              background: '#c8a96e', 
              color: '#0c0a0c', 
              border: 'none', 
              padding: '16px',
              borderRadius: '12px',
              cursor: 'crosshair',
              fontFamily: "var(--heading)",
              fontSize: '18px',
              fontWeight: 700,
              transition: 'all 0.3s',
              marginTop: '12px'
            }}
            onMouseOver={e => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.target.style.transform = 'translateY(0)'}>
              {isEditing ? 'Actualizar Archivo' : 'Iniciar Investigación'}
            </button>
            
            <button 
              type="button" 
              onClick={() => { setShowModal(false); setIsEditing(false); setFormData({title:'', description:'', image:null}); }}
              style={{ background: 'transparent', border: '1px solid rgba(200,169,110,0.2)', color: 'rgba(200,169,110,0.5)', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontFamily: "var(--sans)" }}
            >
              Cancelar
            </button>
          </form>
        </div>
      )}
      
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0.3; transform: scale(0.8); }
        }
        .loader-pulse {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #c8a96e;
          margin: 0 auto;
          animation: pulse 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  )
}