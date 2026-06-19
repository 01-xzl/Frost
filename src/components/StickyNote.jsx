import { useRef, useCallback } from 'react'
import useLocale from '../hooks/useLocale'

export default function StickyNote({ sticky, onUpdate, onMove, onDelete }) {
  const ref = useRef(null)
  const posRef = useRef({ x: sticky.x, y: sticky.y })
  const { t } = useLocale()

  posRef.current = { x: sticky.x, y: sticky.y }

  const handlePointerDown = useCallback((e) => {
    if (e.target.tagName === 'TEXTAREA') return
    e.preventDefault()
    const el = ref.current
    if (!el) return

    const startX = e.clientX
    const startY = e.clientY
    const origX = posRef.current.x
    const origY = posRef.current.y

    const handleMove = (ev) => {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      const nx = Math.max(0, origX + dx)
      const ny = Math.max(0, origY + dy)
      el.style.left = `${nx}px`
      el.style.top = `${ny}px`
    }

    const handleUp = (ev) => {
      document.removeEventListener('pointermove', handleMove)
      document.removeEventListener('pointerup', handleUp)
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      const nx = Math.max(0, origX + dx)
      const ny = Math.max(0, origY + dy)
      onMove(sticky.id, nx, ny)
    }

    document.addEventListener('pointermove', handleMove)
    document.addEventListener('pointerup', handleUp)
  }, [sticky.id, onMove])

  return (
    <div
      ref={ref}
      className="absolute rounded-lg p-3 w-44 min-h-32 flex flex-col gap-2
                 backdrop-blur-md border border-white/10 shadow-md
                 transition-shadow duration-200 hover:shadow-lg cursor-grab active:cursor-grabbing"
      style={{
        left: sticky.x,
        top: sticky.y,
        background: sticky.color,
        touchAction: 'none',
      }}
      onPointerDown={handlePointerDown}
    >
      <button
        onClick={() => onDelete(sticky.id)}
        className="absolute top-1 right-2 text-white/30 hover:text-white/70
                   text-xs leading-none cursor-pointer transition-colors"
      >
        ×
      </button>

      <textarea
        value={sticky.text}
        onChange={(e) => onUpdate(sticky.id, e.target.value)}
        placeholder={t('stickyPlaceholder')}
        rows={3}
        className="w-full bg-transparent text-white/75 text-xs resize-none
                   outline-none placeholder-white/20 leading-relaxed"
      />
    </div>
  )
}
