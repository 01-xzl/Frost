export default function StatsBar({ total, done, onClearCompleted }) {
  const left = total - done

  return (
    <div className="flex items-center justify-between text-xs text-white/60 mb-4 px-1">
      <div className="flex gap-3">
        <span>{total} total</span>
        <span>{done} done</span>
        <span>{left} left</span>
      </div>
      {done > 0 && (
        <button
          onClick={onClearCompleted}
          className="text-white/40 hover:text-white/70 transition-colors cursor-pointer"
        >
          Clear done
        </button>
      )}
    </div>
  )
}
