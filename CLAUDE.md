# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TransformAZ is a consulting firm's deliverable generation system. Each client gets a subfolder containing HTML documents (proposals, internal breakdowns, one-pagers) that are converted to PDF and DOCX formats.

## Build Commands

```bash
# Generate PDFs from HTML (per client folder)
node SME-Group/generate-pdf.js
node "Taylor Group/generate-pdf.js"

# Generate DOCX from Python script
python3 SME-Group/generate-onepager-docx.py

# Take screenshots for presentations
node SME-Group/take-screenshots.js
```

**Dependencies:** Playwright (chromium) for HTML→PDF, python-docx for DOCX generation.

## Architecture

- **Client folders:** `SME-Group/`, `Taylor Group/` — each contains HTML source documents, generation scripts, and output files (PDF/DOCX)
- **HTML→PDF pipeline:** Playwright with `printBackground: true`, zero margins, `preferCSSPageSize: true`. HTML files use `@page` CSS for A4 sizing and print-specific styles
- **DOCX generation:** Python scripts using `python-docx` with manual styling (no template files)

## Brand & Design Tokens

- **Fonts (Interactive Pitch):** Source Serif 4 (headings), Inter with `font-feature-settings: 'cv01','cv02','ss01'` (body), JetBrains Mono (data/mono)
- **Fonts (Static docs):** Source Serif 4 (headings), Source Sans 3 (body); Calibri in DOCX
- **Type scale:** 1.25 Major Third ratio with 12 CSS tokens (`--text-3xs` through `--text-5xl`). Never use hardcoded `font-size` values — always use a `--text-*` token
- **Client-facing accent:** `#7A7AE6` (purple)
- **Internal docs accent:** `#c0392b` (red) — visually distinguishes internal from client-facing
- **Layout:** Single `--content-w: 960px` column for interactive pitch. No breakout widths (causes asymmetry with sidebar)
- **CSS print essentials:** `print-color-adjust: exact`, `-webkit-print-color-adjust: exact` for background colors

## Key Conventions

- **Pricing:** Value-based, project fees only. Never expose hourly rates in client-facing documents
- **Proposal structure:** Phase-based options (e.g., INTAKE alone vs. INTAKE + DISCOVERY bundle). 2-option pricing preferred over 3-tier when options map to distinct phases
- **Bibliography:** All client-facing statistics must have verified sources. Source tracking in `proposal-2.0/bibliography/Sources-Interactive-Pitch.md`
- **Language:** Client-facing in English; internal docs and one-pagers in Argentine Spanish
- **Document pairs:** Each client has a client-facing proposal + internal breakdown with cost/hour/profitability analysis

## Interactive Pitch Patterns (Taylor Group)

- **Scroll animations:** IntersectionObserver with low thresholds (0.05–0.15) for early triggers. Never use threshold > 0.2
- **Scroll-reveal text:** Groups `.scroll-reveal` paragraphs per section into one continuous word stream. Uses scroll position, not IntersectionObserver
- **Expand/collapse:** Always use `max-height` + `opacity` CSS transitions (never `display:none/block`) for animatable expand/collapse
- **Sidebar nav tracking:** Scroll-based `offsetTop` comparison, not IntersectionObserver (fails on tall sections)
- **Card hover effects:** `translateY(-2px)` + elevated `box-shadow`. Gradient top borders via `::after` pseudo-elements (not `border-image`, which breaks `border-radius`)
- **CBE diagram:** CSS animated flow phases that double as navigation for expandable content panels below
