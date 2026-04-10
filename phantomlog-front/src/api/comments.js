import api from './axios'

export const getComments   = (reportId)           => api.get(`/reports/${reportId}/comments`)
export const createComment = (reportId, data)     => api.post(`/reports/${reportId}/comments`, data)
export const updateComment = (reportId, id, data) => api.put(`/reports/${reportId}/comments/${id}`, data)
export const deleteComment = (reportId, id)       => api.delete(`/reports/${reportId}/comments/${id}`)