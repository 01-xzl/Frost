export default function EmptyState({ hasTodos, searchActive }) {
  return (
    <li className="text-center text-white/40 text-sm py-6 select-none">
      {!hasTodos
        ? 'Nothing yet — add one above ☝'
        : searchActive
          ? 'No match'
          : 'All done! 🎉'}
    </li>
  )
}
