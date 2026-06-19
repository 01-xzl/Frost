import useLocale from '../hooks/useLocale'

export default function EmptyState({ hasTodos, searchActive }) {
  const { t } = useLocale()

  return (
    <li className="text-center text-white/40 text-sm py-6 select-none">
      {!hasTodos
        ? t('emptyNone')
        : searchActive
          ? t('emptyNoMatch')
          : t('emptyAllDone')}
    </li>
  )
}
