import React from 'react';

export function Badge({ tone = 'positive', children }) {
  const map = {
    positive: { bg: 'var(--posbg)', fg: 'var(--pos)' },
    neutral: { bg: 'var(--surface2)', fg: 'var(--muted)' },
    negative: { bg: 'var(--negbg)', fg: 'var(--neg)' },
  };
  const c = map[tone] || map.neutral;
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 600,
        padding: '3px 9px',
        borderRadius: 100,
        background: c.bg,
        color: c.fg,
      }}
    >
      {children}
    </span>
  );
}
