import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getForum, deleteForum, updateForum } from '../api/forums'
import { createReport, getReports, updateReport, deleteReport } from '../api/reports'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import ShimmerImage from '../components/ShimmerImage'

function ReportCard({ forumId, report, onAction }) {
  const { user } = useAuth()
  const isAuthor = user && String(user.id) === String(report.user_id)

  return (
    <div style={{ position: 'relative' }}>
      <Link 
        to={`/forums/${forumId}/reports/${report.id}`}
        style={{
          background: 'rgba(15, 8, 18, 0.45)', 
          border: '1px solid rgba(200, 169, 110, 0.15)', 
          padding: '20px', 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s',
          textDecoration: 'none'
        }}
        onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.6)'; e.currentTarget.style.background = 'rgba(15, 8, 18, 0.6)'; }}
        onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.15)'; e.currentTarget.style.background = 'rgba(15, 8, 18, 0.45)'; }}
      >
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {report.image && (
            <div style={{ width: '60px', height: '60px', flexShrink: 0 }}>
              <ShimmerImage 
                src={
                  report.image.startsWith('blob:') || report.image.startsWith('http') 
                    ? report.image 
                    : report.image.startsWith('images/') 
                      ? `http://localhost:8000/${report.image}` 
                      : `http://localhost:8000/storage/${report.image}`
                } 
                alt="Evidencia"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(200, 169, 110, 0.2)' }}
              />
            </div>
          )}
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#e8c98e' }}>{report.title}</h4>
            <div style={{ fontSize: '12px', color: 'rgba(200, 169, 110, 0.5)', fontStyle: 'italic' }}>
              Registrado por {report.user?.username || 'Gomita'} • {new Date(report.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div style={{color: 'rgba(180, 50, 40, 0.7)', fontSize: '14px', fontFamily: "var(--heading)", fontWeight: 'bold'}}>
          Analizar Expediente →
        </div>
      </Link>
      
      {isAuthor && (
        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '8px', zIndex: 10 }}>
          <button onClick={() => onAction('edit', report)} style={{ background: '#222', border: '1px solid #c8a96e', color: '#c8a96e', cursor: 'pointer', padding: '2px 8px', fontSize: '10px', borderRadius: '3px' }}>Editar</button>
          <button onClick={() => onAction('delete', report.id)} style={{ background: '#222', border: '1px solid #ff4d4f', color: '#ff4d4f', cursor: 'pointer', padding: '2px 8px', fontSize: '10px', borderRadius: '3px' }}>Borrar</button>
        </div>
      )}
    </div>
  )
}

export default function ForumDetail() {
  const { id } = useParams()
  const [forum, setForum] = useState(null)
  const [reports, setReports] = useState([])
  const [reportsPage, setReportsPage] = useState(1)
  const [reportsLastPage, setReportsLastPage] = useState(1)
  const [loadingReports, setLoadingReports] = useState(false)
  
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportData, setReportData] = useState({ title: '', description: '', image: null })
  const [isBlocking, setIsBlocking] = useState(false)
  const [countdown, setCountdown] = useState(0)
  
  const { user } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [showForumEditModal, setShowForumEditModal] = useState(false)
  const [forumFormData, setForumFormData] = useState({ title: '', description: '', image: null })

  const [isEditingReport, setIsEditingReport] = useState(false)
  const [currentReportId, setCurrentReportId] = useState(null)

  useEffect(() => {
    fetchForum()
    fetchReports(1)
  }, [id])

  const fetchForum = async () => {
    try {
      const res = await getForum(id)
      setForum(res.data)
    } catch (error) {
      console.error(error)
      addToast('Error cargando foro', 'error')
    }
  }

  const fetchReports = async (pageNumber) => {
    setLoadingReports(true)
    try {
      const res = await getReports(id, { page: pageNumber, per_page: 5 })
      setReports(res.data.data)
      setReportsLastPage(res.data.last_page)
      setReportsPage(res.data.current_page)
    } catch (error) {
      console.error(error)
      addToast('Error al cargar reportes', 'error')
    } finally {
      setLoadingReports(false)
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
      addToast(isEditingReport ? 'Actualizando evidencia...' : 'Enviando reporte paranormal...', 'info')

      const payload = {
        title: reportData.title,
        description: reportData.description,
      }
      if (reportData.image) payload.image = await fileToBase64(reportData.image)

      if (isEditingReport) {
        await updateReport(forum.id, currentReportId, payload)
        addToast('Reporte actualizado', 'success')
      } else {
        await createReport(forum.id, payload)
        addToast('Reporte creado', 'success')
      }
      
      setShowReportModal(false)
      setReportData({ title: '', description: '', image: null })
      setIsEditingReport(false)
      setCurrentReportId(null)
      fetchReports(1)
    } catch (error) {
      console.error(error)
      addToast('Error al guardar reporte', 'error')
    }
  }

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('¿Eliminar este hallazgo?')) return
    try {
      await deleteReport(forum.id, reportId)
      addToast('Evidencia borrada', 'success')
      fetchReports(1)
    } catch (error) {
      addToast('Error al borrar reporte', 'error')
    }
  }

  const openEditReport = (report) => {
    setReportData({ title: report.title, description: report.description, image: null })
    setIsEditingReport(true)
    setCurrentReportId(report.id)
    setShowReportModal(true)
  }

  const handleForumAction = async (action) => {
    if (action === 'delete') {
      if (!window.confirm('¿Borrar este foro y todos sus reportes permanentemente?')) return
      try {
        await deleteForum(forum.id)
        addToast('Foro eliminado', 'success')
        navigate('/forums')
      } catch (error) {
        addToast('Error al borrar foro', 'error')
      }
    } else if (action === 'edit') {
      setForumFormData({ title: forum.title, description: forum.description, image: null })
      setShowForumEditModal(true)
    }
  }

  const handleUpdateForum = async (e) => {
    e.preventDefault()
    try {
      const payload = { title: forumFormData.title, description: forumFormData.description }
      if (forumFormData.image) payload.image = await fileToBase64(forumFormData.image)
      await updateForum(forum.id, payload)
      addToast('Foro actualizado', 'success')
      setShowForumEditModal(false)
      fetchForum()
    } catch (error) {
      addToast('Error al actualizar foro', 'error')
    }
  }

  if (!forum) return <div style={{ color: '#c8a96e', padding: '40px', textAlign: 'center' }}>Cargando expediente misterioso...</div>

  const isCreator = user && user.id === forum.user_id

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>
      <Link to="/forums" style={{ color: 'rgba(200, 169, 110, 0.5)', textDecoration: 'none', display: 'inline-block', marginBottom: '24px', transition: 'color 0.3s' }} onMouseOver={e=>e.target.style.color='#c8a96e'} onMouseOut={e=>e.target.style.color='rgba(200, 169, 110, 0.5)'}>← Volver a los Carpetas Centrales</Link>

      <div style={{ background: 'rgba(10, 5, 12, 0.85)', border: '1px solid rgba(200, 169, 110, 0.3)', padding: '32px', marginBottom: '32px', boxShadow: '0 0 40px rgba(0,0,0,0.5)', position: 'relative' }}>
        {isCreator && (
          <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px' }}>
            <button onClick={() => handleForumAction('edit')} style={{ background: 'transparent', border: '1px solid #c8a96e', color: '#c8a96e', cursor: 'pointer', padding: '5px 15px', borderRadius: '4px' }}>Editar Foro</button>
            <button onClick={() => handleForumAction('delete')} style={{ background: 'transparent', border: '1px solid #ff4d4f', color: '#ff4d4f', cursor: 'pointer', padding: '5px 15px', borderRadius: '4px' }}>Borrar Foro</button>
          </div>
        )}
        <h1 style={{ fontFamily: "var(--heading)", fontSize: '42px', color: '#c8a96e', margin: '0 0 16px 0', textShadow: '0 0 15px rgba(200,169,110,0.2)' }}>{forum.title}</h1>
        {forum.image && (
          <div style={{ width: '100%', height: '400px', marginBottom: '32px', border: '1px solid rgba(200, 169, 110, 0.2)', boxShadow: '0 10px 30px rgba(0,0,0,0.8)', overflow: 'hidden' }}>
            <ShimmerImage 
              src={
                forum.image.startsWith('blob:') || forum.image.startsWith('http') 
                  ? forum.image 
                  : forum.image.startsWith('images/') 
                    ? `http://localhost:8000/${forum.image}` 
                    : `http://localhost:8000/storage/${forum.image}`
              } 
              alt={forum.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
        )}
        <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: 'rgba(200, 169, 110, 0.4)', fontStyle: 'italic', marginBottom: '24px', borderBottom: '1px solid rgba(200, 169, 110, 0.1)', paddingBottom: '16px' }}>
          <span>Liderado por <strong style={{color: '#f0d090'}}>{forum.user?.username || 'Gomita'}</strong></span>
          <span>Apertura: {new Date(forum.created_at).toLocaleDateString()}</span>
        </div>
        <p style={{ lineHeight: '1.8', fontSize: '18px', color: '#e0cfa5', margin: 0 }}>{forum.description}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(200, 169, 110, 0.2)', paddingBottom: '12px' }}>
        <h3 style={{ fontFamily: "var(--heading)", fontSize: '28px', color: 'rgba(200, 169, 110, 0.8)', margin: 0 }}>Expedientes de Reporte</h3>
        {isCreator && (
          <button 
            disabled={isBlocking}
            onClick={() => setShowReportModal(true)} 
            style={{ 
              background: isBlocking ? 'rgba(50, 50, 50, 0.2)' : 'rgba(180, 50, 40, 0.1)', 
              border: `1px solid ${isBlocking ? 'rgba(100, 100, 100, 0.3)' : 'rgba(180, 50, 40, 0.6)'}`, 
              color: isBlocking ? 'rgba(200, 169, 110, 0.3)' : '#f0d090', 
              padding: '10px 24px', 
              cursor: isBlocking ? 'not-allowed' : 'crosshair', 
              fontFamily: "var(--sans)",
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={e => !isBlocking && (e.target.style.background = 'rgba(180, 50, 40, 0.3)')}
            onMouseOut={e => !isBlocking && (e.target.style.background = 'rgba(180, 50, 40, 0.1)')}
          >
            {isBlocking ? `Sincronizando Archivo (${countdown}s)` : '+ Anexar Evidencia'}
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loadingReports ? (
          <p style={{ textAlign: 'center', color: '#c8a96e', padding: '20px' }}>Interfiriendo con la señal...</p>
        ) : (
          <>
            {reports.length > 0 ? (
              reports.map(rep => (
                <ReportCard 
                  key={rep.id} 
                  forumId={forum.id} 
                  report={rep} 
                  onAction={(type, data) => type === 'edit' ? openEditReport(data) : handleDeleteReport(data)} 
                />
              ))
            ) : (
              <p style={{ color: 'rgba(200,169,110,0.5)', textAlign: 'center', marginTop: '20px', fontStyle: 'italic' }}>Todavía no hay hallazgos fotográficos o escritos para este expediente.</p>
            )}

            {/* Pagination */}
            {reportsLastPage > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '30px' }}>
                <button 
                  disabled={reportsPage === 1}
                  onClick={() => fetchReports(reportsPage - 1)}
                  style={{ background: 'transparent', border: '1px solid rgba(200,169,110,0.3)', color: reportsPage === 1 ? '#444' : '#c8a96e', padding: '6px 15px', cursor: reportsPage === 1 ? 'default' : 'pointer' }}
                >Anterior</button>
                <span style={{ color: '#c8a96e', fontSize: '14px' }}>{reportsPage} de {reportsLastPage}</span>
                <button 
                  disabled={reportsPage === reportsLastPage}
                  onClick={() => fetchReports(reportsPage + 1)}
                  style={{ background: 'transparent', border: '1px solid rgba(200,169,110,0.3)', color: reportsPage === reportsLastPage ? '#444' : '#c8a96e', padding: '6px 15px', cursor: reportsPage === reportsLastPage ? 'default' : 'pointer' }}
                >Siguiente</button>
              </div>
            )}
          </>
        )}
      </div>

      {showReportModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
          <form onSubmit={handleCreateReport} style={{ background: 'rgba(15, 8, 18, 0.98)', border: '1px solid rgba(180, 50, 40, 0.4)', padding: '40px', width: '500px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 0 50px rgba(180, 50, 40, 0.2)' }}>
            <h2 style={{ fontFamily: "var(--heading)", color: '#ff4d4f', margin: '0 0 10px 0', fontSize: '32px' }}>{isEditingReport ? 'Editar Evidencia' : 'Anexar Evidencia'}</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#c8a96e', fontSize: '14px' }}>Título</label>
              <input required value={reportData.title} onChange={e => setReportData({...reportData, title: e.target.value})} style={{ background: '#000', border: '1px solid #c8a96e', color: '#fff', padding: '10px' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#c8a96e', fontSize: '14px' }}>Descripción</label>
              <textarea required value={reportData.description} onChange={e => setReportData({...reportData, description: e.target.value})} style={{ background: '#000', border: '1px solid #c8a96e', color: '#fff', padding: '10px', height: '120px' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#c8a96e', fontSize: '14px' }}>Imagen (Opcional)</label>
              <input type="file" onChange={e => setReportData({...reportData, image: e.target.files[0]})} />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" style={{ flex: 1, background: '#822', color: '#fff', border: 'none', padding: '12px', cursor: 'pointer' }}>Guardar</button>
              <button type="button" onClick={() => setShowReportModal(false)} style={{ flex: 1, background: '#333', color: '#fff', border: 'none', padding: '12px', cursor: 'pointer' }}>Cerrar</button>
            </div>
          </form>
        </div>
      )}

      {showForumEditModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
          <form onSubmit={handleUpdateForum} style={{ background: 'rgba(15, 8, 18, 0.98)', border: '1px solid #c8a96e', padding: '40px', width: '500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ color: '#c8a96e' }}>Editar Foro</h2>
            <input required placeholder="Título" value={forumFormData.title} onChange={e => setForumFormData({...forumFormData, title: e.target.value})} style={{ background: '#000', border: '1px solid #c8a96e', color: '#fff', padding: '10px' }} />
            <textarea required placeholder="Descripción" value={forumFormData.description} onChange={e => setForumFormData({...forumFormData, description: e.target.value})} style={{ background: '#000', border: '1px solid #c8a96e', color: '#fff', padding: '10px', height: '100px' }} />
            <input type="file" onChange={e => setForumFormData({...forumFormData, image: e.target.files[0]})} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ flex: 1, background: '#c8a96e', color: '#000', border: 'none', padding: '12px' }}>Actualizar</button>
              <button type="button" onClick={() => setShowForumEditModal(false)} style={{ flex: 1, background: '#333', color: '#fff', border: 'none', padding: '12px' }}>Cerrar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
