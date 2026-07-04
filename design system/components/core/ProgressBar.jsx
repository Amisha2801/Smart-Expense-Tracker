import React from 'react';

export function ProgressBar({ value, max, color = 'var(--ink)', overColor = 'var(--neg)', height = 5 }) {
  const pct = Math.min(100, (value / max) * 100);
  const over = value > max;
  return (
    <div style={{ height, borderRadius: 4, background: 'var(--track)' }}>
      <div
        style={{
          width: `${pct}%`,
          height: '100%',
          borderRadius: 4,
          background: over ? overColor : color,
        }}
      />
    </div>
  );
}
