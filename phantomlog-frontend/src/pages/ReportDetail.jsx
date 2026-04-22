import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getReport, updateReport, deleteReport } from '../api/reports'
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

  useEffect(() => {
    fetchReport()
    fetchComments()
  }, [reportId])

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
      <div style={{ maxWidth: '1000px', margin: '0 auto', color: '#0f0', padding: '20px' }}>
        <div style={{ height: '40px', background: '#111', width: '200px', marginBottom: '20px' }}></div>
        <div style={{ height: '60px', background: '#111', width: '80%', marginBottom: '20px' }}></div>
        <div style={{ height: '400px', background: '#111', width: '100%', marginBottom: '20px', border: '1px solid #040' }}></div>
        <div style={{ height: '20px', background: '#111', width: '100%', marginBottom: '10px' }}></div>
        <div style={{ height: '20px', background: '#111', width: '90%', marginBottom: '10px' }}></div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', color: '#0f0', padding: '20px' }}>
      {/* Header Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #040', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => navigate('/forums')} 
            style={{ 
              background: 'none', border: '1px solid #0f0', color: '#0f0', 
              padding: '8px 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' 
            }}
          >
            🡄 INICIO
          </button>
          <button 
            onClick={() => navigate(`/forums/${forumId}`)} 
            style={{ 
              background: 'none', border: '1px solid #0f0', color: '#0f0', 
              padding: '8px 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' 
            }}
          >
            🡄 FORO
          </button>
        </div>
        {user && String(user.id) === String(report?.user_id) && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setShowReportModal(true)} style={{ background: '#000', border: '1px solid #0f0', color: '#0f0', padding: '8px 15px', cursor: 'pointer' }}>EDITAR REPORTE</button>
            <button onClick={handleReportDelete} style={{ background: '#000', border: '1px solid #f00', color: '#f00', padding: '8px 15px', cursor: 'pointer' }}>ELIMINAR REPORTE</button>
          </div>
        )}
      </div>

      <h1 style={{ color: '#f00', fontSize: '42px', margin: '0 0 10px 0' }}>{report.title}</h1>
      <p style={{ color: '#060', marginBottom: '30px' }}>
        HALLAZGO REGISTRADO POR <span style={{ color: '#0f0' }}>{report.user?.username.toUpperCase()}</span>
      </p>
      
      {report.image && (
        <div style={{ 
          border: '2px solid #060', background: '#000', padding: '10px', 
          marginBottom: '30px', boxShadow: '0 0 30px rgba(255,0,0,0.1)' 
        }}>
          <ShimmerImage 
            src={
              report.image?.startsWith('http') || report.image?.startsWith('blob:')
                ? report.image
                : report.image?.startsWith('images/')
                  ? `http://localhost:8000/${report.image}`
                  : `http://localhost:8000/storage/${report.image}`
            } 
            alt="Evidencia"
            style={{ width: '100%', maxHeight: '600px', objectFit: 'contain' }}
          />
        </div>
      )}

      <div style={{ 
        background: '#080808', padding: '30px', borderLeft: '4px solid #f00', 
        fontSize: '18px', lineHeight: '1.8', whiteSpace: 'pre-line', marginBottom: '50px' 
      }}>
        {report.description}
      </div>

      {/* Comentarios */}
      <div style={{ marginTop: '60px' }}>
        <h2 style={{ color: '#f00', borderBottom: '1px solid #040', paddingBottom: '10px', marginBottom: '30px' }}>TRANSMISIONES RELACIONADAS</h2>
        
        {user ? (
          <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '15px', marginBottom: '40px' }}>
            <input 
              value={newComment} 
              onChange={e => setNewComment(e.target.value)} 
              placeholder="ENVIAR TRANSMISIÓN AL ARCHIVO..." 
              style={{ flex: 1, background: '#000', border: '1px solid #0f0', color: '#0f0', padding: '15px' }}
            />
            <button type="submit" style={{ padding: '0 30px', fontWeight: 'bold' }}>ENVIAR</button>
          </form>
        ) : (
          <p style={{ color: '#060', textAlign: 'center', marginBottom: '40px' }}>DEBES ESTAR LOGUEADO PARA ENVIAR TRANSMISIONES.</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {comments.length === 0 ? (
            <p style={{ color: '#060', textAlign: 'center' }}>NO HAY TRANSMISIONES ADICIONALES.</p>
          ) : (
            comments.map(c => (
              <div key={c.id} style={{ borderBottom: '1px solid #040', paddingBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <strong style={{ color: '#0f0', fontSize: '14px' }}>{c.user?.username.toUpperCase()}</strong>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {user && String(user.id) === String(c.user_id) && (
                      <>
                        <button onClick={() => { setEditingCommentId(c.id); setEditingCommentText(c.content); }} style={{ fontSize: '10px', color: '#0f0', border: 'none', background: 'none', cursor: 'pointer' }}>[EDITAR]</button>
                        <button onClick={() => handleCommentDelete(c.id)} style={{ fontSize: '10px', color: '#f00', border: 'none', background: 'none', cursor: 'pointer' }}>[BORRAR]</button>
                      </>
                    )}
                    <span style={{ fontSize: '10px', color: '#040' }}>{new Date(c.created_at).toLocaleString()}</span>
                  </div>
                </div>
                
                {editingCommentId === c.id ? (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <input value={editingCommentText} onChange={e => setEditingCommentText(e.target.value)} style={{ flex: 1, background: '#000', border: '1px solid #0f0', color: '#0f0', padding: '5px' }} />
                    <button onClick={() => handleCommentUpdate(c.id)}>OK</button>
                    <button onClick={() => setEditingCommentId(null)}>CANCELAR</button>
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
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form onSubmit={handleReportUpdate} style={{ background: '#000', border: '1px solid #f00', padding: '40px', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ color: '#f00', margin: 0 }}>MODIFICAR REPORTE</h2>
            <input required value={reportData.title} onChange={e => setReportData({...reportData, title: e.target.value})} style={{ background: '#000', border: '1px solid #060', color: '#0f0', padding: '15px' }} />
            <textarea required value={reportData.description} onChange={e => setReportData({...reportData, description: e.target.value})} style={{ background: '#000', border: '1px solid #060', color: '#0f0', padding: '15px', minHeight: '200px' }} />
            <div style={{ display: 'flex', gap: '20px' }}>
              <button type="submit" style={{ flex: 1, padding: '15px' }}>ACTUALIZAR</button>
              <button type="button" onClick={() => setShowReportModal(false)} style={{ flex: 1, padding: '15px', color: '#f00', borderColor: '#f00' }}>CANCELAR</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
