import './Field.css';

export function Select({ label, className = '', children, ...selectProps }) {
  const select = (
    <select className={`ds-select${className ? ` ${className}` : ''}`} {...selectProps}>
      {children}
    </select>
  );

  if (!label) {
    return select;
  }

  return (
    <label className="ds-field">
      <span className="ds-field__label">{label}</span>
      {select}
    </label>
  );
}
