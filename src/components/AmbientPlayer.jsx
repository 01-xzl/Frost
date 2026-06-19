export default function AmbientPlayer({ active, sounds, onToggle }) {
  const entries = Object.entries(sounds)

  return (
    <div className="flex items-center justify-center gap-1">
      {entries.map(([key, { label, icon }]) => {
        const isActive = active === key
        return (
          <button
            key={key}
            onClick={() => onToggle(key)}
            title={label}
            className={`w-9 h-9 rounded-full flex items-center justify-center
                        text-sm transition-all duration-200 cursor-pointer
                        ${isActive
                          ? 'bg-white/18 border border-white/30 text-white shadow-[0_0_10px_rgba(255,255,255,0.15)]'
                          : 'bg-white/6 border border-white/10 text-white/40 hover:bg-white/12 hover:text-white/70'
                        }`}
          >
            {icon}
          </button>
        )
      })}
    </div>
  )
}
