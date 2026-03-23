# DESIGN.md — TransformAZ Design System

Inferred from the Taylor Group Interactive Pitch implementation. This document codifies the design language used across client-facing interactive deliverables.

---

## Classification

**HYBRID** — Editorial scrolling pitch (marketing/landing page qualities) with interactive app-like sections (chatbot, tabbed panels, expandable content, SVG visualizations).

---

## Typography

### Font Stack

| Role | Family | Weight(s) | CSS Variable | Notes |
|------|--------|-----------|--------------|-------|
| Headings | Source Serif 4 | 300, 400, 600, 700 | `--serif` | Optical size 8–60. Italic for subtitles. |
| Body | Inter | 400, 500, 600 | `--sans` | `font-feature-settings: 'cv01','cv02','ss01'` required. |
| Data/Mono | JetBrains Mono | 500, 600, 700 | `--mono` | Used for section labels, stat values, tags, badges, metadata. |

### Type Scale — 1.25 Major Third

| Token | Size | Typical Use |
|-------|------|-------------|
| `--text-3xs` | 0.52rem | Severity tags, meta labels |
| `--text-2xs` | 0.64rem | Section numbers, tab labels, table headers |
| `--text-xs` | 0.80rem | Dim tags, timeline labels, sidebar nav |
| `--text-sm` | 0.875rem | Card body text, sidebar links, badges |
| `--text-base` | 1.00rem | Body text, list items |
| `--text-lg` | 1.125rem | Timeline year labels, CBE panel subtitles |
| `--text-xl` | 1.25rem | Section h4, phase card headings |
| `--text-2xl` | 1.563rem | Section h3, CTA headings, interstitial (mobile) |
| `--text-3xl` | 1.953rem | Section h2 (mobile), stat card values |
| `--text-4xl` | 2.441rem | Section h2 (desktop), interstitial text |
| `--text-5xl` | 3.052rem | Cover h1 |

**Rule:** Never use hardcoded `font-size` values — always use a `--text-*` token.

### Typography Patterns

- **Section numbers:** `--mono`, `--text-xs`, `font-weight:600`, `text-transform:uppercase`, `letter-spacing:.15em`, `color:var(--accent)`
- **Section headings (h2):** `--serif`, `--text-4xl`, `font-weight:700`, `line-height:1.1`, `letter-spacing:-.03em`, centered
- **Body text:** `--sans`, `--text-base`, `line-height:1.75`, `color:var(--text-secondary)`
- **Mono labels/tags:** `--mono`, `--text-2xs` or `--text-3xs`, `font-weight:600–700`, `text-transform:uppercase`, `letter-spacing:.08–.14em`
- **Interstitial quotes:** `--serif`, `--text-4xl`, `font-weight:300`, `line-height:1.3`, `letter-spacing:-.02em`

---

## Color System

### Core Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#fcfcfa` | Page background |
| `--bg-warm` | `#f7f6f3` | Warm surface (boxes, tab bg) |
| `--bg-white` | `#ffffff` | Card backgrounds |
| `--text` | `#18181b` | Primary text, headings |
| `--text-secondary` | `#52525b` | Body text, descriptions |
| `--text-tertiary` | `#a1a1aa` | Metadata, hints, placeholders |

### Accent Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--accent` | `#7A7AE6` | Client-facing accent (purple). Brand color. |
| `--accent-light` | `#ededfc` | Accent background tints |
| `--accent-dark` | `#5a5abf` | Accent hover/emphasis |
| `--accent-glow` | `rgba(122,122,230,.18)` | Radial glow effects (CTA) |
| `--gradient` | `linear-gradient(135deg,#7A7AE6,#a78bfa,#60a5fa)` | Progress bar, gradient accents |

### Semantic Colors

| Token | Value | Background Token | Usage |
|-------|-------|------------------|-------|
| `--green` | `#1a9959` | `--green-bg` `#ecfdf5` | People & Culture, Build phase, positive |
| `--blue` | `#2563eb` | `--blue-bg` `#eff6ff` | Processes, Create phase, informational |
| `--amber` | `#b45309` | `--amber-bg` `#fffbeb` | Data, Execute phase, warnings |
| `--red` | `#dc2626` | `--red-bg` `#fef2f2` | Compliance, high severity |

### Borders

| Token | Value | Usage |
|-------|-------|-------|
| `--border` | `#e4e4e7` | Default borders |
| `--border-light` | `#f0f0f2` | Subtle borders, dividers |

### Color Rules

- **Client-facing accent:** `#7A7AE6` (purple) — per CLAUDE.md
- **Internal docs accent:** `#c0392b` (red) — visually distinguishes internal from client-facing
- **Selection:** `::selection { background: var(--accent); color: #fff }`
- **Never use** default purple-on-white without the gradient/glow treatment — it needs warmth

---

## Layout

### Widths

| Token | Value | Usage |
|-------|-------|-------|
| `--content-w` | `960px` | Single content column |
| `--sidebar-w` | `220px` | Fixed sidebar width |

### Section Structure

```
.section {
  min-height: 100vh;
  padding: 100px 48px;
  max-width: var(--content-w);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
```

**Rule:** Never use breakout layout (`margin-left:50%; transform:translateX(-50%)`) with a sidebar — it centers relative to parent, not viewport, causing asymmetry.

### Grid Patterns

| Component | Desktop | Tablet (≤1024px) | Mobile (≤768px) |
|-----------|---------|-------------------|-----------------|
| Stats grid | `repeat(4, 1fr)` | `repeat(2, 1fr)` | `1fr 1fr` |
| Findings grid | `repeat(2, 1fr)` | `repeat(2, 1fr)` | `1fr` |
| Phases grid | `repeat(3, 1fr)` | `repeat(3, 1fr)` | `1fr` |
| Horizons grid | `repeat(3, 1fr)` | `repeat(3, 1fr)` | `1fr` |
| CBE grid | `repeat(2, 1fr)` | `repeat(2, 1fr)` | `1fr` |
| Competitor grid | `repeat(3, 1fr)` | `repeat(3, 1fr)` | `1fr` |

---

## Components

### Card System

All cards share: `border-radius: 14px`, `border: 1px solid var(--border-light)`, `background: var(--bg-white)`.

| Card Type | Accent Pattern | Interactive? | Hover Effect |
|-----------|---------------|-------------|--------------|
| `stat-card` | `::after` gradient top bar (3px) | No | `translateY(-3px)` + elevated shadow |
| `finding-card` | `border-left: 3px solid var(--accent)` | Yes (expand/collapse) | `translateY(-2px)` + shadow + 3D tilt |
| `phase-card` | `::before` colored top bar (3px) | Yes (expand/collapse) | Shadow + 3D tilt |
| `horizon-card` | `::before` gradient top bar (3px) | No | Shadow elevation |
| `cbe-card` | `::before` left bar (3px) | No | Subtle border + shadow |
| `pillar-card` | `::before` left bar (3px) | No | — |
| `competitor-card` | `border-left: 3px solid` | No | `translateY(-2px)` + shadow |

### Box System (Callouts)

`.box` base: `padding: 18px 22px`, `border-radius: 10px`, `border-left: 3px solid`, `background: var(--bg-warm)`.

Variants: `--accent`, `--amber`, `--blue`, `--green`, `--red` — each sets `border-color` and `background` to the semantic color pair.

### Value Proposition Block

`.value-prop`: `border: 1px solid rgba(122,122,230,.15)`, `border-radius: 14px`, accent-light background, `::before` gradient top line.

### CTA Block

`.cta-box`: Centered, `border-radius: 18px`, accent border, radial glow animation, gradient top bar.

---

## Animation System

### Easing Curves

| Token | Value | Usage |
|-------|-------|-------|
| `--ease` | `cubic-bezier(.4,0,.2,1)` | Standard transitions |
| `--ease-out` | `cubic-bezier(0,0,.2,1)` | Exit/reveal animations |

### Scroll Animations

- **`.anim` class:** `opacity:0 → 1`, `translateY(28px → 0)`, `700ms` with `--ease`. Triggered by IntersectionObserver at low thresholds (0.05–0.15).
- **Staggered delays:** Via `style="--d:.Xs"` on elements. Increments of ~0.05–0.1s.

### Scroll-Reveal Text

- **Pattern:** Each paragraph gets `.scroll-reveal`. All paragraphs in a section are grouped into one continuous word stream.
- **Effect:** opacity `0.55 → 1`, `150ms` transition, **NO blur**. Reading must be practically immediate.
- **Trigger:** Scroll position-based (not IntersectionObserver).

### Expand/Collapse

- **Always use** `max-height` + `opacity` CSS transitions. Never `display:none/block`.
- `max-height: 0 → 600–2000px`, `opacity: 0 → 1`, duration `400–600ms`.

### Cover Animations

1. Logo fade-in: `0.8s` delay `0.3s`
2. Rule fade-in: `0.6s` delay `0.5s`
3. Word reveal: blur+translateY, staggered `0.12s` per word starting at `0.6s`
4. Subtitle: fade-in delay `1.3s`
5. Meta grid: fade-in delay `1.6s`
6. Badge: fade-in delay `1.9s`
7. Scroll hint: fade-in delay `2.4s`

### Interaction Feedback

- **Card hover:** `translateY(-2px)` + elevated `box-shadow`
- **3D tilt:** `transform-style: preserve-3d; perspective: 800px` — JS-driven mouse tracking
- **Button hover:** `translateY(-2px)` + colored shadow spread

---

## Interactive Patterns

### Sidebar Navigation

- Fixed left sidebar, `220px` wide, frosted glass (`backdrop-filter: blur(20px) saturate(1.4)`)
- Active state: accent color + left border + background tint
- Tracking: scroll-based `offsetTop` comparison (not IntersectionObserver — fails on tall sections)
- Mobile: hamburger toggle at `≤1024px`, slide-in with overlay

### CBE Diagram (Create → Build → Execute)

- Lives in Section 04 (Digital Backbone). Never duplicate in Section 05.
- Flow phases double as navigation for expandable content panels below.
- Active phase: top bar thickens (3px → 4px), accent border, elevated shadow.
- Backbone bar below with shimmer animation.

### Backbone SVG Visualization

- SVG (not Canvas) — bezier curves, gradient nodes, `<animateMotion>` particles
- Hover highlighting via CSS classes set by JS on SVG root
- Printable, accessible. Hide particles in print and reduced-motion.

### Typewriter (Interstitials)

- Full-screen editorial pauses with typewriter text reveal
- Ghost vertical line on left (`::before`, 15% from left, accent color at 15% opacity)
- Blinking cursor animation

### Tay Chatbot

- Floating action button (56x56, bottom-right, breathing animation)
- Chat panel: 380px wide, 640px max-height, frosted glass appearance
- Message bubbles: bot (accent-light bg, left-aligned), user (warm bg, right-aligned)
- Typing indicator: 3 bouncing dots
- Suggestion pills below messages

---

## Accessibility

### Implemented

- `prefers-reduced-motion: reduce` → disables all animations
- `focus-visible` outlines on interactive cards
- `role="button"`, `tabindex="0"`, `aria-expanded` on expandable cards
- `role="tab"`, `aria-selected` on tab components
- Hamburger: `aria-label`, `aria-expanded`
- Decorative elements: `aria-hidden="true"`

### Known Gaps

- No skip-to-content link
- Chat send button touch target is 34x34px (below 44px WCAG minimum)
- No `aria-live` region on chatbot messages
- Tab panels lack `role="tabpanel"` and `aria-labelledby`

---

## Print Styles

- Hide: sidebar, hamburger, progress bar, scroll hint, gradient mesh, chatbot, particles
- Remove margins: `.main { margin-left: 0 }`
- Reveal all hidden content: expanded details, Gantt bars at full scale, all tab panels visible
- Force: `print-color-adjust: exact; -webkit-print-color-adjust: exact`
- Page breaks: `page-break-after: always` on cover, `page-break-inside: avoid` on cards
- Disable: all animations set to `opacity:1; transform:none`

---

## Responsive Breakpoints

| Breakpoint | Changes |
|------------|---------|
| `≤1024px` | Sidebar → hidden (hamburger), `.main` margin removed, section padding reduced to `56px 28px`, stats grid → 2-col |
| `≤768px` | Min-height removed from sections, padding → `44px 18px`, cover h1 → `--text-4xl`, h2 → `--text-3xl`, all multi-col grids → single column, timeline → vertical, chatbot → full-width |

---

## Content Rules (from CLAUDE.md)

- **Pricing:** Value-based, project fees only. Never expose hourly rates.
- **Data integrity:** All stats must have verified, named sources. Ranges over rounded numbers.
- **No stat duplication** within the same section.
- **Source links:** Data-heavy sections end with a "Sources & methodology → 09" button.
- **Naming:** "Taylor Inc." only on cover; "Taylor Group" everywhere else.
- **Language:** Client-facing in English.
