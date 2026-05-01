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
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentEditId, setCurrentEditId] = useState(null)
  const [formData, setFormData] = useState({ title: '', description: '', image: null })
  const [currentPage, setCurrentPage] = useState(1)
  const [localSearch, setLocalSearch] = useState('')
  const { user } = useAuth()
  const { addToast } = useToast()

  // Reset page to 1 when local search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [localSearch]);

  // Effect for both search and page changes
  useEffect(() => {
    // Evitar recarga redundante al montar si ya tenemos foros y estamos en estado inicial
    const isInitialDefault = localSearch === '' && currentPage === 1;
    if (isInitialDefault && forums.length > 0) return;

    if (localSearch !== '') {
      const delayDebounceFn = setTimeout(() => {
        refreshForums({ search: localSearch, page: currentPage, per_page: 9 });
      }, 400);
      return () => clearTimeout(delayDebounceFn);
    } else {
      refreshForums({ search: '', page: currentPage, per_page: 9 });
    }
  }, [localSearch, currentPage, refreshForums]);

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
    <div className="page-container">
      <header className="mb-40 text-center">
        <h1>FOROS DE INVESTIGACIÓN</h1>
        <p style={{ color: 'var(--text-dim)' }}>Comparte tus hallazgos con la comunidad.</p>
      </header>

      <div className="mb-40 flex-center" style={{ justifyContent: 'space-between', gap: '20px' }}>
        <input 
          type="text" 
          placeholder="BUSCAR FOROS..." 
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          style={{ maxWidth: '300px', margin: 0 }}
        />
        {user && <button onClick={() => { setFormData({title: '', description: '', image: null}); setIsEditing(false); setShowModal(true); }}>NUEVO FORO</button>}
      </div>

      {loading && forums.length === 0 ? (
        <div className="text-center" style={{ padding: '100px' }}>Invocando foros...</div>
      ) : (
        <>
          <div className="grid-3" style={{ opacity: loading ? 0.4 : 1, transition: 'opacity 0.2s' }}>
            {forums.map(f => (
              <div key={f.id} className="horror-card column" style={{ padding: '15px' }}>
                <div onClick={() => navigate(`/forums/${f.id}`)} style={{ cursor: 'pointer', flex: 1 }}>
                  <div style={{ height: '180px', background: '#111', border: '1px solid var(--border)', marginBottom: '15px' }}>
                    <ShimmerImage 
                      src={f.image_url}
                      alt={f.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <h3>{f.title.toUpperCase()}</h3>
                  <p style={{ fontSize: '13px', lineHeight: '1.4', color: 'var(--text-dim)' }}>{f.description.substring(0, 100)}...</p>
                </div>
                {user && String(user.id) === String(f.user_id) && (
                  <div className="flex-center mt-10" style={{ gap: '10px' }}>
                    <button onClick={() => { setFormData({title: f.title, description: f.description}); setCurrentEditId(f.id); setIsEditing(true); setShowModal(true); }} style={{ flex: 1 }}>EDITAR</button>
                    <button onClick={() => handleDeleteForum(f.id)} className="outline-red" style={{ flex: 1 }}>BORRAR</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-60 flex-center" style={{ gap: '20px' }}>
              <button disabled={currentPage === 1} onClick={() => { setCurrentPage(p => p - 1); window.scrollTo(0,0); }}>🡄 ANTERIOR</button>
              <span style={{ fontWeight: 'bold' }}>{currentPage} / {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => { setCurrentPage(p => p + 1); window.scrollTo(0,0); }}>SIGUIENTE 🡆</button>
            </div>
          )}
        </>
      )}

      {showModal && (
        <div className="modal-overlay">
          <form onSubmit={handleCreateForum} className="horror-form" style={{ maxWidth: '400px' }}>
            <h2>{isEditing ? 'EDITAR FORO' : 'NUEVO FORO'}</h2>
            <input required placeholder="Titulo" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <textarea required placeholder="Descripcion" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ minHeight: '100px' }} />
            {!isEditing && <input type="file" required onChange={e => setFormData({...formData, image: e.target.files[0]})} />}
            <button type="submit" className="primary">GUARDAR CAMBIOS</button>
            <button type="button" onClick={() => setShowModal(false)} className="outline-red">CANCELAR</button>
          </form>
        </div>
      )}
    </div>
  )
}