import api from './axios'

export const getInvoices  = (params = {}) => api.get('/invoices', { params })
export const getInvoice   = (id)    => api.get(`/invoices/${id}`)
export const createInvoice = (data) => api.post('/invoices', data)