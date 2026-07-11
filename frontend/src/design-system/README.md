# Ledger design system

Ported from `/design system` at the repo root. This is the single source of visual truth for the frontend — new UI should be built from these tokens and components rather than one-off styles.

## Tokens

`tokens/index.css` imports `colors.css`, `typography.css`, `spacing.css`, `effects.css` and is loaded once via `src/index.css`. Always reference tokens (`var(--ink)`, `var(--space-7)`, `var(--radius-xl)`, etc.) instead of hardcoded values. See `/design system/readme.md` for the full rationale (warm paper palette, Newsreader/Hanken Grotesk pairing, no drop shadows except hero cards, no emoji).

## Components

Import from `src/design-system/components`:

- **Core** (ported 1:1 from `/design system/components/core`): `Button`, `Card`, `Badge`, `ProgressBar`, `StatCard`, `NavItem`.
- **Composed** (added here to support real pages/forms that the source kit didn't cover): `PageHeader`, `SectionHeader`, `EmptyState`, `TextField`, `Select`, `StatusBanner`, `SegmentedControl`. These follow the same tokens and visual rules as the core set.

Icons come from `lucide-react` (stroke icons only, per the design system spec — no emoji, no icon fonts).

## Layout classes

Shared page-layout utility classes (`.page`, `.stat-grid`, `.two-col`, `.list`, `.list-row`, `.form-grid`, `.chart-grid`, `.ds-table`, etc.) live in `src/index.css`. Reuse these for new pages before inventing new layout CSS.

## Adding a new component

1. Check `/design system/components/core` first — if it already exists there, port it here rather than rebuilding.
2. Otherwise, build it from tokens only (no new colors/spacing values), colocate a small `Name.css`, and export it from `components/index.js`.
