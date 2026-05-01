import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Profile() {
  const { user, updateUser, logout } = useAuth()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  
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
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, img: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateUser(formData)
      addToast('PERFIL ACTUALIZADO', 'success')
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al actualizar'
      addToast(msg.toUpperCase(), 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container" style={{ maxWidth: '800px' }}>
      <div className="flex-center" style={{ justifyContent: 'space-between', marginBottom: '40px', borderBottom: '1px solid var(--text-muted)', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '42px', letterSpacing: '4px' }}>PERFIL DE OPERATIVO</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '14px', marginTop: '5px' }}>EXPEDIENTE: {user?.id}</p>
        </div>
        <button 
          onClick={logout}
          className="outline-red"
        >
          CERRAR SESIÓN
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
        {/* Avatar Section */}
        <div className="column flex-center" style={{ gap: '20px' }}>
          <div style={{ 
            width: '200px', 
            height: '200px', 
            border: '2px solid var(--text-muted)', 
            background: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            boxShadow: '0 0 20px rgba(0,255,0,0.1)'
          }}>
            {formData.img ? (
              <img src={formData.img} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ fontSize: '80px', color: 'var(--text)' }}>{user?.username?.[0].toUpperCase()}</div>
            )}
          </div>
          <label className="btn" style={{ fontSize: '12px', textAlign: 'center', width: '100%' }}>
            CAMBIAR FOTO
            <input type="file" hidden onChange={handleImageChange} />
          </label>
        </div>

        {/* Data Section */}
        <div className="column" style={{ gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--text-dim)' }}>USERNAME</label>
              <input value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--text-dim)' }}>EMAIL (NO MODIFICABLE)</label>
              <input value={user?.email} disabled style={{ 
                background: 'rgba(0, 119, 255, 0.05)', 
                border: '1px solid var(--border)', 
                color: 'var(--accent)', 
                cursor: 'not-allowed' 
              }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--text-dim)' }}>FIRST_NAME</label>
              <input value={formData.firstname} onChange={e => setFormData({...formData, firstname: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--text-dim)' }}>LAST_NAME</label>
              <input value={formData.lastname} onChange={e => setFormData({...formData, lastname: e.target.value})} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: 'var(--text-dim)' }}>ID_DNI</label>
            <input value={formData.dni} onChange={e => setFormData({...formData, dni: e.target.value})} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--text-dim)' }}>BASE_ADDRESS</label>
              <input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--text-dim)' }}>POSTAL_CODE</label>
              <input value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="primary"
            style={{ marginTop: '20px', padding: '15px' }}
          >
            {loading ? 'SINCRONIZANDO...' : 'ACTUALIZAR EXPEDIENTE'}
          </button>
        </div>
      </form>
    </div>
  )
}
