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
  const requestRefs = useRef({ products: 0, forums: 0, invoices: 0 })

  const [globalSearch, setGlobalSearch] = useState('')
  const [productsPagination, setProductsPagination] = useState({ currentPage: 1, totalPages: 1 })
  const [forumsPagination, setForumsPagination] = useState({ currentPage: 1, totalPages: 1 })
  const [invoicesPagination, setInvoicesPagination] = useState({ currentPage: 1, totalPages: 1 })

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
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoadingProducts(false)
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
    } catch (error) {
      console.error('Error fetching forums:', error)
    } finally {
      setLoadingForums(false)
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
    } catch (error) {
      console.error('Error fetching invoices:', error)
    } finally {
      setLoadingInvoices(false)
    }
  }, [])

  const refreshPhantoms = useCallback(async () => {
    setLoadingPhantoms(true)
    try {
      const res = await getPhantoms()
      setPhantoms(res.data)
    } catch (error) {
      console.error('Error fetching phantoms:', error)
    } finally {
      setLoadingPhantoms(false)
    }
  }, [])

  const refreshExpeditions = useCallback(async () => {
    setLoadingExpeditions(true)
    try {
      const res = await getExpeditions()
      setExpeditions(res.data)
    } catch (error) {
      console.error('Error fetching expeditions:', error)
    } finally {
      setLoadingExpeditions(false)
    }
  }, [])

  const refreshAll = useCallback(async () => {
    await Promise.all([
      refreshProducts({ page: 1, per_page: 9 }),
      refreshForums({ page: 1, per_page: 9 }),
      refreshInvoices({ page: 1, per_page: 5 }),
      refreshPhantoms(),
      refreshExpeditions()
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
    expeditions, loadingExpeditions, refreshExpeditions,
    globalSearch, setGlobalSearch,
    refreshAll
  }), [
    products, loadingProducts, productsPagination, refreshProducts,
    forums, loadingForums, forumsPagination, refreshForums,
    invoices, loadingInvoices, invoicesPagination, refreshInvoices,
    phantoms, loadingPhantoms, refreshPhantoms,
    expeditions, loadingExpeditions, refreshExpeditions,
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
