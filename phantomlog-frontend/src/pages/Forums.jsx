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
        addToast('Investigación actualizada con éxito.', 'success')
      } else {
        if (!formData.image) return addToast('Debes adjuntar una evidencia visual.', 'error')
        
        // Client-side type check
        const validTypes = ['image/jpeg', 'image/png', 'image/webp']
        if (!validTypes.includes(formData.image.type)) {
          return addToast('El archivo debe ser una imagen (JPG, PNG o WEBP).', 'error')
        }

        const reader = new FileReader()
        reader.readAsDataURL(formData.image)
        reader.onload = async () => {
          try {
            await createForum({ title: formData.title, description: formData.description, image: reader.result })
            addToast('Nuevo foro de investigación sellado.', 'success')
            setShowModal(false)
            refreshForums({ page: 1 })
          } catch (err) {
            const msg = err.response?.data?.message || 'Error al sellar el foro.'
            const errors = err.response?.data?.errors
            if (errors) {
              const firstError = Object.values(errors)[0][0]
              addToast(firstError.toUpperCase(), 'error')
            } else {
              addToast(msg.toUpperCase(), 'error')
            }
          }
        }
        return
      }
      setShowModal(false)
      refreshForums({ page: currentPage })
    } catch (error) { 
      const msg = error.response?.data?.message || 'Fallo en la conexión con el servidor.'
      addToast(msg.toUpperCase(), 'error') 
    }
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
      <header className="text-center mb-60 border-bottom pb-30">
        <h1 className="fs-42 ls-4">FOROS DE INVESTIGACIÓN</h1>
        <p className="text-dim fs-14 mt-5 mb-80">Comparte tus hallazgos con la comunidad.</p>
        
        <div className="flex-center gap-20 mt-60">
          <input 
            type="text" 
            placeholder="BUSCAR FOROS..." 
            className="search-bar w-100 max-400 m-0"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          {user && (
            <button 
              onClick={() => { setFormData({title: '', description: '', image: null}); setIsEditing(false); setShowModal(true); }}
              className="ls-1 p-15-40 primary nowrap"
            >
              + NUEVO FORO
            </button>
          )}
        </div>
      </header>

      {loading && forums.length === 0 ? (
        <div className="text-center fs-18 p-100">Invocando foros...</div>
      ) : (
        <>
        <div className="max-1200">
          <div className={`grid-3 ${loading ? 'opacity-04' : ''}`}>
            {forums.map(f => (
              <div key={f.id} className="horror-card column">
                <div onClick={() => navigate(`/forums/${f.id}`)} className="pointer flex-1">
                  <div className="card-image-box">
                    <ShimmerImage 
                      src={f.image_url}
                      alt={f.title}
                      objectFit="cover"
                    />
                  </div>
                  <h3 className="fs-24 mb-10">{f.title.toUpperCase()}</h3>
                  <p className="fs-15 lh-1-6 text-dim text-break">{f.description.substring(0, 120)}...</p>
                </div>
                {user && String(user.id) === String(f.user_id) && (
                  <div className="flex-center mt-10 gap-10">
                    <button onClick={() => { setFormData({title: f.title, description: f.description}); setCurrentEditId(f.id); setIsEditing(true); setShowModal(true); }} className="flex-1">EDITAR</button>
                    <button onClick={() => handleDeleteForum(f.id)} className="outline-red flex-1">BORRAR</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

          {totalPages > 1 && (
            <div className="pagination-controls">
              <button disabled={currentPage === 1} onClick={() => { setCurrentPage(p => p - 1); window.scrollTo(0,0); }}>🡄 ANTERIOR</button>
              <span className="bold">{currentPage} / {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => { setCurrentPage(p => p + 1); window.scrollTo(0,0); }}>SIGUIENTE 🡆</button>
            </div>
          )}
        </>
      )}

      {showModal && (
        <div className="modal-overlay">
          <form onSubmit={handleCreateForum} className="horror-form max-400">
            <div className="form-group">
              <label className="form-label">TÍTULO DE LA INVESTIGACIÓN</label>
              <input required placeholder="Ej: Avistamiento en el bosque" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">DESCRIPCIÓN DE LOS HECHOS</label>
              <textarea required placeholder="Relata lo sucedido con detalle..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="min-h-120" />
            </div>

            {!isEditing && (
              <div className="form-group">
                <label className="form-label">EVIDENCIA VISUAL (IMAGEN)</label>
                <input type="file" required onChange={e => setFormData({...formData, image: e.target.files[0]})} />
              </div>
            )}

            <div className="flex-center mt-20 gap-20">
              <button type="submit" className="primary flex-1">GUARDAR REGISTRO</button>
              <button type="button" onClick={() => setShowModal(false)} className="outline-red flex-1">CANCELAR</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}