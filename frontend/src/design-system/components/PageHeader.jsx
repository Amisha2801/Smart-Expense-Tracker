import './PageHeader.css';

export function PageHeader({ eyebrow, title, subtitle, action }) {
  return (
    <header className="ds-page-header">
      <div>
        {eyebrow && <div className="ds-page-header__eyebrow">{eyebrow}</div>}
        <h1 className="ds-page-header__title">{title}</h1>
        {subtitle && <p className="ds-page-header__subtitle">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}
