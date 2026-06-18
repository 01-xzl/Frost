export function getDateBucket(isoString) {
  const date = new Date(isoString)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const day = 86400000
  const yesterday = today - day
  const weekAgo = today - 7 * day

  const timestamp = date.getTime()
  if (timestamp >= today) return 'Today'
  if (timestamp >= yesterday) return 'Yesterday'
  if (timestamp >= weekAgo) return 'This Week'
  return 'Older'
}

const BUCKET_ORDER = ['Today', 'Yesterday', 'This Week', 'Older']

export function groupByDate(todos) {
  const groups = new Map()
  for (const t of todos) {
    const bucket = getDateBucket(t.createdAt)
    if (!groups.has(bucket)) groups.set(bucket, [])
    groups.get(bucket).push(t)
  }
  return BUCKET_ORDER
    .filter((b) => groups.has(b))
    .map((label) => ({ label, todos: groups.get(label) }))
}

export { BUCKET_ORDER }
