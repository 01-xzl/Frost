import { useRef } from 'react'
import useLocale from '../hooks/useLocale'

export default function FooterMenu({ onExport, onImport }) {
  const fileRef = useRef(null)
  const { t } = useLocale()

  return (
    <div className="flex justify-center gap-4 mt-4">
      <button
        onClick={onExport}
        className="text-xs text-white/30 hover:text-white/60 transition-colors cursor-pointer"
        title={t('exportTitle')}
      >
        {t('export')}
      </button>

      <span className="text-white/20">·</span>

      <button
        onClick={() => fileRef.current?.click()}
        className="text-xs text-white/30 hover:text-white/60 transition-colors cursor-pointer"
        title={t('importTitle')}
      >
        {t('import')}
      </button>

      <input
        ref={fileRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            onImport(file)
          }
          e.target.value = ''
        }}
      />
    </div>
  )
}
