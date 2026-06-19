import useLocale from '../hooks/useLocale'
import ProgressRing from './ProgressRing'

function fmt(ms) {
  const totalSec = Math.ceil(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function PomodoroTimer({
  mode,
  remaining,
  progress,
  isRunning,
  isPaused,
  isIdle,
  onStart,
  onPause,
  onReset,
  onSkip,
}) {
  const { t } = useLocale()
  const label = mode === 'focus' ? t('focus') : t('break')

  return (
    <div className="flex flex-col items-center gap-3">
      <span className={`text-[10px] uppercase tracking-[0.15em] font-medium
        ${mode === 'focus' ? 'text-white/50' : 'text-emerald-300/70'}`}>
        {label}
      </span>

      <div className="relative flex items-center justify-center">
        <ProgressRing progress={progress} size={100} stroke={4} />
        <span className="absolute text-2xl font-mono font-light tracking-wider text-white/90">
          {fmt(remaining)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {isIdle && (
          <button onClick={onStart} className="px-5 py-1.5 rounded-full text-xs font-medium bg-white/12 border border-white/15 text-white/85 hover:bg-white/20 transition-colors cursor-pointer">
            {t('start')}
          </button>
        )}
        {isRunning && (
          <button onClick={onPause} className="px-5 py-1.5 rounded-full text-xs font-medium bg-white/12 border border-white/15 text-white/85 hover:bg-white/20 transition-colors cursor-pointer">
            {t('pause')}
          </button>
        )}
        {isPaused && (
          <button onClick={onStart} className="px-5 py-1.5 rounded-full text-xs font-medium bg-white/12 border border-white/15 text-white/85 hover:bg-white/20 transition-colors cursor-pointer">
            {t('resume')}
          </button>
        )}
        {!isIdle && (
          <>
            <button onClick={onReset} className="px-3 py-1.5 rounded-full text-xs text-white/40 hover:text-white/70 transition-colors cursor-pointer">
              {t('reset')}
            </button>
            <button onClick={onSkip} className="px-3 py-1.5 rounded-full text-xs text-white/40 hover:text-white/70 transition-colors cursor-pointer">
              {t('skip')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
