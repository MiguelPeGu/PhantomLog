import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { getProducts } from '../api/products'
import { getForums } from '../api/forums'
import { getInvoices } from '../api/invoices'
import { useAuth } from './AuthContext'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [forums, setForums] = useState([])
  const [invoices, setInvoices] = useState([])
  
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [loadingForums, setLoadingForums] = useState(false)
  const [loadingInvoices, setLoadingInvoices] = useState(false)

  const [productsPagination, setProductsPagination] = useState({ currentPage: 1, totalPages: 1 })
  const [forumsPagination, setForumsPagination] = useState({ currentPage: 1, totalPages: 1 })
  const [invoicesPagination, setInvoicesPagination] = useState({ currentPage: 1, totalPages: 1 })

  const refreshProducts = useCallback(async (params = {}) => {
    setLoadingProducts(true)
    try {
      const res = await getProducts(params)
      setProducts(res.data.data || [])
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
    setLoadingForums(true)
    try {
      const res = await getForums(params)
      setForums(res.data.data || [])
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
    setLoadingInvoices(true)
    try {
      const res = await getInvoices(params)
      setInvoices(res.data.data || [])
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

  const refreshAll = useCallback(async () => {
    await Promise.all([
      refreshProducts({ page: 1, per_page: 9 }),
      refreshForums({ page: 1, per_page: 9 }),
      refreshInvoices({ page: 1, per_page: 5 })
    ])
  }, [refreshProducts, refreshForums, refreshInvoices])

  useEffect(() => {
    if (user) {
      refreshAll()
    }
  }, [user, refreshAll])

  return (
    <DataContext.Provider value={{
      products, loadingProducts, productsPagination, refreshProducts,
      forums, loadingForums, forumsPagination, refreshForums,
      invoices, loadingInvoices, invoicesPagination, refreshInvoices,
      refreshAll
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
