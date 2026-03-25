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
| All text | Inter | 400, 500, 600 | `--sans` | `font-feature-settings: 'cv01','cv02','ss01'` required. Single family for entire pitch. |

### Type Scale — Figma-sourced hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Typical Use |
|-------|------|--------|-------------|----------------|-------------|
| `--text-h0` | 100px | 400 (Regular) | 1 | -0.08em | Cover hero word, section openers |
| `--text-h1` | 60px | 400 (Regular) | 1 | -0.08em | Section headlines |
| `--text-h2` | 40px | 400 (Regular) | 1 | -0.08em | Sub-section headlines |
| `--text-h3` | 20px | 500 (Medium) | 1.3 | -0.02em | Card headings, panel titles |
| `--text-body` | 16px | 400 (Regular) | 1.5 | -0.01em | Body text, descriptions |
| `--text-body-highlight` | 16px | 600 (Semi Bold) | 1.5 | -0.01em | Emphasized body text, inline highlights |
| `--text-button` | 14px | 500 (Medium) | 1.1 | 0 | Buttons, CTAs, interactive labels |
| `--text-metadata` | 12px | 500 (Medium) | 1.1 | 0 | Metadata, captions, muted labels |

**Rule:** Never use hardcoded `font-size` values — always use a `--text-*` token.

### Typography Patterns

- **Section headings:** `--text-h1` or `--text-h2`, `font-weight:400`, tight letter-spacing (-0.08em), `color:var(--text)`
- **Accent words in headings:** `color:var(--accent)` inline within heading text (e.g., "One **connected** operation")
- **Body text:** `--text-body`, `line-height:1.5`, `color:var(--text-secondary)`
- **Body highlights:** `--text-body-highlight`, same as body but `font-weight:600`, `color:var(--text)` for inline emphasis
- **Buttons/CTAs:** `--text-button`, `color:var(--accent)`, medium weight
- **Metadata:** `--text-metadata`, `color:var(--text-tertiary)`, medium weight
- **Interstitial/hero:** `--text-h0`, `font-weight:400`, dramatic letter-spacing (-0.08em)

---

## Color System

### Full Palette — Figma-sourced (FONTS + COMPONENTS frames)

#### Gray Scale

| Token | Figma Name | Value | Usage |
|-------|------------|-------|-------|
| `--gray-00` | Gray/00 | `#ffffff` | Page background |
| `--gray-01` | Gray/01 | `#F9F9F9` | Subtle surface (toggle bg, card hover) |
| `--gray-02` | Gray/02 | `#F3F3F3` | Light surface |
| `--gray-03` | Gray/03 | `#E8E8E8` | Borders, dividers |
| `--gray-05` | Gray/05 | `#D2D1D1` | Muted borders |
| `--gray-06` | Gray/06 | `#B2B2B2` | Disabled text |

#### Brown Scale

| Token | Figma Name | Value | Usage |
|-------|------------|-------|-------|
| `--brown-00` | Brown/00 | `#FFF6F2` | Warm tint background |
| `--brown-01` | Brown/01 | `#E2D4CF` | Dimmed/upcoming nav items |
| `--brown-02` | Brown/02 | `#88746D` | Metadata, tertiary text |
| `--brown-03` | Brown/03 | `#3C3336` | Body text, descriptions |
| `--brown-04` | Brown/04 | `#2F2024` | Primary text, headings. Badge bg |
| `--brown-05` | Brown/05 | `#170909` | Darkest text — hero, H0 |

#### Purple Scale

| Token | Figma Name | Value | Usage |
|-------|------------|-------|-------|
| `--purple-01` | Purple/01 | `#EBE8FF` | Accent background tint |
| `--purple-02` | Purple/02 | `#A696FF` | Accent mid-tone |
| `--purple-03` | Purple/03 | `#5436FF` | Primary accent |

#### Yellow Scale

| Token | Figma Name | Value | Usage |
|-------|------------|-------|-------|
| `--yellow-00` | Yellow/00 | `#FCFFEA` | Yellow tint background |
| `--yellow-01` | Yellow/01 | `#F8FFD4` | Yellow light |
| `--yellow-03` | Yellow/03 | `#D8FF2A` | Badge text on dark bg |

#### Other

| Token | Figma Name | Value | Usage |
|-------|------------|-------|-------|
| `--red-brand` | Red | `#FF0026` | Error, destructive |

### Semantic Aliases

| Token | Maps to | Usage |
|-------|---------|-------|
| `--bg` | `--gray-00` | Page background |
| `--bg-warm` | `#f7f6f3` | Warm surface |
| `--bg-subtle` | `--gray-01` | Toggle bg, card hover |
| `--text` | `--brown-05` | H0, darkest |
| `--text-primary` | `--brown-04` | H1–H3, highlights |
| `--text-secondary` | `--brown-03` | Body text |
| `--text-tertiary` | `--brown-02` | Metadata, muted |
| `--text-dimmed` | `--brown-01` | Upcoming/disabled nav items |
| `--accent` | `--purple-03` | Brand accent |
| `--accent-light` | `--purple-01` | Accent tint |
| `--accent-mid` | `--purple-02` | Accent mid-tone |
| `--accent-dark` | `#3d22cc` | Hover/emphasis |
| `--yellow-accent` | `--yellow-03` | Badge text on dark bg |
| `--gradient` | — | `linear-gradient(135deg,#5436FF,#a78bfa,#60a5fa)` |

### Semantic Colors (CBE phases)

| Token | Value | Background Token | Usage |
|-------|-------|------------------|-------|
| `--green` | `#1a9959` | `--green-bg` `#ecfdf5` | People & Culture, Build phase, positive |
| `--blue` | `#2563eb` | `--blue-bg` `#eff6ff` | Processes, Create phase, informational |
| `--amber` | `#b45309` | `--amber-bg` `#fffbeb` | Data, Execute phase, warnings |
| `--red` | `#dc2626` | `--red-bg` `#fef2f2` | Compliance, high severity |

### Color Rules

- **Client-facing accent:** `#5436FF` (Purple/03)
- **Internal docs accent:** `#c0392b` (red)
- **Selection:** `::selection { background: var(--accent); color: #fff }`
- **Text hierarchy:** Brown/05 → Brown/04 → Brown/03 → Brown/02 → Brown/01 (darkest to lightest)
- **Nav dimming:** Past sections use `--text-tertiary`, active uses `--accent`, upcoming uses `--text-dimmed`
- **Badge pattern:** Dark bg (`--brown-04`) + lime text (`--yellow-accent`) for section pills

---

## Layout

### Widths

| Token | Value | Usage |
|-------|-------|-------|
| `--content-w` | `1120px` | Declared but **not enforced** — sections use `max-width: none` with padding-based layout |
| `--sidebar-w` | `220px` | Fixed sidebar width |

### Section Structure

```
.section {
  min-height: 100vh;
  padding: 100px 80px;
  max-width: none;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
```

Sections are full-width with generous horizontal padding. The 2-column `.section-header` grid (`1fr 1fr`, gap 56px) controls content density within each section.

**Rule:** Never use breakout layout (`margin-left:50%; transform:translateX(-50%)`) with a sidebar — it centers relative to parent, not viewport, causing asymmetry.

### Grid Patterns

| Component | Desktop | Tablet (≤1024px) | Mobile (≤768px) |
|-----------|---------|-------------------|-----------------|
| Section header | `1fr 1fr` | `1fr` | `1fr` |
| Stats grid | `repeat(4, 1fr)` | `repeat(2, 1fr)` | `1fr 1fr` |
| Findings grid | `repeat(2, 1fr)` | `repeat(2, 1fr)` | `1fr` |
| Phase stack | Horizontal flex (strips expand) | — | Single column |
| Horizons grid | `repeat(3, 1fr)` | `repeat(3, 1fr)` | `1fr` |
| CBE dropdown grid | `1fr 1fr` | `1fr 1fr` (reduced gap) | `1fr` |
| Competitor grid | `repeat(3, 1fr)` | `repeat(3, 1fr)` | `1fr` |
| Svc matrix | `140px 1fr 1fr 1fr 1fr` | — | — |
| Invest grid | `1fr 1fr` | `1fr 1fr` | `1fr` |

---

## Components

### Card System

All cards share: `border-radius: 14px`, `border: 1px solid var(--border-light)`, `background: var(--bg-white)`.

| Card Type | Accent Pattern | Interactive? | Hover Effect |
|-----------|---------------|-------------|--------------|
| `stat-card` | `::after` gradient top bar (3px) | No | `translateY(-3px)` + elevated shadow |
| `finding-card` | `::after` gradient top bar (3px), color varies by severity | Yes (expand/collapse) | `translateY(-2px)` + shadow + 3D tilt |
| `phase-card-v2` | Full-color background per phase (no border accent) | Yes (carousel strip → expand) | Flex expansion animation |
| `horizon-card` | `::before` gradient top bar (3px) | No | Shadow elevation |
| `cbe-bar` | Dark pill (`--brown-05`), phase text activates white | Yes (click phase → dropdown) | — |
| `competitor-card` | Neutral border, hover accent | No | `translateY(-2px)` + shadow |

### Box System (Callouts)

`.box` base: `padding: 18px 22px`, `border-radius: 10px`, `border-left: 3px solid`, `background: var(--bg-warm)`.

Variants: `--accent`, `--amber`, `--blue`, `--green`, `--red` — each sets `border-color` and `background` to the semantic color pair.

### Value Proposition Block

`.value-prop`: `border: 1px solid rgba(84,54,255,.15)`, `border-radius: 14px`, accent-light background, `::before` gradient top line.

### CTA Block

`.cta-box`: Centered, `border-radius: 18px`, accent border, radial glow animation, gradient top bar.

### Phase Stack (Section 04)

`.phase-stack`: Horizontal flex container, `height: 627px`, gap 6px. Cards are collapsible strips (56px) that expand to fill (`flex: 1`). Only one active at a time.

| Phase | Background | Number | Date | Text |
|-------|-----------|--------|------|------|
| #0 Pre-engagement | `--gray-01` | `#D2D1D1` | `--accent` | `--brown-04` |
| #1 Intake | `--purple-01` | `--brown-04` | `--accent` | `--brown-04` |
| #2 Discovery | `--accent-mid` | `--brown-04` | `#fff` | `--brown-05` |
| #3 Implementation | `--accent` | `--purple-01` | `--yellow-accent` | `#fff` |
| #4 Stabilization | `--yellow-accent` | `--brown-04` | `--accent` | `--brown-04` |
| #5 Change enablement | `--brown-05` | `#fff` | `--yellow-accent` | `#fff` |

Navigation: circular buttons (54px) with chevron SVGs, bottom-right.

### Gantt Chart (Section 04)

Cascading timeline with 9-column grid (APR–DEC). Pill-shaped bars (`border-radius: 20px`), staggered fill animation (`scaleX(0) → scaleX(1)`). Decision markers: red vertical line + icon. Legend at bottom.

| Phase | Bar style |
|-------|----------|
| Pre-engagement | `--gray-02` (muted) |
| Intake | `--purple-01` (light purple) |
| Discovery | `--accent-mid` (medium purple) |
| Implementation | `--accent` (electric purple) |
| Stabilization | `--yellow-accent` with `--red-brand` text |
| Change enablement | `--brown-05` (dark), split at decision points |

### Service Matrix (Section 05)

`.svc-matrix`: 5-column CSS Grid (`140px 1fr 1fr 1fr 1fr`). Phase pills match Gantt colors. Service groups span multiple rows with dashed borders. Format badges: dark pills.

### Investment Cards (Section 05)

`.invest-card`: White bg, `--gray-02` border, `--radius-xl` corners. Phase color chips at top. Footer with meta labels + price. 2-column grid, collapses to 1-col on mobile.

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

- Fixed left sidebar, `220px` wide, frosted glass (`rgba(255,255,255,.85)` + `backdrop-filter: blur(20px) saturate(1.4)`)
- Font: `--text-metadata` (12px), `--fw-medium` (500), letter-spacing 0
- States: `is-active` (accent color + left border + accent bg tint), `is-past` (tertiary text), `is-upcoming` (`--text-dimmed` #E2D4CF)
- Tracking: scroll-based `offsetTop` comparison (not IntersectionObserver — fails on tall sections)
- Mobile: hamburger toggle at `≤1024px`, slide-in with overlay

### Section Header (2-column)

- Reusable `.section-header` grid: `1fr 1fr`, gap 56px
- Left column: `section-num` + `h2` (left-aligned)
- Right column: intro paragraphs with `scroll-reveal`, `padding-top: 40px`
- Responsive (≤1024px): collapses to single column, `padding-top: 0` on right
- Applied to all sections with intro text (01, 02, 03, 04, 06, 07, 08, 09)

### CBE Bar (Create → Build → Execute)

- Lives in Section 03 (Digital Backbone). Never duplicate elsewhere.
- Dark pill shape (`--brown-05`, `border-radius: 140px`)
- Phase text: 120px Inter Regular, -9.6px letter-spacing. Active = white, inactive = `--brown-03`
- Active dot: `--yellow-accent`. Subtitles: `--text-button`, medium weight
- Arrow button (54px circle) toggles dropdown panels. Rotates 180° when open
- Dropdown: `1px solid --brown-01` border, max-height + opacity + scaleY expand/collapse
- Each phase has a 2-column grid of capabilities + Before/After comparison cards

### Before/After Toggle (Section 03)

- Underline tab style with `border-bottom: 2px` indicator
- Active tab: `--accent` color + underline (Before), `--green` + `--yellow-accent` underline (After)
- Central lime sparkle icon (`--yellow-accent` circle with starburst SVG)
- Panels stacked via CSS grid (`grid-area: 1/1`), clip-path wipe transition (0.7s)
- Before SVG: disconnected state — thin outline circles, dashed red backbone, gap markers
- After SVG: connected state — gradient spokes from central hub, `<animateMotion>` particles, orbital animations
- Spokes fade in staggered (120ms interval) when After becomes visible

### How Backbone Works Accordion (Section 03)

- 3-layer vertical accordion (Automation, Data, AI)
- Active item: `--yellow-accent` bg, 100px number, 40px title
- Adjacent to active: `--yellow-01` bg. Collapsed: `--yellow-00` bg
- Only one open at a time. Automation (01) active by default
- Expand/collapse via `max-height + opacity` transitions

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

## Section Order

| # | Section | Anchor |
|---|---------|--------|
| 00 | Cover | `#cover` |
| 01 | The Opportunity | `#opportunity` |
| 02 | The New Operating Paradigm | `#paradigm` |
| 03 | The Digital Backbone | `#backbone` |
| 04 | The Transformation Approach | `#transformation` |
| 05 | Services & Investment | `#next-steps` |
| 06 | Key Findings | `#findings` |
| 07 | Phase Overview | `#intake-proposal` |
| 08 | Market Insights | `#market` |
| 09 | References | `#references` |

Interstitials bridge between sections (full-screen typewriter pauses).

---

## Accessibility

### Implemented

- Skip-to-content link (visible on focus)
- `prefers-reduced-motion: reduce` → disables all animations
- `focus-visible` outlines on interactive cards
- `role="button"`, `tabindex="0"`, `aria-expanded` on finding cards
- `role="tab"`, `aria-selected` on Before/After toggle
- `role="tabpanel"` on Before/After panels
- `aria-live="polite"` on chatbot messages
- Chat send button: 44x44px touch target
- Hamburger: `aria-label`, `aria-expanded`
- Decorative elements: `aria-hidden="true"`

### Known Gaps

- CBE phase buttons lack `role="tab"` and `aria-selected`
- CBE dropdown panels lack `role="tabpanel"` and `aria-labelledby`
- HBW accordion items lack `role="button"`, `tabindex="0"`, and `aria-expanded` — not keyboard-accessible
- Phase stack cards (collapsed strips) not keyboard-navigable

---

## Print Styles

- Hide: sidebar, hamburger, progress bar, scroll hint, gradient mesh, chatbot, particles, Before/After toggle, phase nav arrows, CBE arrow, CTA buttons, typewriter cursors
- Remove margins: `.main { margin-left: 0 }`
- Reveal all hidden content: expanded finding details, Gantt bars at full scale, Before + After panels both visible, all CBE dropdowns open, all cover animations resolved
- `.section-header` → single column
- Force: `print-color-adjust: exact; -webkit-print-color-adjust: exact`
- Page breaks: `page-break-after: always` on cover, `page-break-inside: avoid` on cards, `page-break-after: avoid` on headings
- Disable: all animations set to `opacity:1; transform:none`

---

## Responsive Breakpoints

| Breakpoint | Changes |
|------------|---------|
| `≤1024px` | Sidebar → hidden (hamburger), `.main` margin removed, section padding → `56px 28px`, `.section-header` → single column, stats grid → 2-col, CBE bar → 60px text + 80px border-radius |
| `≤768px` | Min-height removed from sections, padding → `44px 18px`, cover h1 → `--text-4xl`, h2 → `--text-3xl`, all multi-col grids → single column, timeline → vertical, CBE bar → vertical + 36px text, chatbot → full-width, phase cards → reduced padding + 32px type |

---

## Content Rules (from CLAUDE.md)

- **Pricing:** Value-based, project fees only. Never expose hourly rates.
- **Data integrity:** All stats must have verified, named sources. Ranges over rounded numbers.
- **No stat duplication** within the same section.
- **Source links:** Section 09 (References) contains all citations grouped by topic with clickable links.
- **Naming:** "Taylor Inc." only on cover; "Taylor Group" everywhere else.
- **Language:** Client-facing in English.
- **H2 accent highlights:** Key word(s) in every section h2 wrapped in `color: var(--accent)` — e.g., "Transformation", "System-Level", "connected".
- **Cover badge:** Dark bg (`--brown-04`) + lime text (`--yellow-accent`), pill shape (26px radius), `--text-button` size, `--fw-medium` weight.
