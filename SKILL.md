---
name: apple-ui
description: Apply a clean, Apple-inspired visual system to a Next.js + Tailwind project — SF-stack typography, muted neutrals with a single blue accent, generous whitespace, soft rounded corners (14–22px), layered shadow tiers, tabular numerics, and subtle motion. Use when the user asks for "Apple-like", "clean", "minimal", or "premium" UI on a web app.
---

# Apple-inspired UI system

A concrete design system for Next.js + Tailwind apps. Every value below is load-bearing — don't swap tokens for arbitrary ones. If you need something new, extend the scale rather than introducing a one-off.

## Philosophy — five rules

1. **Whitespace over decoration.** Remove, don't add. Borders and dividers are `#d2d2d7` at 60–70% opacity; shadows are the primary separator.
2. **One accent color.** Blue `#0071e3` only. No second color for "success" or "danger" CTAs — use tone chips (green/red backgrounds) for status, never for buttons.
3. **Typographic hierarchy carries the layout.** Large tracking-tight headings, muted supporting copy, tabular numerics for anything numeric. Never rely on bold + color to establish hierarchy.
4. **Softness, not flatness.** Borders are almost invisible; layered shadows imply elevation. Pure-flat design reads as "web", not "Apple".
5. **Motion is a confirmation, not a performance.** 150–220ms ease-out. Fade-in on mount, subtle active-state scale-down (0.98) on press. No bouncing, no long durations.

## Install

```bash
npm install clsx tailwind-merge lucide-react
```

## tailwind.config.ts

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system", "BlinkMacSystemFont",
          "SF Pro Display", "SF Pro Text",
          "Helvetica Neue", "Inter", "system-ui", "sans-serif",
        ],
      },
      colors: {
        ink: { DEFAULT: "#1d1d1f", muted: "#6e6e73", soft: "#86868b" },
        surface: { DEFAULT: "#ffffff", muted: "#f5f5f7", sunken: "#fbfbfd" },
        line: "#d2d2d7",
        accent: { DEFAULT: "#0071e3", hover: "#0077ed" },
      },
      borderRadius: { xl: "14px", "2xl": "18px", "3xl": "22px" },
      boxShadow: {
        card:  "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
        float: "0 4px 16px rgba(0,0,0,0.06), 0 20px 48px rgba(0,0,0,0.08)",
      },
      keyframes: {
        "fade-in": {
          "0%":   { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: { "fade-in": "fade-in 200ms ease-out" },
    },
  },
};
export default config;
```

## globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { --bg: #fbfbfd; --ink: #1d1d1f; }

html, body {
  background: var(--bg);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: "ss01", "cv11";
  letter-spacing: -0.01em;
}

::selection { background: rgba(0, 113, 227, 0.18); }

/* macOS-style scrollbars */
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.18);
  border-radius: 999px;
  border: 2px solid transparent;
  background-clip: padding-box;
}
::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.3); background-clip: padding-box; }
::-webkit-scrollbar-track { background: transparent; }

.glass {
  background: rgba(255,255,255,0.72);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
}
```

## Design tokens — the scale

| Token                  | Value                 | Use                                                |
| ---------------------- | --------------------- | -------------------------------------------------- |
| `bg-surface-sunken`    | `#fbfbfd`             | App-wide canvas                                    |
| `bg-surface`           | `#ffffff`             | Cards, popovers, modals — elevated surfaces        |
| `bg-surface-muted`     | `#f5f5f7`             | Hover states, subtle rows, secondary button bg     |
| `text-ink`             | `#1d1d1f`             | Primary text, headings                             |
| `text-ink-muted`       | `#6e6e73`             | Secondary text, captions, labels                   |
| `text-ink-soft`        | `#86868b`             | Metadata, timestamps, placeholder                  |
| `border-line`          | `#d2d2d7`             | Dividers, input borders — often at `/60` or `/70`  |
| `bg-accent`            | `#0071e3`             | Primary CTAs, active nav, links, focus rings       |
| `shadow-card`          | two-layer soft        | Standard card elevation                            |
| `shadow-float`         | two-layer deep        | Modals, popovers                                   |
| `rounded-xl`           | 14px                  | Buttons, inputs, rows                              |
| `rounded-2xl`          | 18px                  | Cards, badges container                            |
| `rounded-3xl`          | 22px                  | Modals, hero elements                              |

## Typography scale

Pair tracking-tight with size. Smaller sizes use native tracking.

| Role                    | Class                                                |
| ----------------------- | ---------------------------------------------------- |
| Page title (H1)         | `text-[32px] font-semibold tracking-tight leading-tight` |
| Card title (H3)         | `text-[15px] font-semibold` (or `[17px]` for emphasis) |
| Stat/metric value       | `text-[22px]`–`[28px] font-semibold tracking-tight tabular-nums` |
| Body                    | `text-sm` (14px) or `text-[13px]`                    |
| Caption / metadata      | `text-[12px] text-ink-muted`                         |
| Micro (timestamps, ids) | `text-[11px] text-ink-soft`                          |
| Section label (allcaps) | `text-[12px] font-semibold uppercase tracking-wider text-ink-muted` |

Always use `tabular-nums` for: currency, counts, durations, percentages, anything in a column.

## Component patterns

### `cn()` utility

```ts
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
```

### Button

Four variants: `primary` (accent), `secondary` (bordered), `ghost` (hover-only), `danger` (red). Three sizes. Always include `active:scale-[0.98]` on filled variants.

```tsx
const variants = {
  primary: "bg-accent text-white hover:bg-accent-hover active:scale-[0.98] shadow-sm",
  secondary: "bg-surface text-ink border border-line hover:bg-surface-muted active:scale-[0.98]",
  ghost: "text-ink hover:bg-surface-muted",
  danger: "bg-red-500 text-white hover:bg-red-600 active:scale-[0.98]",
};
const sizes = {
  sm: "h-8 px-3 text-[13px] rounded-lg",
  md: "h-10 px-4 text-sm rounded-xl",
  lg: "h-12 px-6 text-[15px] rounded-2xl",
};
```

### Card

```tsx
<div className="bg-surface rounded-2xl border border-line/70 shadow-card">
  <div className="px-6 pt-5 pb-3">
    <h3 className="text-[15px] font-semibold text-ink">Title</h3>
    <p className="text-[13px] text-ink-muted mt-1">Supporting copy</p>
  </div>
  <div className="px-6 pb-6">{/* body */}</div>
</div>
```

### Input / Textarea / Select

```tsx
"h-10 w-full rounded-xl border border-line bg-surface px-3 text-sm text-ink placeholder:text-ink-soft
 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
```

### Badge (tonal chips)

Six tones — `neutral`, `blue`, `green`, `amber`, `red`, `violet`. Use tailwind's `-50` backgrounds with `-700` text for a muted, non-shouting chip.

```ts
const tones = {
  neutral: "bg-surface-muted text-ink-muted",
  blue:    "bg-blue-50 text-blue-700",
  green:   "bg-emerald-50 text-emerald-700",
  amber:   "bg-amber-50 text-amber-700",
  red:     "bg-red-50 text-red-700",
  violet:  "bg-violet-50 text-violet-700",
};
// rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-tight
```

### Avatar

Initials on a solid color. Per-user color stays consistent. Use `ring-2 ring-surface` for overlap stacks.

### Modal

Backdrop: `bg-black/30 backdrop-blur-sm`. Panel: `rounded-3xl shadow-float border border-line/60`. Header title `text-[17px]`, sticky footer with `bg-surface-sunken` and border-top.

### Progress bar

```tsx
<div className="h-1.5 w-full rounded-full bg-surface-muted overflow-hidden">
  <div className="h-full bg-accent rounded-full transition-all duration-500"
       style={{ width: `${value}%` }} />
</div>
```

### Empty state

Centered, generous padding (`py-16`), muted icon from `lucide-react` at 32px, one-line title + one-line description, optional single action button.

## Layout patterns

### Dashboard shell

Two-column: fixed 256px sidebar (`w-64`) + flexible main. Content width capped at `max-w-6xl`, centered, with `px-8 py-10`.

**Sidebar:**
- `glass` utility class + `sticky top-0 h-screen`, right border `line/70`
- Logo lockup: 32×32 `rounded-xl` dark square with icon + brand text
- Nav items: `px-3 py-2 rounded-xl text-[13px]`
  - Active: `bg-surface shadow-sm border border-line/60`, icon in `text-accent`
  - Inactive: `text-ink-muted hover:bg-surface hover:text-ink`
- Profile card pinned to bottom inside a bordered `rounded-xl`

### Page header

```tsx
<div className="flex items-start justify-between mb-8 gap-4">
  <div>
    <h1 className="text-[32px] font-semibold tracking-tight leading-tight">Title</h1>
    <p className="text-[15px] text-ink-muted mt-1.5">Description</p>
  </div>
  {action && <div className="shrink-0">{action}</div>}
</div>
```

### Stat card

```tsx
<Card>
  <CardBody className="pt-5">
    <div className="flex items-center gap-2 text-ink-muted mb-3">
      {icon}<span className="text-[12px] font-medium">{label}</span>
    </div>
    <div className="text-[28px] font-semibold tracking-tight tabular-nums">{value}</div>
    {hint && <div className="text-[12px] text-ink-muted mt-1">{hint}</div>}
  </CardBody>
</Card>
```

### List in card

Divide rows with `divide-y divide-line/60`. Row height ≥ 56px (`px-5 py-3.5` minimum). Use flex with `gap-4`, `flex-1 min-w-0` on the main content column, right-aligned numerics with fixed widths like `w-20 text-right` to keep columns aligned.

## Chart styling (recharts)

Neutralize the default look. Hide axes, add horizontal-only gridlines, round bar tops, use the accent for all single-series charts.

```tsx
<CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
<XAxis stroke="#86868b" fontSize={12} tickLine={false} axisLine={false} />
<YAxis stroke="#86868b" fontSize={12} tickLine={false} axisLine={false} />
<Tooltip contentStyle={{
  background: "white",
  border: "1px solid #d2d2d7",
  borderRadius: 12,
  fontSize: 12,
}} />
<Bar dataKey="value" fill="#0071e3" radius={[8, 8, 0, 0]} />
```

For area charts, define a vertical gradient from `#0071e3` at 0.3 opacity to 0.

For pie charts, use `innerRadius={48} outerRadius={80} paddingAngle={3}` — creates space between slices without cartoonish gaps.

## Motion

- `animate-fade-in` on route content mount (`<main>` inner div)
- `transition` on every interactive element — defaults to 150ms, that's fine
- Press feedback: `active:scale-[0.98]` on filled buttons only
- **Don't** animate layout shifts or non-essential elements

## Icons

Use `lucide-react` exclusively. Sizes: 12 (inline), 14 (in buttons), 16 (nav), 18 (section headers), 32 (empty states). Stroke weight stays default (1.5).

## Anti-patterns — do not do these

- Gradient backgrounds on cards (breaks the calm)
- Multiple accent colors in the same view
- Heavy borders (`border-2`, `border-gray-900`) — stick with `border-line`
- Drop shadows with visible blur on individual text elements
- Emoji in UI chrome (fine in user-generated content)
- Fixed pixel widths on containers — max-width + padding only
- Using `font-bold` — the system stops at `font-semibold` (600)
- Hard black (`#000`) — always `#1d1d1f`
- Pure white cards on pure white bg — use the sunken canvas underneath

## Reference implementation

This workspace implements the full system:

- Tokens: [tailwind.config.ts](tailwind.config.ts), [app/globals.css](app/globals.css)
- Primitives: [components/ui/](components/ui/) — button, card, input, badge, avatar, modal, progress, empty
- Shell: [components/dashboard-shell.tsx](components/dashboard-shell.tsx)
- Charts: [app/admin/analytics/page.tsx](app/admin/analytics/page.tsx)

When asked to replicate this look elsewhere, start by copying `tailwind.config.ts`, `globals.css`, and `lib/utils.ts` — those three files define the system. Components are derivative.
