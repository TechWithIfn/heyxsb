import { motion } from 'framer-motion'

export function ProgressRing({ percent = 0, size = 96, strokeWidth = 10, color = '#10b981', label }) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size, color }}
    >
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-slate-200 dark:stroke-slate-800"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ transition: 'stroke-dashoffset 700ms ease-out' }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
          {clamped}%
        </span>
        {label ? <span className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{label}</span> : null}
      </div>
    </div>
  )
}
