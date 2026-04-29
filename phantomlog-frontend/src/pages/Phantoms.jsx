import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPhantoms } from '../api/phantoms'
import { useToast } from '../context/ToastContext'

export default function Phantoms() {
  const [phantoms, setPhantoms] = useState([])
  const { addToast } = useToast()

  useEffect(() => {
    fetchPhantoms()
  }, [])

  const fetchPhantoms = async () => {
    try {
      const res = await getPhantoms()
      setPhantoms(res.data)
    } catch (e) {
      addToast('Error al conectar con la base de datos de entidades', 'error')
    }
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ borderBottom: '1px solid #040', paddingBottom: '20px', marginBottom: '40px' }}>
        <h1 style={{ color: '#f00', fontSize: '42px', margin: 0, letterSpacing: '8px' }}>EL BESTIARIO</h1>
        <p style={{ color: '#060', fontSize: '14px', marginTop: '5px' }}>BASE DE DATOS DE ENTIDADES CLASIFICADAS // ACCESO NIVEL 4</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
        {phantoms.map(p => (
          <Link 
            key={p.id} 
            to={`/phantoms/${p.id}`} 
            style={{ 
              border: '1px solid #111', 
              padding: '20px', 
              background: 'rgba(0,10,0,0.4)',
              textDecoration: 'none',
              transition: 'all 0.3s',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#0f0';
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,255,0,0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#111';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2 style={{ color: '#f00', margin: 0, fontSize: '24px', letterSpacing: '2px' }}>{p.name.toUpperCase()}</h2>
              <span style={{ color: '#060', fontSize: '10px' }}>TYPE: {p.type.toUpperCase()}</span>
            </div>
            
            <div style={{ color: '#0f0', fontSize: '11px', borderTop: '1px solid #111', paddingTop: '10px' }}>
              <strong style={{ color: '#060' }}>EVIDENCIA:</strong><br />
              {p.evidence}
            </div>

            <div style={{ 
              position: 'absolute', 
              bottom: '10px', 
              right: '10px', 
              color: '#020', 
              fontSize: '24px', 
              opacity: 0.2,
              fontWeight: 'bold'
            }}>
              ?
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
