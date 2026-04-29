import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getExpeditions, createExpedition } from '../api/expeditions'
import { getPhantoms } from '../api/phantoms'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Expeditions() {
  const [expeditions, setExpeditions] = useState([])
  const [phantoms, setPhantoms] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '', description: '', location: '', date: '', phantom_id: ''
  })
  const { user } = useAuth()
  const { addToast } = useToast()

  useEffect(() => {
    fetchExpeditions()
    fetchPhantoms()
  }, [])

  const fetchExpeditions = async () => {
    try {
      const res = await getExpeditions()
      setExpeditions(res.data)
    } catch (e) { addToast('Error al cargar expediciones', 'error') }
  }

  const fetchPhantoms = async () => {
    try {
      const res = await getPhantoms()
      setPhantoms(res.data)
    } catch (e) { console.error(e) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createExpedition(formData)
      addToast('Expedición programada', 'success')
      setShowModal(false)
      fetchExpeditions()
    } catch (e) { 
      const msg = e.response?.data?.message || 'Error al crear'
      addToast(msg.toUpperCase(), 'error') 
    }
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #040', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ color: '#f00', fontSize: '42px', margin: 0, letterSpacing: '4px' }}>CALENDARIO DE INCURSIÓN</h1>
          <p style={{ color: '#060', fontSize: '14px', marginTop: '5px' }}>ZONAS DE ACTIVIDAD PARANORMAL CONFIRMADA</p>
        </div>
        {user && (
          <button 
            onClick={() => setShowModal(true)}
            style={{ padding: '15px 30px', fontWeight: 'bold', letterSpacing: '1px' }}
          >
            + PROGRAMAR INCURSIÓN
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
        {expeditions.length === 0 ? (
          <p style={{ color: '#040', textAlign: 'center', gridColumn: '1/-1', padding: '100px' }}>NO HAY INCURSIONES PROGRAMADAS EN ESTE SECTOR.</p>
        ) : (
          expeditions.map(exp => {
            const isClosed = new Date(exp.date) < new Date()
            return (
              <Link 
                key={exp.id} 
                to={`/expeditions/${exp.id}`} 
                style={{ 
                  border: `1px solid ${isClosed ? '#200' : '#060'}`, 
                  padding: '25px', 
                  textDecoration: 'none', 
                  background: isClosed ? 'rgba(20,0,0,0.4)' : '#000',
                  position: 'relative',
                  transition: 'transform 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ color: isClosed ? '#600' : '#f00', margin: 0, fontSize: '20px' }}>{exp.name.toUpperCase()}</h3>
                  <div style={{ 
                    fontSize: '10px', 
                    padding: '2px 8px', 
                    background: isClosed ? '#400' : '#040', 
                    color: '#fff',
                    borderRadius: '2px'
                  }}>
                    {isClosed ? 'FINALIZADA' : 'ACTIVA'}
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: '#0f0', opacity: 0.8 }}>
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
                  <div style={{ color: '#060', fontSize: '11px' }}>
                    {new Date(exp.date).toLocaleString()}
                  </div>
                  <div style={{ color: '#f00', fontSize: '11px', fontWeight: 'bold' }}>
                    {exp.participants_count} OPERATIVOS
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form onSubmit={handleSubmit} style={{ background: '#000', border: '1px solid #f00', padding: '40px', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ color: '#f00', margin: 0, letterSpacing: '2px' }}>NUEVA INCURSIÓN</h2>
            
            <input required placeholder="NOMBRE DE LA MISIÓN" onChange={e => setFormData({...formData, name: e.target.value})} style={{ background: '#000', border: '1px solid #060', color: '#0f0', padding: '12px' }} />
            <textarea required placeholder="DESCRIPCIÓN Y OBJETIVOS" onChange={e => setFormData({...formData, description: e.target.value})} style={{ background: '#000', border: '1px solid #060', color: '#0f0', padding: '12px', minHeight: '100px' }} />
            <input required placeholder="UBICACIÓN" onChange={e => setFormData({...formData, location: e.target.value})} style={{ background: '#000', border: '1px solid #060', color: '#0f0', padding: '12px' }} />
            <input required type="datetime-local" onChange={e => setFormData({...formData, date: e.target.value})} style={{ background: '#000', border: '1px solid #060', color: '#0f0', padding: '12px' }} />
            
            <select required onChange={e => setFormData({...formData, phantom_id: e.target.value})} style={{ background: '#000', border: '1px solid #060', color: '#0f0', padding: '12px' }}>
              <option value="">SELECCIONAR ENTIDAD OBJETIVO</option>
              {phantoms.map(p => (
                <option key={p.id} value={p.id}>{p.name.toUpperCase()}</option>
              ))}
            </select>

            <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
              <button type="submit" style={{ flex: 1, padding: '15px' }}>DESPLEGAR</button>
              <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '15px', color: '#f00', borderColor: '#f00' }}>ABORTAR</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
