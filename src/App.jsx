import { useRef, useCallback, useMemo } from 'react'
import useTodos from './hooks/useTodos'
import useToast from './hooks/useToast'
import useTheme from './hooks/useTheme'
import useDailyGoal from './hooks/useDailyGoal'
import useTimer from './hooks/useTimer'
import useAudio from './hooks/useAudio'
import useQuotes from './hooks/useQuotes'
import useStreak from './hooks/useStreak'
import ProgressRing from './components/ProgressRing'
import PomodoroTimer from './components/PomodoroTimer'
import AmbientPlayer from './components/AmbientPlayer'
import QuoteDisplay from './components/QuoteDisplay'
import StreakBadge from './components/StreakBadge'
import TodoInput from './components/TodoInput'
import SearchBar from './components/SearchBar'
import StatsBar from './components/StatsBar'
import CategoryFilter from './components/CategoryFilter'
import TodoList from './components/TodoList'
import TodoItem from './components/TodoItem'
import EmptyState from './components/EmptyState'
import ThemeToggle from './components/ThemeToggle'
import FooterMenu from './components/FooterMenu'
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

  // Request notification permission (called on first timer start)
  const requestNotification = useCallback(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Pomodoro — notify on session end
  const handleSessionEnd = useCallback((completedMode) => {
    const label = completedMode === 'focus' ? 'Focus done! Take a break ☕' : 'Break over! Back to work 🚀'
    toast(label, { duration: 4000 })
    if (Notification.permission === 'granted') {
      new Notification('Frost', { body: label })
    }
  }, [toast])
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

  const addInputRef = useRef(null)
  const searchInputRef = useRef(null)

  // Date grouping: only when not searching/filtering
  const groupedItems = useMemo(() => {
    if (search.trim() || activeCategory) return null
    return groupByDate(filtered)
  }, [filtered, search, activeCategory])

  // Delete with toast + undo
  const handleDelete = useCallback((id) => {
    const removed = remove(id)
    if (removed) {
      toast(`Deleted: "${removed.text}"`, {
        action: () => restore(removed),
        actionLabel: 'Undo',
      })
    }
  }, [remove, restore, toast])

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
        toast(`Imported ${imported.length} todo${imported.length > 1 ? 's' : ''}`, { duration: 2500 })
      } else {
        toast('No valid todos found in file', { duration: 3000 })
      }
    } catch (err) {
      toast(err.message ?? 'Import failed', { duration: 3000 })
    }
  }, [importData, toast])

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

        {/* Header */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <ProgressRing progress={progress} />
          <h1 className="text-3xl font-light tracking-wide select-none">
            ✦ Frost
          </h1>
        </div>

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
      </div>

      {/* Footer: Export / Import */}
      <FooterMenu onExport={handleExport} onImport={handleImport} />

      {/* Hint */}
      <p className="text-center text-white/40 text-xs mt-3 select-none">
        Sorted by priority · Double-click to edit · Tasks grouped by date
      </p>
    </div>
  )
}
