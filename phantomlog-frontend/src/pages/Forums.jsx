import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { createForum, deleteForum, updateForum } from '../api/forums'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useData } from '../context/DataProvider'
import ShimmerImage from '../components/ShimmerImage'

export default function Forums() {
  const navigate = useNavigate()
  const { forums, loadingForums: loading, forumsPagination, refreshForums } = useData()
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentEditId, setCurrentEditId] = useState(null)
  const [formData, setFormData] = useState({ title: '', description: '', image: null })
  const [currentPage, setCurrentPage] = useState(1)
  const { user } = useAuth()
  const { addToast } = useToast()

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      refreshForums({ search, page: currentPage, per_page: 9 })
    }, 400)
    return () => clearTimeout(delayDebounceFn)
  }, [search, currentPage, refreshForums])

  const handleCreateForum = async (e) => {
    e.preventDefault()
    try {
      if (isEditing) {
        await updateForum(currentEditId, { title: formData.title, description: formData.description })
        addToast('Actualizado', 'success')
      } else {
        const reader = new FileReader()
        reader.readAsDataURL(formData.image)
        reader.onload = async () => {
          await createForum({ title: formData.title, description: formData.description, image: reader.result })
          addToast('Creado', 'success')
          refreshForums({ page: 1 })
        }
        setShowModal(false)
        return
      }
      setShowModal(false)
      refreshForums({ page: currentPage })
    } catch (error) { addToast('Error', 'error') }
  }

  const handleDeleteForum = async (id) => {
    if (!window.confirm('¿Borrar foro?')) return
    try {
      await deleteForum(id)
      addToast('Borrado', 'success')
      refreshForums({ page: currentPage })
    } catch (error) { addToast('Error', 'error') }
  }

  const { totalPages } = forumsPagination

  return (
    <div style={{ padding: '20px', color: '#0f0' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ color: '#f00', fontSize: '48px', margin: '0' }}>FOROS DE INVESTIGACIÓN</h1>
        <p style={{ color: '#060' }}>Comparte tus hallazgos con la comunidad.</p>
      </header>

      <div style={{ marginBottom: '30px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <input 
          placeholder="Buscar testimonios..." 
          value={search} 
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} 
          style={{ width: '100%', maxWidth: '400px', background: '#000', border: '1px solid #0f0', color: '#0f0', padding: '10px' }}
        />
        {user && <button onClick={() => { setFormData({title: '', description: '', image: null}); setIsEditing(false); setShowModal(true); }} style={{ padding: '10px 20px' }}>NUEVO FORO</button>}
      </div>

      {loading && forums.length === 0 ? (
        <div style={{ textAlign: 'center' }}>Invocando foros...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
            {forums.map(f => (
              <div key={f.id} style={{ border: '1px solid #060', padding: '15px', background: '#000', display: 'flex', flexDirection: 'column' }}>
                <div onClick={() => navigate(`/forums/${f.id}`)} style={{ cursor: 'pointer', flex: 1 }}>
                  <div style={{ height: '180px', background: '#111', border: '1px solid #040', marginBottom: '15px' }}>
                    <ShimmerImage 
                      src={f.image_url}
                      alt={f.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <h3 style={{ color: '#f00', margin: '0 0 10px 0' }}>{f.title}</h3>
                  <p style={{ fontSize: '13px', lineHeight: '1.4' }}>{f.description.substring(0, 100)}...</p>
                </div>
                {user && String(user.id) === String(f.user_id) && (
                  <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                    <button onClick={() => { setFormData({title: f.title, description: f.description}); setCurrentEditId(f.id); setIsEditing(true); setShowModal(true); }} style={{ flex: 1 }}>EDITAR</button>
                    <button onClick={() => handleDeleteForum(f.id)} style={{ flex: 1, borderColor: '#f00', color: '#f00' }}>BORRAR</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
              <button disabled={currentPage === 1} onClick={() => { setCurrentPage(p => p - 1); window.scrollTo(0,0); }}>🡄 ANTERIOR</button>
              <span style={{ color: '#f00', fontWeight: 'bold' }}>PÁGINA {currentPage} DE {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => { setCurrentPage(p => p + 1); window.scrollTo(0,0); }}>SIGUIENTE 🡆</button>
            </div>
          )}
        </>
      )}

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <form onSubmit={handleCreateForum} style={{ background: '#000', border: '1px solid #0f0', padding: '30px', display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', maxWidth: '400px' }}>
            <h2 style={{ color: '#f00', margin: 0 }}>{isEditing ? 'EDITAR FORO' : 'NUEVO FORO'}</h2>
            <input required placeholder="Titulo" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ background: '#000', border: '1px solid #0f0', color: '#0f0', padding: '10px' }} />
            <textarea required placeholder="Descripcion" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ background: '#000', border: '1px solid #0f0', color: '#0f0', padding: '10px', minHeight: '100px' }} />
            {!isEditing && <input type="file" required onChange={e => setFormData({...formData, image: e.target.files[0]})} style={{ color: '#0f0' }} />}
            <button type="submit">GUARDAR CAMBIOS</button>
            <button type="button" onClick={() => setShowModal(false)} style={{ borderColor: '#f00', color: '#f00' }}>CANCELAR</button>
          </form>
        </div>
      )}
    </div>
  )
}