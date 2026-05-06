import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { createExpedition, updateExpedition, deleteExpedition } from '../api/expeditions'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useData } from '../context/DataProvider'

const ExpeditionSkeleton = () => (
  <div className="horror-card column gap-15 p-25 h-100">
    <div className="flex-center justify-between align-start">
      <div className="skeleton skeleton-title" style={{ width: '60%' }}></div>
      <div className="skeleton" style={{ width: '60px', height: '20px' }}></div>
    </div>
    <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
    <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
    <div className="border-top mt-auto flex-center justify-between pt-15">
      <div className="skeleton skeleton-text" style={{ width: '30%' }}></div>
      <div className="skeleton skeleton-text" style={{ width: '20%' }}></div>
    </div>
  </div>
)

export default function Expeditions() {
  const { expeditions, refreshExpeditions, loadingExpeditions, expeditionsPagination } = useData()
  const [localSearch, setLocalSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentExpId, setCurrentExpId] = useState(null)
  const [formData, setFormData] = useState({
    name: '', description: '', location: '', date: '', phantom_id: ''
  })
  const [currentPage, setCurrentPage] = useState(1)
  const { user } = useAuth()
  const { addToast } = useToast()

  // Guard para evitar petición duplicada en el primer render:
  // DataProvider ya cargó las expediciones con refreshAll() al arrancar la app.
  const isFirstRender = useRef(true)

  useEffect(() => {
    setCurrentPage(1);
  }, [localSearch]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return // datos ya cargados por DataProvider
    }
    if (localSearch !== '') {
      const delayDebounceFn = setTimeout(() => {
        refreshExpeditions({ search: localSearch, page: currentPage, per_page: 9 });
      }, 400);
      return () => clearTimeout(delayDebounceFn);
    } else {
      refreshExpeditions({ search: '', page: currentPage, per_page: 9 });
    }
  }, [localSearch, currentPage, refreshExpeditions]);

  const handleOpenCreate = () => {
    setFormData({ name: '', description: '', location: '', date: '', phantom_id: '' })
    setIsEditing(false)
    setShowModal(true)
  }

  const handleOpenEdit = (event, exp) => {
    event.preventDefault()
    event.stopPropagation()
    setFormData({
      name: exp.name,
      description: exp.description,
      location: exp.location,
      date: exp.date ? new Date(exp.date).toISOString().slice(0, 16) : '',
      phantom_id: exp.phantom_id
    })
    setCurrentExpId(exp.id)
    setIsEditing(true)
    setShowModal(true)
  }

  const handleExpeditionSubmit = async (event) => {
    event.preventDefault()
    try {
      if (isEditing) {
        await updateExpedition(currentExpId, formData)
        addToast('INCURSIÓN RE-PROGRAMADA CON ÉXITO', 'success')
      } else {
        await createExpedition(formData)
        addToast('INCURSIÓN DESPLEGADA EN EL CALENDARIO', 'success')
      }
      setShowModal(false)
      refreshExpeditions({ search: localSearch, page: currentPage, per_page: 9 })
    } catch (err) { 
      const errors = err.response?.data?.errors
      if (errors) {
        const firstError = Object.values(errors)[0][0]
        addToast(firstError.toUpperCase(), 'error')
      } else {
        const msg = err.response?.data?.message || 'ERROR EN LA OPERACIÓN'
        addToast(msg.toUpperCase(), 'error') 
      }
    }
  }

  const handleDeleteExpedition = async (event, id) => {
    event.preventDefault()
    event.stopPropagation()
    if (!window.confirm('¿ESTÁS SEGURO DE ELIMINAR ESTA INCURSIÓN?')) return
    try {
      await deleteExpedition(id)
      addToast('INCURSIÓN PURGADA DEL SISTEMA', 'success')
      refreshExpeditions({ search: localSearch, page: currentPage, per_page: 9 })
    } catch (e) {
      addToast('FALLO AL ELIMINAR LA ENTRADA', 'error')
    }
  }

  const { totalPages } = expeditionsPagination

  return (
    <div className="page-container">
      <header className="text-center mb-60 border-bottom pb-30">
        <h1 className="fs-42 ls-4">CALENDARIO DE INCURSIÓN</h1>
        <p className="text-dim fs-14 mt-5 mb-80">ZONAS DE ACTIVIDAD PARANORMAL CONFIRMADA</p>
        
        <div className="flex-center gap-20 mt-60">
          <input 
            type="text" 
            placeholder="BUSCAR INCURSIÓN O UBICACIÓN..." 
            className="search-bar w-100 max-400 m-0"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          {user && (
            <button 
              onClick={handleOpenCreate}
              className="ls-1 p-15-40 primary nowrap"
            >
              + PROGRAMAR INCURSIÓN
            </button>
          )}
        </div>
      </header>

      <div className="max-1200">
        <div className={`grid-3 loading-fade${loadingExpeditions && expeditions.length > 0 && currentPage > 1 ? ' is-loading' : ''}`}>
          {loadingExpeditions && expeditions.length === 0 ? (
            [...Array(6)].map((_, i) => <ExpeditionSkeleton key={i} />)
          ) : expeditions.length === 0 ? (
            <p className="text-muted text-center flex-1 p-100" style={{ gridColumn: '1/-1' }}>NO HAY INCURSIONES PROGRAMADAS EN ESTE SECTOR.</p>
          ) : (
            expeditions.map(exp => {
              const isClosed = new Date(exp.date) < new Date()
              const isCreator = user && String(user.id) === String(exp.user_id)

              return (
                <div key={exp.id} className="relative">
                  <Link 
                    to={`/expeditions/${exp.id}`} 
                    className={`horror-card column ${isClosed ? 'red' : ''} gap-15 p-25 h-100`}
                  >
                    <div className="flex-center justify-between align-start">
                      <h3 className={`m-0 fs-20 ${isClosed ? 'text-accent-dim' : 'text-accent'}`}>{exp.name.toUpperCase()}</h3>
                      <div className={`status-badge ${isClosed ? 'closed' : 'active'}`}>
                        {isClosed ? 'FINALIZADA' : 'ACTIVA'}
                      </div>
                    </div>

                    <div className="fs-12 opacity-08">
                      <div>Ubicación: {exp.location.toUpperCase()}</div>
                      <div>Objetivo: {exp.phantom?.name.toUpperCase() || 'DESCONOCIDO'}</div>
                    </div>

                    <div className="border-top mt-auto flex-center justify-between pt-15">
                      <div className="text-dim fs-11">
                        {new Date(exp.date).toLocaleString()}
                      </div>
                      <div className="text-accent fs-11 bold">
                        {exp.participants_count} OPERATIVOS
                      </div>
                    </div>
                    
                    {isCreator && (
                      <div className="flex-center mt-20 gap-10 border-top pt-10 border-faded-05">
                        <button onClick={(e) => handleOpenEdit(e, exp)} className="flex-1 fs-10 p-5">[EDITAR]</button>
                        <button onClick={(e) => handleDeleteExpedition(e, exp.id)} className="outline-red flex-1 fs-10 p-5">[PURGAR]</button>
                      </div>
                    )}
                  </Link>
                </div>
              )
            })
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination-controls mt-60">
            <button 
              disabled={currentPage === 1} 
              onClick={() => { setCurrentPage(p => p - 1); window.scrollTo(0,0); }}
            >
              🡄 ANTERIOR
            </button>
            <span className="bold fs-18">
              {currentPage} / {totalPages}
            </span>
            <button 
              disabled={currentPage === totalPages} 
              onClick={() => { setCurrentPage(p => p + 1); window.scrollTo(0,0); }}
            >
              SIGUIENTE 🡆
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <form onSubmit={handleExpeditionSubmit} className="horror-form">
            <h2 className="ls-2">{isEditing ? 'RE-PROGRAMAR' : 'NUEVA'} INCURSIÓN</h2>
            
            <div className="form-group">
              <label className="form-label">NOMBRE DE LA OPERACIÓN</label>
              <input required placeholder="Ej: Operación Silencio" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">OBJETIVOS Y PROTOCOLO (MÍN. 100 CARACTERES)</label>
              <textarea required minLength={100} placeholder="Describe detalladamente los objetivos..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="min-h-120" />
              <small className={`fs-10 ${formData.description.length < 100 ? 'text-accent' : 'text-dim'}`}>
                CARACTERES: {formData.description.length} / 100
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">UBICACIÓN BASE (MÁX. 40 CARACTERES)</label>
              <input required maxLength={40} placeholder="Ej: Psiquiátrico Abandonado" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">FECHA Y HORA DE DESPLIEGUE</label>
              <input required type="datetime-local" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            
            <div className="form-group">
              <label className="form-label">ENTIDAD OBJETIVO</label>
              <select required value={formData.phantom_id} onChange={e => setFormData({...formData, phantom_id: e.target.value})}>
                <option value="">SELECCIONAR ENTIDAD...</option>
                {phantoms.map(p => (
                  <option key={p.id} value={p.id}>{p.name.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div className="flex-center mt-10 gap-20">
              <button type="submit" className="primary flex-1 p-15">{isEditing ? 'ACTUALIZAR DATOS' : 'DESPLEGAR INCURSIÓN'}</button>
              <button type="button" onClick={() => setShowModal(false)} className="outline-red flex-1 p-15">ABORTAR</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
