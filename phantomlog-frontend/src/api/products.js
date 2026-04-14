import api from './axios'

// Hace un GET, Laravel lee "GET /products" y llama a index()
export const getProducts = (params = {}) => api.get('/products', { params })
// Hace un POST, Laravel lee "POST /products" y llama a store() para guardar datos
export const createProduct = (data) => api.post('/products', data)
// Hace un GET a /products/1, Laravel llama a show() pasándole el ID 1
export const getProduct = (id) => api.get(`/products/${id}`)
export const updateProduct = (id, data)  => api.put(`/products/${id}`, data)
export const deleteProduct = (id)        => api.delete(`/products/${id}`)