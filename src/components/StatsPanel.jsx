import { useMemo } from 'react'
import useLocale from '../hooks/useLocale'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MS_PER_DAY = 86400000

export default function StatsPanel({ todos }) {
  const { t } = useLocale()

  const weeklyData = useMemo(() => {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const days = []
    for (let i = 6; i >= 0; i--) {
      const dayStart = todayStart - i * MS_PER_DAY
      const dayEnd = dayStart + MS_PER_DAY
      const dayTodos = todos.filter((t) => {
        const ts = t.createdAt ? new Date(t.createdAt).getTime() : t.id
        return ts >= dayStart && ts < dayEnd
      })
      const done = dayTodos.filter((td) => td.done).length
      const created = dayTodos.length
      days.push({
        label: DAY_NAMES[new Date(dayStart).getDay()],
        created,
        done,
        isToday: i === 0,
      })
    }
    return days
  }, [todos])

  const maxVal = Math.max(1, ...weeklyData.map((d) => d.created))

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-center gap-2 h-32 px-2">
        {weeklyData.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-1 max-w-10">
            <div className="relative w-full h-24 flex flex-col justify-end">
              <div
                className="w-full rounded-t-sm transition-all duration-500"
                style={{
                  height: `${(d.created / maxVal) * 100}%`,
                  background: d.isToday ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                }}
              />
              {d.done > 0 && (
                <div
                  className="absolute bottom-0 w-full rounded-t-sm transition-all duration-500"
                  style={{
                    height: `${(d.done / maxVal) * 100}%`,
                    background: d.done === d.created && d.created > 0
                      ? 'rgba(52,211,153,0.5)'
                      : 'rgba(52,211,153,0.3)',
                  }}
                />
              )}
            </div>
            <span className={`text-[10px] ${d.isToday ? 'text-white/60 font-medium' : 'text-white/25'}`}>
              {d.label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 text-[10px] text-white/30">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-white/10 inline-block" />
          {t('weekCreated')}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-emerald-400/40 inline-block" />
          {t('weekDone')}
        </span>
        <span className="text-white/20">
          {weeklyData.reduce((s, d) => s + d.created, 0)} {t('weekSummary')}
        </span>
      </div>
    </div>
  )
}
