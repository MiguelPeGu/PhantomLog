import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getExpedition, toggleJoin, deleteExpedition } from '../api/expeditions'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import NotFound from './NotFound'

export default function ExpeditionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToast } = useToast()
  
  const [expedition, setExpedition] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [isJoined, setIsJoined] = useState(false)

  useEffect(() => {
    fetchExpedition()
  }, [id])

  const fetchExpedition = async () => {
    try {
      const res = await getExpedition(id)
      setExpedition(res.data)
      if (user) {
        const joined = res.data.participants.some(p => String(p.id) === String(user.id))
        setIsJoined(joined)
      }
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

  if (loading) return <div style={{ padding: '100px', color: '#0f0', textAlign: 'center' }}>ESCANEANDO FRECUENCIAS...</div>
  if (!expedition) return null

  const isClosed = new Date(expedition.date) < new Date()

  return (
    <div className="page-container" style={{ maxWidth: '1000px' }}>
      <div className="flex-center mb-40" style={{ justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/expeditions')}>🡄 VOLVER AL CALENDARIO</button>
        {user && String(user.id) === String(expedition.user_id) && (
          <button onClick={handleDelete} className="outline-red">ELIMINAR INCURSIÓN</button>
        )}
      </div>

      <div className="horror-card" style={{ 
        border: `2px solid ${isClosed ? 'var(--accent)' : 'var(--border)'}`, 
        padding: '40px',
        position: 'relative',
        boxShadow: isClosed ? '0 0 50px rgba(255,0,0,0.1)' : 'none'
      }}>
        {/* Header Section */}
        <div style={{ borderBottom: '1px solid #111', paddingBottom: '30px', marginBottom: '30px' }}>
          <div className="flex-center mb-20" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '48px', margin: 0, letterSpacing: '4px' }}>{expedition.name.toUpperCase()}</h1>
              <p style={{ color: 'var(--text-dim)', fontSize: '14px', margin: '10px 0 0 0' }}>UBICACIÓN: <span style={{ color: 'var(--text)' }}>{expedition.location.toUpperCase()}</span></p>
            </div>
            <div className={`status-badge ${isClosed ? 'closed' : 'active'}`} style={{ padding: '10px 20px' }}>
              {isClosed ? 'ESTADO: FINALIZADA' : 'ESTADO: RECLUTANDO'}
            </div>
          </div>

          <div className="flex-center" style={{ gap: '30px', fontSize: '16px' }}>
            <div>FECHA: {new Date(expedition.date).toLocaleDateString()}</div>
            <div>HORA: {new Date(expedition.date).toLocaleTimeString()}</div>
            <div>AUTOR: {expedition.user?.username.toUpperCase()}</div>
          </div>
        </div>

        {/* Info & Participants Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
          <div>
            <h3 style={{ borderBottom: '1px solid var(--text-muted)', paddingBottom: '10px' }}>OBJETIVOS DE LA MISIÓN</h3>
            <p style={{ lineHeight: '1.6', fontSize: '18px' }}>{expedition.description}</p>
            
            <div className="horror-card" style={{ marginTop: '30px', padding: '20px' }}>
              <h4 style={{ color: 'var(--text-dim)', margin: '0 0 10px 0' }}>ENTIDAD DETECTADA</h4>
              <div style={{ color: 'var(--accent)', fontSize: '24px', fontWeight: 'bold' }}>
                {expedition.phantom?.name.toUpperCase() || 'DESCONOCIDO'}
              </div>
            </div>

            {!isClosed && (
              <button 
                onClick={handleJoin}
                className={`w-100 mt-40 ${isJoined ? 'outline-red' : 'primary'}`}
                style={{ 
                  padding: '20px', 
                  fontSize: '20px', 
                }}
              >
                {isJoined ? 'ABANDONAR EXPEDICIÓN' : 'CONFIRMAR ASISTENCIA'}
              </button>
            )}
          </div>

          <div style={{ borderLeft: '1px solid #111', paddingLeft: '40px' }}>
            <h3 style={{ borderBottom: '1px solid var(--text-muted)', paddingBottom: '10px' }}>OPERATIVOS ({expedition.participants_count})</h3>
            <div className="column" style={{ gap: '10px', marginTop: '20px' }}>
              {expedition.participants?.length === 0 ? (
                <p style={{ color: 'var(--text-dim)' }}>NADIE SE HA ATREVIDO TODAVÍA.</p>
              ) : (
                expedition.participants.map(p => (
                  <div key={p.id} className="flex-center" style={{ gap: '12px', padding: '10px', background: 'rgba(0,255,0,0.02)', border: '1px solid var(--border)' }}>
                    <div className="flex-center" style={{ width: '30px', height: '30px', background: 'var(--text)', color: '#000', fontWeight: 'bold', fontSize: '12px' }}>
                      {p.username[0].toUpperCase()}
                    </div>
                    <span style={{ fontSize: '14px' }}>{p.username.toUpperCase()}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
