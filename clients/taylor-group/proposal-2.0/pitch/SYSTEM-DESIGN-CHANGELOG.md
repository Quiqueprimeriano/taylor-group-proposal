# SYSTEM.DESIGN Changelog

Changes between `Taylor-Group-Interactive-Pitch.html` (original) and `Taylor-Group-Interactive-Pitch-SYSTEM.DESIGN.html` (new design system).

Source: Figma frame `FONTS` (node 10:1904) from TransformAZ x Taylor file.

---

## Fonts

| What | Original | SYSTEM.DESIGN |
|------|----------|---------------|
| Google Fonts import | Source Serif 4 + Inter + JetBrains Mono | Inter only |
| `--serif` | `'Source Serif 4', Georgia, serif` | **Removed** |
| `--mono` | `'JetBrains Mono', monospace` | **Removed** |
| `--sans` | `'Inter', -apple-system, system-ui, sans-serif` | Same |
| `--font-features` | Hardcoded in `body` rule | New token: `'cv01','cv02','ss01'` |
| All `var(--serif)` refs | ~15 occurrences (headings, cover, interstitials) | → `var(--sans)` |
| All `var(--mono)` refs | ~30 occurrences (labels, stats, tags, badges) | → `var(--sans)` |

## Typography Scale

| What | Original | SYSTEM.DESIGN |
|------|----------|---------------|
| System | 1.25 Major Third (3xs–5xl) | Figma hierarchy (H0–Metadata) |
| Cover h1 | `--text-5xl` (3.052rem), weight 700 | `--text-h0` (100px), weight 400 |
| Section h2 | `--text-4xl` (2.441rem), weight 700, `--serif` | `--text-h1` (60px), weight 400, `--sans` |
| Section h3 | `--text-2xl` (1.563rem), weight 600, `--serif` | `--text-h3` (20px), weight 500, `--sans` |
| Interstitials | `--text-4xl`, weight 300, `--serif` | `--text-h2` (40px), weight 400, `--sans` |
| Stat values | `--text-3xl` (1.953rem), weight 700, `--mono` | `--text-h2` (40px), weight 400, `--sans` |
| Section num | `--text-xs`, weight 600, `--mono` | `--text-metadata` (12px), weight 500 |
| Stat labels | `--text-xs`, weight 600, `--mono` | `--text-metadata` (12px), weight 500 |
| Letter spacing (headings) | `-0.03em` | `-0.08em` (much tighter) |
| Letter spacing (body) | none | `-0.01em` |
| Line height (body) | `1.6` (body rule) / `1.75` (section p) | `1.5` (via `--lh-body`) |
| Cover subtitle | italic, weight 300 | normal style, weight 400 |

### New tokens added

- `--text-h0` through `--text-metadata` (8 Figma typography levels)
- `--ls-heading`, `--ls-h3`, `--ls-body` (letter spacing tokens)
- `--lh-heading`, `--lh-h3`, `--lh-body`, `--lh-ui` (line height tokens)
- `--fw-regular`, `--fw-medium`, `--fw-semibold` (font weight tokens)
- Legacy scale (`--text-3xs` through `--text-5xl`) kept as aliases for migration

## Colors

| Token | Original | SYSTEM.DESIGN | Figma Name |
|-------|----------|---------------|------------|
| `--bg` | `#fcfcfa` (warm off-white) | `#ffffff` (pure white) | Gray/00 |
| `--text` | `#18181b` (zinc-900) | `#170909` (deep brown) | Brown/05 |
| `--text-primary` | — (didn't exist) | `#2F2024` | Brown/04 |
| `--text-secondary` | `#52525b` (zinc-600) | `#3C3336` (warm brown) | Brown/03 |
| `--text-tertiary` | `#a1a1aa` (zinc-400) | `#88746D` (muted brown) | Brown/02 |
| `--accent` | `#7A7AE6` (lavender) | `#5436FF` (electric purple) | Purple/03 |
| `--accent-dark` | `#5a5abf` | `#3d22cc` | — |
| `--accent-glow` | `rgba(122,122,230,.18)` | `rgba(84,54,255,.18)` | — |
| `--gradient` | `135deg, #7A7AE6, ...` | `135deg, #5436FF, ...` | — |
| `--shadow-accent` | `rgba(122,122,230,.3)` | `rgba(84,54,255,.3)` | — |

### Hardcoded color replacements

All ~38 instances of `#7A7AE6` → `#5436FF`
All ~15 instances of `rgba(122,122,230,...)` → `rgba(84,54,255,...)`
All ~2 instances of `#5a5abf` → `#3d22cc`

## Body defaults

| Property | Original | SYSTEM.DESIGN |
|----------|----------|---------------|
| `color` | `var(--text)` (#18181b) | `var(--text-secondary)` (#3C3336) |
| `line-height` | `1.6` | `var(--lh-body)` (1.5) |
| `letter-spacing` | none | `var(--ls-body)` (-0.01em) |
| `font-feature-settings` | `'cv01','cv02','ss01'` (hardcoded) | `var(--font-features)` (tokenized) |
| `-moz-osx-font-smoothing` | not set | `grayscale` (added) |

## New color tokens (from COMPONENTS frame, node 11:2093)

### Full palette added

| Scale | Tokens |
|-------|--------|
| **Gray** | `--gray-00` (#FFF), `--gray-01` (#F9F9F9), `--gray-02` (#F3F3F3), `--gray-03` (#E8E8E8), `--gray-05` (#D2D1D1), `--gray-06` (#B2B2B2) |
| **Brown** | `--brown-00` (#FFF6F2), `--brown-01` (#E2D4CF), `--brown-02` (#88746D), `--brown-03` (#3C3336), `--brown-04` (#2F2024), `--brown-05` (#170909) |
| **Purple** | `--purple-01` (#EBE8FF), `--purple-02` (#A696FF), `--purple-03` (#5436FF) |
| **Yellow** | `--yellow-00` (#FCFFEA), `--yellow-01` (#F8FFD4), `--yellow-03` (#D8FF2A) |
| **Red** | `--red-brand` (#FF0026) |

### New semantic aliases

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-subtle` | Gray/01 `#F9F9F9` | Toggle bg, card hover state |
| `--text-dimmed` | Brown/01 `#E2D4CF` | Upcoming/disabled nav items |
| `--accent-light` | **Changed** from `#ededfc` to Purple/01 `#EBE8FF` | Now matches Figma exactly |
| `--accent-mid` | Purple/02 `#A696FF` | New mid-tone accent |
| `--yellow-accent` | Yellow/03 `#D8FF2A` | Badge text on dark backgrounds |

## Component changes

### Sidebar navigation

| Property | Original | SYSTEM.DESIGN |
|----------|----------|---------------|
| Font size | `--text-sm` (0.875rem) | `--text-metadata` (12px) |
| Font weight | 500 / 600 (active) | `--fw-medium` (500) for all states |
| Letter spacing | `.01em` | `0` |
| Background (frosted) | `rgba(252,252,250,.85)` | `rgba(255,255,255,.85)` |
| Upcoming items | Same as tertiary | New: `--text-dimmed` (#E2D4CF) — clearly dimmed |
| Active current item | Bold text `is-active` only | `is-active`, `is-past`, `is-upcoming` states |

### Cover badge

| Property | Original | SYSTEM.DESIGN |
|----------|----------|---------------|
| Background | `--accent-light` (purple tint) | `--brown-04` (#2F2024, dark) |
| Text color | `--accent` (purple) | `--yellow-accent` (#D8FF2A, lime) |
| Font size | `--text-2xs` (0.64rem) | `--text-button` (14px) |
| Font weight | 700 | `--fw-medium` (500) |
| Text transform | uppercase | none |
| Letter spacing | `.14em` | `0` |
| Border | `1px solid rgba(84,54,255,.2)` | none |
| Border radius | 20px | 26px |
| Padding | `5px 14px` | `9px 12px` |

### Before/After toggle (new component)

New component from Figma with `--gray-01` background, `--text-tertiary` inactive labels, `--accent` active label, and `--yellow-accent` circular indicator. Defined in `brand/design-system.css`.

## Visual character shift

The overall feel changes from **editorial serif + tech mono** to **unified Inter with aggressive negative tracking**. Key differences:
- Headlines go from heavy serif (700 weight) to light sans (400 weight) — more modern/minimal
- The accent shifts from soft lavender (#7A7AE6) to electric purple (#5436FF) — more saturated/bold
- Text hierarchy shifts from cold zinc grays to warm brown tones — warmer feel
- Background shifts from warm off-white (#fcfcfa) to pure white (#ffffff) — cleaner
- Stat values lose their monospace tech feel and gain large editorial presence via `--text-h2` at 40px

---

## Section 03 — Digital Backbone rebuild (2026-03-25)

### S04 Header → 2-column grid
- Replaced centered section-num + centered h2 + sequential paragraphs with a `.s04-header` 2-column grid (`2fr 3fr`)
- Left column: section label + h2 (left-aligned)
- Right column: 3 consolidated body paragraphs with scroll-reveal
- Responsive: collapses to single column at 1024px

### Before/After toggle (Figma Components frame)
- Underline tab style with `border-bottom: 2px` indicator (not pill toggle)
- Active tab uses `--accent` (#5436FF) color + underline
- Central lime sparkle icon (`--yellow-accent` #D8FF2A circle with starburst SVG)
- `aria-selected` drives both accessibility and visual state

### Before SVG diagram (static)
- 5 dimension circles: thin solid outlines, no fill, with dots at bottom
- V-shaped dashed chevron connector web (`<polyline>` pairs forming diamond patterns)
- Solid red backbone line (`--red-brand` #FF0026) across middle
- 3 large phase circles: pink fill (#FDEAE8), dashed outlines
- "5 dimensions" / "3 phases" annotations on right

### After SVG diagram (animated)
- 5 dimension circles (thin outline), 3 phase circles (purple fill `--purple-01`)
- Soft arc connections (ellipses) showing network topology
- Central lime green hub (`--yellow-accent`) with glow filter + breathing pulse animation
- 8 electric spokes from hub edge to each circle edge (edge-point math, not center-to-center)
- 13 animated spark particles via `<animateMotion>` + `<mpath>`: yellow outbound, purple return
- Spokes fade in staggered (120ms interval) when After panel becomes visible
- Hub starburst lines + "Digital backbone" label badge

### Panel transition
- Panels stacked in `.s04-panels` CSS grid (`grid-area: 1/1`)
- Left-to-right wipe via `clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)` (0.7s)
- Outgoing panel wipes out same direction via `.is-leaving` class
- Print: toggle hidden, both panels force-visible, spokes visible

## Section reorder (2026-03-25)

### New narrative flow

| # | Section | Previous # |
|---|---------|-----------|
| 01 | The Opportunity | 01 (unchanged) |
| 02 | The New Operating Paradigm | 02 (unchanged) |
| 03 | The Digital Backbone | was 04 |
| 04 | The Transformation Approach | was 05 |
| 05 | Services & Investment | was 07 "Next Steps" (renamed) |
| 06 | Key Findings | was 03 |
| 07 | Phase Overview | was 08 "Intake Proposal" (renamed) |
| 08 | Market Insights | was 06 |
| 09 | References | 09 (unchanged) |

### Renamed sections
- `#next-steps`: "Next Steps" → "Services & Investment", h2 "Moving Forward" → "Defining the Path Forward"
- `#intake-proposal`: "Intake Proposal" → "Phase Overview", h2 → "Pre-Engagement + Intake + Discovery"

### Interstitial reassignment
Each interstitial moved with its thematic context to bridge into the section it introduces in the new order.

## Layout changes (2026-03-25)

- `--content-w`: 960px → 1120px → removed (`max-width: none`)
- `.section` padding: `100px 48px` → `100px 80px`, full-width (no `margin: 0 auto`)

## H2 accent highlights (2026-03-25)

Key word(s) in every section h2 wrapped in `<span style="color:var(--accent)">` (#5436FF purple):

| Section | Highlighted word(s) |
|---------|-------------------|
| 01 The Opportunity | **Transformation** |
| 02 New Operating Paradigm | **System-Level** |
| 03 Digital Backbone | **connected** |
| 04 Transformation Approach | **Transformation** |
| 05 Services & Investment | **Path Forward** |
| 06 Key Findings | **Revealed** |
| 07 Phase Overview | **Pre-Engagement**, **Intake**, **Discovery** |
| 08 Market Insights | **Transformation** |
| 09 References | **Research** |

## 2-column section headers (2026-03-25)

### Generic `.section-header` component

Replaced backbone-specific `.s04-header` with a reusable `.section-header` class applied to all sections with intro text.

| Property | Value |
|----------|-------|
| Layout | `grid-template-columns: 1fr 1fr`, gap 56px |
| Left column | `section-num` + `h2` (left-aligned) |
| Right column | Intro paragraph(s) with `scroll-reveal`, `padding-top: 40px` |
| Responsive (≤1024px) | Collapses to single column, `padding-top: 0` on right |
| Print | Single column |

### Sections converted

| Section | # Paragraphs (right column) |
|---------|-----------------------------|
| 01 The Opportunity | 2 (growth summary + digital foundation question) |
| 02 The New Operating Paradigm | 2 (industrial shift + reactive adoption) |
| 03 The Digital Backbone | 3 (modes + layers + backbone definition) |
| 04 The Transformation Approach | 5 (built not deployed + structured phase-based + progression intro + ordered list + builds on previous) |
| 06 Key Findings | 2 (paradigm in practice + pattern of disconnection) |
| 07 Phase Overview | 2 (friction estimate + hypothesis/INTAKE) |
| 08 Market Insights | 1 (AI adoption stat + strategic timing) |
| 09 References | 1 (methodology note) |

### Sections NOT converted (no intro text)

| Section | Reason |
|---------|--------|
| 05 Services & Investment | Opens directly with pricing table |

## CBE (Create/Build/Execute) redesign (2026-03-25)

Replaced the old flow-phase diagram + expandable panels with a Figma-matched component.

### New `.cbe-bar` component

| Property | Value |
|----------|-------|
| Shape | Dark pill (`border-radius: 140px`), `background: --brown-05` (#170909) |
| Layout | Flex row with 3 phase items, centered |
| Phase text | 100px Inter Regular, letter-spacing -8px |
| Active state | White text + yellow-accent dot; inactive = `--brown-03` |
| Subtitles | 14px Inter Medium below each phase name |
| Arrow button | 54px circle, right-aligned, rotates 180° when open |
| Mobile (768px) | 36px text, vertical stack, arrow below |

### New `.cbe-dropdown` component

| Property | Value |
|----------|-------|
| Container | `border: 1px solid --brown-01`, rounded, expand/collapse via `max-height + opacity` |
| Grid | 2-column (`1fr 1fr`), 48px row gap, 80px column gap |
| Items | h4 at `--text-h3` (20px) Medium + body text |
| Summary box | `--gray-01` background, centered, `--text-h3` text |
| Before/After | Two side-by-side cards with dark badges (`--brown-04` bg, `--yellow-accent` text) |
| Before card bg | `--gray-01` (#F9F9F9) |
| After card bg | `--brown-01` (#E2D4CF) |

### Interaction

- Clicking a phase name activates it (white text) and opens its dropdown
- Clicking the active phase or arrow collapses all dropdowns
- "Create" is active + open by default on page load
- Print: all dropdowns forced open, arrow hidden

## Section 04 title & header consolidation (2026-03-25)

- h2 changed: "From Insight / to System-Level Execution" → "An Engineered / Transformation"
- Accent highlight moved from "Execution" to "Transformation"
- Moved progression intro paragraph, ordered list (5 items), and closing paragraph from standalone `<p>`/`<ol>` below the header into `section-header__right` column
- Scroll-reveal delays recalculated: `.21s`, `.24s`, `.27s` (continuing from existing `.15s`, `.18s`)

## Removed: Five Dimensions pillar tabs (2026-03-25)

- Deleted "Five Dimensions Across Every Phase" h3, pillar tab bar (People & Culture, Processes, Tech, Data, Compliance), 5 pillar cards with quotes, and "Five dimensions. Three phases. One backbone." value-prop
- Cleaned up orphaned CSS: `.pillar-tabs`, `.pillar-tab`, `.pillar-tab-content`, `.pillar-card`, `.pillar-card--*`, `.pillar-header`, `.pillar-tag` rules
- Cleaned up orphaned JS: pillar tab click handler
- Cleaned up orphaned print/responsive media query rules for `.pillar-tab-content` and `.pillar-tab`

## Paradigm comparison table redesign (2026-03-25)

| Property | Original | SYSTEM.DESIGN |
|----------|----------|---------------|
| `border-collapse` | `collapse` | `separate` (needed for border-radius on cells) |
| Font size (body) | `--text-sm` (0.875rem) | `--text-body` (16px) |
| Header font size | `--text-2xs` (0.64rem) | `--text-metadata` (12px) |
| Header font weight | 700 | `--fw-medium` (500) |
| Header border | `2px solid --border` | `2px solid --gray-03` |
| "Designed Transformation" header | Purple text, plain | Dark badge (`--brown-04` bg, `--yellow-accent` text, 26px pill radius) |
| Dimension labels | `--text-xs`, weight 600 | `--text-metadata` (12px), `--fw-medium` |
| Right column (Designed) bg | none | `--purple-01` (#EBE8FF) |
| Right column font weight | 500 | `--fw-medium` (500) |
| Row borders | `--border-light` | `--gray-03` |
| Row padding | `12px 16px` | `14px 16px` |
| Last row bottom-right | square | `--radius-md` rounded |
| Asterisks (`*` / `**`) | Present on headers | Kept (reference body text) |

## Interstitial 2 content change (2026-03-25)

- Text: "Not new software. New connective tissue." → "97% of executives believe AI will transform their company and industry. 93% say their AI investments are outperforming other strategic areas."
- Added `interstitial__source`: "— Accenture"
- Source: Accenture — *Reinvent Enterprise Models with Generative AI*
- Added 2 rows to References § "AI Adoption & Impact" table (97% claim + 93% claim), both linking to accenture.com
- Updated finding-tag to include "Accenture" alongside McKinsey & WEF

## "How Digital Backbone Works" accordion (2026-03-25)

New subsection within Section 03 (backbone), placed after the CBE bar/dropdowns.

### Structure

| Element | Spec |
|---------|------|
| Header icon | 54px lime circle (`--yellow-accent`) with starburst SVG |
| h2 | "How Digital Backbone Works", 40px Inter Regular, centered |
| Subtitle | 16px body, centered, max-width 433px |
| Accordion | 3 items stacked vertically, gap 8px |

### Accordion items

| State | Background | Number color | Title color |
|-------|-----------|-------------|-------------|
| Collapsed | `--yellow-00` (#FCFFEA) | `--yellow-accent` (#D8FF2A) | `--brown-02` (#88746D) |
| Adjacent to active | `--yellow-01` (#F8FFD4) | `--brown-03` (#3C3336) | `--brown-04` |
| Active | `--yellow-accent` (#D8FF2A) | `--brown-04` (#2F2024) | `--brown-04` |

| Property | Value |
|----------|-------|
| Number | 100px Inter Regular, -8px letter-spacing |
| Title | 40px Inter Regular, -3.2px letter-spacing |
| Min height (collapsed) | 129px |
| Border radius | `--radius-md` (10px) |
| Expand/collapse | `max-height + opacity` transition |

### Content (3 layers)

1. **Automation** — "How Work Moves": workflow orchestration across Create/Build/Execute
2. **Data** — "What the business knows": structured foundation, single source of truth
3. **Artificial Intelligence** — "How the system improves": 4 sub-types (Copilots, Generative, Analytical, Autonomous)

### Interaction

- Click any item to expand it (only one open at a time)
- Clicking the active item collapses it
- "Automation" (01) is active by default on load

## "Digital Backbone addresses this gap" bridge block (2026-03-25)

- Reuses `.section-header` 2-column grid (same as "One connected operation" and all other section headers)
- Left column: h2 "The Digital Backbone / addresses this gap" (accent on "The Digital Backbone")
- Right column: 3 scroll-reveal paragraphs (current state → connected layer → integrates modes+layers)
- Removed custom `.bb-gap-bridge` / `.bb-gap-bridge__h2` CSS (no longer needed)

## Gantt chart redesign — cascading timeline (2026-03-25)

### Layout change

| Property | Original | SYSTEM.DESIGN |
|----------|----------|---------------|
| Grid | `150px + repeat(12,1fr)` (labels + 12 months) | `repeat(9,1fr)` (APR–DEC, no label column) |
| Months | APR–JAN+ (11 months) | APR–DEC (9 months) |
| Month dividers | Bottom border on header | Vertical dashed lines (`--gray-03`) spanning full height |
| Phase layout | All rows at same level with left labels | Cascading/waterfall — each phase on its own row, staggered down |
| Bar radius | 6px | 20px (pill shape) |
| Bar font | `--text-2xs`, weight 600 | `--text-button` (14px), `--fw-medium` |

### Phase colors

| Phase | Original | SYSTEM.DESIGN |
|-------|----------|---------------|
| Pre-engagement | `--bg-warm` + dashed border | `--gray-02` solid pill |
| Intake | `--blue` | `--purple-01` (light purple) |
| Discovery | `--green` | `--accent-mid` (#A696FF, medium purple) |
| Implementation | `--accent` | `--accent` (#5436FF) |
| Stabilization | `--amber` | `--yellow-accent` (#D8FF2A) with `--red-brand` text |
| Change enablement | Gradient overlay, single bar | Two dark pills (`--brown-05`), split at decision point |

### Decision markers

| Property | Original | SYSTEM.DESIGN |
|----------|----------|---------------|
| Shape | Rotated diamond (purple border) | Red vertical line + circle icon |
| Color | `--accent` (purple) | `--red-brand` (#FF0026) |
| Label | Inline text below diamond | Legend at bottom of chart |
| Dashed lines | Horizontal dashed lines flanking diamond | Removed |

### Animation
- Same `scaleX(0)→scaleX(1)` fill animation with staggered `data-gantt-delay`
- JS unchanged (IntersectionObserver adds `.is-filling`)

---

## Phase Cards → Phase Stack (Figma redesign)

| What | Original | SYSTEM.DESIGN |
|------|----------|---------------|
| Layout | `.phases-grid` — 3-column card grid | `.phase-stack` — vertically stacked full-width cards |
| Card style | White bg, thin border, colored top bar (`::before`) | Full color backgrounds per phase, no border |
| Phase number | `.phase-tag` pill badge ("Phase 0") | `.phase-card-v2__num` — large `#0` text (40px) |
| Title | Uppercase h3 inside card | `.phase-card-v2__title` — 40px title, sentence case |
| Date | `.phase-date` small text | `.phase-card-v2__date` — 12px metadata, accent-colored |
| Location | Bold text inside card body | `.phase-badge` — dark pills at bottom-left |
| Expand/collapse | `.phase-expand-hint` + `.phase-detail` | Removed — all content visible |
| Navigation | None | `.phase-nav` — up/down arrow buttons between cards |
| Card count | 6 (Phase 0–4 + Phase X) | 6 (Phase #0–#5) |
| Phase X label | "Change Enablement" | Phase #5 "Change enablement" |

### Color scheme per phase

| Phase | Background | Number color | Date color | Text color |
|-------|-----------|-------------|-----------|-----------|
| #0 Pre-engagement | `--gray-01` | `#D2D1D1` | `--accent` | `--brown-04` |
| #1 Intake | `--purple-01` | `--brown-04` | `--accent` | `--brown-04` |
| #2 Discovery | `--accent-mid` | `--brown-04` | `#fff` | `--brown-05` |
| #3 Implementation | `--accent` | `--purple-01` | `--yellow-accent` | `#fff` |
| #4 Stabilization | `--yellow-accent` | `--brown-04` | `--accent` | `--brown-04` |
| #5 Change enablement | `--brown-05` | `--purple-01` | `--yellow-accent` | `#fff` |

### Navigation arrows
- Circular buttons (54px) with chevron SVGs
- Placed between each card pair
- Click scrolls to adjacent phase card (`scrollIntoView` smooth)
- Hidden in print (`display:none`)

### Responsive (≤768px)
- Grid collapses to single column
- Phase number: 32px, title: 32px
- Reduced padding

## Section 05 Services & Investment redesign (2026-03-25)

### Layout change
- Added 2-column `.section-header` (was missing — only section without one)
- Replaced `ba-table` + "What Taylor Gets" list + CTA box with `.svc-matrix` CSS Grid

### New `.svc-matrix` component

| Property | Value |
|----------|-------|
| Layout | 5-column CSS Grid (`auto 1fr 1fr 1fr 1fr`) |
| Columns | Phase, Duration, Format, TransformAZ service, Investment |
| Header font | `--text-metadata` (12px), uppercase, `--fw-medium` |
| Cell borders | Bottom `1px solid --gray-03` |
| Phase pills | Colored cards matching Gantt chart colors per phase |
| Format badges | Pill shape, `1px solid --gray-05`, `--text-metadata` |
| Service groups | Dashed border containers spanning multiple rows |

### Service groupings (column 4)

| Group | Rows | Label |
|-------|------|-------|
| Diagnosis | #0 Pre-alignment, #1 Intake, #2 Discovery | "Diagnosis" |
| Execution | #3 Implementation, #4 Stabilization | "Execution" |
| Comms | #X Comms & change | "Diagnosis and/or execution" |

### Phase colors (matching Gantt)

| Phase | Background | Text |
|-------|-----------|------|
| #0 Pre-alignment | `--gray-02` | `--text-secondary` |
| #1 Intake | `--purple-01` | `--brown-04` |
| #2 Discovery | `--accent-mid` | `#fff` |
| #3 Implementation | `--accent` | `#fff` |
| #4 Stabilization | `--yellow-accent` | `--red-brand` |
| #X Comms & change | `--brown-05` | `#fff` |

### Removed elements
- `ba-table` (simple 4-row table)
- "What Taylor Gets" h3 + ul list
- CTA box "Start INTAKE" with glow animation
- Closing paragraph about walking away

---

## Section 07 — Phase Overview (complete redesign)

### New component: `.po-phase` (Phase Detail blocks)
Replaces the previous stat cards + pre-engagement box + deliverable tables + pricing cards layout with three full-width phase blocks.

**Structure per phase:**
- `.po-phase__header` — 2-column grid: title+subtitle (left), 4 stat badges (right)
- `.po-phase__body` — 2-column grid: description + operating model (left), exclusions or outcomes (right)

**Phase color mapping (matches Gantt palette):**

| Phase | CSS class | Background |
|-------|-----------|-----------|
| Pre-Engagement | `.po-phase--pre` | `--gray-02` |
| Intake | `.po-phase--intake` | `--purple-01` |
| Discovery | `.po-phase--discovery` | `--accent-mid` |

### Removed elements (Section 07)
- `stats-grid` with 4 stat cards (Duration, Interviews, Flows, Dimensions)
- `.box--accent` Pre-Engagement box
- INTAKE Deliverables `ba-table`
- DISCOVERY Scope `ba-table`
- Investment Options (2 `.horizon-card` pricing cards with $18K/$42K)
- ROI framing `.value-prop` block
- Engagement Terms `ba-table`
- Final CTA box "Let's Begin"

### New content structure
- **Pre-Engagement**: "Alignment Becomes Commitment" — 2 wk, Remote, 5 areas, 1 MSA. Operating model + exclusions
- **Intake**: "Setting the Ground for Discovery" — 1 mo, Remote, 3 core flows, 5 dimensions. Operating model + exclusions
- **Discovery**: "From Visibility to Validated Understanding" — 2 mo, Hybrid, 5 pillars, 1 roadmap. Operating model + outcomes
