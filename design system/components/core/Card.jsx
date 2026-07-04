import React from 'react';

export function Card({ children, padding = '20px 22px', elevated = false, style = {} }) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 14,
        padding,
        boxShadow: elevated ? 'var(--shadow)' : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
