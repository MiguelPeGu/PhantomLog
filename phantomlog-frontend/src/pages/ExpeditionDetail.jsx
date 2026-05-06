import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getExpedition, toggleJoin, deleteExpedition, updateExpedition } from '../api/expeditions'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useData } from '../context/DataProvider'
import NotFound from './NotFound'

export default function ExpeditionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToast } = useToast()
  const { phantoms } = useData()

  const [expedition, setExpedition] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [isJoined, setIsJoined] = useState(false)

  const [showEditModal, setShowEditModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '', description: '', location: '', date: '', phantom_id: ''
  })

  useEffect(() => {
    fetchExpedition()
  }, [id])

  const fetchExpedition = async () => {
    try {
      const res = await getExpedition(id)
      setExpedition(res.data)
      if (user) {
        const joined = res.data.participants.some(person => String(person.id) === String(user.id))
        setIsJoined(joined)
      }
      setFormData({
        name: res.data.name,
        description: res.data.description,
        location: res.data.location,
        date: res.data.date ? new Date(res.data.date).toISOString().slice(0, 16) : '',
        phantom_id: res.data.phantom_id
      })
    } catch (e) {
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async () => {
    if (!user) {
      addToast('Debes iniciar sesión para unirte', 'info')
      return
    }
    try {
      const res = await toggleJoin(id)
      setIsJoined(res.data.is_joined)
      addToast(res.data.is_joined ? 'REGISTRADO EN LA INCURSIÓN' : 'BAJA TRAMITADA', 'success')
      fetchExpedition()
    } catch (e) {
      const msg = e.response?.data?.message || 'Error al procesar registro'
      addToast(msg.toUpperCase(), 'error')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('¿ELIMINAR ESTA EXPEDICIÓN?')) return
    try {
      await deleteExpedition(id)
      addToast('INCURSIÓN ABORTADA', 'success')
      navigate('/expeditions')
    } catch (e) { addToast('Error al eliminar', 'error') }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await updateExpedition(id, formData)
      addToast('EXPEDIENTE DE INCURSIÓN ACTUALIZADO', 'success')
      setShowEditModal(false)
      fetchExpedition()
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        const firstError = Object.values(errors)[0][0]
        addToast(firstError.toUpperCase(), 'error')
      } else {
        const msg = err.response?.data?.message || 'ERROR AL ACTUALIZAR'
        addToast(msg.toUpperCase(), 'error')
      }
    }
  }

  if (notFound) return <NotFound />
  if (loading) {
    return (
      <div className="page-container max-1000">
        {/* Nav */}
        <div className="flex-center justify-between mb-40">
          <div className="skeleton" style={{ width: '180px', height: '36px', borderRadius: '4px' }}></div>
          <div className="flex-center gap-15">
            <div className="skeleton" style={{ width: '150px', height: '36px', borderRadius: '4px' }}></div>
            <div className="skeleton" style={{ width: '160px', height: '36px', borderRadius: '4px' }}></div>
          </div>
        </div>

        {/* Tarjeta principal */}
        <div className="horror-card p-40">
          {/* Header */}
          <div className="border-bottom pb-30 mb-30">
            <div className="flex-center justify-between mb-20">
              <div>
                <div className="skeleton skeleton-title mb-10" style={{ width: '380px', height: '52px' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '200px' }}></div>
              </div>
              <div className="skeleton" style={{ width: '160px', height: '40px', borderRadius: '4px' }}></div>
            </div>
            <div className="flex-center gap-30 mt-20">
              <div className="skeleton skeleton-text" style={{ width: '120px' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '100px' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '130px' }}></div>
            </div>
          </div>

          {/* Grid descripción + participantes */}
          <div className="grid-2 gap-40">
            <div>
              <div className="skeleton" style={{ width: '200px', height: '24px', marginBottom: '15px' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '100%' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '95%' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '88%' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>

              <div className="horror-card mt-30 p-20">
                <div className="skeleton skeleton-text mb-10" style={{ width: '140px' }}></div>
                <div className="skeleton" style={{ width: '180px', height: '28px' }}></div>
              </div>

              <div className="skeleton w-100 mt-40" style={{ height: '64px', borderRadius: '4px' }}></div>
            </div>

            <div className="border-left pl-40">
              <div className="skeleton" style={{ width: '160px', height: '24px', marginBottom: '20px' }}></div>
              <div className="column gap-10">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex-center gap-10">
                    <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></div>
                    <div className="skeleton skeleton-text" style={{ width: '100px' }}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  if (!expedition) return null

  const isClosed = new Date(expedition.date) < new Date()

  return (
    <div className="page-container max-1000">
      <div className="flex-center justify-between mb-40">
        <Link to="/expeditions" className="btn">🡄 VOLVER AL CALENDARIO</Link>
        {user && String(user.id) === String(expedition.user_id) && (
          <div className="flex-center gap-15">
            <button onClick={() => setShowEditModal(true)} className="outline">EDITAR INCURSIÓN</button>
            <button onClick={handleDelete} className="outline-red">ELIMINAR INCURSIÓN</button>
          </div>
        )}
      </div>

      <div className={`horror-card ${isClosed ? 'red closed-mission-shadow' : ''} p-40 relative`}>
        {/* Header Section */}
        <div className="border-bottom pb-30 mb-30">
          <div className="flex-center justify-between align-start mb-20">
            <div>
              <h1 className="m-0 fs-48 ls-4">{expedition.name.toUpperCase()}</h1>
              <p className="text-dim fs-14 mt-10">UBICACIÓN: <span className="text-normal">{expedition.location.toUpperCase()}</span></p>
            </div>
            <div className={`status-badge ${isClosed ? 'closed' : 'active'} p-10-20`}>
              {isClosed ? 'ESTADO: FINALIZADA' : 'ESTADO: RECLUTANDO'}
            </div>
          </div>

          <div className="flex-wrap gap-30 fs-16 text-dim mt-20">
            <div><span className="text-muted">FECHA:</span> {new Date(expedition.date).toLocaleDateString()}</div>
            <div><span className="text-muted">HORA:</span> {new Date(expedition.date).toLocaleTimeString()}</div>
            <div><span className="text-muted">AUTOR:</span> {expedition.creator?.username.toUpperCase()}</div>
          </div>
        </div>

        {/* Info & Participants Grid */}
        <div className="grid-2 gap-40 grid-15-1">
          <div>
            <h3 className="border-bottom pb-10">OBJETIVOS DE LA MISIÓN</h3>
            <p className="fs-18 lh-1-6 pre-wrap word-break">{expedition.description}</p>

            <div className="horror-card mt-30 p-20">
              <h4 className="text-dim m-0 mb-10">ENTIDAD DETECTADA</h4>
              <div className="text-accent fs-24 bold">
                {expedition.phantom?.name.toUpperCase() || 'DESCONOCIDO'}
              </div>
            </div>

            {!isClosed && (
              <button
                onClick={handleJoin}
                className={`w-100 mt-40 fs-24 ${isJoined ? 'outline-red' : 'primary'} p-20`}
              >
                {isJoined ? 'ABANDONAR EXPEDICIÓN' : 'CONFIRMAR ASISTENCIA'}
              </button>
            )}
          </div>

          <div className="border-left pl-40">
            <h3 className="border-bottom pb-10">OPERATIVOS ({expedition.participants_count})</h3>
            <div className="column gap-10 mt-20">
              {expedition.participants?.length === 0 ? (
                <p className="text-dim">NADIE SE HA ATREVIDO TODAVÍA.</p>
              ) : (
                expedition.participants.map(p => {
                  const avatarUrl = p.img ? (p.img.startsWith('http') || p.img.startsWith('data:') ? p.img : `http://localhost:8000/storage/${p.img}`) : null;
                  return (
                    <div key={p.id} className="participant-box">
                      <div className="avatar-circle">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={p.username}
                            className="w-100 h-100 object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerText = p.username[0].toUpperCase();
                            }}
                          />
                        ) : (
                          p.username[0].toUpperCase()
                        )}
                      </div>
                      <span className="fs-14 uppercase">{p.username}</span>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="modal-overlay">
          <form onSubmit={handleUpdate} className="horror-form">
            <h2 className="ls-2">RE-PROGRAMAR INCURSIÓN</h2>

            <div className="form-group">
              <label className="form-label">NOMBRE DE LA OPERACIÓN</label>
              <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">OBJETIVOS (MÍN. 100 CARACTERES)</label>
              <textarea required minLength={100} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="min-h-150" />
              <small className={`fs-10 ${formData.description.length < 100 ? 'text-accent' : 'text-dim'}`}>
                CARACTERES: {formData.description.length} / 100
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">UBICACIÓN BASE (MÁX. 40 CARACTERES)</label>
              <input required maxLength={40} value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">FECHA Y HORA</label>
              <input required type="datetime-local" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">ENTIDAD OBJETIVO</label>
              <select required value={formData.phantom_id} onChange={e => setFormData({ ...formData, phantom_id: e.target.value })}>
                <option value="">SELECCIONAR ENTIDAD...</option>
                {phantoms && phantoms.map(p => (
                  <option key={p.id} value={p.id}>{p.name.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div className="flex-center mt-10 gap-20">
              <button type="submit" className="primary flex-1 p-15">ACTUALIZAR DATOS</button>
              <button type="button" onClick={() => setShowEditModal(false)} className="outline-red flex-1 p-15">CANCELAR</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
