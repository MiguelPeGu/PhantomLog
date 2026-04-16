import api from './axios'

export const getReports   = (forumId, params = {}) => api.get(`/forums/${forumId}/reports`, { params })
export const getReport    = (forumId, id)     => api.get(`/forums/${forumId}/reports/${id}`)
export const createReport = (forumId, data)   => api.post(`/forums/${forumId}/reports`, data)
export const updateReport = (forumId, id, data) => api.put(`/forums/${forumId}/reports/${id}`, data)
export const deleteReport = (forumId, id)     => api.delete(`/forums/${forumId}/reports/${id}`)