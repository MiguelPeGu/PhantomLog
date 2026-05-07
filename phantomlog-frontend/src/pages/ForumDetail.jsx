import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getForum, deleteForum, updateForum } from '../api/forums'
import { createReport, getReports, updateReport, deleteReport } from '../api/reports'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import ShimmerImage from '../components/ShimmerImage'
import NotFound from './NotFound'

export default function ForumDetail() {
  const { id } = useParams()
  const [forum, setForum] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [reports, setReports] = useState([])
  const [loadingReports, setLoadingReports] = useState(true)
  const { user } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [showForumModal, setShowForumModal] = useState(false)
  const [forumData, setForumData] = useState({ title: '', description: '', image: null })

  const [showReportModal, setShowReportModal] = useState(false)
  const [isEditingReport, setIsEditingReport] = useState(false)
  const [currentReportId, setCurrentReportId] = useState(null)
  const [reportData, setReportData] = useState({ title: '', description: '', image: null })

  const [isCreatingReport, setIsCreatingReport] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    fetchForum()
    fetchReports()
  }, [id])

  const fetchForum = async () => {
    try {
      const res = await getForum(id)
      setForum(res.data)
      setForumData({ title: res.data.title, description: res.data.description, image: null })
    } catch (error) {
      setNotFound(true);
      addToast('ERROR AL CARGAR EL EXPEDIENTE', 'error');
    }
  }

  const fetchReports = async () => {
    setLoadingReports(true)
    try {
      const res = await getReports(id)
      setReports(res.data.data)
    } catch (error) {
      addToast('ERROR AL CARGAR LAS EVIDENCIAS', 'error')
    } finally {
      setLoadingReports(false)
    }
  }

  const handleUpdateForum = async (e) => {
    e.preventDefault()

    if (!forumData.title.trim() || !forumData.description.trim()) {
      return addToast('EL TÍTULO Y LA DESCRIPCIÓN SON OBLIGATORIOS', 'error')
    }

    try {
      const sendData = async (data) => {
        await updateForum(id, data)
        addToast('FORO ACTUALIZADO', 'success')
        setShowForumModal(false)
        fetchForum()
      }

      if (forumData.image) {
        const validTypes = ['image/jpeg', 'image/png', 'image/webp']
        if (!validTypes.includes(forumData.image.type)) {
          return addToast('EL ARCHIVO DEBE SER UNA IMAGEN (JPG, PNG O WEBP)', 'error')
        }

        const reader = new FileReader()
        reader.readAsDataURL(forumData.image)
        reader.onload = () => sendData({ ...forumData, image: reader.result })
      } else {
        await sendData({ title: forumData.title, description: forumData.description })
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'ERROR AL ACTUALIZAR'
      addToast(msg.toUpperCase(), 'error')
    }
  }

  const handleDeleteForum = async () => {
    if (!window.confirm('¿BORRAR ESTE FORO Y TODA SU EVIDENCIA?')) return
    try {
      await deleteForum(id)
      addToast('FORO ELIMINADO DEL ARCHIVO', 'success')
      navigate('/forums')
    } catch (err) {
      addToast('ERROR AL ELIMINAR EL FORO', 'error')
    }
  }

  const handleReportSubmit = async (e) => {
    e.preventDefault()
    if (isCreatingReport) return;

    if (!reportData.title.trim() || !reportData.description.trim()) {
      return addToast('EL TÍTULO Y LA DESCRIPCIÓN SON OBLIGATORIOS', 'error')
    }

    try {
      if (isEditingReport) {
        const sendUpdate = async (data) => {
          await updateReport(id, currentReportId, data)
          addToast('EVIDENCIA ACTUALIZADA', 'success')
          setShowReportModal(false)
          fetchReports()
        }

        if (reportData.image) {
          const validTypes = ['image/jpeg', 'image/png', 'image/webp']
          if (!validTypes.includes(reportData.image.type)) {
            return addToast('EL ARCHIVO DEBE SER UNA IMAGEN (JPG, PNG O WEBP)', 'error')
          }
          const reader = new FileReader()
          reader.readAsDataURL(reportData.image)
          reader.onload = () => sendUpdate({ ...reportData, image: reader.result })
        } else {
          await sendUpdate({ title: reportData.title, description: reportData.description })
        }
      } else {
        if (!reportData.image) return addToast('DEBES ADJUNTAR UNA EVIDENCIA VISUAL', 'error')

        const validTypes = ['image/jpeg', 'image/png', 'image/webp']
        if (!validTypes.includes(reportData.image.type)) {
          return addToast('EL ARCHIVO DEBE SER UNA IMAGEN (JPG, PNG O WEBP)', 'error')
        }

        setIsCreatingReport(true)
        setCountdown(3)

        const reader = new FileReader()
        reader.readAsDataURL(reportData.image)

        reader.onload = async () => {
          try {
            const apiPromise = createReport(id, {
              title: reportData.title,
              description: reportData.description,
              image: reader.result
            })

            // El contador visual baja cada segundo
            for (let i = 2; i >= 0; i--) {
              await new Promise(r => setTimeout(r, 1000))
              setCountdown(i)
            }

            await apiPromise

            setIsCreatingReport(false)
            setShowReportModal(false) // explicar el ciclo de abrir, set creating report a true y set showreportmodal, countdown, api promise, api response false, set creating report a false, close report modal, fetch reports, display toast and repeat.
            fetchReports()
            addToast('REPORTE SELLADO CON ÉXITO', 'success')
          } catch (err) {
            setIsCreatingReport(false)
            const errors = err.response?.data?.errors
            if (errors) {
              const firstError = Object.values(errors)[0][0]
              addToast(firstError.toUpperCase(), "error")
            } else {
              addToast((err.response?.data?.message || "ERROR AL CREAR REPORTE").toUpperCase(), "error")
            }
          }
        }
      }
    } catch (error) {
      setIsCreatingReport(false)
      addToast('ERROR CRÍTICO EN LA TRANSMISIÓN', 'error')
    }
  }

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('¿ELIMINAR ESTA EVIDENCIA?')) return
    try {
      await deleteReport(id, reportId)
      addToast('REPORTE ELIMINADO', 'success')
      fetchReports()
    } catch (err) {
      addToast('ERROR AL ELIMINAR LA EVIDENCIA', 'error')
    }
  }

  if (notFound) return <NotFound />
  if (!forum) {
    return (
      <div className="page-container">
        {/* Nav */}
        <div className="flex-center justify-between mb-40">
          <div className="skeleton" style={{ width: '180px', height: '36px', borderRadius: '4px' }}></div>
          <div className="flex-center gap-10">
            <div className="skeleton" style={{ width: '110px', height: '36px', borderRadius: '4px' }}></div>
            <div className="skeleton" style={{ width: '130px', height: '36px', borderRadius: '4px' }}></div>
          </div>
        </div>

        {/* Título + autor */}
        <div className="column align-center max-1000 mx-auto gap-20 mb-60">
          <div className="skeleton w-100 text-center" style={{ height: '52px', maxWidth: '700px' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>

          {/* Imagen */}
          <div className="horror-card mx-auto p-10 w-100" style={{ minHeight: '420px', maxWidth: '800px' }}>
            <div className="skeleton w-100" style={{ height: '400px' }}></div>
          </div>

          {/* Credibility bar */}
          <div className="w-100" style={{ maxWidth: '800px' }}>
            <div className="flex-center justify-between mb-10">
              <div className="skeleton" style={{ width: '110px', height: '12px' }}></div>
              <div className="skeleton" style={{ width: '130px', height: '12px' }}></div>
            </div>
            <div className="skeleton w-100" style={{ height: '8px', borderRadius: '4px' }}></div>
            <div className="skeleton skeleton-text mt-10" style={{ width: '180px' }}></div>
          </div>

          {/* Descripción */}
          <div className="horror-card w-100" style={{ maxWidth: '800px' }}>
            <div className="skeleton skeleton-text" style={{ width: '100%' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '95%' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
          </div>
        </div>

        {/* Report cards */}
        <div className="flex-center justify-between mb-40">
          <div className="skeleton" style={{ width: '200px', height: '36px' }}></div>
        </div>
        <div className="grid-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="horror-card column p-20" style={{ minHeight: '320px' }}>
              <div className="skeleton w-100 mb-20" style={{ height: '180px' }}></div>
              <div className="skeleton skeleton-title" style={{ width: '80%' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '100%' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const credibilityMarkerPos = Math.min(Math.max((forum.credibility_score + 20) * 2.5, 0), 100);

  return (
    <div className="page-container">
      <div className="flex-center justify-between mb-40">
        <Link to="/forums" className="btn">🡄 VOLVER A LOS FOROS</Link>
        {user && String(user.id) === String(forum?.user_id) && (
          <div className="flex-center gap-10">
            <button onClick={() => setShowForumModal(true)} className="p-8-15">EDITAR FORO</button>
            <button onClick={handleDeleteForum} className="outline-red p-8-15">ELIMINAR FORO</button>
          </div>
        )}
      </div>

      <div className="column align-center mb-60 gap-40 max-1000 mx-auto">
        <div className="text-center w-100">
          <h1 className="mb-20 fs-48">{forum.title}</h1>
          <p className="text-dim mb-40 fs-16">
            FORO INICIADO POR <span className="text-normal">{forum.user?.username.toUpperCase()}</span> EL {new Date(forum.created_at).toLocaleDateString()}
          </p>
        </div>

        {forum.image && (
          <div className="horror-card mx-auto p-10 mb-40" style={{ width: 'fit-content', minWidth: 'min(800px, 100%)', minHeight: '500px', maxHeight: '600px', display: 'block' }}>
            <ShimmerImage
              src={forum.image_url?.startsWith('http') ? forum.image_url : `http://localhost:8000/storage/${forum.image_url}`}
              alt={forum.title}
              objectFit="contain"
              style={{ minHeight: '480px' }}
            />
          </div>
        )}

        {/* Credibility Bar */}
        <div className="credibility-bar-wrapper w-100">
          <div className="credibility-labels">
            <span>DUBIOUS_DATA</span>
            <span>VERIFIED_ARCHIVE</span>
          </div>
          <div className="credibility-track">
            <div
              className="credibility-marker"
              style={{ left: `${credibilityMarkerPos}%` }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9V22L7 20L9 22L11 20L13 22L15 20L17 22L19 20L21 22V9C21 5.13 17.87 2 14 2H12Z" fill="white" />
                <circle cx="9" cy="9" r="1.5" fill="black" />
                <circle cx="15" cy="9" r="1.5" fill="black" />
                <path d="M10 13C10 13 11 14 12 14C13 14 14 13 14 13" stroke="black" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </div>
            <div className="credibility-center-line"></div>
          </div>
          <div
            className={`credibility-value ${forum.credibility_score >= 0 ? 'text-normal' : 'text-accent'}`}
          >
            GLOBAL_CREDIBILITY: {forum.credibility_score > 0 ? `+${forum.credibility_score.toFixed(1)}` : forum.credibility_score.toFixed(1)}
          </div>
        </div>

        <div className="horror-card fs-18 column lh-1-6 border-accent-left-3 pl-40 min-h-120 w-100 text-break">
          <div className={isExpanded ? '' : 'line-clamp-3'}>
            {forum.description}
          </div>

          {forum.description.length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-accent bold uppercase pointer w-fit mt-10 p-0 fs-12 no-border no-bg text-left"
            >
              {isExpanded ? '[ MOSTRAR MENOS ]' : '[ MOSTRAR MÁS ]'}
            </button>
          )}
        </div>
      </div>

      <div className="mt-60">
        <div className="flex-center justify-between mb-40">
          <h2 className="fs-32 m-0">REPORTES DE CAMPO</h2>
          {user && String(user.id) === String(forum.user_id) && (
            <button
              onClick={() => { setIsEditingReport(false); setReportData({ title: '', description: '', image: null }); setShowReportModal(true); }}
              className="primary"
              style={{ padding: '10px 30px' }}
            >
              + NUEVO REPORTE
            </button>
          )}
        </div>

        <div className="grid-3">
          {loadingReports ? (
            <div className="text-center text-dim border-dashed p-100 ls-2" style={{ gridColumn: '1/-1' }}>[ ESCANEANDO ARCHIVOS DE CAMPO... ]</div>
          ) : reports.length === 0 ? (
            <div className="text-center text-dim border-dashed p-100" style={{ gridColumn: '1/-1' }}>NO SE HAN REGISTRADO EVIDENCIAS TODAVÍA.</div>
          ) : (
            reports.map(r => (
              <div key={r.id} className="horror-card column p-20 min-h-320">
                <Link to={`/forums/${id}/reports/${r.id}`} className="flex-1 column">
                  <div className="card-image-box mb-20">
                    <ShimmerImage
                      src={r.image_url?.startsWith('http') ? r.image_url : `http://localhost:8000/storage/${r.image_url}`}
                      alt={r.title}
                      className="w-100 h-100 object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="fs-18 lh-1-2 word-break text-normal m-0 mb-10">
                      {r.title}
                    </h3>
                    <p className="fs-13 text-dim lh-1-4 line-clamp-2">
                      {r.description}
                    </p>
                  </div>
                </Link>
                {user && String(user.id) === String(r.user_id) && (
                  <div className="flex-center mt-20 gap-10">
                    <button onClick={() => { setCurrentReportId(r.id); setReportData({ title: r.title, description: r.description }); setIsEditingReport(true); setShowReportModal(true); }} className="flex-1 fs-12">EDITAR</button>
                    <button onClick={() => handleDeleteReport(r.id)} className="outline-red flex-1 fs-12">BORRAR</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {showForumModal && (
        <div className="modal-overlay">
          <form onSubmit={handleUpdateForum} className="horror-form">
            <h2>MODIFICAR FORO</h2>

            <div className="form-group">
              <label className="form-label">TÍTULO DEL FORO</label>
              <input required value={forumData.title} onChange={e => setForumData({ ...forumData, title: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">BITÁCORA DE HALLAZGOS</label>
              <textarea required value={forumData.description} onChange={e => setForumData({ ...forumData, description: e.target.value })} style={{ minHeight: '200px' }} />
            </div>

            <div className="form-group">
              <label className="form-label">ACTUALIZAR EVIDENCIA VISUAL (OPCIONAL)</label>
              <input type="file" onChange={e => setForumData({ ...forumData, image: e.target.files[0] })} className="text-normal" />
            </div>

            <div className="flex-center gap-20">
              <button type="submit" className="primary flex-1 p-15">ACTUALIZAR ARCHIVO</button>
              <button type="button" onClick={() => setShowForumModal(false)} className="outline-red flex-1 p-15">ABORTAR</button>
            </div>
          </form>
        </div>
      )}

      {showReportModal && (
        <div className="modal-overlay">
          <form onSubmit={handleReportSubmit} className="horror-form">
            <h2>{isEditingReport ? 'MODIFICAR EVIDENCIA' : 'REGISTRAR EVIDENCIA'}</h2>

            {isCreatingReport ? (
              <div className="text-center p-40">
                <p className="fs-20 ls-2">SELLANDO REPORTE EN EL ARCHIVO CENTRAL...</p>
                <div className="fs-64 m-30-0" style={{ color: 'var(--text)' }}>{countdown}</div>
                <div className="w-100 h-4 bg-black">
                  <div className="h-100 bg-accent transition-width" style={{ width: `${(countdown / 3) * 100}%` }}></div>
                </div>
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label className="form-label">TÍTULO DEL HALLAZGO</label>
                  <input required placeholder="Ej: Anomalía detectada en cámara 4" value={reportData.title} onChange={e => setReportData({ ...reportData, title: e.target.value })} />
                </div>

                <div className="form-group">
                  <label className="form-label">DESCRIPCIÓN DE LA EVIDENCIA</label>
                  <textarea required placeholder="Relata detalladamente lo observado..." value={reportData.description} onChange={e => setReportData({ ...reportData, description: e.target.value })} style={{ minHeight: '180px' }} />
                </div>

                <div className="form-group">
                  <label className="form-label">{isEditingReport ? 'ACTUALIZAR EVIDENCIA (OPCIONAL)' : 'CAPTURA DE EVIDENCIA (IMAGEN)'}</label>
                  <input type="file" required={!isEditingReport} onChange={e => setReportData({ ...reportData, image: e.target.files[0] })} className="text-normal" />
                </div>

                <div className="flex-center mt-20 gap-20">
                  <button type="submit" className="primary flex-1 p-15">{isEditingReport ? 'ACTUALIZAR DATOS' : 'REGISTRAR EVIDENCIA'}</button>
                  <button type="button" onClick={() => setShowReportModal(false)} className="outline-red flex-1 p-15">ABORTAR</button>
                </div>
              </>
            )}
          </form>
        </div>
      )}
    </div>
  )
}
