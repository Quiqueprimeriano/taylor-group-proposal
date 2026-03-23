# Repo Reorganization Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Clean up the TransformAZ repo — delete junk, relocate misplaced files, consolidate scripts per client.

**Architecture:** Pure file moves (`git mv`) and deletions (`git rm`). No code changes except updating `path.resolve(__dirname, ...)` references in moved scripts and the `publish` path in `netlify.toml`. All scripts use `__dirname`-relative paths so internal logic stays the same.

**Tech Stack:** git, bash

---

## Principles

1. **Netlify constraints:** `netlify.toml` must stay at repo root. Its `publish` path must match the final location of the pitch folder.
2. **`__dirname` safety:** Scripts using `path.resolve(__dirname, ...)` work from wherever they live — but if a script references sibling files, both must move together.
3. **No nested `node_modules`:** After reorg, consolidate deps to root `package.json` only.
4. **Git history:** Use `git mv` so renames are tracked.

---

### Task 1: Delete junk files

**Files:**
- Delete: `package 2.json` (exact duplicate of package.json, missing only `docx` dep)
- Delete: `Taylor Group/proposal-2.0/pitch/~$ylor-Group-Strategic-Pitch.docx` (Word temp/lock file)

**Step 1: Remove files**

```bash
git rm "package 2.json"
rm "Taylor Group/proposal-2.0/pitch/~$ylor-Group-Strategic-Pitch.docx"
```

**Step 2: Commit**

```bash
git add -A && git commit -m "chore: delete duplicate package.json and Word temp file"
```

---

### Task 2: Move misplaced PDF out of chat-bot/

**Files:**
- Move: `Taylor Group/proposal-2.0/chat-bot/Time To Transform - transformaz (1).pdf` → `Taylor Group/proposal-2.0/bibliography/`

**Step 1: Move**

```bash
mv "Taylor Group/proposal-2.0/chat-bot/Time To Transform - transformaz (1).pdf" "Taylor Group/proposal-2.0/bibliography/"
```

Note: This file is gitignored (*.pdf), so just a local filesystem move.

---

### Task 3: Move root-level SME screenshot script into SME-Group/

The root `take-screenshots.js` uses `path.resolve(__dirname, 'SME-Group-Transformation-Proposal.html')` — it's an SME-Group script living at the wrong level.

**Files:**
- Move: `take-screenshots.js` → `SME-Group/take-screenshots.js`
- Modify: Update the HTML path inside from `'SME-Group-Transformation-Proposal.html'` to `'SME-Group-Transformation-Proposal.html'` (already correct since __dirname changes)

Wait — the script uses `__dirname` and references the HTML file as a sibling. Currently at root, it points to `SME-Group-Transformation-Proposal.html` which would NOT exist at root level. Let's check...

Actually, root has no `SME-Group-Transformation-Proposal.html`. The file is at `SME-Group/SME-Group-Transformation-Proposal.html`. The script at root uses `path.resolve(__dirname, 'SME-Group-Transformation-Proposal.html')` which would fail. So either:
- The script was already moved from SME-Group/ to root by accident, or
- The path is wrong

**Step 1: Move script**

```bash
git mv take-screenshots.js SME-Group/take-screenshots.js
```

No path edit needed — the script already expects the HTML as a sibling, and in `SME-Group/` it IS a sibling.

**Step 2: Update root `package.json` main field**

Change `"main": "take-screenshots.js"` to remove this stale reference.

**Step 3: Commit**

```bash
git add -A && git commit -m "chore: move SME screenshot script to its client folder"
```

---

### Task 4: Move Taylor-specific generation scripts into Taylor Group/

Two scripts at root generate Taylor Group deliverables:
- `generate-agenda-docx.js` — generates agenda DOCX (output likely goes to Taylor Group/)
- `generate-ceo-review-pdf.js` — generates CEO review PDF (idem)

**Files:**
- Move: `generate-agenda-docx.js` → `Taylor Group/scripts/generate-agenda-docx.js`
- Move: `generate-ceo-review-pdf.js` → `Taylor Group/scripts/generate-ceo-review-pdf.js`

**Step 1: Create target directory and move**

```bash
mkdir -p "Taylor Group/scripts"
git mv generate-agenda-docx.js "Taylor Group/scripts/"
git mv generate-ceo-review-pdf.js "Taylor Group/scripts/"
```

**Step 2: Check and fix output paths in both scripts**

Both scripts use `__dirname`-relative paths. After moving, any relative references to files outside the new location (e.g., `../TODOS.md`) need updating. Read each script's output path and adjust.

**Step 3: Commit**

```bash
git add -A && git commit -m "chore: move Taylor generation scripts to client folder"
```

---

### Task 5: Move findings.md into proposal-2.0/

`Taylor Group/findings.md` is research from proposal-2.0 analysis.

**Files:**
- Move: `Taylor Group/findings.md` → `Taylor Group/proposal-2.0/research/findings.md`

**Step 1: Move**

```bash
mkdir -p "Taylor Group/proposal-2.0/research"
git mv "Taylor Group/findings.md" "Taylor Group/proposal-2.0/research/"
```

**Step 2: Commit**

```bash
git add -A && git commit -m "chore: move findings.md to proposal-2.0/research/"
```

---

### Task 6: Move Bibliografía/ into Taylor Group research

Root-level `Bibliografía/` contains McKinsey papers used in Taylor Group proposal research.

**Files:**
- Move: `Bibliografía/` contents → `Taylor Group/proposal-2.0/research/bibliografía/`

**Step 1: Move**

```bash
mkdir -p "Taylor Group/proposal-2.0/research/bibliografía"
git mv Bibliografía/* "Taylor Group/proposal-2.0/research/bibliografía/"
rmdir Bibliografía
```

Note: The PDFs inside are gitignored. The HTML/PDF pair for McKinsey OnePager may be tracked — use `git mv` for tracked files, `mv` for untracked.

**Step 2: Commit**

```bash
git add -A && git commit -m "chore: move Bibliografía into Taylor research folder"
```

---

### Task 7: Archive completed planning docs

`task_plan.md` is fully completed (all phases ✅). `TODOS.md` has active items but is a CEO review output. `docs/plans/` already has the pitch polish plan.

**Files:**
- Move: `task_plan.md` → `docs/plans/2026-03-11-taylor-proposal-plan.md` (completed)
- Keep: `TODOS.md` at root (active items, P1/P2 priority)
- Keep: `docs/plans/2026-03-23-pitch-design-polish.md` (already correct)

**Step 1: Move**

```bash
git mv task_plan.md "docs/plans/2026-03-11-taylor-proposal-plan.md"
```

**Step 2: Commit**

```bash
git add -A && git commit -m "chore: archive completed task plan to docs/plans/"
```

---

### Task 8: Consolidate node_modules to root only

Currently 3 separate `node_modules/` + `package.json`:
- Root: playwright, docx, @anthropic-ai/sdk
- `Taylor Group/proposal-2.0/chat-bot/`: @anthropic-ai/sdk, cors, dotenv, express
- `Taylor Group/proposal-2.0/pitch/`: docx, jszip, playwright

The pitch and chatbot packages duplicate root deps. After reorg:
- Root `package.json` should include ALL deps
- Delete inner `package.json` + `node_modules/` from pitch/ and chat-bot/
- Scripts use `require()` which walks up to root `node_modules/`

**Step 1: Merge deps into root package.json**

Add to root: `cors`, `dotenv`, `express` (from chat-bot). `docx`, `jszip` are already at root or in pitch.

```bash
npm install cors dotenv express jszip
```

**Step 2: Remove inner package files**

```bash
git rm "Taylor Group/proposal-2.0/pitch/package.json" "Taylor Group/proposal-2.0/pitch/package-lock.json"
rm -rf "Taylor Group/proposal-2.0/pitch/node_modules"
git rm "Taylor Group/proposal-2.0/chat-bot/package.json" "Taylor Group/proposal-2.0/chat-bot/package-lock.json"
rm -rf "Taylor Group/proposal-2.0/chat-bot/node_modules"
```

Note: Keep `SME-Group/package.json` for now — it may have its own deps.

**Step 3: Verify scripts still resolve modules**

```bash
node -e "require('docx'); require('playwright'); require('cors'); require('express'); console.log('OK')"
```

**Step 4: Commit**

```bash
git add -A && git commit -m "chore: consolidate all npm deps to root package.json"
```

---

### Task 9: Update .gitignore and cleanup

**Files:**
- Modify: `.gitignore` — add `screenshots/`, `.DS_Store` recursively, `~$*` (Word temp files)

**Step 1: Update .gitignore**

```
.DS_Store
node_modules/
.claude/
*.pdf
.env
~$*
screenshots/
```

**Step 2: Remove tracked .DS_Store files**

```bash
find . -name ".DS_Store" -exec git rm --cached {} \; 2>/dev/null
```

**Step 3: Commit**

```bash
git add -A && git commit -m "chore: update .gitignore, remove tracked .DS_Store files"
```

---

### Task 10: Update CLAUDE.md build commands

After moves, the build commands in CLAUDE.md need updating:

```markdown
## Build Commands

```bash
# Generate PDFs
node SME-Group/generate-pdf.js           # SME proposals → PDF
node "Taylor Group/proposal-2.0/generate-pdf.js"  # Taylor static docs → PDF

# Generate DOCX
node "Taylor Group/scripts/generate-agenda-docx.js"
node "Taylor Group/proposal-2.0/pitch/generate-full-pitch-docx.js"

# Screenshots
node SME-Group/take-screenshots.js
node "Taylor Group/proposal-2.0/pitch/take-screenshots.js"
```
```

**Step 1: Edit CLAUDE.md**

Update the Build Commands section.

**Step 2: Commit**

```bash
git add CLAUDE.md && git commit -m "docs: update build commands after repo reorganization"
```

---

## Final Structure (after all tasks)

```
TransformAZ/
├── CLAUDE.md
├── DESIGN.md
├── TODOS.md                              ← active business TODOs
├── .gitignore
├── netlify.toml                          ← Netlify deploy config (must be at root)
├── package.json                          ← all deps consolidated here
├── node_modules/
├── netlify/functions/chat.js             ← Netlify serverless function
│
├── docs/plans/                           ← archived plans
│   ├── 2026-03-11-taylor-proposal-plan.md
│   ├── 2026-03-23-pitch-design-polish.md
│   └── 2026-03-23-repo-reorganization.md
│
├── SME-Group/
│   ├── *.html, *.docx, *.pptx           ← proposals + deliverables
│   ├── generate-onepager-docx.py
│   ├── take-screenshots.js               ← moved from root
│   └── screenshots/
│
└── Taylor Group/
    ├── scripts/                           ← generation scripts
    │   ├── generate-agenda-docx.js
    │   └── generate-ceo-review-pdf.js
    ├── proposal-1.0/                      ← v1 archive (markdown)
    ├── proposal-2.0/
    │   ├── generate-pdf.js                ← generates static PDFs
    │   ├── research/                      ← NEW: consolidated research
    │   │   ├── findings.md
    │   │   └── bibliografía/              ← moved from root
    │   ├── bibliography/                  ← source tracking for pitch
    │   ├── benchmark/
    │   ├── strategy/
    │   ├── chat-bot/
    │   │   └── server.js                  ← no more local package.json
    │   └── pitch/
    │       ├── Taylor-Group-Interactive-Pitch.html
    │       ├── index.html
    │       ├── take-screenshots.js
    │       ├── generate-*.js
    │       └── screenshots/               ← gitignored
    ├── script notes/                      ← call transcripts
    ├── *.docx, *.pdf                      ← briefs, agendas
    └── generate-pdf.js                    ← generates v1 PDFs
```
