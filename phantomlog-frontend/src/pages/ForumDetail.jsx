import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getForum } from '../api/forums'
import { createReport } from '../api/reports'
import { getComments, createComment } from '../api/comments'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

function ReportDetail({ report, onBack }) {
  const [comments, setComments] = useState([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [newComment, setNewComment] = useState('')
  const { user } = useAuth()
  const { showToast } = useToast()

  useEffect(() => {
    fetchComments(1)
  }, [report.id])

  // Desactivamos la carga real de comentarios temporales si el ID incluye temp
  const fetchComments = async (pageNumber) => {
    if (String(report.id).includes('temp')) return; 
    
    try {
      const res = await getComments(report.id, { params: { page: pageNumber } })
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
      showToast('Debes iniciar sesión para comentar', 'error')
      return
    }

    if (String(report.id).includes('temp')) {
       return showToast('Espera a que el reporte termine de crearse...', 'warning')
    }

    // Optimistic Update
    const optimisticComment = {
      id: `temp-${Date.now()}`,
      content: newComment,
      user: user,
      created_at: new Date().toISOString()
    }

    setComments(prev => [optimisticComment, ...prev])
    setNewComment('')
    showToast('Comentario añadido exitosamente', 'success')

    try {
      await createComment(report.id, { content: optimisticComment.content })
      fetchComments(1)
    } catch (error) {
      showToast('Error al guardar comentario', 'error')
    }
  }

  return (
    <div style={{ background: 'rgba(15, 8, 18, 0.8)', border: '1px solid rgba(180, 50, 40, 0.3)', padding: '24px', marginBottom: '32px' }}>
      <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: 'rgba(200, 169, 110, 0.6)', cursor: 'pointer', marginBottom: '16px', padding: 0 }}>
        ← Volver a lista de reportes
      </button>

      <h3 style={{ margin: '0 0 12px 0', fontSize: '24px', color: '#ff4d4d', fontFamily: "'UnifrakturMaguntia', serif" }}>{report.title}</h3>
      <div style={{ display: 'flex', gap: '20px', flexDirection: window.innerWidth < 600 ? 'column' : 'row' }}>
        {report.image && (
          <img 
            src={report.image.startsWith('blob:') || report.image.startsWith('http') ? report.image : `http://localhost:8000/storage/${report.image}`} 
            alt="Reporte"
            style={{ width: '300px', height: '200px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(200, 169, 110, 0.3)' }}
          />
        )}
        <p style={{ color: '#e0cfa5', fontSize: '16px', lineHeight: '1.6', margin: 0, flex: 1 }}>
          {report.description}
        </p>
      </div>

      {/* Comentarios */}
      <div style={{ marginTop: '32px', borderTop: '1px solid rgba(200, 169, 110, 0.2)', paddingTop: '24px' }}>
        <h4 style={{ color: '#c8a96e', fontSize: '20px', margin: '0 0 16px 0', fontFamily: "'UnifrakturMaguntia', serif" }}>Registros de Audio / Comentarios</h4>
        
        <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <input 
            value={newComment} onChange={e => setNewComment(e.target.value)} required
            placeholder="Analizar este reporte y dejar un comentario..."
            style={{ flex: 1, background: 'rgba(5, 3, 5, 0.8)', border: '1px solid rgba(200, 169, 110, 0.3)', color: '#c8a96e', padding: '12px' }}
          />
          <button type="submit" style={{ background: 'rgba(200, 169, 110, 0.1)', border: '1px solid rgba(200, 169, 110, 0.5)', color: '#c8a96e', padding: '0 24px', cursor: 'pointer' }}>
            Aportar
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {comments.map(c => (
            <div key={c.id} style={{ background: 'rgba(5, 3, 5, 0.6)', borderLeft: '2px solid rgba(200,169,110,0.4)', padding: '16px' }}>
              <div style={{ fontSize: '13px', color: 'rgba(200,169,110,0.5)', marginBottom: '8px' }}>
                <strong style={{ color: '#e8c98e' }}>{c.user?.username || 'Anónimo'}</strong> - {new Date(c.created_at).toLocaleString()}
              </div>
              <div style={{ color: '#c8a96e', fontSize: '15px' }}>{c.content}</div>
            </div>
          ))}
          {page < lastPage && (
             <button onClick={() => fetchComments(page + 1)} style={{ marginTop: '12px', background: 'transparent', border: 'none', color: 'rgba(200,169,110,0.7)', cursor: 'pointer', textDecoration: 'underline' }}>
               Descifrar más registros...
             </button>
          )}
          {comments.length === 0 && <p style={{color: 'rgba(200,169,110,0.4)', fontStyle: 'italic'}}>Aún no hay expedientes sonoros.</p>}
        </div>
      </div>
    </div>
  )
}

function ReportCard({ report, onClick }) {
  return (
    <div 
      onClick={onClick}
      style={{
        background: 'rgba(15, 8, 18, 0.45)', 
        border: '1px solid rgba(200, 169, 110, 0.15)', 
        padding: '16px', 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s'
      }}
      onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.6)'; e.currentTarget.style.background = 'rgba(15, 8, 18, 0.6)'; }}
      onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.15)'; e.currentTarget.style.background = 'rgba(15, 8, 18, 0.45)'; }}
    >
      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#e8c98e' }}>{report.title}</h4>
        <div style={{ fontSize: '12px', color: 'rgba(200, 169, 110, 0.5)' }}>
          {new Date(report.created_at).toLocaleString()}
        </div>
      </div>
      <div style={{color: 'rgba(180, 50, 40, 0.7)', fontSize: '14px', fontFamily: "'UnifrakturMaguntia', serif"}}>
        Inspeccionar →
      </div>
    </div>
  )
}

export default function ForumDetail() {
  const { id } = useParams()
  const [forum, setForum] = useState(null)
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportData, setReportData] = useState({ title: '', description: '', image: null })
  
  // Estado para la vista de reportes
  const [activeReportId, setActiveReportId] = useState(null)

  const { user } = useAuth()
  const { showToast } = useToast()

  useEffect(() => {
    fetchForum()
    // Si resetea el FORUM ID, volvemos a la lista
    setActiveReportId(null)
  }, [id])

  const fetchForum = async () => {
    try {
      const res = await getForum(id)
      setForum(res.data)
    } catch (error) {
      console.error(error)
      showToast('Error cargando foro', 'error')
    }
  }

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })

  const handleCreateReport = async (e) => {
    e.preventDefault()
    
    if (!reportData.title || !reportData.description) return;

    try {
      const optimisticReport = {
        id: `temp-${Date.now()}`,
        title: reportData.title,
        description: reportData.description,
        image: reportData.image ? URL.createObjectURL(reportData.image) : null,
        created_at: new Date().toISOString(),
        comments: []
      }

      setForum(prev => ({
        ...prev,
        reports: [optimisticReport, ...(prev.reports || [])]
      }))

      setShowReportModal(false)
      setReportData({ title: '', description: '', image: null })
      showToast('Reporte añadido espectacularmente', 'success')

      const payload = {
        title: reportData.title,
        description: reportData.description,
      }
      
      if (reportData.image) {
        payload.image = await fileToBase64(reportData.image)
      }

      await createReport(forum.id, payload)
      fetchForum() // recarga
    } catch (error) {
      console.error(error)
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message
      const errorDetails = JSON.stringify(error.response?.data?.errors || {})
      showToast(`Error: ${errorMsg} ${errorDetails}`, 'error')
      fetchForum() // Revert
    }
  }

  if (!forum) return <div style={{ color: '#c8a96e', padding: '40px', textAlign: 'center' }}>Cargando expediente misterioso...</div>

  const isCreator = user && user.id === forum.user_id
  const activeReport = activeReportId ? forum.reports.find(r => r.id === activeReportId) : null

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>
      <Link to="/forums" style={{ color: 'rgba(200, 169, 110, 0.5)', textDecoration: 'none', display: 'inline-block', marginBottom: '24px' }}>← Volver a los Carpetas Centrales</Link>

      <div style={{ background: 'rgba(10, 5, 12, 0.85)', border: '1px solid rgba(200, 169, 110, 0.3)', padding: '32px', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: '42px', color: '#c8a96e', margin: '0 0 16px 0' }}>{forum.title}</h1>
        {forum.image && (
          <img src={forum.image.startsWith('blob:') || forum.image.startsWith('http') ? forum.image : `http://localhost:8000/storage/${forum.image}`} alt={forum.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', marginBottom: '24px', border: '1px solid rgba(200, 169, 110, 0.2)' }} />
        )}
        <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: 'rgba(200, 169, 110, 0.4)', fontStyle: 'italic', marginBottom: '24px', borderBottom: '1px solid rgba(200, 169, 110, 0.1)', paddingBottom: '16px' }}>
          <span>Caso liderado por <strong style={{color: '#f0d090'}}>{forum.user?.username || 'Anónimo'}</strong></span>
          <span>Apertura: {new Date(forum.created_at).toLocaleDateString()}</span>
        </div>
        <p style={{ lineHeight: '1.6', fontSize: '18px', color: '#e0cfa5', margin: 0 }}>{forum.description}</p>
      </div>

      {!activeReport ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(200, 169, 110, 0.2)', paddingBottom: '8px' }}>
            <h3 style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: '28px', color: 'rgba(200, 169, 110, 0.6)', margin: 0 }}>Reportes del Caso</h3>
            {isCreator && (
              <button onClick={() => setShowReportModal(true)} style={{ background: 'rgba(180, 50, 40, 0.2)', border: '1px solid rgba(180, 50, 40, 0.6)', color: '#f0d090', padding: '8px 16px', cursor: 'pointer', transition: 'all 0.3s' }}>
                + Anexar Reporte
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {forum.reports && forum.reports.length > 0 ? (
              forum.reports.map(rep => (
                <ReportCard key={rep.id} report={rep} onClick={() => setActiveReportId(rep.id)} />
              ))
            ) : (
              <p style={{ color: 'rgba(200,169,110,0.5)', textAlign: 'center', marginTop: '20px' }}>Todavía no hay hallazgos fotográficos o escritos para este expediente.</p>
            )}
          </div>
        </>
      ) : (
        <ReportDetail report={activeReport} onBack={() => setActiveReportId(null)} />
      )}

      {showReportModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form onSubmit={handleCreateReport} style={{ background: 'rgba(15, 8, 18, 0.95)', border: '1px solid rgba(200, 169, 110, 0.3)', padding: '32px', width: '500px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontFamily: "'UnifrakturMaguntia', serif", color: '#ff4d4d', margin: '0 0 16px 0' }}>Nuevo Reporte al Expediente</h2>
            <input required placeholder="Título Sintético" value={reportData.title} onChange={e => setReportData({...reportData, title: e.target.value})} style={{ background: 'rgba(5, 3, 5, 0.8)', border: '1px solid rgba(200, 169, 110, 0.3)', color: '#c8a96e', padding: '10px' }} />
            <textarea required placeholder="Descripción de los eventos, lecturas, etc..." value={reportData.description} onChange={e => setReportData({...reportData, description: e.target.value})} style={{ background: 'rgba(5, 3, 5, 0.8)', border: '1px solid rgba(200, 169, 110, 0.3)', color: '#c8a96e', padding: '10px', height: '140px' }} />
            <label style={{ color: '#c8a96e', fontSize: '14px' }}>Evidencia Fotográfica (Opcional)</label>
            <input type="file" accept="image/*" onChange={e => setReportData({...reportData, image: e.target.files[0]})} style={{ color: '#c8a96e' }} />
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button type="submit" style={{ flex: 1, background: 'rgba(180, 50, 40, 0.2)', color: '#f0d090', border: '1px solid rgba(180, 50, 40, 0.5)', padding: '12px', cursor: 'pointer' }}>Adjuntar</button>
              <button type="button" onClick={() => setShowReportModal(false)} style={{ flex: 1, background: 'transparent', color: 'rgba(200,169,110,0.6)', border: '1px solid rgba(200,169,110,0.3)', padding: '12px', cursor: 'pointer' }}>Descartar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}