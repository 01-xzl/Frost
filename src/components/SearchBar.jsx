import { forwardRef } from 'react'

const SearchBar = forwardRef(function SearchBar({ value, onChange }, ref) {
  return (
    <input
      ref={ref}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search…"
      className="w-full px-4 py-2 mb-4 rounded-xl bg-white/10 border border-white/20
                 text-white placeholder-white/50 outline-none
                 focus:border-white/40 focus:bg-white/15 transition-all text-sm"
    />
  )
})

export default SearchBar
