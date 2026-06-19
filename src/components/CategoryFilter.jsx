import useLocale from '../hooks/useLocale'
import { CATEGORIES } from '../utils/defaults'

export default function CategoryFilter({ active, onChange }) {
  const { t } = useLocale()

  return (
    <div className="flex gap-1.5 mb-3 flex-wrap">
      <button
        onClick={() => onChange(null)}
        className={`px-2.5 py-1 rounded-full text-xs transition-all cursor-pointer
          ${active === null
            ? 'bg-white/25 text-white'
            : 'bg-white/8 text-white/50 hover:bg-white/15'
          }`}
      >
        {t('all')}
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-2.5 py-1 rounded-full text-xs transition-all cursor-pointer
            ${active === cat
              ? 'bg-white/25 text-white'
              : 'bg-white/8 text-white/50 hover:bg-white/15'
            }`}
        >
          {t(cat)}
        </button>
      ))}
    </div>
  )
}
