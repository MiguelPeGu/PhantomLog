import api from './axios'

export const getInvoices  = ()      => api.get('/invoices')
export const getInvoice   = (id)    => api.get(`/invoices/${id}`)
export const createInvoice = (data) => api.post('/invoices', data)