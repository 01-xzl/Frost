import useLocale from '../hooks/useLocale'

export default function StreakBadge({ current, longest, todayDone }) {
  const { t } = useLocale()
  if (current === 0 && longest === 0) return null

  return (
    <div className="flex items-center justify-center gap-3 text-[10px] text-white/25">
      <span className="flex items-center gap-1">
        <span className={current > 0 ? 'text-amber-300/80' : 'text-white/15'}>🔥</span>
        <span>{current} {current === 1 ? t('day_one') : t('day_other')}</span>
      </span>
      {longest > current && (
        <span>· {t('best')} {longest}</span>
      )}
      {todayDone && (
        <span className="text-emerald-400/60">{t('todayDone')}</span>
      )}
    </div>
  )
}
