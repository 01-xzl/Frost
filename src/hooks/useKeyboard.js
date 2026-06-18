import { useEffect, useRef } from 'react'

/**
 * Parse shortcut strings like 'Ctrl+N', 'Ctrl+Shift+K', 'Escape'
 * Returns a matcher function that checks keyboard events.
 */
function parseShortcut(shortcut) {
  const parts = shortcut.split('+')
  const key = parts.pop().toLowerCase()
  const ctrl = parts.includes('Ctrl') || parts.includes('Control')
  const shift = parts.includes('Shift')
  const alt = parts.includes('Alt')
  const meta = parts.includes('Meta') || parts.includes('Cmd')

  return (e) => {
    if (e.key.toLowerCase() !== key) return false
    if (e.ctrlKey !== ctrl) return false
    if (e.shiftKey !== shift) return false
    if (e.altKey !== alt) return false
    if (e.metaKey !== meta) return false
    return true
  }
}

export default function useKeyboard(shortcuts) {
  const shortcutsRef = useRef(shortcuts)
  shortcutsRef.current = shortcuts

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't fire shortcuts when typing in inputs, except Escape
      const tag = e.target.tagName
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
      const isEscape = e.key === 'Escape'

      if (isInput && !isEscape) return

      for (const [shortcut, handler] of Object.entries(shortcutsRef.current)) {
        if (parseShortcut(shortcut)(e)) {
          e.preventDefault()
          handler()
          return
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}
