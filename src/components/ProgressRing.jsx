export default function ProgressRing({ progress, size = 52, stroke = 3 }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - progress)

  return (
    <svg
      width={size}
      height={size}
      className="shrink-0"
      viewBox={`0 0 ${size} ${size}`}
    >
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        className="text-white/15"
      />
      {/* Progress arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className={`transition-[stroke-dashoffset] duration-500 ease-out
          ${progress >= 1 ? 'text-emerald-400' : 'text-white/80'}`}
        style={{
          transform: 'rotate(-90deg)',
          transformOrigin: 'center',
        }}
      />
      {/* Center text */}
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className={`text-xs font-medium fill-current
          ${progress >= 1 ? 'text-emerald-400' : 'text-white/80'}`}
      >
        {Math.round(progress * 100)}%
      </text>
    </svg>
  )
}
