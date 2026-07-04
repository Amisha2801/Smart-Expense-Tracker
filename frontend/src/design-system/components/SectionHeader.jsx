import './SectionHeader.css';

export function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="ds-section-header">
      {icon && <div className="ds-section-header__icon">{icon}</div>}
      <div>
        <h2 className="ds-section-header__title">{title}</h2>
        {subtitle && <p className="ds-section-header__subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}
