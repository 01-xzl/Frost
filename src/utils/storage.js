import { createTodo } from './defaults'

const STORAGE_KEY = 'glass-todos'
const CURRENT_VERSION = 3

function migrate(todos, fromVersion) {
  let result = [...todos]
  if (fromVersion < 2) {
    result = result.map((t) => ({
      id: t.id,
      text: t.text,
      done: t.done,
      priority: t.priority ?? 'medium',
      category: t.category ?? 'Other',
      order: t.order ?? t.id,
      createdAt: t.createdAt ?? new Date(t.id).toISOString(),
      dueDate: t.dueDate ?? null,
    }))
  }
  if (fromVersion === 2) {
    result = result.map((t) => ({
      ...t,
      createdAt: t.createdAt ?? new Date(t.id).toISOString(),
      dueDate: t.dueDate ?? null,
    }))
  }
  return result
}

export function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { version: CURRENT_VERSION, todos: [] }

    const data = JSON.parse(raw)

    // Legacy: plain array = version 1
    if (Array.isArray(data)) {
      const migrated = migrate(data, 1)
      return { version: CURRENT_VERSION, todos: migrated }
    }

    // Versioned object
    const version = data.version ?? 1
    const todos = data.todos ?? []
    if (version < CURRENT_VERSION) {
      return { version: CURRENT_VERSION, todos: migrate(todos, version) }
    }

    return data
  } catch {
    return { version: CURRENT_VERSION, todos: [] }
  }
}

export function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: CURRENT_VERSION, todos }))
}

/**
 * Build a new todo with all fields and defaults.
 */
export function buildTodo(text, options) {
  return createTodo(text, options)
}
