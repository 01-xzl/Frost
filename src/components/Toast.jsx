export default function Toast({ toasts, onDismiss, onAction }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="glass rounded-xl px-4 py-2.5 text-sm text-white pointer-events-auto
                     animate-slide-up-toast flex items-center gap-3 shadow-lg"
        >
          <span className="truncate max-w-[260px]">{toast.message}</span>
          {toast.hasAction && (
            <button
              onClick={() => onAction(toast.id)}
              className="shrink-0 text-emerald-300 hover:text-emerald-200 font-medium cursor-pointer transition-colors"
            >
              {toast.actionLabel}
            </button>
          )}
          <button
            onClick={() => onDismiss(toast.id)}
            className="shrink-0 text-white/40 hover:text-white/70 cursor-pointer transition-colors ml-1"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
