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

  if (error) return (
    <div className="vh100 flex-center column">
      <h2 className="text-accent">FALLO EN EL NÚCLEO</h2>
      <p className="text-dim">Error de red: {error}</p>
      <button onClick={fetchPhantom} className="mt-20">REINTENTAR ACCESO</button>
    </div>
  )

  if (notFound) return <NotFound />
  if (loading) return <div className="p-100 text-normal text-center ls-5">DESENCRIPTANDO ARCHIVO...</div>
  if (!phantom) return null

  return (
    <div className="page-container max-900">
      <button 
        onClick={() => navigate('/phantoms')} 
        className="mb-40"
      >
        🡄 VOLVER AL BESTIARIO
      </button>

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
    </div>
  )
}
