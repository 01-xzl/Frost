import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { LOCALES, t as translate } from '../i18n/locales'

const STORAGE_KEY = 'frost-locale'

function getInitialLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && LOCALES[stored]) return stored
  } catch {}
  // Detect browser language
  const nav = navigator.language || ''
  return nav.startsWith('zh') ? 'zh' : 'en'
}

const LocaleContext = createContext(null)

export function LocaleProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang)

  const setLang = useCallback((l) => {
    if (!LOCALES[l]) return
    setLangState(l)
    localStorage.setItem(STORAGE_KEY, l)
  }, [])

  const t = useCallback((key, params) => {
    return translate(LOCALES[lang], key, params)
  }, [lang])

  return (
    <LocaleContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export default function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    // Fallback: return default en when used outside provider
    return { lang: 'en', setLang: () => {}, t: (k, p) => translate(LOCALES['en'], k, p) }
  }
  return ctx
}
