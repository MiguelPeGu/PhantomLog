import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Profile() {
  const { user, updateUser, logout } = useAuth()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('forums')
  
  const [formData, setFormData] = useState({
    username: '', firstname: '', lastname: '',
    dni: '', address: '', postalCode: '', img: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        dni: user.dni || '',
        address: user.address || '',
        postalCode: user.postalCode || '',
        img: user.img || ''
      })
    }
  }, [user])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
      if (!validTypes.includes(file.type)) {
        return addToast('EL ARCHIVO DEBE SER UNA IMAGEN (JPG, PNG o WEBP).', 'error')
      }
      const reader = new FileReader()
      reader.onloadend = () => setFormData(prev => ({ ...prev, img: reader.result }))
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
    if (!nameRegex.test(formData.firstname)) {
      addToast('EL NOMBRE NO PUEDE CONTENER NÚMEROS NI SÍMBOLOS.', 'error')
      return false
    }
    if (!nameRegex.test(formData.lastname)) {
      addToast('LOS APELLIDOS NO PUEDEN CONTENER NÚMEROS NI SÍMBOLOS.', 'error')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    try {
      await updateUser(formData)
      addToast('EXPEDIENTE ACTUALIZADO CORRECTAMENTE.', 'success')
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        addToast(Object.values(errors)[0][0].toUpperCase(), 'error')
      } else {
        addToast((err.response?.data?.message || 'ERROR AL ACTUALIZAR').toUpperCase(), 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    if (window.confirm('¿ESTÁS SEGURO DE QUE DESEAS CERRAR TU SESIÓN?')) logout()
  }

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'short', day: 'numeric'
    }).toUpperCase()

  // Property names from the Laravel models:
  // Forums: title, created_at
  // Expeditions: name, location, date
  // Invoices: n_invoice, total, tax, created_at, details (array)
  const forums = user?.forums || []
  const createdExpeditions = user?.created_expeditions || []
  const joinedExpeditions = user?.joined_expeditions || []
  const invoices = user?.invoices || []

  return (
    <div className="page-container mx-auto" style={{ maxWidth: '900px' }}>
      <header className="text-center mb-60 border-bottom pb-30">
        <h1 className="fs-42 ls-4">PERFIL DE OPERATIVO</h1>
        <p className="text-dim fs-14 mt-5">EXPEDIENTE: {user?.id}</p>
      </header>

      <form onSubmit={handleSubmit} className="grid-2 gap-40 grid-1-2 mb-80">
        {/* Avatar */}
        <div className="column flex-center gap-20">
          <div className="profile-avatar-container">
            {formData.img ? (
              <img
                src={
                  formData.img.startsWith('data:') || formData.img.startsWith('http')
                    ? formData.img
                    : `http://localhost:8000/storage/${formData.img}`
                }
                alt="Avatar"
                className="w-100 h-100 object-cover"
              />
            ) : (
              <div className="fs-80 text-normal">{user?.username?.[0].toUpperCase()}</div>
            )}
          </div>
          <label className="btn fs-12 text-center w-100">
            CAMBIAR FOTO
            <input type="file" hidden onChange={handleImageChange} />
          </label>
        </div>

        {/* Datos */}
        <div className="column gap-20">
          <div className="grid-2 gap-20">
            <div className="form-group">
              <label className="form-label text-dim">USERNAME</label>
              <input value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label text-dim">EMAIL (NO MODIFICABLE)</label>
              <input value={user?.email || ''} disabled className="disabled-input" />
            </div>
          </div>
          <div className="grid-2 gap-20">
            <div className="form-group">
              <label className="form-label text-dim">FIRST_NAME</label>
              <input value={formData.firstname} onChange={e => setFormData({...formData, firstname: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label text-dim">LAST_NAME</label>
              <input value={formData.lastname} onChange={e => setFormData({...formData, lastname: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label text-dim">ID_DNI</label>
            <input value={formData.dni} onChange={e => setFormData({...formData, dni: e.target.value})} />
          </div>
          <div className="grid-2 gap-20 grid-2-1">
            <div className="form-group">
              <label className="form-label text-dim">BASE_ADDRESS</label>
              <input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label text-dim">POSTAL_CODE</label>
              <input value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} />
            </div>
          </div>
          <div className="flex-center gap-20 mt-20">
            <button type="submit" disabled={loading} className="primary flex-1 p-15">
              {loading ? 'SINCRONIZANDO...' : 'ACTUALIZAR EXPEDIENTE'}
            </button>
            <button type="button" onClick={handleLogout} className="outline-red p-15 fs-12 ls-2" style={{ flex: '0 0 180px' }}>
              CERRAR SESIÓN
            </button>
          </div>
        </div>
      </form>

      {/* ── TABS ── */}
      <div>
        <div className="tabs-header">
          <button className={`tab-btn ${activeTab === 'forums' ? 'active' : ''}`} onClick={() => setActiveTab('forums')}>
            FOROS ({forums.length})
          </button>
          <button className={`tab-btn ${activeTab === 'expeditions' ? 'active' : ''}`} onClick={() => setActiveTab('expeditions')}>
            EXPEDICIONES ({createdExpeditions.length + joinedExpeditions.length})
          </button>
          <button className={`tab-btn ${activeTab === 'invoices' ? 'active' : ''}`} onClick={() => setActiveTab('invoices')}>
            FACTURAS ({invoices.length})
          </button>
        </div>

        {/* TAB: FOROS */}
        {activeTab === 'forums' && (
          <div>
            {forums.length === 0 ? (
              <div className="text-center text-dim border-dashed p-60 ls-1">[ NO HAS INICIADO NINGÚN FORO TODAVÍA ]</div>
            ) : (
              forums.map(forum => (
                <Link key={forum.id} to={`/forums/${forum.id}`} className="profile-list-item">
                  <div className="column">
                    <span className="title uppercase ls-1">{forum.title}</span>
                    <span className="meta">{formatDate(forum.created_at)}</span>
                  </div>
                  <span className="text-accent fs-12 nowrap">[ VER EXPEDIENTE ]</span>
                </Link>
              ))
            )}
          </div>
        )}

        {/* TAB: EXPEDICIONES */}
        {activeTab === 'expeditions' && (
          <div>
            <p className="fs-11 text-dim mb-15 ls-2 uppercase">ORGANIZADAS POR TI</p>
            {createdExpeditions.length === 0 ? (
              <p className="text-dim fs-12 mb-30 border-dashed p-20 text-center">[ SIN EXPEDICIONES ORGANIZADAS ]</p>
            ) : (
              createdExpeditions.map(exp => (
                <Link key={exp.id} to={`/expeditions/${exp.id}`} className="profile-list-item">
                  <div className="column">
                    <span className="title uppercase ls-1">{exp.name}</span>
                    <span className="meta">{exp.location?.toUpperCase()} &nbsp;//&nbsp; {formatDate(exp.date)}</span>
                  </div>
                  <span className="text-accent fs-12 nowrap">[ DETALLES ]</span>
                </Link>
              ))
            )}

            <p className="fs-11 text-dim mt-40 mb-15 ls-2 uppercase">COMO OPERATIVO</p>
            {joinedExpeditions.length === 0 ? (
              <p className="text-dim fs-12 border-dashed p-20 text-center">[ NO PARTICIPAS EN NINGUNA EXPEDICIÓN ]</p>
            ) : (
              joinedExpeditions.map(exp => (
                <Link key={exp.id} to={`/expeditions/${exp.id}`} className="profile-list-item">
                  <div className="column">
                    <span className="title uppercase ls-1">{exp.name}</span>
                    <span className="meta">{exp.location?.toUpperCase()} &nbsp;//&nbsp; {formatDate(exp.date)}</span>
                  </div>
                  <span className="text-accent fs-12 nowrap">[ DETALLES ]</span>
                </Link>
              ))
            )}
          </div>
        )}

        {/* TAB: FACTURAS */}
        {activeTab === 'invoices' && (
          <div>
            {invoices.length === 0 ? (
              <div className="text-center text-dim border-dashed p-60 ls-1">[ NO TIENES FACTURAS REGISTRADAS ]</div>
            ) : (
              invoices.map(inv => (
                <div key={inv.id} className="profile-list-item">
                  <div className="column">
                    <span className="title ls-1">FACTURA #{inv.n_invoice}</span>
                    <span className="meta">
                      {formatDate(inv.created_at)} &nbsp;//&nbsp; {inv.details?.length || 0} ARTÍCULO(S) &nbsp;//&nbsp; IVA {inv.tax}%
                    </span>
                  </div>
                  <div className="flex-center gap-20">
                    <span className="fs-20 bold text-normal">{Number(inv.total).toFixed(2)}€</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
