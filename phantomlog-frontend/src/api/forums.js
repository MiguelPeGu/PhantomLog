import api from './axios'

export const getForums      = ()              => api.get('/forums')
export const getForum       = (id)            => api.get(`/forums/${id}`)
export const createForum    = (data)          => api.post('/forums', data)
export const updateForum    = (id, data)      => api.put(`/forums/${id}`, data)
export const deleteForum    = (id)            => api.delete(`/forums/${id}`)
export const toggleFollow   = (id)            => api.post(`/forums/${id}/follow`)