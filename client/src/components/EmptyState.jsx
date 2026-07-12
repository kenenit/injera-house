export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="state-block" role="status">
      {Icon && <Icon size={40} strokeWidth={1.5} />}
      {title && <h3>{title}</h3>}
      {message && <p>{message}</p>}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  )
}
