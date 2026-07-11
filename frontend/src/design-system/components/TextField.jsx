import './Field.css';

export function TextField({ label, className = '', ...inputProps }) {
  const input = <input className={`ds-input${className ? ` ${className}` : ''}`} {...inputProps} />;

  if (!label) {
    return input;
  }

  return (
    <label className="ds-field">
      <span className="ds-field__label">{label}</span>
      {input}
    </label>
  );
}
