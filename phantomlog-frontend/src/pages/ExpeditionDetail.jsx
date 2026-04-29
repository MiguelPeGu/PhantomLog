import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getExpedition, toggleJoin, deleteExpedition } from '../api/expeditions'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function ExpeditionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToast } = useToast()
  
  const [expedition, setExpedition] = useState(null)
  const [loading, setLoading] = useState(true)
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
      addToast('Error al cargar la expedición', 'error')
      navigate('/expeditions')
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
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <button 
          onClick={() => navigate('/expeditions')} 
          style={{ background: 'none', border: '1px solid #0f0', color: '#0f0', padding: '8px 15px', cursor: 'pointer' }}
        >
          🡄 VOLVER AL CALENDARIO
        </button>
        {user && String(user.id) === String(expedition.user_id) && (
          <button onClick={handleDelete} style={{ background: '#000', border: '1px solid #f00', color: '#f00', padding: '8px 15px', cursor: 'pointer' }}>
            ELIMINAR INCURSIÓN
          </button>
        )}
      </div>

      <div style={{ 
        border: `2px solid ${isClosed ? '#f00' : '#060'}`, 
        background: '#000', 
        padding: '40px',
        position: 'relative',
        boxShadow: isClosed ? '0 0 50px rgba(255,0,0,0.1)' : 'none'
      }}>
        {/* Header Section */}
        <div style={{ borderBottom: '1px solid #111', paddingBottom: '30px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <h1 style={{ color: '#f00', fontSize: '48px', margin: 0, letterSpacing: '4px' }}>{expedition.name.toUpperCase()}</h1>
              <p style={{ color: '#060', fontSize: '14px', margin: '10px 0 0 0' }}>UBICACIÓN: <span style={{ color: '#0f0' }}>{expedition.location.toUpperCase()}</span></p>
            </div>
            <div style={{ 
              background: isClosed ? '#400' : '#040', 
              color: '#fff', 
              padding: '10px 20px', 
              fontWeight: 'bold',
              letterSpacing: '2px',
              border: `1px solid ${isClosed ? '#f00' : '#0f0'}`
            }}>
              {isClosed ? 'ESTADO: FINALIZADA' : 'ESTADO: RECLUTANDO'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '30px', color: '#0f0', fontSize: '16px' }}>
            <div>FECHA: {new Date(expedition.date).toLocaleDateString()}</div>
            <div>HORA: {new Date(expedition.date).toLocaleTimeString()}</div>
            <div>AUTOR: {expedition.user?.username.toUpperCase()}</div>
          </div>
        </div>

        {/* Info & Participants Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
          <div>
            <h3 style={{ color: '#f00', borderBottom: '1px solid #200', paddingBottom: '10px' }}>OBJETIVOS DE LA MISIÓN</h3>
            <p style={{ color: '#0f0', lineHeight: '1.6', fontSize: '18px' }}>{expedition.description}</p>
            
            <div style={{ marginTop: '30px', padding: '20px', background: '#080808', border: '1px solid #111' }}>
              <h4 style={{ color: '#060', margin: '0 0 10px 0' }}>ENTIDAD DETECTADA</h4>
              <div style={{ color: '#f00', fontSize: '24px', fontWeight: 'bold' }}>
                {expedition.phantom?.name.toUpperCase() || 'DESCONOCIDO'}
              </div>
            </div>

            {!isClosed && (
              <button 
                onClick={handleJoin}
                style={{ 
                  marginTop: '40px', 
                  width: '100%', 
                  padding: '20px', 
                  fontSize: '20px', 
                  background: isJoined ? '#000' : '#f00',
                  color: isJoined ? '#f00' : '#000',
                  border: isJoined ? '2px solid #f00' : 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {isJoined ? 'ABANDONAR EXPEDICIÓN' : 'CONFIRMAR ASISTENCIA'}
              </button>
            )}
          </div>

          <div style={{ borderLeft: '1px solid #111', paddingLeft: '40px' }}>
            <h3 style={{ color: '#f00', borderBottom: '1px solid #200', paddingBottom: '10px' }}>OPERATIVOS ({expedition.participants_count})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
              {expedition.participants?.length === 0 ? (
                <p style={{ color: '#040' }}>NADIE SE HA ATREVIDO TODAVÍA.</p>
              ) : (
                expedition.participants.map(p => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'rgba(0,255,0,0.02)', border: '1px solid #111' }}>
                    <div style={{ width: '30px', height: '30px', background: '#0f0', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                      {p.username[0].toUpperCase()}
                    </div>
                    <span style={{ color: '#0f0', fontSize: '14px' }}>{p.username.toUpperCase()}</span>
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
