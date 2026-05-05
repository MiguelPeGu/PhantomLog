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
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
      if (!validTypes.includes(file.type)) {
        return addToast('EL ARCHIVO DEBE SER UNA IMAGEN (JPG, PNG o WEBP).', 'error')
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, img: reader.result })
      }
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
        const firstError = Object.values(errors)[0][0]
        addToast(firstError.toUpperCase(), 'error')
      } else {
        const msg = err.response?.data?.message || 'ERROR AL ACTUALIZAR EXPEDIENTE'
        addToast(msg.toUpperCase(), 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    if (window.confirm('¿ESTÁS SEGURO DE QUE DESEAS CERRAR TU SESIÓN Y ABANDONAR EL ARCHIVO?')) {
      logout()
    }
  }

  return (
    <div className="page-container mx-auto" style={{ maxWidth: '800px' }}>
      <header className="text-center mb-60 border-bottom pb-30">
        <h1 className="fs-42 ls-4">PERFIL DE OPERATIVO</h1>
        <p className="text-dim fs-14 mt-5">EXPEDIENTE: {user?.id}</p>
      </header>

      <form onSubmit={handleSubmit} className="grid-2 gap-40 grid-1-2">
        {/* Avatar Section */}
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

        {/* Data Section */}
        <div className="column gap-20">
          <div className="grid-2 gap-20">
            <div className="form-group">
              <label className="form-label text-dim">USERNAME</label>
              <input value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label text-dim">EMAIL (NO MODIFICABLE)</label>
              <input value={user?.email} disabled className="disabled-input" />
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

          <button 
            type="submit" 
            disabled={loading}
            className="primary mt-20 p-15"
          >
            {loading ? 'SINCRONIZANDO...' : 'ACTUALIZAR EXPEDIENTE'}
          </button>

          <button 
            type="button"
            onClick={handleLogout}
            className="outline-red mt-10 p-15 fs-12 ls-2"
          >
            CERRAR SESIÓN DEL SISTEMA
          </button>
        </div>
      </form>
    </div>
  )
}
