export function SkeletonBlock({ width = '100%', height = 16, radius, style = {} }) {
  return <div className="skeleton" style={{ width, height, borderRadius: radius, ...style }} />
}

export function MenuCardSkeleton() {
  return (
    <div className="menu-card" aria-hidden="true">
      <SkeletonBlock height={200} radius={0} />
      <div className="menu-card-body">
        <SkeletonBlock height={18} width="70%" style={{ marginBottom: 10 }} />
        <SkeletonBlock height={13} width="95%" style={{ marginBottom: 6 }} />
        <SkeletonBlock height={13} width="60%" style={{ marginBottom: 16 }} />
        <SkeletonBlock height={40} radius={999} />
      </div>
    </div>
  )
}

export function TableRowSkeleton({ columns = 4 }) {
  return (
    <tr aria-hidden="true">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i}><SkeletonBlock height={14} width={i === 0 ? '80%' : '60%'} /></td>
      ))}
    </tr>
  )
}
