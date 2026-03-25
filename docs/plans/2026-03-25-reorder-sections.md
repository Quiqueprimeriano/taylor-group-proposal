# Reorder Interactive Pitch Sections

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reorder all sections in `Taylor-Group-Interactive-Pitch-SYSTEM.DESIGN.html` to match the new narrative flow, update all section numbers, sidebar nav, and internal links.

**Architecture:** Single-file restructure. Extract each section block (comment + section + trailing interstitial) as a unit, reassemble in new order, then batch-update section-num labels and sidebar nav.

**Tech Stack:** HTML, CSS (no changes needed), JS (sidebar nav auto-tracks by scroll position — no JS changes needed)

---

## Current Order → New Order

| Current | Section ID | Current # | New # | New Title |
|---------|-----------|-----------|-------|-----------|
| 1 | `#opportunity` | 01 | 01 | THE OPPORTUNITY |
| 2 | `#paradigm` | 02 | 02 | The New Operating Paradigm |
| 3 | `#findings` | 03 | **06** | KEY FINDINGS |
| 4 | `#backbone` | 04 | **03** | THE DIGITAL BACKBONE |
| 5 | `#transformation` | 05 | **04** | The TRANSFORMATION APPROACH |
| 6 | `#market` | 06 | **08** | MARKET INSIGHTS |
| 7 | `#next-steps` | 07 | **05** | SERVICES & INVESTMENT |
| 8 | `#intake-proposal` | 08 | **07** | PHASE OVERVIEW |
| 9 | `#references` | 09 | 09 | REFERENCES |

## Section Blocks (line ranges in current file)

Each "block" = HTML comment + section + trailing interstitial (if any):

| Block | Lines | Content |
|-------|-------|---------|
| COVER | 1351–1365 | Cover section (stays first) |
| OPPORTUNITY | 1366–1393 | Section + Interstitial 1 |
| PARADIGM | 1395–1446 | Section + Interstitial (paradigm→findings) |
| FINDINGS | 1448–1549 | Section + Interstitial 2 |
| BACKBONE | 1551–1989 | Section + Interstitial 3 |
| TRANSFORMATION | 1991–2212 | Section (starts after interstitial 3) + Interstitial 4 |
| MARKET | 2214–2375 | Section (no trailing interstitial, next-steps follows directly) |
| NEXT-STEPS | 2376–2413 | Section + trailing interstitial |
| INTAKE-PROPOSAL | 2415–2543 | Section |
| REFERENCES | 2545–2702 | Section (includes footer) |

## New Assembly Order

```
COVER (unchanged)
OPPORTUNITY (01) + interstitial
PARADIGM (02) + interstitial
BACKBONE (03) + interstitial
TRANSFORMATION (04) + interstitial
NEXT-STEPS → renamed "Services & Investment" (05) + interstitial
FINDINGS (06) + interstitial
INTAKE-PROPOSAL → renamed "Phase Overview" (07)
MARKET (08)
REFERENCES (09)
```

**Interstitial reassignment:** Each interstitial currently has content thematically tied to its following section. When we move sections, we need to decide whether interstitials travel with the section they precede or the one they follow. The safest approach: keep each interstitial with the section it **introduces** (i.e., it travels with the section that follows it).

Current interstitial assignments:
- Inter 1 (line 1388): "Every satisfactory process is also a ceiling" → introduces paradigm thinking → keep before PARADIGM (02)
- Inter paradigm→findings (line 1443): "Tools are everywhere. Connectivity is not." → introduces findings → keep before FINDINGS (now 06)
- Inter 2 (line 1546): "Not new software. New connective tissue." → introduces backbone → keep before BACKBONE (now 03)
- Inter 3 (line 1985): "Only 16% of digital transformations fully succeed..." → introduces transformation → keep before TRANSFORMATION (now 04)
- Inter 4 (line 2209): "Everyone is buying AI tools..." → introduces market → keep before MARKET (now 08)
- Inter next-steps→intake (line 2410): "Clear baseline. No assumptions..." → introduces intake/phase overview → keep before PHASE OVERVIEW (07)

---

### Task 1: Extract all section blocks into named variables

**Files:**
- Modify: `clients/taylor-group/proposal-2.0/pitch/Taylor-Group-Interactive-Pitch-SYSTEM.DESIGN.html`

**Step 1: Read and memorize every block boundary**

The file structure between `<main>` tags is:
```
lines 1349-1350: <main class="main">
lines 1351-1365: COVER
lines 1366-1393: OPPORTUNITY + INTERSTITIAL_1
lines 1395-1446: PARADIGM + INTERSTITIAL_PF
lines 1448-1549: FINDINGS + INTERSTITIAL_2
lines 1551-1989: BACKBONE + INTERSTITIAL_3
lines 1991-2212: TRANSFORMATION + INTERSTITIAL_4
lines 2214-2375: MARKET
lines 2376-2413: NEXT_STEPS + INTERSTITIAL_NI
lines 2415-2543: INTAKE_PROPOSAL
lines 2545-2702: REFERENCES
lines 2703-2704: </main>
```

**Step 2: Reassemble in new order**

Replace everything between `<main>` opening and `</main>` closing with blocks in this order:

```
COVER
OPPORTUNITY + INTERSTITIAL_1
PARADIGM + INTERSTITIAL_2 (was before backbone, now follows paradigm)
BACKBONE + INTERSTITIAL_3
TRANSFORMATION + INTERSTITIAL_4 (was before market, now follows transformation since market moved later)
NEXT_STEPS + INTERSTITIAL_PF (was "paradigm→findings", repurpose or remove)
FINDINGS + INTERSTITIAL_NI (was next-steps→intake interstitial)
INTAKE_PROPOSAL
MARKET
REFERENCES
```

NOTE: Interstitial content should be reviewed — some may need text changes to fit their new context. Flag these for user review but don't change text without approval.

**Step 3: Commit**
```bash
git add clients/taylor-group/proposal-2.0/pitch/Taylor-Group-Interactive-Pitch-SYSTEM.DESIGN.html
git commit -m "refactor: reorder pitch sections to new narrative flow"
```

---

### Task 2: Update section numbers in HTML

**Files:**
- Modify: `clients/taylor-group/proposal-2.0/pitch/Taylor-Group-Interactive-Pitch-SYSTEM.DESIGN.html`

**Step 1: Update each `<span class="section-num">` to new number**

| Section ID | Old label | New label |
|-----------|-----------|-----------|
| `#opportunity` | `01 — The Opportunity` | `01 — The Opportunity` (unchanged) |
| `#paradigm` | `02 — The New Operating Paradigm` | `02 — The New Operating Paradigm` (unchanged) |
| `#backbone` | `04 — The Digital Backbone` | `03 — The Digital Backbone` |
| `#transformation` | `05 — The Transformation Approach` | `04 — The Transformation Approach` |
| `#next-steps` | `07 — Next Steps` | `05 — Services & Investment` |
| `#findings` | `03 — Key Findings` | `06 — Key Findings` |
| `#intake-proposal` | `08 — Intake Proposal` | `07 — Phase Overview` |
| `#market` | `06 — Market Insights` | `08 — Market Insights` |
| `#references` | `09` | `09` (unchanged) |

**Step 2: Update `<h2>` headings where title changed**

- `#next-steps`: h2 "Moving Forward" → "Defining the Path Forward"
- `#intake-proposal`: h2 whatever current → "Pre-Engagement + Intake + Discovery"

**Step 3: Commit**
```bash
git commit -am "refactor: update section numbers and titles for new order"
```

---

### Task 3: Update sidebar navigation

**Files:**
- Modify: same file, sidebar nav block (~lines 1332-1342)

**Step 1: Replace sidebar nav list**

```html
<ul class="sidebar__nav" role="list">
  <li><a href="#cover"><span class="nav-num">00</span> Cover</a></li>
  <li><a href="#opportunity"><span class="nav-num">01</span> The Opportunity</a></li>
  <li><a href="#paradigm"><span class="nav-num">02</span> New Paradigm</a></li>
  <li><a href="#backbone"><span class="nav-num">03</span> Digital Backbone</a></li>
  <li><a href="#transformation"><span class="nav-num">04</span> Transformation</a></li>
  <li><a href="#next-steps"><span class="nav-num">05</span> Services & Investment</a></li>
  <li><a href="#findings"><span class="nav-num">06</span> Key Findings</a></li>
  <li><a href="#intake-proposal"><span class="nav-num">07</span> Phase Overview</a></li>
  <li><a href="#market"><span class="nav-num">08</span> Market Insights</a></li>
  <li><a href="#references"><span class="nav-num">09</span> References</a></li>
</ul>
```

**Step 2: Commit**
```bash
git commit -am "refactor: update sidebar nav order and labels"
```

---

### Task 4: Update internal cross-references

**Step 1: Search for any `href="#section-id"` or `→ 09` style links that reference section numbers**

Common patterns:
- "Sources & methodology → 09" buttons at end of data-heavy sections
- Any internal links between sections
- The skip-to-content link

Grep for: `→ 0[0-9]`, `section 0`, `Section 0` to find references that use old numbers.

**Step 2: Update found references**

**Step 3: Commit**
```bash
git commit -am "fix: update internal cross-references to new section numbers"
```

---

### Task 5: Visual verification

**Step 1: Open in browser and verify:**
- Sections appear in correct order
- Sidebar nav matches and tracks correctly on scroll
- All interstitials display between correct sections
- Before/After toggle in Backbone (now 03) still works
- CBE diagram still expands
- Pillar tabs still switch
- No broken internal links

**Step 2: Check print preview**
- All sections render in correct order

---

## Risks

- **Interstitial context mismatch:** Some interstitial text was written for the section that originally followed it. After reordering, the text may feel out of place. Flag for user review.
- **JS Module F:** The backbone SVG generator targets `#backbone-vis` by ID — reordering doesn't change IDs, so this should be safe.
- **Scroll-reveal grouping:** Groups scroll-reveal words by parent section — since we're moving whole `<section>` blocks, grouping stays intact.
- **CSS section-specific rules:** Any CSS using `#backbone`, `#findings`, etc. as selectors will still work since IDs don't change.
