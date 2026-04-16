import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getForum } from '../api/forums'
import { createReport, getReports } from '../api/reports'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

function ReportCard({ forumId, report }) {
  return (
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
          <img 
            src={
              report.image.startsWith('blob:') || report.image.startsWith('http') 
                ? report.image 
                : report.image.startsWith('images/') 
                  ? `http://localhost:8000/${report.image}` 
                  : `http://localhost:8000/storage/${report.image}`
            } 
            alt="Evidencia"
            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(200, 169, 110, 0.2)' }}
          />
        )}
        <div>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#e8c98e' }}>{report.title}</h4>
          <div style={{ fontSize: '12px', color: 'rgba(200, 169, 110, 0.5)', fontStyle: 'italic' }}>
            Registrado por {report.user?.username || 'Gomita'} • {new Date(report.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
      <div style={{color: 'rgba(180, 50, 40, 0.7)', fontSize: '14px', fontFamily: "'UnifrakturMaguntia', serif", fontWeight: 'bold'}}>
        Analizar Expediente →
      </div>
    </Link>
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
  
  const { user } = useAuth()
  const { addToast } = useToast()

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
      const optimisticReport = {
        id: `temp-${Date.now()}`,
        title: reportData.title,
        description: reportData.description,
        image: reportData.image ? URL.createObjectURL(reportData.image) : null,
        user: user,
        created_at: new Date().toISOString()
      }

      setReports(prev => [optimisticReport, ...prev])
      setShowReportModal(false)
      setReportData({ title: '', description: '', image: null })
      addToast('Enviando reporte paranormal...', 'success')

      const payload = {
        title: reportData.title,
        description: reportData.description,
      }
      
      if (reportData.image) {
        payload.image = await fileToBase64(reportData.image)
      }

      await createReport(forum.id, payload)
      fetchReports(1) // recarga lista real
    } catch (error) {
      console.error(error)
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message
      addToast(`Error: ${errorMsg}`, 'error')
      fetchReports(reportsPage)
    }
  }

  if (!forum) return <div style={{ color: '#c8a96e', padding: '40px', textAlign: 'center' }}>Cargando expediente misterioso...</div>

  const isCreator = user && user.id === forum.user_id

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>
      <Link to="/forums" style={{ color: 'rgba(200, 169, 110, 0.5)', textDecoration: 'none', display: 'inline-block', marginBottom: '24px', transition: 'color 0.3s' }} onMouseOver={e=>e.target.style.color='#c8a96e'} onMouseOut={e=>e.target.style.color='rgba(200, 169, 110, 0.5)'}>← Volver a los Carpetas Centrales</Link>

      <div style={{ background: 'rgba(10, 5, 12, 0.85)', border: '1px solid rgba(200, 169, 110, 0.3)', padding: '32px', marginBottom: '32px', boxShadow: '0 0 40px rgba(0,0,0,0.5)' }}>
        <h1 style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: '42px', color: '#c8a96e', margin: '0 0 16px 0', textShadow: '0 0 15px rgba(200,169,110,0.2)' }}>{forum.title}</h1>
        {forum.image && (
          <img 
            src={
              forum.image.startsWith('blob:') || forum.image.startsWith('http') 
                ? forum.image 
                : forum.image.startsWith('images/') 
                  ? `http://localhost:8000/${forum.image}` 
                  : `http://localhost:8000/storage/${forum.image}`
            } 
            alt={forum.title} 
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', marginBottom: '32px', border: '1px solid rgba(200, 169, 110, 0.2)', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }} 
          />
        )}
        <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: 'rgba(200, 169, 110, 0.4)', fontStyle: 'italic', marginBottom: '24px', borderBottom: '1px solid rgba(200, 169, 110, 0.1)', paddingBottom: '16px' }}>
          <span>Liderado por <strong style={{color: '#f0d090'}}>{forum.user?.username || 'Gomita'}</strong></span>
          <span>Apertura: {new Date(forum.created_at).toLocaleDateString()}</span>
        </div>
        <p style={{ lineHeight: '1.8', fontSize: '18px', color: '#e0cfa5', margin: 0 }}>{forum.description}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(200, 169, 110, 0.2)', paddingBottom: '12px' }}>
        <h3 style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: '28px', color: 'rgba(200, 169, 110, 0.8)', margin: 0 }}>Expedientes de Reporte</h3>
        {isCreator && (
          <button 
            onClick={() => setShowReportModal(true)} 
            style={{ 
              background: 'rgba(180, 50, 40, 0.1)', 
              border: '1px solid rgba(180, 50, 40, 0.6)', 
              color: '#f0d090', 
              padding: '10px 20px', 
              cursor: 'crosshair', 
              fontFamily: "'IM Fell English', serif",
              transition: 'all 0.3s'
            }}
            onMouseOver={e => e.target.style.background = 'rgba(180, 50, 40, 0.3)'}
            onMouseOut={e => e.target.style.background = 'rgba(180, 50, 40, 0.1)'}
          >
            + Anexar Evidencia
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
                <ReportCard key={rep.id} forumId={forum.id} report={rep} />
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
            <h2 style={{ fontFamily: "'UnifrakturMaguntia', serif", color: '#ff4d4d', margin: '0 0 10px 0', fontSize: '32px' }}>Anexar Evidencia al Caso</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#c8a96e', fontSize: '14px', fontFamily: "'IM Fell English', serif" }}>Título del Hallazgo</label>
              <input required placeholder="Ej: Sombras en el sótano..." value={reportData.title} onChange={e => setReportData({...reportData, title: e.target.value})} style={{ background: 'rgba(5, 3, 5, 0.9)', border: '1px solid rgba(200, 169, 110, 0.2)', color: '#e8c98e', padding: '12px', outline: 'none', fontFamily: "'IM Fell English', serif" }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#c8a96e', fontSize: '14px', fontFamily: "'IM Fell English', serif" }}>Descripción Detallada</label>
              <textarea required placeholder="Relata los eventos con precisión..." value={reportData.description} onChange={e => setReportData({...reportData, description: e.target.value})} style={{ background: 'rgba(5, 3, 5, 0.9)', border: '1px solid rgba(200, 169, 110, 0.2)', color: '#e8c98e', padding: '12px', height: '140px', outline: 'none', fontFamily: "'IM Fell English', serif", resize: 'none' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#c8a96e', fontSize: '14px', fontFamily: "'IM Fell English', serif" }}>Prueba Fotográfica (Opcional)</label>
              <input type="file" accept="image/*" onChange={e => setReportData({...reportData, image: e.target.files[0]})} style={{ color: 'rgba(200, 169, 110, 0.6)', fontSize: '14px' }} />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
              <button type="submit" style={{ flex: 1, background: 'rgba(180, 50, 40, 0.2)', color: '#f0d090', border: '1px solid rgba(180, 50, 40, 0.6)', padding: '14px', cursor: 'pointer', fontFamily: "'IM Fell English', serif", fontSize: '18px', transition: 'all 0.3s' }} onMouseOver={e=>e.target.style.background='rgba(180, 50, 40, 0.4)'} onMouseOut={e=>e.target.style.background='rgba(180, 50, 40, 0.2)'}>Archivar</button>
              <button type="button" onClick={() => setShowReportModal(false)} style={{ flex: 1, background: 'transparent', color: 'rgba(200,169,110,0.5)', border: '1px solid rgba(200,169,110,0.2)', padding: '14px', cursor: 'pointer', fontFamily: "'IM Fell English', serif", fontSize: '18px' }}>Descartar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}