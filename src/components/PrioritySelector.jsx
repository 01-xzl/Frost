import useLocale from '../hooks/useLocale'
import { PRIORITIES } from '../utils/defaults'

export default function PrioritySelector({ value, onChange, compact = false }) {
  const { t } = useLocale()

  return (
    <div className={`flex ${compact ? 'gap-1' : 'gap-2'}`}>
      {PRIORITIES.map((p) => (
        <button
          key={p.key}
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onChange(p.key)}
          title={t(p.key)}
          className={`rounded-full transition-all cursor-pointer
            ${compact ? 'w-3 h-3' : 'w-4 h-4'}
            ${p.color}
            ${value === p.key
              ? 'ring-2 ring-white/60 scale-110'
              : 'opacity-30 hover:opacity-60'
            }`}
        />
      ))}
    </div>
  )
}
