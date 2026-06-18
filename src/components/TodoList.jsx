import { useLayoutEffect, useRef } from 'react'
import DateGroupHeader from './DateGroupHeader'

/**
 * List renderer with optional date grouping and FLIP position animation.
 *
 * When `grouped` is true, `items` is an array of { label, todos } groups.
 * When false, `items` is a flat array of todos.
 */
export default function TodoList({
  items,
  renderItem,
  grouped = false,
}) {
  const listRef = useRef(null)

  // --- FLIP animation: smoothly move items when list order changes ---
  const positionsRef = useRef(new Map())

  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    const els = list.querySelectorAll('[data-todo-id]')
    const oldPos = positionsRef.current
    const newPos = new Map()

    els.forEach((el) => {
      newPos.set(el.dataset.todoId, el.getBoundingClientRect().top)
    })

    els.forEach((el) => {
      const id = el.dataset.todoId
      const prev = oldPos.get(id)
      const curr = newPos.get(id)
      if (prev != null && curr != null && Math.abs(prev - curr) > 1) {
        const deltaY = prev - curr
        el.style.transition = 'none'
        el.style.transform = `translateY(${deltaY}px)`
        // Force synchronous layout so the browser registers the transform
        // eslint-disable-next-line no-unused-expressions
        el.offsetHeight
        el.style.transition = 'transform 0.3s ease'
        el.style.transform = ''
      }
    })

    positionsRef.current = newPos
  })

  // --- Grouped render ---
  if (grouped) {
    return (
      <ul
        ref={listRef}
        className="space-y-2 max-h-80 overflow-y-auto pr-1"
      >
        {items.map((group) => (
          <li key={group.label}>
            <DateGroupHeader label={group.label} />
            <ul className="space-y-2">
              {group.todos.map((item) => (
                <li key={item.id} data-todo-id={item.id}>
                  {renderItem(item)}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    )
  }

  // --- Flat render ---
  return (
    <ul
      ref={listRef}
      className="space-y-2 max-h-80 overflow-y-auto pr-1"
    >
      {items.map((item) => (
        <li key={item.id} data-todo-id={item.id}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  )
}
