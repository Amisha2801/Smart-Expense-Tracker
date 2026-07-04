import './EmptyState.css';

export function EmptyState({ icon, children, action }) {
  return (
    <div className="ds-empty-state">
      {icon && <div className="ds-empty-state__icon">{icon}</div>}
      <p>{children}</p>
      {action}
    </div>
  );
}
