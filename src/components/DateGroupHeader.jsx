export default function DateGroupHeader({ label }) {
  return (
    <li className="sticky top-0 z-10 pt-2 pb-1 px-1">
      <span className="text-[11px] font-medium text-white/40 uppercase tracking-wider">
        {label}
      </span>
    </li>
  )
}
