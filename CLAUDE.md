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

- **Fonts:** Source Serif 4 (headings), Source Sans 3 (body) in HTML; Calibri in DOCX
- **Client-facing accent:** `#7A7AE6` (purple)
- **Internal docs accent:** `#c0392b` (red) — visually distinguishes internal from client-facing
- **CSS print essentials:** `print-color-adjust: exact`, `-webkit-print-color-adjust: exact` for background colors

## Key Conventions

- **Pricing:** Value-based, project fees only. Never expose hourly rates in client-facing documents
- **3-tier proposals:** Small anchor / Mid recommended / Large enterprise
- **Language:** Client-facing in English; internal docs and one-pagers in Argentine Spanish
- **Document pairs:** Each client has a client-facing proposal + internal breakdown with cost/hour/profitability analysis
