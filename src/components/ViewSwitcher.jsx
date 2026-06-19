import useLocale from '../hooks/useLocale'

const VIEW_KEYS = ['tasks', 'notes', 'stats']
const VIEW_ICONS = { tasks: '✓', notes: '📌', stats: '📊' }

export default function ViewSwitcher({ active, onChange }) {
  const { t } = useLocale()

  return (
    <div className="flex gap-1 mb-4">
      {VIEW_KEYS.map((key) => {
        const isActive = active === key
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium
                        transition-all duration-200 cursor-pointer
                        ${isActive
                          ? 'bg-white/15 border border-white/20 text-white/85'
                          : 'bg-white/5 border border-white/8 text-white/35 hover:bg-white/8 hover:text-white/55'
                        }`}
          >
            <span className="mr-1.5">{VIEW_ICONS[key]}</span>
            {t(key)}
          </button>
        )
      })}
    </div>
  )
}
