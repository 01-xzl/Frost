export default function QuoteDisplay({ quote, onRefresh }) {
  return (
    <div className="text-center px-2 py-3 group">
      <p className="text-white/35 text-xs leading-relaxed italic transition-colors duration-300 group-hover:text-white/55">
        "{quote.text}"
      </p>
      <div className="flex items-center justify-center gap-2 mt-1">
        <span className="text-white/20 text-[10px]">
          — {quote.author}
        </span>
        <button
          onClick={onRefresh}
          className="text-white/15 hover:text-white/50 text-[10px] cursor-pointer
                     transition-colors duration-200"
          title="New quote"
        >
          ↻
        </button>
      </div>
    </div>
  )
}
