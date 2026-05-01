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
    } catch (error) { addToast('Error al cargar reporte', 'error') }
  }

  const fetchComments = async () => {
    try {
      const res = await getComments(reportId)
      setComments(res.data.data || res.data)
    } catch (error) { console.error(error) }
  }

  const fetchUserVote = async () => {
    try {
      const res = await getReportVote(reportId)
      setUserVote(res.data.user_vote)
    } catch (error) { console.error(error) }
  }

  const handleVote = async (value) => {
    if (!user) return addToast('Debes iniciar sesión para votar', 'info')
    
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
      // Sync with server response just in case
      setUserVote(res.data.user_vote)
      setReport({ ...report, score: res.data.score, votes_count: res.data.votes_count })
      
      if (res.data.user_vote === 0) {
        addToast('VOTO RETIRADO', 'info')
      } else {
        addToast(value === 1 ? 'HAS CREÍDO EN EL REPORTE' : 'HAS MARCADO COMO FALSEDAD', 'success')
      }
    } catch (error) { 
      // Revert on error
      setUserVote(prevVote)
      setReport({ ...report, score: prevScore })
      addToast('Error al registrar voto', 'error') 
    }
  }

  const handleReportUpdate = async (e) => {
    e.preventDefault()
    try {
      await updateReport(forumId, reportId, reportData)
      addToast('Reporte actualizado', 'success')
      setShowReportModal(false)
      fetchReport()
    } catch (error) { addToast('Error al actualizar', 'error') }
  }

  const handleReportDelete = async () => {
    if (!window.confirm('¿Borrar reporte?')) return
    try {
      await deleteReport(forumId, reportId)
      addToast('Reporte eliminado', 'success')
      navigate(`/forums/${forumId}`)
    } catch (error) { addToast('Error al eliminar', 'error') }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return;
    try {
      await createComment(reportId, { content: newComment })
      setNewComment('')
      fetchComments()
    } catch (error) { addToast('Error al comentar', 'error') }
  }

  const handleCommentDelete = async (id) => {
    if (!window.confirm('¿Borrar comentario?')) return
    try {
      await deleteComment(reportId, id)
      fetchComments()
    } catch (error) { addToast('Error al borrar', 'error') }
  }

  const handleCommentUpdate = async (id) => {
    try {
      await updateComment(reportId, id, { content: editingCommentText })
      setEditingCommentId(null)
      fetchComments()
    } catch (error) { addToast('Error al editar', 'error') }
  }

  // SKELETON LOADERS
  if (!report) {
    return (
      <div className="page-container">
        <div className="shimmer-effect mb-40" style={{ height: '40px', width: '200px' }}></div>
        <div className="shimmer-effect mb-40" style={{ height: '60px', width: '80%' }}></div>
        <div className="shimmer-effect mb-40" style={{ height: '400px', width: '100%', border: '1px solid var(--border)' }}></div>
        <div className="shimmer-effect mb-10" style={{ height: '20px', width: '100%' }}></div>
        <div className="shimmer-effect mb-10" style={{ height: '20px', width: '90%' }}></div>
      </div>
    )
  }

  return (
    <div className="page-container" style={{ maxWidth: '1000px' }}>
      {/* Header Navigation */}
      <div className="flex-center mb-40" style={{ justifyContent: 'space-between', borderBottom: '1px solid var(--text-muted)', paddingBottom: '20px' }}>
        <div className="flex-center" style={{ gap: '10px' }}>
          <button 
            onClick={() => navigate('/forums')} 
            style={{ padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            🡄 INICIO
          </button>
          <button 
            onClick={() => navigate(`/forums/${forumId}`)} 
            style={{ padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            🡄 FORO
          </button>
        </div>
        {user && String(user.id) === String(report?.user_id) && (
          <div className="flex-center" style={{ gap: '10px' }}>
            <button onClick={() => setShowReportModal(true)} style={{ padding: '8px 15px' }}>EDITAR REPORTE</button>
            <button onClick={handleReportDelete} className="outline-red" style={{ padding: '8px 15px' }}>ELIMINAR REPORTE</button>
          </div>
        )}
      </div>

      <h1 style={{ fontSize: '42px', marginBottom: '10px' }}>{report.title}</h1>
      <p style={{ color: 'var(--text-dim)', marginBottom: '30px' }}>
        HALLAZGO REGISTRADO POR <span style={{ color: 'var(--text)' }}>{report.user?.username.toUpperCase()}</span>
      </p>
      
      {report.image_url && (
        <div className="horror-card" style={{ 
          padding: '10px', 
          marginBottom: '30px',
          minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <ShimmerImage 
            src={report.image_url} 
            alt="Evidencia"
            style={{ width: '100%', maxHeight: '600px', objectFit: 'contain' }}
          />
        </div>
      )}

      <div className="horror-card" style={{ 
        padding: '30px', borderLeft: '4px solid var(--accent)', 
        fontSize: '18px', lineHeight: '1.8', whiteSpace: 'pre-line', marginBottom: '30px' 
      }}>
        {report.description}
      </div>

      {/* Votación / Score */}
      <div className="flex-center" style={{ gap: '40px', marginBottom: '50px', background: 'rgba(255,0,0,0.05)', padding: '25px', border: '1px solid var(--border)' }}>
        <div className="flex-center" style={{ gap: '30px', borderRight: '1px solid #222', paddingRight: '40px' }}>
          <div style={{ textAlign: 'center', minWidth: '100px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '5px', letterSpacing: '1px' }}>SCORE_CREDIBILITY</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: report.score > 0 ? 'var(--text)' : (report.score < 0 ? 'var(--accent)' : 'var(--text)') }}>
              {report.score > 0 ? `+${report.score}` : report.score}
            </div>
          </div>
          
          <div style={{ textAlign: 'center', minWidth: '100px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '5px', letterSpacing: '1px' }}>TOTAL_WITNESSES</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--text)' }}>{report.votes_count}</div>
          </div>
        </div>
        
        <div className="flex-center" style={{ gap: '20px' }}>
          <button 
            className={`vote-btn ${userVote === 1 ? 'active' : ''}`} 
            style={{ "--i": "#00ff00", "--j": "#004400" }}
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
            style={{ "--i": "#ff0000", "--j": "#440000" }}
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
        <h2 style={{ borderBottom: '1px solid var(--text-muted)', paddingBottom: '10px', marginBottom: '30px' }}>TRANSMISIONES RELACIONADAS</h2>
        
        {user ? (
          <form onSubmit={handleCommentSubmit} className="flex-center mb-40" style={{ gap: '15px' }}>
            <input 
              value={newComment} 
              onChange={e => setNewComment(e.target.value)} 
              placeholder="ENVIAR TRANSMISIÓN AL ARCHIVO..." 
              style={{ flex: 1 }}
            />
            <button type="submit" className="primary" style={{ padding: '0 30px' }}>ENVIAR</button>
          </form>
        ) : (
          <p className="text-center mb-40" style={{ color: 'var(--text-dim)' }}>DEBES ESTAR LOGUEADO PARA ENVIAR TRANSMISIONES.</p>
        )}

        <div className="column" style={{ gap: '20px' }}>
          {comments.length === 0 ? (
            <p className="text-center" style={{ color: 'var(--text-dim)' }}>NO HAY TRANSMISIONES ADICIONALES.</p>
          ) : (
            comments.map(c => (
              <div key={c.id} className="horror-card" style={{ padding: '20px', borderLeft: '3px solid var(--border)', background: 'rgba(0,0,0,0.5)' }}>
                <div className="flex-center mb-10" style={{ justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{c.user?.username.toUpperCase()}</span>
                  <div className="flex-center" style={{ gap: '10px' }}>
                    {user && String(user.id) === String(c.user_id) && editingCommentId !== c.id && (
                      <>
                        <button onClick={() => { setEditingCommentId(c.id); setEditingCommentText(c.content); }} style={{ fontSize: '10px', padding: '2px 8px' }}>[EDITAR]</button>
                        <button onClick={() => handleCommentDelete(c.id)} className="outline-red" style={{ fontSize: '10px', padding: '2px 8px' }}>[BORRAR]</button>
                      </>
                    )}
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{new Date(c.created_at).toLocaleString()}</span>
                  </div>
                </div>
                
                {editingCommentId === c.id ? (
                  <div className="flex-center mt-10" style={{ gap: '10px' }}>
                    <input className="w-100" value={editingCommentText} onChange={e => setEditingCommentText(e.target.value)} />
                    <button onClick={() => handleCommentUpdate(c.id)}>OK</button>
                    <button onClick={() => setEditingCommentId(null)} className="outline-red">CANCELAR</button>
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: '16px', lineHeight: '1.4' }}>{c.content}</p>
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
            <input required value={reportData.title} onChange={e => setReportData({...reportData, title: e.target.value})} />
            <textarea required value={reportData.description} onChange={e => setReportData({...reportData, description: e.target.value})} style={{ minHeight: '200px' }} />
            <div className="flex-center" style={{ gap: '20px' }}>
              <button type="submit" className="primary" style={{ flex: 1, padding: '15px' }}>ACTUALIZAR</button>
              <button type="button" onClick={() => setShowReportModal(false)} className="outline-red" style={{ flex: 1, padding: '15px' }}>CANCELAR</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
