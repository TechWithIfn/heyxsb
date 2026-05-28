/**
 * @param {object} props
 * @param {{ label: string, value: number }[]} props.data
 * @param {number} [props.width]
 * @param {number} [props.height]
 * @param {number} [props.minY]
 * @param {number} [props.maxY]
 * @param {string} [props.lineColor]
 */
export function LineChart({
  data = [],
  width = 480,
  height = 220,
  minY = 0,
  maxY = 100,
  lineColor = '#04AA6D',
}) {
  if (!data.length) {
    return (
      <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Complete a lesson quiz to see scores over time.
      </p>
    )
  }

  const padding = { top: 16, right: 16, bottom: 36, left: 44 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom
  const range = maxY - minY || 1

  const points = data.map((d, i) => {
    const x =
      padding.left +
      (data.length === 1 ? chartW / 2 : (i / (data.length - 1)) * chartW)
    const y =
      padding.top + chartH - ((d.value - minY) / range) * chartH
    return { x, y, ...d }
  })

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full max-w-full"
      role="img"
      aria-label="Line chart"
    >
      {[0, 25, 50, 75, 100].map((pct) => {
        const y = padding.top + chartH * (1 - (pct - minY) / range)
        return (
          <g key={pct}>
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
              {pct}%
            </text>
          </g>
        )
      })}

      <path
        d={areaPath}
        fill={lineColor}
        fillOpacity="0.12"
        className="dark:opacity-80"
      />
      <path
        d={linePath}
        fill="none"
        stroke={lineColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {points.map((p, i) => (
        <g key={i}>
          <circle
            cx={p.x}
            cy={p.y}
            r="5"
            fill="white"
            stroke={lineColor}
            strokeWidth="2"
            className="dark:fill-slate-900"
          >
            <title>
              {p.lessonTitle ?? p.label}: {p.value}%
            </title>
          </circle>
          {(i === 0 || i === points.length - 1 || points.length <= 6) && (
            <text
              x={p.x}
              y={height - 10}
              textAnchor="middle"
              className="fill-slate-600 text-[9px] dark:fill-slate-400"
            >
              {p.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}
