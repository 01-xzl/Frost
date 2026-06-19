import useLocale from '../hooks/useLocale'

export default function StatsBar({
  total, done, onClearCompleted,
  todayDone, todayCreated, goal, onGoalChange,
}) {
  const { t } = useLocale()
  const left = total - done

  return (
    <div className="space-y-2 mb-4 px-1">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-white/60">
          <span>{t('today')}</span>
          <span className="text-white/80 font-medium">
            {todayDone}/{goal}
          </span>
          <span className="text-white/30">{t('done')}</span>
          <input
            type="number"
            min={1}
            max={99}
            value={goal}
            onChange={(e) => onGoalChange(Number(e.target.value))}
            className="w-9 text-center bg-white/8 border border-white/15 rounded-md
                       text-white/60 text-xs py-0.5 outline-none
                       focus:border-white/30 transition-colors
                       [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            title={t('dailyGoal')}
          />
        </div>
        {todayCreated > 0 && (
          <span className="text-white/30">
            {todayCreated} {t('created')}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-white/40">
        <div className="flex gap-3">
          <span>{total} {t('total')}</span>
          <span>{done} {t('done')}</span>
          <span>{left} {t('left')}</span>
        </div>
        {done > 0 && (
          <button
            onClick={onClearCompleted}
            className="text-white/40 hover:text-white/70 transition-colors cursor-pointer"
          >
            {t('clearDone')}
          </button>
        )}
      </div>
    </div>
  )
}
