function StatusBadge({ status }) {
  return (
    <div className={`status-badge status-badge--${status}`}>
      <span className="status-badge__dot" />
      <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
    </div>
  )
}

export default StatusBadge
