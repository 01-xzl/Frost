import { useRef, useCallback, useMemo, useState } from 'react'
import useTodos from './hooks/useTodos'
import useToast from './hooks/useToast'
import useTheme from './hooks/useTheme'
import useDailyGoal from './hooks/useDailyGoal'
import useTimer from './hooks/useTimer'
import useAudio from './hooks/useAudio'
import useQuotes from './hooks/useQuotes'
import useStreak from './hooks/useStreak'
import useStickies from './hooks/useStickies'
import useLocale from './hooks/useLocale'
import ProgressRing from './components/ProgressRing'
import PomodoroTimer from './components/PomodoroTimer'
import AmbientPlayer from './components/AmbientPlayer'
import QuoteDisplay from './components/QuoteDisplay'
import StreakBadge from './components/StreakBadge'
import ViewSwitcher from './components/ViewSwitcher'
import StickyBoard from './components/StickyBoard'
import StatsPanel from './components/StatsPanel'
import TodoInput from './components/TodoInput'
import SearchBar from './components/SearchBar'
import StatsBar from './components/StatsBar'
import CategoryFilter from './components/CategoryFilter'
import TodoList from './components/TodoList'
import TodoItem from './components/TodoItem'
import EmptyState from './components/EmptyState'
import ThemeToggle from './components/ThemeToggle'
import FooterMenu from './components/FooterMenu'
import LanguageSwitcher from './components/LanguageSwitcher'
import Toast from './components/Toast'
import { downloadJSON, parseImportedFile } from './utils/exportImport'
import { groupByDate } from './utils/dateGrouping'

export default function App() {
  const {
    filtered,
    todos,
    search,
    setSearch,
    editingId,
    setEditingId,
    editText,
    setEditText,
    add,
    toggle,
    remove,
    restore,
    update,
    updatePriority,
    activeCategory,
    setActiveCategory,
    clearCompleted,
    exitingIds,
    exportData,
    importData,
    doneCount,
    totalCount,
  } = useTodos()

  const { toasts, toast, dismissToast, handleAction } = useToast()
  const { theme, toggleTheme } = useTheme()
  const { goal, setGoal, todayCreated, todayDone, progress } = useDailyGoal(todos)
  const { t } = useLocale()

  // Request notification permission (called on first timer start)
  const requestNotification = useCallback(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Pomodoro — notify on session end
  const handleSessionEnd = useCallback((completedMode) => {
    const label = completedMode === 'focus' ? t('focusDone') : t('breakDone')
    toast(label, { duration: 4000 })
    if (Notification.permission === 'granted') {
      new Notification('Frost', { body: label })
    }
  }, [toast, t])
  const timer = useTimer(handleSessionEnd)

  const handleStartTimer = useCallback(() => {
    requestNotification()
    timer.start()
  }, [requestNotification, timer.start])

  // Ambient sounds
  const audio = useAudio()

  // Quote of the day
  const { quote, refresh: refreshQuote } = useQuotes()

  // Streak
  const streak = useStreak(todayDone)

  // Sticky notes
  const { stickies, add: addSticky, update: updateSticky, move: moveSticky, remove: removeSticky } = useStickies()

  // View switching
  const [view, setView] = useState('tasks')

  const addInputRef = useRef(null)
  const searchInputRef = useRef(null)

  // Date grouping: only when not searching/filtering
  const groupedItems = useMemo(() => {
    if (search.trim() || activeCategory) return null
    const dateKeys = { Today: 'dateToday', Yesterday: 'dateYesterday', 'This Week': 'dateThisWeek', Older: 'dateOlder' }
    return groupByDate(filtered).map((g) => ({ ...g, label: t(dateKeys[g.label] || g.label) }))
  }, [filtered, search, activeCategory, t])

  // Delete with toast + undo
  const handleDelete = useCallback((id) => {
    const removed = remove(id)
    if (removed) {
      toast(`${t('deleted')}"${removed.text}"`, {
        action: () => restore(removed),
        actionLabel: t('undo'),
      })
    }
  }, [remove, restore, toast, t])

  // Edit flow
  const handleEdit = useCallback((todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }, [setEditingId, setEditText])

  const handleSaveEdit = useCallback((id) => {
    const ok = update(id, editText)
    if (ok) {
      setEditingId(null)
      setEditText('')
    }
  }, [update, editText, setEditingId, setEditText])

  const handleCancelEdit = useCallback(() => {
    setEditingId(null)
    setEditText('')
  }, [setEditingId, setEditText])

  // Export
  const handleExport = useCallback(() => {
    const json = exportData()
    downloadJSON(JSON.parse(json), 'todos-backup.json')
  }, [exportData])

  // Import
  const handleImport = useCallback(async (file) => {
    try {
      const imported = await parseImportedFile(file)
      const ok = importData(imported)
      if (ok) {
        const msg = imported.length === 1 ? t('imported_singular') : t('imported_plural', { n: imported.length })
        toast(msg, { duration: 2500 })
      } else {
        toast(t('noValidTodos'), { duration: 3000 })
      }
    } catch (err) {
      toast(err.message ?? t('importFailed'), { duration: 3000 })
    }
  }, [importData, toast, t])

  const renderItem = useCallback((todo) => (
    <TodoItem
      todo={todo}
      onToggle={toggle}
      onDelete={handleDelete}
      onEdit={handleEdit}
      onUpdatePriority={updatePriority}
      editingId={editingId}
      editText={editText}
      onEditTextChange={setEditText}
      onSaveEdit={handleSaveEdit}
      onCancelEdit={handleCancelEdit}
      isExiting={exitingIds.has(todo.id)}
    />
  ), [
    toggle, handleDelete, handleEdit, updatePriority,
    editingId, editText, setEditText, handleSaveEdit, handleCancelEdit,
    exitingIds,
  ])

  return (
    <div className="w-full max-w-lg">
      <Toast toasts={toasts} onDismiss={dismissToast} onAction={handleAction} />

      <div className="glass rounded-2xl p-8 text-white relative">
        {/* Theme toggle */}
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
        <LanguageSwitcher />

        {/* Header */}
        <div className="flex items-center justify-center gap-4 mb-3">
          <ProgressRing progress={progress} />
          <h1 className="text-3xl font-light tracking-wide select-none">
            ✦ Frost
          </h1>
        </div>

        {/* View switcher */}
        <ViewSwitcher active={view} onChange={setView} />

        {/* ===== Tasks View ===== */}
        {view === 'tasks' && (
          <>
            {/* Pomodoro */}
            <div className="mb-5">
              <PomodoroTimer
                mode={timer.mode}
                remaining={timer.remaining}
                progress={timer.progress}
                isRunning={timer.isRunning}
                isPaused={timer.isPaused}
                isIdle={timer.isIdle}
                onStart={handleStartTimer}
                onPause={timer.pause}
                onReset={timer.reset}
                onSkip={timer.skip}
              />
            </div>

            {/* Ambient sounds */}
            <div className="mb-5">
              <AmbientPlayer
                active={audio.active}
                sounds={audio.sounds}
                onToggle={audio.toggle}
              />
            </div>

            {/* Add input */}
            <TodoInput ref={addInputRef} onAdd={add} />

            {/* Search */}
            <SearchBar ref={searchInputRef} value={search} onChange={setSearch} />

            {/* Category filter */}
            <CategoryFilter active={activeCategory} onChange={setActiveCategory} />

            {/* Stats + Clear completed */}
            <StatsBar
              total={totalCount}
              done={doneCount}
              onClearCompleted={clearCompleted}
              todayDone={todayDone}
              todayCreated={todayCreated}
              goal={goal}
              onGoalChange={setGoal}
            />

            {/* Streak badge */}
            <div className="mb-3">
              <StreakBadge
                current={streak.current}
                longest={streak.longest}
                todayDone={streak.todayDone}
              />
            </div>

            {/* List */}
            {filtered.length === 0 ? (
              <ul className="space-y-2 max-h-80 overflow-y-auto pr-1">
                <EmptyState
                  hasTodos={totalCount > 0}
                  searchActive={search.trim().length > 0 || activeCategory !== null}
                />
              </ul>
            ) : (
              <TodoList
                items={groupedItems ?? filtered}
                renderItem={renderItem}
                grouped={!!groupedItems}
              />
            )}

            {/* Quote of the day */}
            <QuoteDisplay quote={quote} onRefresh={refreshQuote} />
          </>
        )}

        {/* ===== Notes View ===== */}
        {view === 'notes' && (
          <StickyBoard
            stickies={stickies}
            onUpdate={updateSticky}
            onMove={moveSticky}
            onDelete={removeSticky}
            onAdd={addSticky}
          />
        )}

        {/* ===== Stats View ===== */}
        {view === 'stats' && (
          <StatsPanel todos={todos} />
        )}
      </div>

      {/* Footer: Export / Import (tasks only) */}
      {view === 'tasks' && (
        <>
          <FooterMenu onExport={handleExport} onImport={handleImport} />

          {/* Hint */}
          <p className="text-center text-white/40 text-xs mt-3 select-none">
            {t('hint')}
          </p>
        </>
      )}
    </div>
  )
}
