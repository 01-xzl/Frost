import { useRef } from 'react'

export default function FooterMenu({ onExport, onImport }) {
  const fileRef = useRef(null)

  return (
    <div className="flex justify-center gap-4 mt-4">
      <button
        onClick={onExport}
        className="text-xs text-white/30 hover:text-white/60 transition-colors cursor-pointer"
        title="Download all todos as JSON"
      >
        Export
      </button>

      <span className="text-white/20">·</span>

      <button
        onClick={() => fileRef.current?.click()}
        className="text-xs text-white/30 hover:text-white/60 transition-colors cursor-pointer"
        title="Import todos from JSON file"
      >
        Import
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
          // Reset so the same file can be re-imported
          e.target.value = ''
        }}
      />
    </div>
  )
}
