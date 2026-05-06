import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getPhantom } from '../api/phantoms'
import { getExpeditions } from '../api/expeditions'
import { useToast } from '../context/ToastContext'
import { useData } from '../context/DataProvider'
import ShimmerImage from '../components/ShimmerImage'
import NotFound from './NotFound'

export default function PhantomDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { expeditions, loadingExpeditions } = useData()
  const [phantom, setPhantom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [localExpeditions, setLocalExpeditions] = useState([])
  const [loadingLocals, setLoadingLocals] = useState(true)
  const [showExpeditions, setShowExpeditions] = useState(false)
  const [error, setError] = useState(null)

  const fetchPhantom = async () => {
    try {
      const res = await getPhantom(id)
      setPhantom(res.data)
    } catch (e) {
      if (e.response?.status === 404) {
        setNotFound(true)
      } else {
        setError(e.response?.data?.message || e.message)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPhantom()
    const fetchLocals = async () => {
      setLoadingLocals(true)
      try {
        const res = await getExpeditions({ phantom_id: id, per_page: 100 })
        setLocalExpeditions(res.data.data || res.data)
      } catch (e) {
        console.error("Error al rastrear incursiones")
      } finally {
        setLoadingLocals(false)
      }
    }
    fetchLocals()
  }, [id])

  if (error) return (
    <div className="vh100 flex-center column">
      <h2 className="text-accent">FALLO EN EL NÚCLEO</h2>
      <p className="text-dim">Error de red: {error}</p>
      <button onClick={fetchPhantom} className="mt-20">REINTENTAR ACCESO</button>
    </div>
  )

  if (notFound) return <NotFound />
  
  if (loading) {
    return (
      <div className="page-container max-900">
        <div className="skeleton mb-40" style={{ width: '220px', height: '36px', borderRadius: '4px' }}></div>
        
        <div className="horror-card p-25 mb-40">
          <div className="grid-2 gap-40 grid-1-15">
            {/* Visual Evidence Skeleton */}
            <div className="column gap-20">
              <div className="bestiary-img-box">
                <div className="skeleton w-100 h-100"></div>
              </div>
              <div className="bestiary-evidence-box">
                <div className="skeleton mb-10" style={{ width: '120px', height: '12px' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '100%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
              </div>
            </div>

            {/* Data Skeleton */}
            <div>
              <div className="border-bottom pb-20 mb-20">
                <div className="skeleton skeleton-title" style={{ width: '70%', height: '42px' }}></div>
                <div className="skeleton" style={{ width: '140px', height: '14px' }}></div>
              </div>

              <div className="mb-40">
                <div className="skeleton mb-10" style={{ width: '160px', height: '14px' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '100%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '95%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '90%' }}></div>
              </div>

              <div className="grid-2 gap-20">
                <div className="stat-box">
                  <div className="skeleton mb-10" style={{ width: '100px', height: '12px' }}></div>
                  <div className="skeleton skeleton-text" style={{ width: '100%' }}></div>
                </div>
                <div className="stat-box-red">
                  <div className="skeleton mb-10" style={{ width: '100px', height: '12px' }}></div>
                  <div className="skeleton skeleton-text" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div className="investigator-note">
                <div className="skeleton skeleton-text" style={{ width: '100%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Expeditions Skeleton */}
        <div className="border-top pt-30">
          <div className="skeleton w-100" style={{ height: '70px', borderRadius: '4px' }}></div>
        </div>
      </div>
    )
  }

  if (!phantom) return null

  return (
    <div className="page-container max-900">
      <Link 
        to="/phantoms" 
        className="btn mb-40"
      >
        🡄 VOLVER AL BESTIARIO
      </Link>

      <div className="horror-card p-25 mb-40">
        <div className="grid-2 gap-40 grid-1-15">
          
          {/* Visual Evidence Section */}
          <div className="column gap-20">
            <div className="bestiary-img-box">
              <ShimmerImage 
                src={phantom.image?.startsWith('http') ? phantom.image : `http://localhost:8000/storage/${phantom.image}`} 
                alt={phantom.name}
                objectFit="cover"
                className="contrast-high"
              />
            </div>
            <div className="bestiary-evidence-box">
              <h4 className="text-accent m-0 mb-10 fs-12 ls-2">EVIDENCIA REQUERIDA</h4>
              <p className="fs-14 m-0">{phantom.evidence}</p>
            </div>
          </div>

          {/* Data Section */}
          <div>
            <div className="border-bottom pb-20 mb-20">
              <h1 className="fs-42 m-0 ls-5">{phantom.name.toUpperCase()}</h1>
              <span className="text-dim fs-14">CLASIFICACIÓN: {phantom.type.toUpperCase()}</span>
            </div>

            <div className="mb-40">
              <h3 className="fs-14 mb-10 ls-1">DESCRIPCIÓN DEL ENTE</h3>
              <p className="text-dim lh-1-6 fs-16">{phantom.description}</p>
            </div>

            <div className="grid-2 gap-20">
              <div className="stat-box">
                <h4 className="text-normal m-0 mb-10 fs-12">PUNTOS FUERTES</h4>
                <p className="text-dim fs-13 m-0">{phantom.strengths}</p>
              </div>
              <div className="stat-box-red">
                <h4 className="text-accent m-0 mb-10 fs-12">DEBILIDADES</h4>
                <p className="text-accent-dim fs-13 m-0">{phantom.weaknesses}</p>
              </div>
            </div>

            <div className="investigator-note">
              NOTA DEL INVESTIGADOR: ESTA ENTIDAD ES EXTREMADAMENTE PELIGROSA. NO INTENTAR CONTACTO SIN EQUIPO DE PROTECCIÓN NIVEL 3.
            </div>
          </div>

        </div>
      </div>

      {/* ── Expeditions Section ─────────────────────────────── */}
      <div className="border-top pt-30">
        <button
          onClick={() => setShowExpeditions(prev => !prev)}
          className="flex-center gap-15 w-100 justify-between p-20 horror-card mb-20"
          style={{ textAlign: 'left' }}
        >
          <div className="flex-center gap-15">
            <span className="fs-18 ls-2">INCURSIONES RELACIONADAS</span>
            {localExpeditions.length > 0 && (
              <span className="status-badge active fs-10">
                {localExpeditions.length} REGISTRADAS
              </span>
            )}
          </div>
          <span className="fs-20 text-dim">{showExpeditions ? '▲' : '▼'}</span>
        </button>

        {showExpeditions && (
          <div className="column gap-15">
            {loadingLocals ? (
              <div className="text-center text-dim border-dashed p-60 fs-14 ls-2">
                RASTREANDO INCURSIONES ASOCIADAS...
              </div>
            ) : localExpeditions.length === 0 ? (
              <div className="text-center text-dim border-dashed p-60 fs-14 ls-2">
                NO HAY INCURSIONES PROGRAMADAS PARA ESTA ENTIDAD.
              </div>
            ) : (
              localExpeditions.map(exp => {
                const isClosed = new Date(exp.date) < new Date()
                return (
                  <Link
                    key={exp.id}
                    to={`/expeditions/${exp.id}`}
                    className="horror-card p-20 flex-center justify-between gap-20"
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="flex-1">
                      <div className="flex-center gap-10 mb-5">
                        <h3 className="m-0 fs-16 ls-1">{exp.name.toUpperCase()}</h3>
                        <span className={`status-badge ${isClosed ? 'closed' : 'active'} fs-9`}>
                          {isClosed ? 'FINALIZADA' : 'ACTIVA'}
                        </span>
                      </div>
                      <p className="m-0 fs-12 text-dim">
                         {exp.location.toUpperCase()} &nbsp;·&nbsp;  {new Date(exp.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right text-dim fs-11 nowrap">
                      <div>{exp.participants_count} OPERATIVOS</div>
                      <div className="text-accent mt-5">VER DETALLE →</div>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        )}
      </div>

    </div>
  )
}
