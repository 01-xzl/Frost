import useLocale from '../hooks/useLocale'
import { LANG_LABELS } from '../i18n/locales'

export default function LanguageSwitcher() {
  const { lang, setLang } = useLocale()
  const next = lang === 'zh' ? 'en' : 'zh'

  return (
    <button
      onClick={() => setLang(next)}
      className="absolute top-3 left-4 text-[10px] text-white/35
                 hover:text-white/65 transition-colors cursor-pointer
                 tracking-wide font-medium"
      title={LANG_LABELS[next]}
    >
      {LANG_LABELS[next]}
    </button>
  )
}
