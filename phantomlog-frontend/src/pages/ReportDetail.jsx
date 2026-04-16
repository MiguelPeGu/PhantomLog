import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getReport } from '../api/reports'
import { getComments, createComment } from '../api/comments'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

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

    const optimisticComment = {
      id: `temp-${Date.now()}`,
      content: newComment,
      user: user,
      created_at: new Date().toISOString()
    }

    setComments(prev => [optimisticComment, ...prev])
    setNewComment('')
    addToast('Comentario añadido exitosamente', 'success')

    try {
      await createComment(reportId, { content: optimisticComment.content })
      fetchComments(1)
    } catch (error) {
      addToast('Error al guardar comentario', 'error')
      fetchComments(1)
    }
  }

  if (loading) return <div style={{ color: '#c8a96e', padding: '40px', textAlign: 'center' }}>Extrayendo datos del expediente...</div>
  if (!report) return <div style={{ color: '#c8a96e', padding: '40px', textAlign: 'center' }}>Reporte no encontrado en los archivos.</div>

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>
      <Link to={`/forums/${forumId}`} style={{ color: 'rgba(200, 169, 110, 0.5)', textDecoration: 'none', display: 'inline-block', marginBottom: '24px' }}>
        ← Volver al Foro
      </Link>

      <div style={{ background: 'rgba(15, 8, 18, 0.8)', border: '1px solid rgba(180, 50, 40, 0.3)', padding: '32px', marginBottom: '32px', boxShadow: '0 0 30px rgba(180, 50, 40, 0.1)' }}>
        <h1 style={{ margin: '0 0 20px 0', fontSize: '36px', color: '#ff4d4d', fontFamily: "'UnifrakturMaguntia', serif", textShadow: '0 0 10px rgba(255, 77, 77, 0.3)' }}>
          {report.title}
        </h1>
        
        <div style={{ display: 'flex', gap: '24px', flexDirection: 'column' }}>
          {report.image && (
            <img 
              src={
                report.image.startsWith('blob:') || report.image.startsWith('http') 
                  ? report.image 
                  : report.image.startsWith('images/') 
                    ? `http://localhost:8000/${report.image}` 
                    : `http://localhost:8000/storage/${report.image}`
              } 
              alt="Evidencia"
              style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(200, 169, 110, 0.3)', background: '#000' }}
            />
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
        <h2 style={{ color: '#c8a96e', fontSize: '24px', margin: '0 0 24px 0', fontFamily: "'UnifrakturMaguntia', serif" }}>Registros de Audio y Comentarios</h2>
        
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
              fontFamily: "'IM Fell English', serif",
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
            fontFamily: "'IM Fell English', serif",
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
              transition: 'all 0.3s'
            }}>
              <div style={{ fontSize: '13px', color: 'rgba(200,169,110,0.5)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: '#e8c98e' }}>{c.user?.username || 'Anónimo'}</strong>
                <span>{new Date(c.created_at).toLocaleString()}</span>
              </div>
              <div style={{ color: '#c8a96e', fontSize: '15px', lineHeight: '1.5' }}>{c.content}</div>
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
              fontFamily: "'IM Fell English', serif"
            }}
            onMouseOver={e => e.target.style.borderColor = 'rgba(200,169,110,0.5)'}
            onMouseOut={e => e.target.style.borderColor = 'rgba(200,169,110,0.2)'}>
              Descifrar más registros...
            </button>
          )}
          
          {comments.length === 0 && <p style={{ color: 'rgba(200,169,110,0.4)', fontStyle: 'italic', textAlign: 'center' }}>No existen frecuencias registradas aún.</p>}
        </div>
      </div>
    </div>
  )
}
