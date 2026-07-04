# Ledger Design System

Extracted from two prototype explorations of a personal finance / expense-tracker product called **Ledger**:

- `Smart Expense Tracker - Paper Ledger.dc.html` — the full multi-page app (Dashboard, Transactions, Budget, Reports, Accounts, Categories, Login/Signup, Add-expense modal), light + dark theme, and the direction this system codifies.
- `Smart Expense Tracker - Concepts.dc.html` — three early Dashboard-only explorations (Paper Ledger / Envelopes / Cockpit). Kept for reference only; **Paper Ledger** is the direction this system is built from.

No external codebase, Figma file, or brand kit was attached — everything below is reverse-engineered from those two HTML files.

## Index
- `styles.css` — import entrypoint (imports everything in `tokens/`)
- `tokens/colors.css` — light/dark surface, ink, semantic, and category-color tokens
- `tokens/typography.css` — font families (Newsreader, Hanken Grotesk, JetBrains Mono) + type scale
- `tokens/spacing.css` — spacing scale, radii, page container widths
- `tokens/effects.css` — border/shadow/motion tokens
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing)
- `components/core/` — Button, Card, ProgressBar, Badge, StatCard, NavItem
- `ui_kits/ledger-app/` — Dashboard screen recreation

## Product context
Ledger is an envelope-budgeting expense tracker: users assign every dollar to a category "envelope," log transactions in two taps, and see a single "safe to spend" figure derived from budget minus spend. Core surfaces: Dashboard, Transactions ledger, Budget (envelope groups), Reports (category donut + income/spend trend), Accounts, Categories, and auth screens.

## Content fundamentals
- Voice is warm but plain-spoken and calm — no exclamation points, no forced enthusiasm. E.g. "Money, minus the anxiety," "Give every dollar a job."
- Second person in marketing copy ("watch your envelopes fill"), first-person-adjacent in-product ("Good morning, Aakriti" — greets the user by name).
- Numbers are always precise to the cent and use `tabular-nums` so columns of figures align.
- No emoji anywhere in the Paper Ledger direction (the rejected "Envelopes" concept used one 👋, which this system does not carry forward).
- Section labels are short nouns ("Recent transactions", "This month's envelopes") not full sentences.

## Visual foundations
- **Palette**: warm paper neutrals (`--bg #f4f1ea`, `--surface #fbfaf6`) in light mode; warm near-black surfaces in dark mode. No blue-gray or cool grays — everything is warmed slightly toward brown/cream.
- **Type**: Newsreader (serif) for all headings, hero figures, and dollar amounts by default — it's the "voice" of the brand. Hanken Grotesk (sans) for all UI chrome — nav, buttons, labels, table cells. JetBrains Mono is an alternate figure style users can opt into (a "figureStyle" toggle switches every dollar amount from serif to mono).
- **Category color system**: 8 fixed hues (one per spending category — groceries, dining, transport, shopping, fun, housing, utilities, subscriptions), reused identically as dot markers, chart wedges, progress-bar fills, and icon tints. Never mixed or reassigned.
- **Cards**: 1px hairline border (`--line`) + 14–16px radius is the default card treatment — no drop shadows. The single soft warm shadow (`--shadow`) is reserved for the one hero/banner card per page (the "safe to spend" card, net-worth banner, modal).
- **Progress bars**: thin (5–6px), fully rounded, category-colored; flip to `--neg` red and clamp to 100% width when over budget.
- **Buttons**: solid ink-fill primary button (`--btn`/`--btnink`) is the only strong-contrast surface on the page; secondary/cancel actions are just a hairline-bordered surface button.
- **Motion**: minimal — a 1px hover lift + soft shadow on the primary button only (`translateY(-1px)`, 120–180ms). No bounce, no spring easing.
- **Layout**: fixed 258px sidebar + fluid main column capped at 1180px max-width; consistent `34px 44px 60px` page padding.
- **Dark mode**: every surface/ink/semantic/category token has a dark-theme counterpart — the palette relationships (warm neutrals, same 8 category hues brightened) hold across both themes.
- **No imagery**: the product uses no photography or illustration — every visual is typographic, iconographic, or a CSS chart (conic-gradient donuts, div-based bar charts).

## Iconography
- **Lucide** (`unpkg.com/lucide@latest`), stroke icons only, loaded from CDN — no custom SVGs, no icon font, no emoji. Standard sizes: 16–17px inline with text, 20–22px for standalone tiles/avatars.
- Icons are always tinted with a semantic or category token color (never a hardcoded hex), typically inside a small rounded-square or circular chip using `--surface2` or a semantic `*bg` token as the chip fill.

## Intentional additions
None of the components above are inventions — Button, Card, ProgressBar, Badge, StatCard, and NavItem are all patterns that repeat verbatim across the source file's six pages and two auth screens.

## Caveats / asks
- No logo mark exists in the source — the wordmark "Ledger" in Newsreader semibold next to a solid wallet icon *is* the mark. If a real logo exists, please attach it.
- Fonts are loaded from Google Fonts CDN (no local font files were provided).
- The two rejected Concepts directions (Envelopes, Cockpit) are **not** represented in tokens/components — only Paper Ledger. Say the word if you'd like either explored as an alternate theme.
- This system covers the Dashboard in the UI kit; Transactions/Budget/Reports/Accounts/Categories/Auth/Modal all exist in the source `.dc.html` and can be added as further UI-kit screens on request.
