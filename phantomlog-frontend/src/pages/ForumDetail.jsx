import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getForum, deleteForum, updateForum } from '../api/forums'
import { createReport, getReports, updateReport, deleteReport } from '../api/reports'
import { useAuth } from '../context/AuthContext' //asi mantiene al usuario logueado?
import { useToast } from '../context/ToastContext'
import ShimmerImage from '../components/ShimmerImage'
import NotFound from './NotFound'

export default function ForumDetail() {
  const { id } = useParams()
  const [forum, setForum] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [reports, setReports] = useState([])
  const { user } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [showForumModal, setShowForumModal] = useState(false)
  const [forumData, setForumData] = useState({ title: '', description: '' })
  
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
      setForumData({ title: res.data.title, description: res.data.description })
    } catch (error) { 
      setNotFound(true);
      addToast('Error al cargar foro', 'error');
    }
  }

  const fetchReports = async () => {
    try {
      const res = await getReports(id)
      setReports(res.data.data || res.data)
    } catch (error) { console.error(error) }
  }

  const handleUpdateForum = async (e) => {
    e.preventDefault()
    try {
      await updateForum(id, forumData)
      addToast('Foro actualizado', 'success')
      setShowForumModal(false)
      fetchForum()
    } catch (error) { addToast('Error al actualizar', 'error') }
  }

  const handleDeleteForum = async () => {
    if (!window.confirm('¿Borrar este foro y todos sus reportes?')) return
    try {
      await deleteForum(id)
      addToast('Foro eliminado', 'success')
      navigate('/forums')
    } catch (error) { addToast('Error al eliminar', 'error') }
  }

  const handleReportSubmit = async (e) => {
    e.preventDefault()
    if (isCreatingReport) return;

    try {
      if (isEditingReport) {
        await updateReport(id, currentReportId, { title: reportData.title, description: reportData.description })
        addToast('Reporte actualizado', 'success')
        setShowReportModal(false)
        fetchReports()
      } else {
        setIsCreatingReport(true)
        setCountdown(3)
        
        const reader = new FileReader()
        reader.readAsDataURL(reportData.image)
        reader.onload = async () => {
          try {
            await createReport(id, { title: reportData.title, description: reportData.description, image: reader.result })
                        for (let i = 3; i > 0; i--) {
              setCountdown(i)
              await new Promise(r => setTimeout(r, 1000))
            }
            
            setIsCreatingReport(false)
            setShowReportModal(false)
            fetchReports()
            addToast('Reporte creado', 'success')
          } catch (err) {
            setIsCreatingReport(false)
            if (err.response?.data?.errors) {
              const errors = err.response.data.errors
              const firstError = Object.values(errors)[0][0]
              addToast(firstError, "error")
            } else {
              addToast(err.response?.data?.message || "Error al crear reporte", "error")
            }
          }
        }
      }
    } catch (error) { 
      setIsCreatingReport(false)
      addToast('Error en la comunicación', 'error') 
    }
  }

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('¿Borrar reporte?')) return
    try {
      await deleteReport(id, reportId)
      addToast('Reporte eliminado', 'success')
      fetchReports()
    } catch (error) { addToast('Error al eliminar', 'error') }
  }

  if (notFound) return <NotFound />

  if (!forum) {
    return (
      <div className="page-container">
        <div className="shimmer-effect mb-40" style={{ height: '40px', width: '150px' }}></div>
        <div className="flex-center" style={{ gap: '40px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div className="shimmer-effect mb-10" style={{ height: '60px', width: '80%' }}></div>
            <div className="shimmer-effect" style={{ height: '200px', width: '100%' }}></div>
          </div>
          <div className="shimmer-effect" style={{ flex: 1, height: '400px' }}></div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="flex-center mb-40" style={{ justifyContent: 'space-between', borderBottom: '1px solid var(--text-muted)', paddingBottom: '20px' }}>
        <div className="flex-center" style={{ gap: '10px' }}>
          <button 
            onClick={() => navigate('/forums')} 
            style={{ padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            🡄 FOROS
          </button>
        </div>
        {user && String(user.id) === String(forum?.user_id) && (
          <div className="flex-center" style={{ gap: '10px' }}>
            <button onClick={() => setShowForumModal(true)} style={{ padding: '8px 15px' }}>EDITAR FORO</button>
            <button onClick={handleDeleteForum} className="outline-red" style={{ padding: '8px 15px' }}>ELIMINAR FORO</button>
          </div>
        )}
      </div>

      <div className="flex-center mb-60" style={{ gap: '40px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>{forum.title}</h1>
          <p style={{ color: 'var(--text-dim)', marginBottom: '10px' }}>
            EXPEDICIÓN INICIADA POR <span style={{ color: 'var(--text)' }}>{forum.user?.username.toUpperCase()}</span> EL {new Date(forum.created_at).toLocaleDateString()}
          </p>

          {/* Credibility Bar */}
          <div style={{ marginBottom: '25px' }}>
            <div className="flex-center" style={{ justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-dim)', marginBottom: '5px', letterSpacing: '1px' }}>
              <span>DUBIOUS_DATA</span>
              <span>VERIFIED_ARCHIVE</span>
            </div>
            <div style={{ 
              height: '10px', 
              width: '100%', 
              background: 'linear-gradient(90deg, var(--accent) 0%, #333 50%, var(--text) 100%)', 
              position: 'relative',
              borderRadius: '5px',
              boxShadow: 'inset 0 0 5px #000'
            }}>
              <div style={{ 
                position: 'absolute', 
                left: `${Math.min(Math.max((forum.credibility_score + 5) * 10, 0), 100)}%`,
                top: '50%', 
                transform: 'translate(-50%, -50%)',
                transition: 'left 1s ease-in-out',
                zIndex: 2,
                filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.8))'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9V22L7 20L9 22L11 20L13 22L15 20L17 22L19 20L21 22V9C21 5.13 17.87 2 14 2H12Z" fill="white" />
                  <circle cx="9" cy="9" r="1.5" fill="black" />
                  <circle cx="15" cy="9" r="1.5" fill="black" />
                  <path d="M10 13C10 13 11 14 12 14C13 14 14 13 14 13" stroke="black" strokeWidth="1" strokeLinecap="round" />
                </svg>
              </div>
              {/* Center marker */}
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: 'rgba(255,255,255,0.2)', zIndex: 1 }}></div>
            </div>
            <div className="text-center mt-10" style={{ fontSize: '11px', color: forum.credibility_score >= 0 ? 'var(--text)' : 'var(--accent)', fontWeight: 'bold' }}>
              GLOBAL_CREDIBILITY: {forum.credibility_score > 0 ? `+${forum.credibility_score.toFixed(1)}` : forum.credibility_score.toFixed(1)}
            </div>
          </div>
          
          <div className="horror-card" style={{ 
            fontSize: '18px', 
            lineHeight: '1.6', 
            padding: '20px', 
            borderLeft: '3px solid var(--accent)',
            minHeight: '120px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              display: '-webkit-box',
              WebkitLineClamp: isExpanded ? 'unset' : '3',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {forum.description}
            </div>
            
            {forum.description.length > 150 && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent)',
                  cursor: 'pointer',
                  padding: '5px 0',
                  marginTop: '10px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textAlign: 'left',
                  textTransform: 'uppercase',
                  width: 'fit-content'
                }}
              >
                {isExpanded ? '[ MOSTRAR MENOS ]' : '[ MOSTRAR MÁS ]'}
              </button>
            )}
          </div>
        </div>
        {forum.image && (
          <div className="horror-card" style={{ flex: 1, minWidth: '300px', padding: '10px', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShimmerImage 
              src={forum.image_url} 
              alt={forum.title}
              style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain' }}
            />
          </div>
        )}
      </div>

      <div className="mt-60">
        <div className="flex-center mb-40" style={{ justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '32px', margin: 0 }}>REPORTES DE CAMPO</h2>
          {user && String(user.id) === String(forum.user_id) && (
            <button onClick={() => { setIsEditingReport(false); setReportData({title: '', description: '', image: null}); setShowReportModal(true); }} className="primary" style={{ padding: '10px 30px' }}>+ NUEVO REPORTE</button>
          )}
        </div>

        <div className="grid-3">
          {reports.length === 0 ? (
            <div className="text-center" style={{ gridColumn: '1/-1', color: 'var(--text-dim)', padding: '100px', border: '1px dashed var(--border)' }}>NO SE HAN REGISTRADO EVIDENCIAS TODAVÍA.</div>
          ) : (
            reports.map(r => (
              <div key={r.id} className="horror-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <Link to={`/forums/${id}/reports/${r.id}`} style={{ flex: 1 }}>
                  <div style={{ height: '150px', background: '#111', marginBottom: '15px', border: '1px solid var(--border)' }}>
                    <ShimmerImage 
                      src={r.image_url} 
                      alt={r.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <h3 style={{ margin: '0 0 10px 0' }}>{r.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-dim)' }}>{r.description.substring(0, 100)}...</p>
                </Link>
                {user && String(user.id) === String(r.user_id) && (
                  <div className="flex-center mt-20" style={{ gap: '10px' }}>
                    <button onClick={() => { setCurrentReportId(r.id); setReportData({title: r.title, description: r.description}); setIsEditingReport(true); setShowReportModal(true); }} style={{ flex: 1, fontSize: '12px' }}>EDITAR</button>
                    <button onClick={() => handleDeleteReport(r.id)} className="outline-red" style={{ flex: 1, fontSize: '12px' }}>BORRAR</button>
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
            <h2>MODIFICAR EXPEDICIÓN</h2>
            <input required value={forumData.title} onChange={e => setForumData({...forumData, title: e.target.value})} />
            <textarea required value={forumData.description} onChange={e => setForumData({...forumData, description: e.target.value})} style={{ minHeight: '200px' }} />
            <div className="flex-center" style={{ gap: '20px' }}>
              <button type="submit" className="primary" style={{ flex: 1, padding: '15px' }}>ACTUALIZAR ARCHIVO</button>
              <button type="button" onClick={() => setShowForumModal(false)} className="outline-red" style={{ flex: 1, padding: '15px' }}>ABORTAR</button>
            </div>
          </form>
        </div>
      )}

      {showReportModal && (
        <div className="modal-overlay">
          <form onSubmit={handleReportSubmit} className="horror-form">
            <h2>{isEditingReport ? 'MODIFICAR EVIDENCIA' : 'REGISTRAR EVIDENCIA'}</h2>
            
            {isCreatingReport ? (
              <div className="text-center" style={{ padding: '40px' }}>
                <p style={{ fontSize: '20px', letterSpacing: '2px' }}>SELLANDO REPORTE EN EL ARCHIVO CENTRAL...</p>
                <div style={{ fontSize: '64px', color: 'var(--accent)', margin: '30px 0' }}>{countdown}</div>
                <div style={{ width: '100%', height: '4px', background: '#111' }}>
                  <div style={{ width: `${(countdown/3)*100}%`, height: '100%', background: 'var(--accent)', transition: 'width 1s linear' }}></div>
                </div>
              </div>
            ) : (
              <>
                <input required placeholder="TITULO" value={reportData.title} onChange={e => setReportData({...reportData, title: e.target.value})} />
                <textarea required placeholder="DESCRIPCIÓN DE LOS HECHOS..." value={reportData.description} onChange={e => setReportData({...reportData, description: e.target.value})} style={{ minHeight: '200px' }} />
                {!isEditingReport && <input type="file" required onChange={e => setReportData({...reportData, image: e.target.files[0]})} style={{ color: 'var(--text)' }} />}
                <div className="flex-center" style={{ gap: '20px' }}>
                  <button type="submit" className="primary" style={{ flex: 1, padding: '15px' }}>{isEditingReport ? 'ACTUALIZAR' : 'REGISTRAR'}</button>
                  <button type="button" onClick={() => setShowReportModal(false)} className="outline-red" style={{ flex: 1, padding: '15px' }}>CANCELAR</button>
                </div>
              </>
            )}
          </form>
        </div>
      )}
    </div>
  )
}
