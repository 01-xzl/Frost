const VIEWS = [
  { key: 'tasks', label: 'Tasks', icon: '✓' },
  { key: 'notes', label: 'Notes', icon: '📌' },
  { key: 'stats', label: 'Stats', icon: '📊' },
]

export default function ViewSwitcher({ active, onChange }) {
  return (
    <div className="flex gap-1 mb-4">
      {VIEWS.map((v) => {
        const isActive = active === v.key
        return (
          <button
            key={v.key}
            onClick={() => onChange(v.key)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium
                        transition-all duration-200 cursor-pointer
                        ${isActive
                          ? 'bg-white/15 border border-white/20 text-white/85'
                          : 'bg-white/5 border border-white/8 text-white/35 hover:bg-white/8 hover:text-white/55'
                        }`}
          >
            <span className="mr-1.5">{v.icon}</span>
            {v.label}
          </button>
        )
      })}
    </div>
  )
}
