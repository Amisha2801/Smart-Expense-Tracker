import React from 'react';

export function NavItem({ icon, label, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '11px 12px',
        borderRadius: 9,
        color: active ? 'var(--navactiveink)' : 'var(--ink2)',
        background: active ? 'var(--navactive)' : 'transparent',
        fontWeight: active ? 600 : 400,
        fontSize: 15,
        fontFamily: "'Hanken Grotesk', sans-serif",
        border: 'none',
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
      }}
    >
      {icon}
      {label}
    </button>
  );
}
