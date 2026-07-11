import './Card.css';

export function Card({ children, padding = '20px 22px', elevated = false, className = '', style = {} }) {
  return (
    <div
      className={`ds-card${elevated ? ' ds-card--elevated' : ''}${className ? ` ${className}` : ''}`}
      style={{ padding, ...style }}
    >
      {children}
    </div>
  );
}
