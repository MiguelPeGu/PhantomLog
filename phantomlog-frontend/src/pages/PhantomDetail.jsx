import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPhantom } from '../api/phantoms'
import { useToast } from '../context/ToastContext'
import ShimmerImage from '../components/ShimmerImage'

export default function PhantomDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [phantom, setPhantom] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPhantom()
  }, [id])

  const fetchPhantom = async () => {
    try {
      const res = await getPhantom(id)
      setPhantom(res.data)
    } catch (e) {
      addToast('Error al acceder al archivo clasificado', 'error')
      navigate('/phantoms')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div style={{ padding: '100px', color: '#0f0', textAlign: 'center', letterSpacing: '5px' }}>DESENCRIPTANDO ARCHIVO...</div>
  if (!phantom) return null

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px' }}>
      <button 
        onClick={() => navigate('/phantoms')} 
        style={{ background: 'none', border: '1px solid #0f0', color: '#0f0', padding: '8px 15px', cursor: 'pointer', marginBottom: '30px' }}
      >
        🡄 VOLVER AL BESTIARIO
      </button>

      <div style={{ border: '1px solid #f00', padding: '40px', background: '#000', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px' }}>
          
          {/* Visual Evidence Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ width: '100%', aspectRatio: '1/1', border: '1px solid #060', background: '#050505', overflow: 'hidden' }}>
              <ShimmerImage 
                src={phantom.image} 
                alt={phantom.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(150%)' }} 
              />
            </div>
            <div style={{ border: '1px solid #111', padding: '15px', background: 'rgba(255,0,0,0.05)' }}>
              <h4 style={{ color: '#f00', margin: '0 0 10px 0', fontSize: '12px', letterSpacing: '2px' }}>EVIDENCIA REQUERIDA</h4>
              <p style={{ color: '#0f0', fontSize: '14px', margin: 0, fontFamily: 'monospace' }}>{phantom.evidence}</p>
            </div>
          </div>

          {/* Data Section */}
          <div>
            <div style={{ borderBottom: '1px solid #200', paddingBottom: '20px', marginBottom: '25px' }}>
              <h1 style={{ color: '#f00', fontSize: '48px', margin: 0, letterSpacing: '5px' }}>{phantom.name.toUpperCase()}</h1>
              <span style={{ color: '#060', fontSize: '14px' }}>CLASIFICACIÓN: {phantom.type.toUpperCase()}</span>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#0f0', fontSize: '14px', margin: '0 0 10px 0', letterSpacing: '1px' }}>DESCRIPCIÓN DEL ENTE</h3>
              <p style={{ color: '#aaa', lineHeight: '1.6', fontSize: '16px' }}>{phantom.description}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ padding: '15px', border: '1px solid #040', background: 'rgba(0,255,0,0.02)' }}>
                <h4 style={{ color: '#0f0', margin: '0 0 10px 0', fontSize: '12px' }}>PUNTOS FUERTES</h4>
                <p style={{ color: '#060', fontSize: '13px', margin: 0 }}>{phantom.strengths}</p>
              </div>
              <div style={{ padding: '15px', border: '1px solid #400', background: 'rgba(255,0,0,0.02)' }}>
                <h4 style={{ color: '#f00', margin: '0 0 10px 0', fontSize: '12px' }}>DEBILIDADES</h4>
                <p style={{ color: '#600', fontSize: '13px', margin: 0 }}>{phantom.weaknesses}</p>
              </div>
            </div>

            <div style={{ marginTop: '30px', padding: '20px', background: '#080808', border: '1px solid #111', fontSize: '11px', color: '#333' }}>
              NOTA DEL INVESTIGADOR: ESTA ENTIDAD ES EXTREMADAMENTE PELIGROSA. NO INTENTAR CONTACTO SIN EQUIPO DE PROTECCIÓN NIVEL 3.
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
