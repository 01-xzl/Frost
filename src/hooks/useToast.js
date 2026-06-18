import { useState, useCallback, useRef, useEffect } from 'react'

let toastId = 0

export default function useToast() {
  const [toasts, setToasts] = useState([])
  const timersRef = useRef({})
  // Store action callbacks in a ref so they survive re-renders
  const actionsRef = useRef({})

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id])
      delete timersRef.current[id]
    }
    delete actionsRef.current[id]
  }, [])

  const toast = useCallback((message, options = {}) => {
    const id = ++toastId
    const { action, actionLabel = 'Undo', duration = 3500 } = options

    if (action) {
      actionsRef.current[id] = action
    }

    setToasts((prev) => [...prev, { id, message, actionLabel, hasAction: !!action }])

    timersRef.current[id] = setTimeout(() => {
      dismissToast(id)
    }, duration)

    return id
  }, [dismissToast])

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout)
    }
  }, [])

  const handleAction = useCallback((id) => {
    const action = actionsRef.current[id]
    if (action) {
      action()
    }
    dismissToast(id)
  }, [dismissToast])

  return { toasts, toast, dismissToast, handleAction }
}
