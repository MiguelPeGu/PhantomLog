import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const LoadingContext = createContext(null)

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false)

  const triggerLoading = useCallback((duration = 3000) => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, duration)
  }, [])

  return (
    <LoadingContext.Provider value={{ isLoading, triggerLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => useContext(LoadingContext)
