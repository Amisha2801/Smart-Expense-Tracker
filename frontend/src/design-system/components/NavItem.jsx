import './NavItem.css';

export function NavItem({ icon, label, active = false, onClick, as: Component, ...rest }) {
  if (Component) {
    return (
      <Component
        onClick={onClick}
        className={({ isActive }) => `ds-nav-item${isActive ? ' ds-nav-item--active' : ''}`}
        {...rest}
      >
        {icon}
        <span>{label}</span>
      </Component>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`ds-nav-item${active ? ' ds-nav-item--active' : ''}`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}
