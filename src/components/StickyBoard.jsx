import useLocale from '../hooks/useLocale'
import StickyNote from './StickyNote'

export default function StickyBoard({ stickies, onUpdate, onMove, onDelete, onAdd }) {
  const { t } = useLocale()

  return (
    <div className="relative min-h-64 rounded-xl bg-white/4 border border-white/8 overflow-hidden">
      {stickies.length === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <p className="text-white/20 text-sm">{t('stickyEmpty')}</p>
          <button
            onClick={onAdd}
            className="px-4 py-1.5 rounded-full text-xs font-medium
                       bg-white/10 border border-white/12 text-white/50
                       hover:bg-white/15 hover:text-white/70 transition-colors cursor-pointer"
          >
            {t('stickyAdd')}
          </button>
        </div>
      ) : (
        <>
          {stickies.map((s) => (
            <StickyNote
              key={s.id}
              sticky={s}
              onUpdate={onUpdate}
              onMove={onMove}
              onDelete={onDelete}
            />
          ))}
          <button
            onClick={onAdd}
            className="absolute bottom-3 right-3 w-8 h-8 rounded-full
                       bg-white/12 border border-white/15 text-white/50
                       hover:bg-white/20 hover:text-white/80
                       flex items-center justify-center text-lg
                       transition-colors cursor-pointer"
            title={t('stickyAdd')}
          >
            +
          </button>
        </>
      )}
    </div>
  )
}
