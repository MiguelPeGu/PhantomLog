import api from './axios'

// Carga todos los datos iniciales en 1 sola petición HTTP.
// Reemplaza las 5 peticiones paralelas que causaban 8-10s de carga
// al serializar contra SQLite.
export const getBootstrap = () => api.get('/bootstrap')
