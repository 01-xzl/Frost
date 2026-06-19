import { useState, useEffect } from 'react'

/**
 * Tracks viewport width breakpoints.
 * - 'narrow' < 768px: single-column
 * - 'wide' >= 768px: dashboard spread
 */
export default function useViewport() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    let raf
    const handleResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setWidth(window.innerWidth))
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(raf)
    }
  }, [])

  const mode = width >= 768 ? 'wide' : 'narrow'

  return { width, mode, isWide: mode === 'wide', isNarrow: mode === 'narrow' }
}
