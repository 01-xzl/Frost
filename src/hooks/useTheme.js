import { useState, useCallback, useEffect } from 'react'

const THEME_KEY = 'glass-theme'

function getInitialTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'dark' || stored === 'light') return stored
  } catch { /* ignore */ }
  // Default to light; could also check prefers-color-scheme
  return 'light'
}

function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

// Apply theme synchronously before first render to prevent flash
applyTheme(getInitialTheme())

export default function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem(THEME_KEY, next)
      applyTheme(next)
      return next
    })
  }, [])

  // Sync with system changes (optional; keeps tab in sync if user changes OS preference)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      // Only auto-switch if user hasn't explicitly set a preference
      if (!localStorage.getItem(THEME_KEY)) {
        const systemTheme = mq.matches ? 'dark' : 'light'
        setTheme(systemTheme)
        applyTheme(systemTheme)
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return { theme, toggleTheme }
}
