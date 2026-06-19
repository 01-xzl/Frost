import { useState, useCallback } from 'react'

const STORAGE_KEY = 'frost-stickies'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch { return [] }
}

function save(stickies) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stickies))
}

const COLORS = [
  'rgba(255,255,200,0.25)',
  'rgba(200,255,220,0.25)',
  'rgba(200,220,255,0.25)',
  'rgba(255,220,240,0.25)',
  'rgba(220,240,255,0.25)',
]

export default function useStickies() {
  const [stickies, setStickies] = useState(load)

  const sync = useCallback((next) => {
    setStickies(next)
    save(next)
  }, [])

  const add = useCallback(() => {
    setStickies((prev) => {
      const next = [...prev, {
        id: Date.now(),
        text: '',
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        x: 20 + (prev.length % 3) * 30,
        y: 20 + (prev.length % 3) * 20,
      }]
      save(next)
      return next
    })
  }, [])

  const update = useCallback((id, text) => {
    setStickies((prev) => {
      const next = prev.map((s) => s.id === id ? { ...s, text } : s)
      save(next)
      return next
    })
  }, [])

  const move = useCallback((id, x, y) => {
    setStickies((prev) => {
      const next = prev.map((s) => s.id === id ? { ...s, x, y } : s)
      save(next)
      return next
    })
  }, [])

  const remove = useCallback((id) => {
    setStickies((prev) => {
      const next = prev.filter((s) => s.id !== id)
      save(next)
      return next
    })
  }, [])

  return { stickies, add, update, move, remove }
}
