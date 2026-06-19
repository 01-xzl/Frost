import ProgressRing from './ProgressRing'
import PomodoroTimer from './PomodoroTimer'
import AmbientPlayer from './AmbientPlayer'
import QuoteDisplay from './QuoteDisplay'
import StreakBadge from './StreakBadge'
import StatsBar from './StatsBar'
import ThemeToggle from './ThemeToggle'
import useLocale from '../hooks/useLocale'
import { LANG_LABELS } from '../i18n/locales'

/**
 * Dashboard layout for wide viewports (≥768px).
 * Arknights-inspired: multiple frosted glass panels spread across the screen
 * with vignette background, depth hierarchy, and zoned information.
 */
export default function DashboardLayout({
  theme, onToggleTheme, progress,
  timer, onStartTimer,
  audio,
  quote, onRefreshQuote,
  streak,
  totalCount, doneCount, todayDone, todayCreated, goal, onGoalChange, onClearCompleted,
  topContent,
  listContent,
  bottomContent,
}) {
  const { lang, setLang } = useLocale()
  const next = lang === 'zh' ? 'en' : 'zh'

  return (
    <div className="w-full h-full min-h-screen flex flex-col items-center justify-center p-6 lg:p-10">
      {/* ===== Main Dashboard Grid ===== */}
      <div className="w-full max-w-[1200px] grid grid-cols-[280px_1fr_240px] gap-5 h-[85vh] max-h-[900px]">

        {/* ===== LEFT PANEL: Focus Tools ===== */}
        <div className="flex flex-col gap-4">
          {/* Timer card */}
          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-2 flex-1 justify-center">
            <PomodoroTimer
              mode={timer.mode}
              remaining={timer.remaining}
              progress={timer.progress}
              isRunning={timer.isRunning}
              isPaused={timer.isPaused}
              isIdle={timer.isIdle}
              onStart={onStartTimer}
              onPause={timer.pause}
              onReset={timer.reset}
              onSkip={timer.skip}
            />
            <div className="mt-2 w-full">
              <AmbientPlayer
                active={audio.active}
                sounds={audio.sounds}
                onToggle={audio.toggle}
              />
            </div>
          </div>

          {/* Quote card */}
          <div className="glass rounded-2xl px-5 py-4">
            <QuoteDisplay quote={quote} onRefresh={onRefreshQuote} />
          </div>
        </div>

        {/* ===== CENTER PANEL: Task List ===== */}
        <div className="glass rounded-2xl p-6 flex flex-col overflow-hidden">
          {/* Header row */}
          <div className="flex items-center gap-3 mb-4">
            <ProgressRing progress={progress} size={36} stroke={3} />
            <h1 className="text-xl font-light tracking-wide select-none text-white/90">
              ✦ Frost
            </h1>
            <div className="flex-1" />
            <button
              onClick={() => setLang(next)}
              className="text-[10px] text-white/35 hover:text-white/65
                         transition-colors cursor-pointer tracking-wide font-medium"
            >
              {LANG_LABELS[next]}
            </button>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>

          {/* Top content: input, search, category, stats */}
          <div className="shrink-0">
            {topContent}
          </div>

          {/* Streak */}
          <div className="mb-2">
            <StreakBadge
              current={streak.current}
              longest={streak.longest}
              todayDone={streak.todayDone}
            />
          </div>

          {/* Scrollable list area */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {listContent}
          </div>

          {/* Stats bar */}
          <div className="shrink-0 mt-2 border-t border-white/8 pt-3">
            <StatsBar
              total={totalCount}
              done={doneCount}
              onClearCompleted={onClearCompleted}
              todayDone={todayDone}
              todayCreated={todayCreated}
              goal={goal}
              onGoalChange={onGoalChange}
            />
          </div>
        </div>

        {/* ===== RIGHT PANEL: Stats & Info ===== */}
        <div className="flex flex-col gap-4">
          {/* Progress & Streak card */}
          <div className="glass rounded-2xl p-5 flex flex-col items-center gap-3 justify-center">
            <ProgressRing progress={progress} size={72} stroke={4} />
            <div className="text-center">
              <div className="text-white/40 text-[10px] uppercase tracking-wide">Daily Goal</div>
              <div className="text-white/80 text-lg font-medium">
                {todayDone}/{goal}
              </div>
            </div>
            <StreakBadge
              current={streak.current}
              longest={streak.longest}
              todayDone={streak.todayDone}
            />
          </div>

          {/* Stats card */}
          <div className="glass rounded-2xl p-4 flex-1">
            <StatsBar
              total={totalCount}
              done={doneCount}
              onClearCompleted={onClearCompleted}
              todayDone={todayDone}
              todayCreated={todayCreated}
              goal={goal}
              onGoalChange={onGoalChange}
            />
          </div>
        </div>
      </div>

      {/* ===== Bottom bar ===== */}
      {bottomContent}
    </div>
  )
}
