import { useState, useMemo, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'frost-streak'
const MS_PER_DAY = 86400000

function getTodayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function loadDates() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch { return new Set() }
}

function saveDates(dates) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...dates]))
}

export default function useStreak(doneCountToday) {
  const [doneDates, setDoneDates] = useState(loadDates)

  // Mark today as "done" if they completed at least one task
  useEffect(() => {
    if (doneCountToday > 0) {
      const today = getTodayKey()
      setDoneDates((prev) => {
        if (prev.has(today)) return prev
        const next = new Set(prev)
        next.add(today)
        saveDates(next)
        return next
      })
    }
  }, [doneCountToday])

  const { current, longest } = useMemo(() => {
    const today = getTodayKey()
    const sorted = [...doneDates].sort().reverse() // newest first

    // Current streak: count consecutive days backward from today or yesterday
    let currentStreak = 0
    let checkDate = new Date()

    // If today not done yet, check from yesterday
    if (!doneDates.has(today)) {
      checkDate = new Date(Date.now() - MS_PER_DAY)
    }

    // Walk backwards
    for (let i = 0; i < 400; i++) {
      const key = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`
      if (doneDates.has(key)) {
        currentStreak++
        checkDate = new Date(checkDate.getTime() - MS_PER_DAY)
      } else {
        break
      }
    }

    // Longest streak: scan all dates
    let longestStreak = 0
    if (sorted.length > 0) {
      let run = 1
      for (let i = 1; i < sorted.length; i++) {
        const prev = new Date(sorted[i - 1])
        const curr = new Date(sorted[i])
        const diffDays = Math.round((prev.getTime() - curr.getTime()) / MS_PER_DAY)
        if (diffDays === 1) {
          run++
        } else {
          longestStreak = Math.max(longestStreak, run)
          run = 1
        }
      }
      longestStreak = Math.max(longestStreak, run)
    }

    return { current: currentStreak, longest: longestStreak }
  }, [doneDates])

  const todayDone = doneDates.has(getTodayKey())

  return { current, longest, todayDone }
}
