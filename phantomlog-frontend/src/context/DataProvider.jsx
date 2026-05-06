import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { getBootstrap } from '../api/bootstrap'
import { getProducts } from '../api/products'
import { getForums } from '../api/forums'
import { getInvoices } from '../api/invoices'
import { getPhantoms } from '../api/phantoms'
import { getExpeditions } from '../api/expeditions'
import { useAuth } from './AuthContext'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const { user } = useAuth()
  const [products, setProducts]       = useState([])
  const [forums, setForums]           = useState([])
  const [invoices, setInvoices]       = useState([])
  const [phantoms, setPhantoms]       = useState([])
  const [expeditions, setExpeditions] = useState([])
  const [productCategories, setProductCategories] = useState(['ALL'])

  const [loadingProducts,   setLoadingProducts]   = useState(false)
  const [loadingForums,     setLoadingForums]      = useState(false)
  const [loadingInvoices,   setLoadingInvoices]    = useState(false)
  const [loadingPhantoms,   setLoadingPhantoms]    = useState(false)
  const [loadingExpeditions,setLoadingExpeditions] = useState(false)
  const [loadingBootstrap,  setLoadingBootstrap]   = useState(false)

  const requestRefs = useRef({ products: 0, forums: 0, invoices: 0, expeditions: 0, phantoms: 0 })

  const [globalSearch, setGlobalSearch] = useState('')
  const [productsPagination,    setProductsPagination]    = useState({ currentPage: 1, totalPages: 1 })
  const [forumsPagination,      setForumsPagination]      = useState({ currentPage: 1, totalPages: 1 })
  const [invoicesPagination,    setInvoicesPagination]    = useState({ currentPage: 1, totalPages: 1 })
  const [expeditionsPagination, setExpeditionsPagination] = useState({ currentPage: 1, totalPages: 1 })

  // ─── Refresh individuales (para búsqueda, paginación, CRUD) ─────────────────

  const refreshProducts = useCallback(async (params = {}) => {
    const requestId = ++requestRefs.current.products
    setLoadingProducts(true)
    try {
      const res = await getProducts(params)
      if (requestId !== requestRefs.current.products) return
      const data = res.data.data || res.data
      setProducts(Array.isArray(data) ? data : [])
      setProductsPagination({ currentPage: res.data.current_page || 1, totalPages: res.data.last_page || 1 })
    } catch (error) {
      console.error('Error al obtener los productos:', error)
    } finally {
      if (requestId === requestRefs.current.products) setLoadingProducts(false)
    }
  }, [])

  const refreshForums = useCallback(async (params = {}) => {
    const requestId = ++requestRefs.current.forums
    setLoadingForums(true)
    try {
      const res = await getForums(params)
      if (requestId !== requestRefs.current.forums) return
      const data = res.data.data || res.data
      setForums(Array.isArray(data) ? data : [])
      setForumsPagination({ currentPage: res.data.current_page || 1, totalPages: res.data.last_page || 1 })
    } catch (error) {
      console.error('Error al obtener los foros:', error)
    } finally {
      if (requestId === requestRefs.current.forums) setLoadingForums(false)
    }
  }, [])

  const refreshInvoices = useCallback(async (params = {}) => { // no sé como funciona callback
    const requestId = ++requestRefs.current.invoices
    setLoadingInvoices(true)
    try {
      const res = await getInvoices(params)
      if (requestId !== requestRefs.current.invoices) return
      const data = res.data.data || res.data
      setInvoices(Array.isArray(data) ? data : [])
      setInvoicesPagination({ currentPage: res.data.current_page || 1, totalPages: res.data.last_page || 1 })
    } catch (error) {
      console.error('Error al obtener las facturas:', error)
    } finally {
      if (requestId === requestRefs.current.invoices) setLoadingInvoices(false)
    }
  }, [])

  const refreshPhantoms = useCallback(async (params = {}) => {
    const requestId = ++requestRefs.current.phantoms
    setLoadingPhantoms(true)
    try {
      const res = await getPhantoms(params)
      if (requestId !== requestRefs.current.phantoms) return
      const data = res.data.data || res.data
      setPhantoms(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error al obtener los fantasmas:', error)
    } finally {
      if (requestId === requestRefs.current.phantoms) setLoadingPhantoms(false)
    }
  }, [])

  const refreshExpeditions = useCallback(async (params = {}) => {
    const requestId = ++requestRefs.current.expeditions
    setLoadingExpeditions(true)
    try {
      const res = await getExpeditions(params)
      if (requestId !== requestRefs.current.expeditions) return
      const data = res.data.data || res.data
      setExpeditions(Array.isArray(data) ? data : [])
      setExpeditionsPagination({ currentPage: res.data.current_page || 1, totalPages: res.data.last_page || 1 })
    } catch (error) {
      console.error('Error al obtener las expediciones:', error)
    } finally {
      if (requestId === requestRefs.current.expeditions) setLoadingExpeditions(false)
    }
  }, [])

  // ─── Bootstrap: 1 sola petición para────
  // Antes eran 5 peticiones paralelas → con SQLite se serializaban → 8-1 todos los datos iniciales ──────────0s carga
  // Ahora: 1 petición → ~1-2s carga

  const refreshAll = useCallback(async () => {
    setLoadingBootstrap(true)
    setLoadingForums(true)
    setLoadingExpeditions(true)
    setLoadingPhantoms(true)
    setLoadingProducts(true)
    setLoadingInvoices(true)
    try {
      const res = await getBootstrap()
      const { forums, expeditions, phantoms, products, invoices } = res.data

      // Foros
      const forumsData = forums.data || forums
      setForums(Array.isArray(forumsData) ? forumsData : [])
      setForumsPagination({ currentPage: forums.current_page || 1, totalPages: forums.last_page || 1 })

      // Expediciones
      const expData = expeditions.data || expeditions
      setExpeditions(Array.isArray(expData) ? expData : [])
      setExpeditionsPagination({ currentPage: expeditions.current_page || 1, totalPages: expeditions.last_page || 1 })

      // Phantom
      setPhantoms(Array.isArray(phantoms) ? phantoms : [])

      // Productos
      const prodData = products.data || products
      setProducts(Array.isArray(prodData) ? prodData : [])
      setProductsPagination({ currentPage: products.current_page || 1, totalPages: products.last_page || 1 })

      // Extraer categorías únicas para los filtros (se mantienen fijas tras el primer carga)
      if (Array.isArray(prodData)) {
        const cats = ['ALL', ...new Set(prodData.map(product => product.category?.toUpperCase()).filter(Boolean))]
        setProductCategories(cats)
      }

      // Facturas
      const invData = invoices.data || invoices
      setInvoices(Array.isArray(invData) ? invData : [])
      setInvoicesPagination({ currentPage: invoices.current_page || 1, totalPages: invoices.last_page || 1 })

    } catch (error) {
      console.error('Error en bootstrap:', error)
    } finally {
      setLoadingBootstrap(false)
      setLoadingForums(false)
      setLoadingExpeditions(false)
      setLoadingPhantoms(false)
      setLoadingProducts(false)
      setLoadingInvoices(false)
    }
  }, [])

  useEffect(() => {
    if (user) {
      refreshAll()
    }
  }, [user, refreshAll])

  const value = {
    products, loadingProducts, productsPagination, refreshProducts,
    forums, loadingForums, forumsPagination, refreshForums,
    invoices, loadingInvoices, invoicesPagination, refreshInvoices,
    phantoms, loadingPhantoms, refreshPhantoms,
    expeditions, loadingExpeditions, expeditionsPagination, refreshExpeditions,
    globalSearch, setGlobalSearch,
    loadingBootstrap,
    productCategories,
    refreshAll
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
