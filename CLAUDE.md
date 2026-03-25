# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TransformAZ is a consulting firm's deliverable generation system. Each client gets a subfolder containing HTML documents (proposals, internal breakdowns, one-pagers).

## Build Commands

```bash
# Generate PDFs from HTML
node "clients/taylor-group/proposal-2.0/generate-pdf.js"    # Taylor static docs → PDF

# Generate DOCX
node "clients/taylor-group/proposal-2.0/pitch/generate-full-pitch-docx.js"
node "clients/taylor-group/proposal-2.0/pitch/generate-intake-docx.js"
node "clients/taylor-group/scripts/generate-agenda-docx.js"
python3 clients/sme-group/generate-onepager-docx.py

# Take screenshots
node clients/sme-group/take-screenshots.js
node "clients/taylor-group/proposal-2.0/pitch/take-screenshots.js"
```

**Dependencies:** All in root `package.json` — Playwright (chromium) for HTML→PDF, docx/pptxgenjs for DOCX/PPTX, python-docx for Python DOCX generation.

## Architecture

- **Client folders:** `clients/sme-group/`, `clients/taylor-group/` — each contains HTML source documents, generation scripts, and output files (PDF/DOCX)
- **HTML→PDF pipeline:** Playwright with `printBackground: true`, zero margins, `preferCSSPageSize: true`. HTML files use `@page` CSS for A4 sizing and print-specific styles
- **DOCX generation:** Python scripts using `python-docx` with manual styling (no template files). JS DOCX scripts use `docx` npm package
- **Dependencies:** All consolidated in root `package.json`. No inner package.json files — `require()` walks up to root `node_modules/`
- **Tay chatbot:** Claude-powered bot embedded in the Interactive Pitch. Netlify Function (`netlify/functions/chat.js`) proxies to Claude API. Local dev server at `chat-bot/server.js`. Both share the same SYSTEM_PROMPT — keep in sync when proposal content changes
- **Netlify deployment:** `netlify.toml` publishes `clients/taylor-group/proposal-2.0/pitch/` (requires `index.html` copy of main HTML). Redirect `/api/chat` → `/.netlify/functions/chat`. ANTHROPIC_API_KEY set in Netlify env vars

## Brand & Design Tokens

- **Fonts (Interactive Pitch):** Inter for all text — headings (400), body (400/600), buttons (500), metadata (500). `font-feature-settings: 'cv01','cv02','ss01'` required.
- **Fonts (Static docs):** Source Serif 4 (headings), Source Sans 3 (body); Calibri in DOCX
- **Type scale:** Figma-sourced hierarchy: `--text-h0` (100px) through `--text-metadata` (12px). Headings use tight letter-spacing (-0.08em). Never use hardcoded `font-size` values — always use a `--text-*` token
- **Spacing tokens:** `--space-xs` (4px) through `--space-3xl` (56px). Use for padding/margin on main components
- **Radius tokens:** `--radius-sm` (8px), `--radius-md` (10px), `--radius-lg` (14px), `--radius-xl` (18px), `--radius-pill` (20px). `::after` top bars must use the same radius token as their parent card
- **Shadow tokens:** `--shadow-sm` through `--shadow-xl`, `--shadow-accent` for accent glow
- **Client-facing accent:** `#5436FF` (purple)
- **Internal docs accent:** `#c0392b` (red) — visually distinguishes internal from client-facing
- **Layout:** Single `--content-w: 960px` column for interactive pitch. No breakout widths (causes asymmetry with sidebar)
- **CSS print essentials:** `print-color-adjust: exact`, `-webkit-print-color-adjust: exact` for background colors
- **Full design system:** See `DESIGN.md` for complete token reference, component catalog, and accessibility specs

## Key Conventions

- **Pricing:** Value-based, project fees only. Never expose hourly rates in client-facing documents
- **Proposal structure:** Phase-based options (e.g., INTAKE alone vs. INTAKE + DISCOVERY bundle). 2-option pricing preferred over 3-tier when options map to distinct phases
- **Bibliography:** All client-facing statistics must have verified sources. Source tracking in `proposal-2.0/bibliography/Sources-Interactive-Pitch.md`
- **Language:** Client-facing in English; internal docs and one-pagers in Argentine Spanish
- **Document pairs:** Each client has a client-facing proposal + internal breakdown with cost/hour/profitability analysis

## Interactive Pitch Patterns (Taylor Group)

- **Scroll animations:** IntersectionObserver with low thresholds (0.05–0.15) for early triggers. Never use threshold > 0.2
- **Scroll-reveal text:** Groups `.scroll-reveal` paragraphs per section into one continuous word stream. Uses scroll position, not IntersectionObserver. Effect must be very subtle: opacity 0.55→1, 150ms transition, NO blur
- **Expand/collapse:** Always use `max-height` + `opacity` CSS transitions (never `display:none/block`) for animatable expand/collapse
- **Sidebar nav tracking:** Scroll-based `offsetTop` comparison, not IntersectionObserver (fails on tall sections)
- **Card accent diversity:** Three distinct treatments to avoid AI-slop monoculture: (1) `::after` top gradient bar for finding-cards and stat-cards, (2) `border-left` / `::before` left bar for boxes, CBE cards, and pillar cards, (3) neutral border with hover accent for competitor cards. Never use the same accent pattern on all card types
- **Card hover effects:** `translateY(-2px)` + elevated `box-shadow`. Gradient top borders via `::after` pseudo-elements (not `border-image`, which breaks `border-radius`)
- **Accessibility:** Skip-to-content link (visible on focus), minimum 44px touch targets, `role="tabpanel"` + `aria-labelledby` on pillar tabs, `aria-live="polite"` on chatbot messages. Chatbot error messages use `.tay-msg--error` (distinct visual style)
- **CBE diagram:** Lives in Section 04 (Digital Backbone). CSS animated flow phases that double as navigation for expandable content panels below. Never duplicate in Section 05
- **Backbone visualization:** SVG (not Canvas) — bezier curves, gradient nodes, `<animateMotion>` particles, hover highlighting via CSS classes. Printable, accessible
- **Backbone Before→After:** 5-stage dramatic reveal (red line fade → crossfade → hub scale-in → spokes draw → particles flow). Hub and sparks wrapped in `<g class="s04a-hub-group">` / `<g class="s04a-sparks">` for staged CSS control. Forward transition ~5s cinematic, backward ~0.8s instant
- **Mobile responsive (768px):** Phase stack → vertical accordion; paradigm table → stacked cards with `::before` labels; service matrix → phase cards with inline metadata grouped by service type via `order`; SVG viewBox cropped via JS (`10 0 820 680`) to remove annotation padding; phase card click scrolls to top on mobile
- **Data integrity:** All stats must have named, verified sources. Ranges preferred over rounded single numbers (e.g., "20 – 30%" not "30%"), with spaces around en-dash. No stat should appear more than once in the same section. Bibliography in Section 09 with clickable links
- **Source links:** Data-heavy sections end with a "Sources & methodology → 09" button linking to the references section
- **Netlify deploy:** `index.html` must be an exact copy of `Taylor-Group-Interactive-Pitch.html`. ALWAYS sync after editing: `cp ...Interactive-Pitch.html .../index.html`

## Workflow Orchestration

### 1. Plan Mode Default

- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Self-Improvement Loop

- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 3. Verification Before Done

- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 4. Demand Elegance (Balanced)

- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting it

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.
