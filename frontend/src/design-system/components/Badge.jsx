import './Badge.css';

export function Badge({ tone = 'neutral', children }) {
  return <span className={`ds-badge ds-badge--${tone}`}>{children}</span>;
}
