import axios from 'axios'

// Creamos una instancia personalizada de Axios
const api = axios.create({

    // URL base para todas las peticiones
    baseURL: 'http://localhost:8000/api'
})

/*
|--------------------------------------------------------------------------
| INTERCEPTOR DE REQUEST
|--------------------------------------------------------------------------
| Se ejecuta ANTES de cada petición HTTP
| Sirve para modificar la configuración automáticamente
*/
api.interceptors.request.use((config) => {

  // Obtenemos el token guardado en localStorage
  const token = localStorage.getItem('token')

  // Si existe token...
  if (token)

    // Añadimos el token en la cabecera Authorization
    // Esto permite autenticar al usuario en el backend
    config.headers.Authorization = `Bearer ${token}`

  // Devolvemos la configuración modificada
  return config
})

/*
|--------------------------------------------------------------------------
| INTERCEPTOR DE RESPONSE
|--------------------------------------------------------------------------
| Se ejecuta después de cada respuesta del servidor
| Aquí manejamos errores globales
*/
api.interceptors.response.use(

  // Si la respuesta es correcta, simplemente la devolvemos
  (res) => res,

  // Si ocurre un error...
  (error) => {

    // Verificamos si el error es 401 (Token expirado)
    if (error.response?.status === 401) {

      // Eliminamos datos de autenticación del navegador
      localStorage.removeItem('token')
      localStorage.removeItem('auth_user')

      // Redirigimos al login
      window.location.href = '/login'
    }

    // Rechazamos el error para que pueda manejarse
    // también desde el componente que hizo la petición
    return Promise.reject(error)
  }
)

// Exportamos la instancia personalizada
// para usarla en toda la aplicación
export default api