import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getForum, deleteForum, updateForum } from '../api/forums'
import { createReport, getReports, updateReport, deleteReport } from '../api/reports'
import { useAuth } from '../context/AuthContext' //asi mantiene al usuario logueado?
import { useToast } from '../context/ToastContext'
import ShimmerImage from '../components/ShimmerImage'

export default function ForumDetail() {
  const { id } = useParams()
  const [forum, setForum] = useState(null)
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
    } catch (error) { addToast('Error al cargar foro', 'error') }
  }

  const fetchReports = async () => {
    try {
      const res = await getReports(id)
      setReports(res.data.data || res.data) // por que dos veces data
    } catch (error) { console.error(error) }
  }

  const handleUpdateForum = async (e) => {
    e.preventDefault()
    try {
      await updateForum(id, forumData)
      addToast('Foro actualizado', 'success')
      setShowForumModal(false)
      fetchForum()
    } catch (error) { addToast('Error al actualizar', 'error') }ñ
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

  if (!forum) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', color: '#0f0', padding: '20px' }}>
        <div style={{ height: '40px', background: '#111', width: '150px', marginBottom: '30px' }}></div>
        <div style={{ display: 'flex', gap: '40px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ height: '60px', background: '#111', width: '80%', marginBottom: '20px' }}></div>
            <div style={{ height: '200px', background: '#111', width: '100%' }}></div>
          </div>
          <div style={{ flex: 1, height: '400px', background: '#111' }}></div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', color: '#0f0', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #040', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => navigate('/forums')} 
            style={{ 
              background: 'none', border: '1px solid #0f0', color: '#0f0', 
              padding: '8px 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' 
            }}
          >
            🡄 FOROS
          </button>
        </div>
        {user && String(user.id) === String(forum?.user_id) && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setShowForumModal(true)} style={{ background: '#000', border: '1px solid #0f0', color: '#0f0', padding: '8px 15px', cursor: 'pointer' }}>EDITAR FORO</button>
            <button onClick={handleDeleteForum} style={{ background: '#000', border: '1px solid #f00', color: '#f00', padding: '8px 15px', cursor: 'pointer' }}>ELIMINAR FORO</button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '40px', marginBottom: '60px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h1 style={{ color: '#f00', fontSize: '48px', margin: '0 0 20px 0' }}>{forum.title}</h1>
          <p style={{ color: '#060', marginBottom: '10px' }}>
            EXPEDICIÓN INICIADA POR <span style={{ color: '#0f0' }}>{forum.user?.username.toUpperCase()}</span> EL {new Date(forum.created_at).toLocaleDateString()}
          </p>

          {/* Credibility Bar */}
          <div style={{ marginBottom: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#060', marginBottom: '5px', letterSpacing: '1px' }}>
              <span>DUBIOUS_DATA</span>
              <span>VERIFIED_ARCHIVE</span>
            </div>
            <div style={{ 
              height: '10px', 
              width: '100%', 
              background: 'linear-gradient(90deg, #f00 0%, #333 50%, #0f0 100%)', 
              position: 'relative',
              borderRadius: '5px',
              boxShadow: 'inset 0 0 5px #000'
            }}>
              <div style={{ 
                position: 'absolute', 
                left: `${Math.min(Math.max((forum.credibility_score + 5) * 10, 0), 100)}%`, //explicacion de por que se hace asi ese calculo
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
            <div style={{ textAlign: 'center', marginTop: '5px', fontSize: '11px', color: forum.credibility_score >= 0 ? '#0f0' : '#f00', fontWeight: 'bold' }}>
              GLOBAL_CREDIBILITY: {forum.credibility_score > 0 ? `+${forum.credibility_score.toFixed(1)}` : forum.credibility_score.toFixed(1)}
            </div>
          </div>
          <div style={{ 
            fontSize: '18px', 
            lineHeight: '1.6', 
            background: '#080808', 
            padding: '20px', 
            borderLeft: '3px solid #f00',
            minHeight: '120px',
            position: 'relative',
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
                  color: '#f00',
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
          <div style={{ flex: 1, minWidth: '300px', border: '1px solid #060', background: '#000', padding: '10px', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShimmerImage 
              src={
                forum.image?.startsWith('http')
                  ? forum.image
                  : forum.image?.startsWith('images/')
                    ? `http://localhost:8000/${forum.image}`
                    : `http://localhost:8000/storage/${forum.image}`
              } 
              alt={forum.title}
              style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain' }}
            />
          </div>
        )}
      </div>

      <div style={{ marginTop: '60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#f00', fontSize: '32px', margin: 0 }}>REPORTES DE CAMPO</h2>
          {user && String(user.id) === String(forum.user_id) && (
            <button onClick={() => { setIsEditingReport(false); setReportData({title: '', description: '', image: null}); setShowReportModal(true); }} style={{ padding: '10px 30px', fontSize: '16px', fontWeight: 'bold' }}>+ NUEVO REPORTE</button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
          {reports.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#060', padding: '100px', border: '1px dashed #040' }}>NO SE HAN REGISTRADO EVIDENCIAS TODAVÍA.</div>
          ) : (
            reports.map(r => (
              <div key={r.id} style={{ background: '#000', border: '1px solid #060', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <Link to={`/forums/${id}/reports/${r.id}`} style={{ textDecoration: 'none', flex: 1 }}>
                  <div style={{ height: '150px', background: '#111', marginBottom: '15px', border: '1px solid #040' }}>
                    <ShimmerImage 
                      src={
                        r.image?.startsWith('http')
                          ? r.image
                          : r.image?.startsWith('images/')
                            ? `http://localhost:8000/${r.image}`
                            : `http://localhost:8000/storage/${r.image}`
                      } 
                      alt={r.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <h3 style={{ color: '#f00', margin: '0 0 10px 0' }}>{r.title}</h3>
                  <p style={{ fontSize: '13px', color: '#0f0', opacity: 0.7 }}>{r.description.substring(0, 100)}...</p>
                </Link>
                {user && String(user.id) === String(r.user_id) && (
                  <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button onClick={() => { setCurrentReportId(r.id); setReportData({title: r.title, description: r.description}); setIsEditingReport(true); setShowReportModal(true); }} style={{ flex: 1, fontSize: '12px' }}>EDITAR</button>
                    <button onClick={() => handleDeleteReport(r.id)} style={{ flex: 1, fontSize: '12px', color: '#f00', borderColor: '#f00' }}>BORRAR</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {showForumModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form onSubmit={handleUpdateForum} style={{ background: '#000', border: '1px solid #f00', padding: '40px', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ color: '#f00', margin: 0 }}>MODIFICAR EXPEDICIÓN</h2>
            <input required value={forumData.title} onChange={e => setForumData({...forumData, title: e.target.value})} style={{ background: '#000', border: '1px solid #060', color: '#0f0', padding: '15px' }} />
            <textarea required value={forumData.description} onChange={e => setForumData({...forumData, description: e.target.value})} style={{ background: '#000', border: '1px solid #060', color: '#0f0', padding: '15px', minHeight: '200px' }} />
            <div style={{ display: 'flex', gap: '20px' }}>
              <button type="submit" style={{ flex: 1, padding: '15px' }}>ACTUALIZAR ARCHIVO</button>
              <button type="button" onClick={() => setShowForumModal(false)} style={{ flex: 1, padding: '15px', color: '#f00', borderColor: '#f00' }}>ABORTAR</button>
            </div>
          </form>
        </div>
      )}

      {showReportModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form onSubmit={handleReportSubmit} style={{ background: '#000', border: '1px solid #f00', padding: '40px', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ color: '#f00', margin: 0 }}>{isEditingReport ? 'MODIFICAR EVIDENCIA' : 'REGISTRAR EVIDENCIA'}</h2>
            
            {isCreatingReport ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ color: '#0f0', fontSize: '20px', letterSpacing: '2px' }}>SELLANDO REPORTE EN EL ARCHIVO CENTRAL...</p>
                <div style={{ fontSize: '64px', color: '#f00', margin: '30px 0' }}>{countdown}</div>
                <div style={{ width: '100%', height: '4px', background: '#111' }}>
                  <div style={{ width: `${(countdown/3)*100}%`, height: '100%', background: '#f00', transition: 'width 1s linear' }}></div>
                </div>
              </div>
            ) : (
              <>
                <input required placeholder="TITULO" value={reportData.title} onChange={e => setReportData({...reportData, title: e.target.value})} style={{ background: '#000', border: '1px solid #060', color: '#0f0', padding: '15px' }} />
                <textarea required placeholder="DESCRIPCIÓN DE LOS HECHOS..." value={reportData.description} onChange={e => setReportData({...reportData, description: e.target.value})} style={{ background: '#000', border: '1px solid #060', color: '#0f0', padding: '15px', minHeight: '200px' }} />
                {!isEditingReport && <input type="file" required onChange={e => setReportData({...reportData, image: e.target.files[0]})} style={{ color: '#0f0' }} />}
                <div style={{ display: 'flex', gap: '20px' }}>
                  <button type="submit" style={{ flex: 1, padding: '15px' }}>{isEditingReport ? 'ACTUALIZAR' : 'REGISTRAR'}</button>
                  <button type="button" onClick={() => setShowReportModal(false)} style={{ flex: 1, padding: '15px', color: '#f00', borderColor: '#f00' }}>CANCELAR</button>
                </div>
              </>
            )}
          </form>
        </div>
      )}
    </div>
  )
}
