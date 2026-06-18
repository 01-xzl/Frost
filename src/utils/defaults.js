export const PRIORITIES = [
  { key: 'high', label: 'High', color: 'bg-red-400' },
  { key: 'medium', label: 'Medium', color: 'bg-yellow-400' },
  { key: 'low', label: 'Low', color: 'bg-green-400' },
]

export const CATEGORIES = ['Work', 'Life', 'Study', 'Other']

export function createTodo(text, { priority = 'medium', category = 'Other' } = {}) {
  const now = Date.now()
  return {
    id: now,
    text: text.trim(),
    done: false,
    priority,
    category,
    order: now,
    createdAt: new Date().toISOString(),
    dueDate: null,
  }
}
