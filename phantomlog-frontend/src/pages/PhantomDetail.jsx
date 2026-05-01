import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPhantom } from '../api/phantoms'
import { useToast } from '../context/ToastContext'
import ShimmerImage from '../components/ShimmerImage'
import NotFound from './NotFound'

export default function PhantomDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [phantom, setPhantom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetchPhantom()
  }, [id])

  const fetchPhantom = async () => {
    try {
      const res = await getPhantom(id)
      setPhantom(res.data)
    } catch (e) {
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  if (notFound) return <NotFound />
  if (loading) return <div style={{ padding: '100px', color: 'var(--text)', textAlign: 'center', letterSpacing: '5px' }}>DESENCRIPTANDO ARCHIVO...</div>
  if (!phantom) return null

  return (
    <div className="page-container" style={{ maxWidth: '900px' }}>
      <button 
        onClick={() => navigate('/phantoms')} 
        className="mb-40"
      >
        🡄 VOLVER AL BESTIARIO
      </button>

      <div className="horror-card" style={{ padding: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px' }}>
          
          {/* Visual Evidence Section */}
          <div className="column" style={{ gap: '20px' }}>
            <div style={{ width: '100%', aspectRatio: '1/1', border: '1px solid var(--border)', background: '#050505', overflow: 'hidden' }}>
              <ShimmerImage 
                src={phantom.image} 
                alt={phantom.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(150%)' }} 
              />
            </div>
            <div style={{ border: '1px solid #111', padding: '15px', background: 'rgba(255,0,0,0.05)' }}>
              <h4 style={{ color: 'var(--accent)', margin: '0 0 10px 0', fontSize: '12px', letterSpacing: '2px' }}>EVIDENCIA REQUERIDA</h4>
              <p style={{ color: 'var(--text)', fontSize: '14px', margin: 0 }}>{phantom.evidence}</p>
            </div>
          </div>

          {/* Data Section */}
          <div>
            <div style={{ borderBottom: '1px solid #200', paddingBottom: '20px', marginBottom: '25px' }}>
              <h1 style={{ fontSize: '48px', margin: 0, letterSpacing: '5px' }}>{phantom.name.toUpperCase()}</h1>
              <span style={{ color: 'var(--text-dim)', fontSize: '14px' }}>CLASIFICACIÓN: {phantom.type.toUpperCase()}</span>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '14px', margin: '0 0 10px 0', letterSpacing: '1px' }}>DESCRIPCIÓN DEL ENTE</h3>
              <p style={{ color: '#aaa', lineHeight: '1.6', fontSize: '16px' }}>{phantom.description}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ padding: '15px', border: '1px solid var(--border)', background: 'rgba(0,255,0,0.02)' }}>
                <h4 style={{ color: 'var(--text)', margin: '0 0 10px 0', fontSize: '12px' }}>PUNTOS FUERTES</h4>
                <p style={{ color: 'var(--text-dim)', fontSize: '13px', margin: 0 }}>{phantom.strengths}</p>
              </div>
              <div style={{ padding: '15px', border: '1px solid var(--accent-dim)', background: 'rgba(255,0,0,0.02)' }}>
                <h4 style={{ color: 'var(--accent)', margin: '0 0 10px 0', fontSize: '12px' }}>DEBILIDADES</h4>
                <p style={{ color: 'var(--accent-dim)', fontSize: '13px', margin: 0 }}>{phantom.weaknesses}</p>
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
