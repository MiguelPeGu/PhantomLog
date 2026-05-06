import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLoading } from '../context/LoadingContext'

export default function LoadingTrigger() {
  const location = useLocation()
  const { triggerLoading } = useLoading()

  useEffect(() => {
    // Trigger loading on every page change for consistent transitions
    triggerLoading(400)
  }, [location.pathname, triggerLoading])

  return null
}
