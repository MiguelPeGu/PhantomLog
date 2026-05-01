import { useState } from 'react'
import { Link } from 'react-router-dom'
import { createExpedition } from '../api/expeditions'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useData } from '../context/DataProvider'

export default function Expeditions() {
  const { expeditions, phantoms, refreshExpeditions } = useData()
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '', description: '', location: '', date: '', phantom_id: ''
  })
  const { user } = useAuth()
  const { addToast } = useToast()

  // No useEffect needed here as DataProvider handles pre-loading

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createExpedition(formData)
      addToast('Expedición programada', 'success')
      setShowModal(false)
      refreshExpeditions()
    } catch (e) { 
      const msg = e.response?.data?.message || 'Error al crear'
      addToast(msg.toUpperCase(), 'error') 
    }
  }

  return (
    <div className="page-container">
      <div className="flex-center" style={{ justifyContent: 'space-between', marginBottom: '40px', borderBottom: '1px solid var(--text-muted)', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '42px', letterSpacing: '4px' }}>CALENDARIO DE INCURSIÓN</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '14px', marginTop: '5px' }}>ZONAS DE ACTIVIDAD PARANORMAL CONFIRMADA</p>
        </div>
        {user && (
          <button 
            onClick={() => setShowModal(true)}
            style={{ padding: '15px 30px', letterSpacing: '1px' }}
          >
            + PROGRAMAR INCURSIÓN
          </button>
        )}
      </div>

      <div className="grid-3">
        {expeditions.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', gridColumn: '1/-1', padding: '100px' }}>NO HAY INCURSIONES PROGRAMADAS EN ESTE SECTOR.</p>
        ) : (
          expeditions.map(exp => {
            const isClosed = new Date(exp.date) < new Date()
            return (
              <Link 
                key={exp.id} 
                to={`/expeditions/${exp.id}`} 
                className={`horror-card column ${isClosed ? 'red' : ''}`}
                style={{ 
                  background: isClosed ? 'rgba(20,0,0,0.4)' : 'var(--card-bg)',
                  gap: '15px',
                  padding: '25px'
                }}
              >
                <div className="flex-center" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ color: isClosed ? 'var(--accent-dim)' : 'var(--accent)', margin: 0, fontSize: '20px' }}>{exp.name.toUpperCase()}</h3>
                  <div className={`status-badge ${isClosed ? 'closed' : 'active'}`}>
                    {isClosed ? 'FINALIZADA' : 'ACTIVA'}
                  </div>
                </div>

                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  <div>Ubicación: {exp.location.toUpperCase()}</div>
                  <div>Objetivo: {exp.phantom?.name.toUpperCase() || 'DESCONOCIDO'}</div>
                </div>

                <div style={{ 
                  borderTop: '1px solid #111', 
                  paddingTop: '15px', 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ color: 'var(--text-dim)', fontSize: '11px' }}>
                    {new Date(exp.date).toLocaleString()}
                  </div>
                  <div style={{ color: 'var(--accent)', fontSize: '11px', fontWeight: 'bold' }}>
                    {exp.participants_count} OPERATIVOS
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <form onSubmit={handleSubmit} className="horror-form">
            <h2 style={{ letterSpacing: '2px' }}>NUEVA INCURSIÓN</h2>
            
            <input required placeholder="NOMBRE DE LA MISIÓN" onChange={e => setFormData({...formData, name: e.target.value})} />
            <textarea required placeholder="DESCRIPCIÓN Y OBJETIVOS" onChange={e => setFormData({...formData, description: e.target.value})} style={{ minHeight: '100px' }} />
            <input required placeholder="UBICACIÓN" onChange={e => setFormData({...formData, location: e.target.value})} />
            <input required type="datetime-local" onChange={e => setFormData({...formData, date: e.target.value})} />
            
            <select required onChange={e => setFormData({...formData, phantom_id: e.target.value})}>
              <option value="">SELECCIONAR ENTIDAD OBJETIVO</option>
              {phantoms.map(p => (
                <option key={p.id} value={p.id}>{p.name.toUpperCase()}</option>
              ))}
            </select>

            <div className="flex-center" style={{ gap: '20px', marginTop: '10px' }}>
              <button type="submit" className="primary" style={{ flex: 1, padding: '15px' }}>DESPLEGAR</button>
              <button type="button" onClick={() => setShowModal(false)} className="outline-red" style={{ flex: 1, padding: '15px' }}>ABORTAR</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
