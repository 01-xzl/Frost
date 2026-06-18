import { useState, useMemo, useCallback } from 'react'

const GOAL_KEY = 'frost-daily-goal'
const DEFAULT_GOAL = 5

function getTodayRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return { start: start.getTime(), end: start.getTime() + 86400000 }
}

function loadGoal() {
  try {
    const raw = localStorage.getItem(GOAL_KEY)
    return raw ? Number(raw) : DEFAULT_GOAL
  } catch {
    return DEFAULT_GOAL
  }
}

export default function useDailyGoal(todos) {
  const [goal, setGoalState] = useState(loadGoal)

  const setGoal = useCallback((n) => {
    const v = Math.max(1, Math.min(99, n))
    setGoalState(v)
    localStorage.setItem(GOAL_KEY, String(v))
  }, [])

  const todayStats = useMemo(() => {
    const { start } = getTodayRange()
    const todayTodos = todos.filter((t) => t.createdAt
      ? new Date(t.createdAt).getTime() >= start
      : t.id >= start // fallback for legacy data
    )
    return {
      created: todayTodos.length,
      done: todayTodos.filter((t) => t.done).length,
    }
  }, [todos])

  const progress = Math.min(todayStats.done / (goal || 1), 1)

  return { goal, setGoal, todayCreated: todayStats.created, todayDone: todayStats.done, progress }
}
