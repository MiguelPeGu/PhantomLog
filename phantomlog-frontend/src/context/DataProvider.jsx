import { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { getProducts } from '../api/products'
import { getForums } from '../api/forums'
import { getInvoices } from '../api/invoices'
import { getPhantoms } from '../api/phantoms'
import { getExpeditions } from '../api/expeditions'
import { useAuth } from './AuthContext'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [forums, setForums] = useState([])
  const [invoices, setInvoices] = useState([])
  const [phantoms, setPhantoms] = useState([])
  const [expeditions, setExpeditions] = useState([])
  
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [loadingForums, setLoadingForums] = useState(false)
  const [loadingInvoices, setLoadingInvoices] = useState(false)
  const [loadingPhantoms, setLoadingPhantoms] = useState(false)
  const [loadingExpeditions, setLoadingExpeditions] = useState(false)
  const requestRefs = useRef({ products: 0, forums: 0, invoices: 0, expeditions: 0, phantoms: 0 })

  const [globalSearch, setGlobalSearch] = useState('')
  const [productsPagination, setProductsPagination] = useState({ currentPage: 1, totalPages: 1 })
  const [forumsPagination, setForumsPagination] = useState({ currentPage: 1, totalPages: 1 })
  const [invoicesPagination, setInvoicesPagination] = useState({ currentPage: 1, totalPages: 1 })
  const [expeditionsPagination, setExpeditionsPagination] = useState({ currentPage: 1, totalPages: 1 })

  const refreshProducts = useCallback(async (params = {}) => {
    const requestId = ++requestRefs.current.products
    setLoadingProducts(true)
    try {
      const res = await getProducts(params)
      if (requestId !== requestRefs.current.products) return
      
      const data = res.data.data || res.data
      setProducts(Array.isArray(data) ? data : [])
      setProductsPagination({
        currentPage: res.data.current_page || 1,
        totalPages: res.data.last_page || 1
      })
      setLoadingProducts(false)
    } catch (error) {
      if (requestId === requestRefs.current.products) setLoadingProducts(false)
      console.error('Error fetching products:', error)
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
      setForumsPagination({
        currentPage: res.data.current_page || 1,
        totalPages: res.data.last_page || 1
      })
      setLoadingForums(false)
    } catch (error) {
      if (requestId === requestRefs.current.forums) setLoadingForums(false)
      console.error('Error fetching forums:', error)
    }
  }, [])

  const refreshInvoices = useCallback(async (params = {}) => {
    const requestId = ++requestRefs.current.invoices
    setLoadingInvoices(true)
    try {
      const res = await getInvoices(params)
      if (requestId !== requestRefs.current.invoices) return

      const data = res.data.data || res.data
      setInvoices(Array.isArray(data) ? data : [])
      setInvoicesPagination({
        currentPage: res.data.current_page || 1,
        totalPages: res.data.last_page || 1
      })
      setLoadingInvoices(false)
    } catch (error) {
      if (requestId === requestRefs.current.invoices) setLoadingInvoices(false)
      console.error('Error fetching invoices:', error)
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
      setLoadingPhantoms(false)
    } catch (error) {
      if (requestId === requestRefs.current.phantoms) setLoadingPhantoms(false)
      console.error('Error fetching phantoms:', error)
    }
  }, [])

  const refreshExpeditions = useCallback(async (params = {}) => {
    const requestId = ++requestRefs.current.expeditions || (requestRefs.current.expeditions = 1)
    setLoadingExpeditions(true)
    try {
      const res = await getExpeditions(params)
      if (requestId !== requestRefs.current.expeditions) return

      const data = res.data.data || res.data
      setExpeditions(Array.isArray(data) ? data : [])
      setExpeditionsPagination({
        currentPage: res.data.current_page || 1,
        totalPages: res.data.last_page || 1
      })
      setLoadingExpeditions(false)
    } catch (error) {
      if (requestId === requestRefs.current.expeditions) setLoadingExpeditions(false)
      console.error('Error fetching expeditions:', error)
    }
  }, [])

  const refreshAll = useCallback(async () => {
    await Promise.all([
      refreshProducts({ page: 1, per_page: 9 }),
      refreshForums({ page: 1, per_page: 9 }),
      refreshInvoices({ page: 1, per_page: 5 }),
      refreshPhantoms({ page: 1, per_page: 9 }),
      refreshExpeditions({ page: 1, per_page: 9 })
    ])
  }, [refreshProducts, refreshForums, refreshInvoices])

  useEffect(() => {
    if (user) {
      refreshAll()
    }
  }, [user, refreshAll])

  const value = useMemo(() => ({
    products, loadingProducts, productsPagination, refreshProducts,
    forums, loadingForums, forumsPagination, refreshForums,
    invoices, loadingInvoices, invoicesPagination, refreshInvoices,
    phantoms, loadingPhantoms, refreshPhantoms,
    expeditions, loadingExpeditions, expeditionsPagination, refreshExpeditions,
    globalSearch, setGlobalSearch,
    refreshAll
  }), [
    products, loadingProducts, productsPagination, refreshProducts,
    forums, loadingForums, forumsPagination, refreshForums,
    invoices, loadingInvoices, invoicesPagination, refreshInvoices,
    phantoms, loadingPhantoms, refreshPhantoms,
    expeditions, loadingExpeditions, expeditionsPagination, refreshExpeditions,
    globalSearch,
    refreshAll
  ])

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
