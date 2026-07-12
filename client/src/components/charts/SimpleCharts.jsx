// Minimal, dependency-free SVG charts. Since this environment has no
// network access to install recharts/chart.js, these hand-rolled
// components cover the "Orders per Day" / "Sales per Week" /
// "Popular Categories" visualizations from the spec.

export function BarChart({ data, valueKey = 'value', labelKey = 'label', color = 'var(--gold)', height = 200, formatValue = (v) => v }) {
  if (!data || data.length === 0) {
    return <p style={{ color: 'var(--muted)', fontSize: 14 }}>Not enough data yet.</p>
  }
  const max = Math.max(...data.map((d) => Number(d[valueKey])), 1)
  const barWidth = 100 / data.length

  return (
    <div>
      <svg viewBox={`0 0 100 ${height}`} width="100%" height={height} preserveAspectRatio="none" role="img" aria-label="Bar chart">
        {data.map((d, i) => {
          const value = Number(d[valueKey])
          const barHeight = (value / max) * (height - 28)
          const x = i * barWidth + barWidth * 0.18
          const w = barWidth * 0.64
          return (
            <g key={i}>
              <rect
                x={x}
                y={height - 20 - barHeight}
                width={w}
                height={barHeight}
                rx="1.2"
                fill={color}
                opacity="0.9"
              >
                <title>{`${d[labelKey]}: ${formatValue(value)}`}</title>
              </rect>
            </g>
          )
        })}
      </svg>
      <div style={{ display: 'flex', marginTop: 6 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 11, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 2px' }}>
            {d[labelKey]}
          </div>
        ))}
      </div>
    </div>
  )
}

export function LineChart({ data, valueKey = 'value', labelKey = 'label', color = 'var(--clay)', height = 200, formatValue = (v) => v }) {
  if (!data || data.length === 0) {
    return <p style={{ color: 'var(--muted)', fontSize: 14 }}>Not enough data yet.</p>
  }
  const max = Math.max(...data.map((d) => Number(d[valueKey])), 1)
  const stepX = data.length > 1 ? 100 / (data.length - 1) : 100
  const points = data.map((d, i) => {
    const x = data.length > 1 ? i * stepX : 50
    const y = height - 24 - (Number(d[valueKey]) / max) * (height - 40)
    return { x, y, value: Number(d[valueKey]), label: d[labelKey] }
  })
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${path} L ${points[points.length - 1].x} ${height - 20} L ${points[0].x} ${height - 20} Z`

  return (
    <div>
      <svg viewBox={`0 0 100 ${height}`} width="100%" height={height} preserveAspectRatio="none" role="img" aria-label="Line chart">
        <path d={areaPath} fill={color} opacity="0.1" />
        <path d={path} fill="none" stroke={color} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.6" fill={color}>
            <title>{`${p.label}: ${formatValue(p.value)}`}</title>
          </circle>
        ))}
      </svg>
      <div style={{ display: 'flex', marginTop: 6 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 11, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 2px' }}>
            {d[labelKey]}
          </div>
        ))}
      </div>
    </div>
  )
}
