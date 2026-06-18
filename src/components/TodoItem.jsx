import { useState, useCallback } from 'react'
import PrioritySelector from './PrioritySelector'
import { PRIORITIES } from '../utils/defaults'

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
  onUpdatePriority,
  editingId,
  editText,
  onEditTextChange,
  onSaveEdit,
  onCancelEdit,
  isExiting = false,
}) {
  const [exiting, setExiting] = useState(false)
  const isEditing = editingId === todo.id
  const priorityInfo = PRIORITIES.find((p) => p.key === todo.priority) || PRIORITIES[1]

  const handleDelete = useCallback(() => {
    setExiting(true)
  }, [])

  const handleAnimationEnd = useCallback(() => {
    if (exiting) {
      onDelete(todo.id)
    }
  }, [exiting, onDelete, todo.id])

  const exitingClass = (exiting || isExiting) ? 'animate-slide-up' : 'animate-slide-down'

  return (
    <div
      onAnimationEnd={handleAnimationEnd}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl
                  bg-white/8 border border-white/10 transition-all group
                  ${exitingClass}`}
    >
      {/* Priority dot */}
      <span
        className={`shrink-0 w-2 h-2 rounded-full ${priorityInfo.color}`}
        title={priorityInfo.label}
      />

      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
                    transition-all cursor-pointer
                    ${todo.done
                      ? 'bg-emerald-400 border-emerald-400'
                      : 'border-white/30 hover:border-white/60'
                    }`}
      >
        {todo.done && (
          <svg className="w-3 h-3 text-white animate-scale-check" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Category label */}
      <span className="shrink-0 text-[10px] text-white/40 px-1.5 py-0.5 rounded-full bg-white/8">
        {todo.category}
      </span>

      {/* Text or Edit Input */}
      {isEditing ? (
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={editText}
            onChange={(e) => onEditTextChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSaveEdit(todo.id)
              if (e.key === 'Escape') onCancelEdit()
            }}
            onBlur={() => onSaveEdit(todo.id)}
            autoFocus
            className="flex-1 px-2 py-1 rounded-lg bg-white/15 border border-white/25
                       text-white outline-none text-sm min-w-0"
          />
          <PrioritySelector
            value={todo.priority}
            onChange={(p) => onUpdatePriority(todo.id, p)}
            compact
          />
        </div>
      ) : (
        <span
          className={`flex-1 text-sm cursor-pointer select-none truncate
                      ${todo.done ? 'line-through text-white/40' : 'text-white/90'}`}
          onDoubleClick={() => onEdit(todo)}
        >
          {todo.text}
        </span>
      )}

      {/* Actions */}
      {!isEditing && (
        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(todo)}
            className="p-1.5 rounded-lg hover:bg-white/15 transition-colors cursor-pointer"
            title="Edit"
          >
            <svg className="w-3.5 h-3.5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg hover:bg-red-500/25 transition-colors cursor-pointer"
            title="Delete"
          >
            <svg className="w-3.5 h-3.5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
