import React from 'react';

export function Button({ variant = 'primary', size = 'md', icon, children, onClick, disabled }) {
  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';
  const pad = size === 'sm' ? '9px 14px' : '12px 18px';
  const fontSize = size === 'sm' ? 13 : 14;

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    border: 'none',
    borderRadius: 10,
    padding: pad,
    fontFamily: "'Hanken Grotesk', sans-serif",
    fontSize,
    fontWeight: 600,
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  };

  const styleByVariant = isPrimary
    ? { background: 'var(--btn)', color: 'var(--btnink)' }
    : isGhost
      ? { background: 'transparent', color: 'var(--ink2)', border: '1px solid var(--line)' }
      : { background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--line)' };

  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...styleByVariant }}>
      {icon}
      {children}
    </button>
  );
}
