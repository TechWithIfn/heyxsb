/**
 * @param {object} props
 * @param {{ label: string, value: number }[]} props.data
 * @param {number} [props.width]
 * @param {number} [props.height]
 * @param {string} [props.barColor]
 * @param {string} [props.valueSuffix]
 */
export function BarChart({
  data = [],
  width = 480,
  height = 220,
  barColor = '#04AA6D',
  valueSuffix = ' min',
}) {
  if (!data.length) {
    return (
      <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
        No data yet for this period.
      </p>
    )
  }

  const padding = { top: 16, right: 12, bottom: 36, left: 40 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom
  const maxVal = Math.max(...data.map((d) => d.value), 1)
  const barGap = 8
  const barWidth = (chartW - barGap * (data.length - 1)) / data.length

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full max-w-full"
      role="img"
      aria-label="Bar chart"
    >
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const y = padding.top + chartH * (1 - t)
        const val = Math.round(maxVal * t)
        return (
          <g key={t}>
            <line
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-700"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text
              x={padding.left - 6}
              y={y + 4}
              textAnchor="end"
              className="fill-slate-400 text-[10px] dark:fill-slate-500"
            >
              {val}
            </text>
          </g>
        )
      })}

      {data.map((d, i) => {
        const barH = (d.value / maxVal) * chartH
        const x = padding.left + i * (barWidth + barGap)
        const y = padding.top + chartH - barH
        return (
          <g key={d.label + i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={Math.max(barH, d.value > 0 ? 4 : 0)}
              rx="4"
              fill={barColor}
              className="opacity-90 transition-opacity hover:opacity-100"
            >
              <title>
                {d.label}: {d.value}
                {valueSuffix}
              </title>
            </rect>
            <text
              x={x + barWidth / 2}
              y={height - 10}
              textAnchor="middle"
              className="fill-slate-600 text-[10px] dark:fill-slate-400"
            >
              {d.label}
            </text>
            {d.value > 0 && (
              <text
                x={x + barWidth / 2}
                y={y - 4}
                textAnchor="middle"
                className="fill-slate-700 text-[9px] font-semibold dark:fill-slate-300"
              >
                {d.value}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
