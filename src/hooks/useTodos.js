import { useState, useMemo, useCallback, useRef } from 'react'
import { loadTodos, saveTodos, buildTodo } from '../utils/storage'

const PRIORITY_WEIGHT = { high: 0, medium: 1, low: 2 }

export default function useTodos() {
  const [todos, setTodos] = useState(() => {
    const data = loadTodos()
    saveTodos(data.todos)
    return data.todos
  })

  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [exitingIds, setExitingIds] = useState(new Set())

  const todosRef = useRef(todos)
  todosRef.current = todos

  const sync = useCallback((next) => {
    setTodos(next)
    saveTodos(next)
  }, [])

  const filtered = useMemo(() => {
    let result = [...todos]

    // Category filter
    if (activeCategory) {
      result = result.filter((t) => t.category === activeCategory)
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((t) => t.text.toLowerCase().includes(q))
    }

    // Sort: high → medium → low, then newest first
    result.sort((a, b) => {
      const w = (PRIORITY_WEIGHT[a.priority] ?? 1) - (PRIORITY_WEIGHT[b.priority] ?? 1)
      if (w !== 0) return w
      return b.id - a.id
    })

    return result
  }, [todos, search, activeCategory])

  const add = useCallback((text, options) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const todo = buildTodo(trimmed, options)
    sync([todo, ...todosRef.current])
  }, [sync])

  const toggle = useCallback((id) => {
    sync(todosRef.current.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }, [sync])

  const remove = useCallback((id) => {
    const todo = todosRef.current.find((t) => t.id === id)
    sync(todosRef.current.filter((t) => t.id !== id))
    return todo ?? null
  }, [sync])

  const restore = useCallback((todo) => {
    sync([todo, ...todosRef.current])
  }, [sync])

  const update = useCallback((id, text) => {
    const trimmed = text.trim()
    if (!trimmed) return false
    sync(todosRef.current.map((t) => (t.id === id ? { ...t, text: trimmed } : t)))
    return true
  }, [sync])

  const updatePriority = useCallback((id, priority) => {
    sync(todosRef.current.map((t) => (t.id === id ? { ...t, priority } : t)))
  }, [sync])

  const clearCompleted = useCallback(() => {
    const doneIds = todosRef.current.filter((t) => t.done).map((t) => t.id)
    if (doneIds.length === 0) return
    setExitingIds(new Set(doneIds))
    setTimeout(() => {
      sync(todosRef.current.filter((t) => !t.done))
      setExitingIds(new Set())
    }, 220)
  }, [sync])

  const exportData = useCallback(() => {
    return JSON.stringify({ version: 3, todos: todosRef.current }, null, 2)
  }, [])

  const importData = useCallback((importedTodos) => {
    if (!Array.isArray(importedTodos) || importedTodos.length === 0) return false
    const normalized = importedTodos.map((t, i) => ({
      id: t.id ?? Date.now() + i,
      text: t.text ?? '',
      done: t.done ?? false,
      priority: t.priority ?? 'medium',
      category: t.category ?? 'Other',
      order: t.order ?? i,
      createdAt: t.createdAt ?? new Date().toISOString(),
      dueDate: t.dueDate ?? null,
    }))
    sync([...normalized, ...todosRef.current])
    return true
  }, [sync])

  const doneCount = todos.filter((t) => t.done).length
  const totalCount = todos.length

  return {
    todos,
    filtered,
    search,
    setSearch,
    activeCategory,
    setActiveCategory,
    editingId,
    setEditingId,
    editText,
    setEditText,
    add,
    toggle,
    remove,
    restore,
    update,
    updatePriority,
    clearCompleted,
    exitingIds,
    exportData,
    importData,
    doneCount,
    totalCount,
  }
}
