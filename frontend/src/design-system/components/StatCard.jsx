import './StatCard.css';

const TONE_COLOR = {
  positive: 'var(--pos)',
  negative: 'var(--neg)',
  neutral: 'var(--ink2)',
};

export function StatCard({ icon, label, value, tone = 'neutral', caption }) {
  return (
    <div className="ds-stat-card">
      <div className="ds-stat-card__label" style={{ color: TONE_COLOR[tone] }}>
        {icon}
        {label}
      </div>
      <div className="ds-stat-card__value">{value}</div>
      {caption && <div className="ds-stat-card__caption">{caption}</div>}
    </div>
  );
}
