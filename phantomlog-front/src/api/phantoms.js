import api from './axios'

export const getPhantoms  = ()         => api.get('/phantoms')
export const getPhantom   = (id)       => api.get(`/phantoms/${id}`)
export const createPhantom = (data)    => api.post('/phantoms', data)
export const updatePhantom = (id, data)=> api.put(`/phantoms/${id}`, data)
export const deletePhantom = (id)      => api.delete(`/phantoms/${id}`)