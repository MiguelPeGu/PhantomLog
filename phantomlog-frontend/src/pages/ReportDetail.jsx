import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getReport, updateReport, deleteReport, voteReport, getReportVote } from '../api/reports'
import { getComments, createComment, updateComment, deleteComment } from '../api/comments'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import ShimmerImage from '../components/ShimmerImage'

export default function ReportDetail() {
  const { id: forumId, reportId } = useParams()
  const [report, setReport] = useState(null)
  const [comments, setComments] = useState([])
  const [loadingComments, setLoadingComments] = useState(true)
  const [newComment, setNewComment] = useState('')
  const { user } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [showReportModal, setShowReportModal] = useState(false)
  const [reportData, setReportData] = useState({ title: '', description: '' })
  
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editingCommentText, setEditingCommentText] = useState('')
  const [userVote, setUserVote] = useState(0)

  useEffect(() => {
    fetchReport()
    fetchComments()
    if (user) fetchUserVote()
  }, [reportId, user])

  const fetchReport = async () => {
    try {
      const res = await getReport(forumId, reportId)
      setReport(res.data)
      setReportData({ title: res.data.title, description: res.data.description })
    } catch (error) { 
      addToast('ERROR AL CARGAR EL REPORTE', 'error') 
    }
  }

  const fetchComments = async () => {
    setLoadingComments(true)
    try {
      const res = await getComments(reportId)
      setComments(res.data.data)
    } catch (error) { 
      console.error(error) 
    } finally {
      setLoadingComments(false)
    }
  }

  const fetchUserVote = async () => {
    try {
      const res = await getReportVote(reportId)
      setUserVote(res.data.user_vote)
    } catch (error) { 
      console.error(error) 
    }
  }

  const handleVote = async (value) => {
    if (!user) return addToast('DEBES INICIAR SESIÓN PARA VOTAR', 'info')
    
    const prevVote = userVote
    const prevScore = report.score
    
    let newVote = value
    let scoreDiff = value
    
    if (prevVote === value) {
      newVote = 0
      scoreDiff = -value
    } else if (prevVote !== 0) {
      scoreDiff = value * 2
    }
    
    setUserVote(newVote)
    setReport({ 
      ...report, 
      score: prevScore + scoreDiff,
      votes_count: prevVote === 0 ? report.votes_count + 1 : (newVote === 0 ? report.votes_count - 1 : report.votes_count)
    })

    try {
      const res = await voteReport(reportId, value)
      setUserVote(res.data.user_vote)
      setReport({ ...report, score: res.data.score, votes_count: res.data.votes_count })
      
      if (res.data.user_vote === 0) {
        addToast('VOTO RETIRADO DEL ARCHIVO', 'info')
      } else {
        addToast(value === 1 ? 'HAS DECIDIDO CREER' : 'HAS PREFERIDO LA DUDA', 'success')
      }
    } catch (error) { 
      setUserVote(prevVote)
      setReport({ ...report, score: prevScore })
      addToast('ERROR AL REGISTRAR VOTO', 'error') 
    }
  }

  const handleReportUpdate = async (e) => {
    e.preventDefault()
    
    if (!reportData.title.trim() || !reportData.description.trim()) {
      return addToast('EL TÍTULO Y LA DESCRIPCIÓN SON OBLIGATORIOS', 'error')
    }

    try {
      const sendUpdate = async (data) => {
        await updateReport(forumId, reportId, data)
        addToast('REPORTE ACTUALIZADO EN EL SISTEMA', 'success')
        setShowReportModal(false)
        fetchReport()
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
    } catch (err) { 
      const msg = err.response?.data?.message || 'ERROR AL ACTUALIZAR'
      addToast(msg.toUpperCase(), 'error') 
    }
  }

  const handleReportDelete = async () => {
    if (!window.confirm('¿ELIMINAR ESTA EVIDENCIA PERMANENTEMENTE?')) return
    try {
      await deleteReport(forumId, reportId)
      addToast('REPORTE ELIMINADO', 'success')
      navigate(`/forums/${forumId}`)
    } catch (err) { 
      addToast('ERROR AL ELIMINAR EL REPORTE', 'error') 
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return;
    try {
      await createComment(reportId, { content: newComment })
      setNewComment('')
      fetchComments()
      addToast('TRANSMISIÓN REGISTRADA', 'success')
    } catch (err) { 
      const errors = err.response?.data?.errors
      if (errors) {
        const firstError = Object.values(errors)[0][0]
        addToast(firstError.toUpperCase(), 'error')
      } else {
        const msg = err.response?.data?.message || 'ERROR AL COMENTAR'
        addToast(msg.toUpperCase(), 'error') 
      }
    }
  }

  const handleCommentDelete = async (id) => {
    if (!window.confirm('¿ELIMINAR ESTA TRANSMISIÓN?')) return
    try {
      await deleteComment(reportId, id)
      fetchComments()
      addToast('COMENTARIO PURGADO', 'success')
    } catch (err) { 
      addToast('ERROR AL BORRAR', 'error') 
    }
  }

  const handleCommentUpdate = async (id) => {
    try {
      await updateComment(reportId, id, { content: editingCommentText })
      setEditingCommentId(null)
      fetchComments()
      addToast('COMENTARIO ACTUALIZADO', 'success')
    } catch (err) { 
      const msg = err.response?.data?.message || 'ERROR AL EDITAR'
      addToast(msg.toUpperCase(), 'error') 
    }
  }

  // SKELETON LOADERS
  if (!report) {
    return (
      <div className="page-container max-1000">
        {/* Navigation Buttons */}
        <div className="mb-40 flex gap-10">
          <div className="skeleton" style={{ width: '100px', height: '36px', borderRadius: '4px' }}></div>
          <div className="skeleton" style={{ width: '80px', height: '36px', borderRadius: '4px' }}></div>
        </div>

        {/* Edit/Delete Actions */}
        <div className="flex-center justify-end mb-40 border-bottom pb-20">
          <div className="flex-center gap-10">
            <div className="skeleton" style={{ width: '130px', height: '36px', borderRadius: '4px' }}></div>
            <div className="skeleton" style={{ width: '140px', height: '36px', borderRadius: '4px' }}></div>
          </div>
        </div>

        {/* Título + autor */}
        <div className="skeleton skeleton-title mb-10" style={{ width: '70%', height: '48px' }}></div>
        <div className="skeleton skeleton-text mb-30" style={{ width: '35%' }}></div>

        {/* Imagen grande */}
        <div className="horror-card mx-auto p-10 mb-30 w-100" style={{ minHeight: '500px' }}>
          <div className="skeleton w-100" style={{ height: '480px' }}></div>
        </div>

        {/* Descripción */}
        <div className="horror-card p-30 mb-30">
          <div className="skeleton skeleton-text" style={{ width: '100%' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '97%' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '85%' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '90%' }}></div>
        </div>

        {/* Score box */}
        <div className="horror-card p-30 mb-50 flex-center gap-40">
          <div className="flex-center gap-30">
            <div>
              <div className="skeleton skeleton-text mb-5" style={{ width: '120px' }}></div>
              <div className="skeleton" style={{ width: '60px', height: '36px' }}></div>
            </div>
            <div>
              <div className="skeleton skeleton-text mb-5" style={{ width: '100px' }}></div>
              <div className="skeleton" style={{ width: '50px', height: '36px' }}></div>
            </div>
          </div>
          <div className="flex-center gap-20">
            <div className="skeleton" style={{ width: '80px', height: '80px', borderRadius: '50%' }}></div>
            <div className="skeleton" style={{ width: '80px', height: '80px', borderRadius: '50%' }}></div>
          </div>
        </div>

        {/* Comentarios */}
        <div className="skeleton" style={{ width: '260px', height: '28px', marginBottom: '30px' }}></div>
        <div className="column gap-20">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="horror-card">
              <div className="flex-center justify-between mb-10">
                <div className="flex-center gap-10">
                  <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></div>
                  <div className="skeleton skeleton-text" style={{ width: '100px' }}></div>
                </div>
                <div className="skeleton skeleton-text" style={{ width: '120px' }}></div>
              </div>
              <div className="skeleton skeleton-text" style={{ width: '90%' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '70%' }}></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="page-container max-1000">
      {/* Header Navigation */}
      <div className="flex-center justify-between mb-40 border-bottom pb-20">
        <div className="flex-center gap-10">
          <Link 
            to="/forums" 
            className="btn flex-center gap-8 p-8-15"
          >
            🡄 INICIO
          </Link>
          <Link 
            to={`/forums/${forumId}`} 
            className="btn flex-center gap-8 p-8-15"
          >
            🡄 FORO
          </Link>
        </div>
        {user && String(user.id) === String(report?.user_id) && (
          <div className="flex-center gap-10">
            <button onClick={() => setShowReportModal(true)} className="p-8-15">EDITAR REPORTE</button>
            <button onClick={handleReportDelete} className="outline-red p-8-15">ELIMINAR REPORTE</button>
          </div>
        )}
      </div>

      <h1 className="fs-42 mb-10">{report.title}</h1>
      <p className="text-dim mb-30">
        HALLAZGO REGISTRADO POR <span className="text-normal">{report.user?.username.toUpperCase()}</span>
      </p>
      
      {report.image_url && (
        <div className="horror-card mx-auto p-10 mb-30" style={{ width: 'fit-content', minWidth: 'min(800px, 100%)', minHeight: '500px', maxHeight: '600px', display: 'block' }}>
          <ShimmerImage 
            src={report.image_url?.startsWith('http') ? report.image_url : `http://localhost:8000/storage/${report.image_url}`} 
            alt="Evidencia"
            objectFit="contain"
            style={{ minHeight: '480px' }}
          />
        </div>
      )}

      <div className="horror-card p-30 mb-30 fs-18 lh-1-8 pre-line border-accent-left-4 text-break">
        {report.description}
      </div>

      {/* Votación / Score */}
      <div className="report-score-box flex-center mb-50">
        <div className="flex-center gap-30 border-right pr-40">
          <div className="score-display">
            <div className="fs-11 text-dim mb-5 ls-1">SCORE_CREDIBILITY</div>
            <div className={`fs-32 bold ${report.score > 0 ? 'text-normal' : (report.score < 0 ? 'text-accent' : 'text-normal')}`}>
              {report.score > 0 ? `+${report.score}` : report.score}
            </div>
          </div>
          
          <div className="score-display">
            <div className="fs-11 text-dim mb-5 ls-1">TOTAL_WITNESSES</div>
            <div className="fs-32 bold text-normal">{report.votes_count}</div>
          </div>
        </div>
        
        <div className="flex-center gap-20">
          <button 
            className={`vote-btn ${userVote === 1 ? 'active' : ''}`} 
            style={{ "--i": "var(--believe-color, #00ff00)", "--j": "var(--text-dim)" }}
            onClick={() => handleVote(1)}
          >
            <span className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
              </svg>
            </span>
            <span className="title">I BELIEVE</span>
          </button>

          <button 
            className={`vote-btn ${userVote === -1 ? 'active' : ''}`} 
            style={{ "--i": "var(--liar-color, #ff0000)", "--j": "var(--accent-dim)" }}
            onClick={() => handleVote(-1)}
          >
            <span className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </span>
            <span className="title">LIAR</span>
          </button>
        </div>
      </div>

      {/* Comentarios */}
      <div className="mt-60">
        <h2 className="border-bottom pb-10 mb-30">TRANSMISIONES RELACIONADAS</h2>
        
        {user ? (
          <div className="mb-40">
            <label className="form-label mb-10 block">NUEVA TRANSMISIÓN (MÁX. 1000 CARACTERES)</label>
            <form onSubmit={handleCommentSubmit} className="flex-center gap-15">
              <div className="flex-1 relative">
                <input 
                  value={newComment} 
                  onChange={e => setNewComment(e.target.value)} 
                  maxLength={1000}
                  placeholder="ESCRIBE TU HALLAZGO..." 
                  className="w-100"
                />
                <small className={`absolute fs-10 right-10 bottom--20 ${newComment.length >= 1000 ? 'text-accent' : 'text-dim'}`}>
                  {newComment.length} / 1000
                </small>
              </div>
              <button type="submit" className="primary p-0-30 h-42">ENVIAR</button>
            </form>
          </div>
        ) : (
          <p className="text-center text-dim mb-40">DEBES ESTAR LOGUEADO PARA ENVIAR TRANSMISIONES.</p>
        )}

        <div className="column gap-20">
          {loadingComments ? (
            <p className="text-center text-dim border-dashed p-40 ls-1">[ ESCANEANDO TRANSMISIONES RELACIONADAS... ]</p>
          ) : comments.length === 0 ? (
            <p className="text-center text-dim">NO HAY TRANSMISIONES ADICIONALES EN ESTA FRECUENCIA.</p>
          ) : (
            comments.map(c => (
              <div key={c.id} className="comment-box horror-card">
                <div className="flex-center justify-between mb-10">
                  <div className="flex-center gap-10">
                    <div className="comment-avatar">
                      {c.user?.img ? (
                        <img 
                          src={c.user.img.startsWith('http') || c.user.img.startsWith('data:') ? c.user.img : `http://localhost:8000/storage/${c.user.img}`} 
                          alt={c.user.username} 
                          className="w-100 h-100 object-cover" 
                        />
                      ) : (
                        c.user?.username ? c.user.username[0].toUpperCase() : '?'
                      )}
                    </div>
                    <span className="text-accent bold uppercase">{c.user?.username}</span>
                  </div>
                  <div className="flex-center gap-10">
                    {user && String(user.id) === String(c.user_id) && editingCommentId !== c.id && (
                      <>
                        <button onClick={() => { setEditingCommentId(c.id); setEditingCommentText(c.content); }} className="fs-10 p-2-8">[EDITAR]</button>
                        <button onClick={() => handleCommentDelete(c.id)} className="outline-red fs-10 p-2-8">[BORRAR]</button>
                      </>
                    )}
                    <span className="fs-10 text-muted">{new Date(c.created_at).toLocaleString()}</span>
                  </div>
                </div>
                
                {editingCommentId === c.id ? (
                  <div className="flex-center gap-10 mt-10">
                    <div className="flex-1 relative">
                      <input className="w-100" value={editingCommentText} maxLength={1000} onChange={e => setEditingCommentText(e.target.value)} />
                      <small className="absolute fs-9 text-dim right-10 bottom--15">
                        {editingCommentText.length} / 1000
                      </small>
                    </div>
                    <button onClick={() => handleCommentUpdate(c.id)}>OK</button>
                    <button onClick={() => setEditingCommentId(null)} className="outline-red">CANCELAR</button>
                  </div>
                ) : (
                  <p className="m-0 fs-16 lh-1-4">{c.content}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {showReportModal && (
        <div className="modal-overlay">
          <form onSubmit={handleReportUpdate} className="horror-form">
            <h2>MODIFICAR REPORTE</h2>
            
            <div className="form-group">
              <label className="form-label">TÍTULO DEL HALLAZGO</label>
              <input required value={reportData.title} onChange={e => setReportData({...reportData, title: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">DESCRIPCIÓN DETALLADA</label>
              <textarea required value={reportData.description} onChange={e => setReportData({...reportData, description: e.target.value})} style={{ minHeight: '200px' }} />
            </div>

            <div className="form-group">
              <label className="form-label">ACTUALIZAR EVIDENCIA VISUAL (OPCIONAL)</label>
              <input type="file" onChange={e => setReportData({ ...reportData, image: e.target.files[0] })} className="text-normal" />
            </div>

            <div className="flex-center gap-20">
              <button type="submit" className="primary flex-1 p-15">ACTUALIZAR DATOS</button>
              <button type="button" onClick={() => setShowReportModal(false)} className="outline-red flex-1 p-15">ABORTAR</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
