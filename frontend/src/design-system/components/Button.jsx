import './Button.css';

/**
 * @param {{variant?: 'primary'|'secondary'|'ghost'|'danger', size?: 'sm'|'md'}} props
 */
export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  onClick,
  disabled,
  type = 'button',
}) {
  return (
    <button
      type={type}
      className={`ds-btn ds-btn--${variant} ds-btn--${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      {children}
    </button>
  );
}
