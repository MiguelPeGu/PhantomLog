import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getReport, updateReport, deleteReport } from '../api/reports'
import { getComments, createComment, updateComment, deleteComment } from '../api/comments'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useNavigate } from 'react-router-dom'
import ShimmerImage from '../components/ShimmerImage'

export default function ReportDetail() {
  const { id: forumId, reportId } = useParams()
  const [report, setReport] = useState(null)
  const [comments, setComments] = useState([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)

  const { user } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [showEditReport, setShowEditReport] = useState(false)
  const [reportForm, setReportForm] = useState({ title: '', description: '', image: null })

  const [editingCommentId, setEditingCommentId] = useState(null)
  const [commentEditValue, setCommentEditValue] = useState('')

  useEffect(() => {
    fetchReport()
    fetchComments(1)
  }, [reportId])

  const fetchReport = async () => {
    try {
      const res = await getReport(forumId, reportId)
      setReport(res.data)
    } catch (error) {
      console.error(error)
      addToast('Error al cargar el reporte', 'error')
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async (pageNumber) => {
    try {
      const res = await getComments(reportId, { params: { page: pageNumber } })
      if (pageNumber === 1) {
        setComments(res.data.data)
      } else {
        setComments(prev => [...prev, ...res.data.data])
      }
      setLastPage(res.data.last_page)
      setPage(res.data.current_page)
    } catch (error) {
      console.error(error)
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      addToast('Debes iniciar sesión para comentar', 'error')
      return
    }

    try {
      await createComment(reportId, { content: newComment })
      setNewComment('')
      addToast('Comentario enviado', 'success')
      fetchComments(1)
    } catch (error) {
      addToast('Error al comentar', 'error')
    }
  }

  const handleDeleteComment = async (cid) => {
    if (!window.confirm('¿Eliminar este registro?')) return
    try {
      await deleteComment(reportId, cid)
      addToast('Comentario borrado', 'success')
      fetchComments(1)
    } catch (error) {
      addToast('Error al borrar comentario', 'error')
    }
  }

  const handleUpdateComment = async (cid) => {
    try {
      await updateComment(reportId, cid, { content: commentEditValue })
      setEditingCommentId(null)
      addToast('Comentario actualizado', 'success')
      fetchComments(1)
    } catch (error) {
      addToast('Error al actualizar', 'error')
    }
  }

  const handleDeleteReport = async () => {
    if (!window.confirm('¿Eliminar este expediente de reporte permanentemente?')) return
    try {
      await deleteReport(forumId, reportId)
      addToast('Reporte eliminado', 'success')
      navigate(`/forums/${forumId}`)
    } catch (error) {
      addToast('Error al eliminar reporte', 'error')
    }
  }

  const handleUpdateReport = async (e) => {
    e.preventDefault()
    try {
      const payload = { title: reportForm.title, description: reportForm.description }
      if (reportForm.image) {
        const fileToBase64 = (file) => new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => resolve(reader.result)
          reader.onerror = error => reject(error)
        })
        payload.image = await fileToBase64(reportForm.image)
      }
      await updateReport(forumId, reportId, payload)
      addToast('Reporte actualizado', 'success')
      setShowEditReport(false)
      fetchReport()
    } catch (error) {
      addToast('Error al actualizar reporte', 'error')
    }
  }

  if (loading) return <div style={{ color: '#c8a96e', padding: '40px', textAlign: 'center' }}>Extrayendo datos del expediente...</div>
  if (!report) return <div style={{ color: '#c8a96e', padding: '40px', textAlign: 'center' }}>Reporte no encontrado en los archivos.</div>

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>
      <Link to={`/forums/${forumId}`} style={{ color: 'rgba(200, 169, 110, 0.5)', textDecoration: 'none', display: 'inline-block', marginBottom: '24px' }}>
        ← Volver al Foro
      </Link>

      <div style={{ background: 'rgba(15, 8, 18, 0.8)', border: '1px solid rgba(180, 50, 40, 0.3)', padding: '32px', marginBottom: '32px', boxShadow: '0 0 30px rgba(180, 50, 40, 0.1)', position: 'relative' }}>
        {user && String(user.id) === String(report.user_id) && (
          <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '8px' }}>
            <button onClick={() => { setReportForm({ title: report.title, description: report.description, image: null }); setShowEditReport(true); }} style={{ background: 'transparent', border: '1px solid #c8a96e', color: '#c8a96e', cursor: 'pointer', padding: '4px 12px', fontSize: '12px' }}>Editar</button>
            <button onClick={handleDeleteReport} style={{ background: 'transparent', border: '1px solid #ff4d4f', color: '#ff4d4f', cursor: 'pointer', padding: '4px 12px', fontSize: '12px' }}>Borrar</button>
          </div>
        )}
        <h1 style={{ margin: '0 0 20px 0', fontSize: '36px', color: '#ff4d4d', fontFamily: "var(--heading)", textShadow: '0 0 10px rgba(255, 77, 77, 0.3)' }}>
          {report.title}
        </h1>
        
        <div style={{ display: 'flex', gap: '24px', flexDirection: 'column' }}>
          {report.image && (
            <div style={{ width: '100%', minHeight: '300px', maxHeight: '500px', borderRadius: '4px', border: '1px solid rgba(200, 169, 110, 0.3)', background: '#000', overflow: 'hidden' }}>
              <ShimmerImage 
                src={
                  report.image.startsWith('blob:') || report.image.startsWith('http') 
                    ? report.image 
                    : report.image.startsWith('images/') 
                      ? `http://localhost:8000/${report.image}` 
                      : `http://localhost:8000/storage/${report.image}`
                } 
                alt="Evidencia"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          )}
          
          <div style={{ borderLeft: '3px solid rgba(180, 50, 40, 0.5)', paddingLeft: '20px' }}>
            <p style={{ color: '#e0cfa5', fontSize: '18px', lineHeight: '1.8', margin: 0, whiteSpace: 'pre-wrap' }}>
              {report.description}
            </p>
          </div>
          
          <div style={{ fontSize: '13px', color: 'rgba(200, 169, 110, 0.4)', fontStyle: 'italic', marginTop: '16px', borderTop: '1px solid rgba(200, 169, 110, 0.1)', paddingTop: '16px' }}>
            <span>Investigador: <strong style={{ color: '#e8c98e' }}>{report.user?.username || 'Gomita'}</strong></span>
            <span style={{ marginLeft: '24px' }}>Registrado el: {new Date(report.created_at).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Comentarios */}
      <div style={{ background: 'rgba(10, 5, 12, 0.5)', border: '1px solid rgba(200, 169, 110, 0.2)', padding: '32px' }}>
        <h2 style={{ color: '#c8a96e', fontSize: '24px', margin: '0 0 24px 0', fontFamily: "var(--heading)" }}>Registros de Audio y Comentarios</h2>
        
        <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <input 
            value={newComment} onChange={e => setNewComment(e.target.value)} required
            placeholder="Añadir análisis al expediente..."
            style={{ 
              flex: 1, 
              background: 'rgba(5, 3, 5, 0.8)', 
              border: '1px solid rgba(200, 169, 110, 0.3)', 
              color: '#c8a96e', 
              padding: '12px 16px',
              fontFamily: "var(--sans)",
              fontSize: '16px',
              outline: 'none'
            }}
          />
          <button type="submit" style={{ 
            background: 'rgba(180, 50, 40, 0.1)', 
            border: '1px solid rgba(180, 50, 40, 0.5)', 
            color: '#f0d090', 
            padding: '0 24px', 
            cursor: 'crosshair',
            fontFamily: "var(--sans)",
            transition: 'all 0.3s'
          }}
          onMouseOver={e => e.target.style.background = 'rgba(180, 50, 40, 0.3)'}
          onMouseOut={e => e.target.style.background = 'rgba(180, 50, 40, 0.1)'}>
            Transmitir
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {comments.map(c => (
            <div key={c.id} style={{ 
              background: 'rgba(15, 8, 18, 0.4)', 
              borderLeft: '2px solid rgba(200,169,110,0.3)', 
              padding: '16px',
              position: 'relative'
            }}>
              <div style={{ fontSize: '13px', color: 'rgba(200,169,110,0.5)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: '#e8c98e' }}>{c.user?.username || 'Anónimo'}</strong>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span>{new Date(c.created_at).toLocaleString()}</span>
                  {user && String(user.id) === String(c.user_id) && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span onClick={() => { setEditingCommentId(c.id); setCommentEditValue(c.content); }} style={{ color: '#c8a96e', cursor: 'pointer', fontSize: '10px', textDecoration: 'underline' }}>Editar</span>
                      <span onClick={() => handleDeleteComment(c.id)} style={{ color: '#ff4d4f', cursor: 'pointer', fontSize: '10px', textDecoration: 'underline' }}>Borrar</span>
                    </div>
                  )}
                </div>
              </div>
              {editingCommentId === c.id ? (
                <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                  <textarea value={commentEditValue} onChange={e => setCommentEditValue(e.target.value)} style={{ background: '#000', border: '1px solid #c8a96e', color: '#fff', padding: '8px' }} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleUpdateComment(c.id)} style={{ background: '#c8a96e', border: 'none', padding: '4px 10px', fontSize: '12px' }}>Guardar</button>
                    <button onClick={() => setEditingCommentId(null)} style={{ background: '#333', border: 'none', color: '#fff', padding: '4px 10px', fontSize: '12px' }}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <div style={{ color: '#c8a96e', fontSize: '15px', lineHeight: '1.5' }}>{c.content}</div>
              )}
            </div>
          ))}
          
          {page < lastPage && (
            <button onClick={() => fetchComments(page + 1)} style={{ 
              marginTop: '16px', 
              background: 'transparent', 
              border: '1px solid rgba(200,169,110,0.2)', 
              color: 'rgba(200,169,110,0.6)', 
              padding: '10px',
              cursor: 'pointer',
              fontFamily: "var(--sans)"
            }}
            onMouseOver={e => e.target.style.borderColor = 'rgba(200,169,110,0.5)'}
            onMouseOut={e => e.target.style.borderColor = 'rgba(200,169,110,0.2)'}>
              Descifrar más registros...
            </button>
          )}
          
          {comments.length === 0 && <p style={{ color: 'rgba(200,169,110,0.4)', fontStyle: 'italic', textAlign: 'center' }}>No existen frecuencias registradas aún.</p>}
        </div>
      </div>

      {showEditReport && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form onSubmit={handleUpdateReport} style={{ background: '#000', border: '1px solid #c8a96e', padding: '40px', width: '500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ color: '#c8a96e' }}>Editar Reporte</h2>
            <input required value={reportForm.title} onChange={e => setReportForm({...reportForm, title: e.target.value})} style={{ background: '#111', border: '1px solid #333', color: '#fff', padding: '10px' }} />
            <textarea required value={reportForm.description} onChange={e => setReportForm({...reportForm, description: e.target.value})} style={{ background: '#111', border: '1px solid #333', color: '#fff', padding: '10px', height: '150px' }} />
            <input type="file" onChange={e => setReportForm({...reportForm, image: e.target.files[0]})} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ flex: 1, background: '#c8a96e', border: 'none', padding: '12px' }}>Actualizar</button>
              <button type="button" onClick={() => setShowEditReport(false)} style={{ flex: 1, background: '#333', color: '#fff', border: 'none', padding: '12px' }}>Cerrar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
