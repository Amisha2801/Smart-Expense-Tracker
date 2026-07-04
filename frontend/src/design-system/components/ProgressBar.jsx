import './ProgressBar.css';

export function ProgressBar({ value, max, color = 'var(--ink)', overColor = 'var(--neg)', height = 5 }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const over = value > max;

  return (
    <div className="ds-progress-track" style={{ height }}>
      <div
        className="ds-progress-fill"
        style={{ width: `${pct}%`, background: over ? overColor : color }}
      />
    </div>
  );
}
