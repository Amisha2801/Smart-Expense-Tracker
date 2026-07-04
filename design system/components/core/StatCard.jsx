import React from 'react';

export function StatCard({ icon, label, value, tone = 'neutral', caption }) {
  const toneColor = tone === 'positive' ? 'var(--pos)' : tone === 'negative' ? 'var(--neg)' : 'var(--ink2)';
  return (
    <div style={{ border: '1px solid var(--line)', borderRadius: 14, padding: '18px 20px', background: 'var(--surface)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: toneColor, fontSize: 13 }}>
        {icon}
        {label}
      </div>
      <div style={{ fontFamily: "'Newsreader', serif", fontWeight: 500, fontSize: 26, marginTop: 8, fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </div>
      {caption && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{caption}</div>}
    </div>
  );
}
