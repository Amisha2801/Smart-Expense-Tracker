Solid/secondary/ghost action button, used for "Log expense", modal save/cancel, and filter actions.

```jsx
<Button variant="primary" icon={<i data-lucide="plus" />}>Log expense</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost" size="sm">View all</Button>
```

Variants: `primary` (solid `--btn`/`--btnink`, used for the main call to action per screen), `secondary` (surface + hairline, used in modal footers), `ghost` (transparent + hairline, rare). Sizes: `md` default, `sm` for compact contexts.
