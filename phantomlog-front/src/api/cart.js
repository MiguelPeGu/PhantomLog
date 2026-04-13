import api from './axios'

export const getCart      = () => api.get('/cart')
export const addToCart    = (productId, quantity = 1) => api.post(`/cart/add/${productId}`, { quantity })
export const subtractCart = (productId) => api.post(`/cart/subtract/${productId}`)
export const removeCart   = (productId) => api.delete(`/cart/remove/${productId}`)
export const clearCart    = () => api.delete('/cart/clear')
