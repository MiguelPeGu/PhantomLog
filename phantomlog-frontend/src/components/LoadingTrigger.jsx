import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLoading } from '../context/LoadingContext'

export default function LoadingTrigger() {
  const location = useLocation()
  const { triggerLoading } = useLoading()

  useEffect(() => {
    const path = location.pathname
    
    // Define exact paths or patterns to trigger
    const exactTargets = ['/cart']
    const detailBases = ['/forums/', '/products/', '/expeditions/', '/success/']

    const isExactMatch = exactTargets.includes(path)
    const isDetailMatch = detailBases.some(base => path.startsWith(base))
    
    if (isExactMatch || isDetailMatch) {
      triggerLoading(1000)
    }
  }, [location.pathname, triggerLoading])

  return null
}
