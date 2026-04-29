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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #040', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ color: '#f00', fontSize: '42px', margin: 0, letterSpacing: '4px' }}>PERFIL DE OPERATIVO</h1>
          <p style={{ color: '#060', fontSize: '14px', marginTop: '5px' }}>EXPEDIENTE: {user?.id}</p>
        </div>
        <button 
          onClick={logout}
          style={{ background: '#000', border: '1px solid #f00', color: '#f00', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          CERRAR SESIÓN
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
        {/* Avatar Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ 
            width: '200px', 
            height: '200px', 
            border: '2px solid #060', 
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
              <div style={{ fontSize: '80px', color: '#0f0' }}>{user?.username?.[0].toUpperCase()}</div>
            )}
          </div>
          <label style={{ 
            background: '#000', border: '1px solid #0f0', color: '#0f0', 
            padding: '10px', cursor: 'pointer', fontSize: '12px', textAlign: 'center', width: '100%' 
          }}>
            CAMBIAR FOTO
            <input type="file" hidden onChange={handleImageChange} />
          </label>
        </div>

        {/* Data Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ color: '#060', fontSize: '12px' }}>USERNAME</label>
              <input value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} style={{ background: '#000', border: '1px solid #040', color: '#0f0', padding: '12px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ color: '#060', fontSize: '12px' }}>EMAIL (NO MODIFICABLE)</label>
              <input value={user?.email} disabled style={{ background: '#050505', border: '1px solid #111', color: '#030', padding: '12px', cursor: 'not-allowed' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ color: '#060', fontSize: '12px' }}>FIRST_NAME</label>
              <input value={formData.firstname} onChange={e => setFormData({...formData, firstname: e.target.value})} style={{ background: '#000', border: '1px solid #040', color: '#0f0', padding: '12px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ color: '#060', fontSize: '12px' }}>LAST_NAME</label>
              <input value={formData.lastname} onChange={e => setFormData({...formData, lastname: e.target.value})} style={{ background: '#000', border: '1px solid #040', color: '#0f0', padding: '12px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#060', fontSize: '12px' }}>ID_DNI</label>
            <input value={formData.dni} onChange={e => setFormData({...formData, dni: e.target.value})} style={{ background: '#000', border: '1px solid #040', color: '#0f0', padding: '12px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ color: '#060', fontSize: '12px' }}>BASE_ADDRESS</label>
              <input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={{ background: '#000', border: '1px solid #040', color: '#0f0', padding: '12px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ color: '#060', fontSize: '12px' }}>POSTAL_CODE</label>
              <input value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} style={{ background: '#000', border: '1px solid #040', color: '#0f0', padding: '12px' }} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ marginTop: '20px', padding: '15px', background: '#f00', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
          >
            {loading ? 'SINCRONIZANDO...' : 'ACTUALIZAR EXPEDIENTE'}
          </button>
        </div>
      </form>
    </div>
  )
}
