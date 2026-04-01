# Architecture Decision Records

## ADR-001: CBE section format — accordion over bar+dropdown (2026-03-27)

**Status:** Accepted

**Context:** The CBE (Create-Build-Execute) section used a large dark bar with 120px titles and dropdown panels that stacked via `display:grid`. The user felt it didn't translate the original idea well.

**Decision:** Replace with accordion format matching the Phase Overview (Section 07) — reusing `.po-item` classes with CBE-specific overrides (`.cbe-accordion`). Titles at 80px, capability grid inside panels.

**Consequences:**
- Consistent visual language between CBE and Phase Overview sections
- Old CBE CSS (`.cbe-bar`, `.cbe-dropdowns`) is now dead code — cleanup needed
- Required separating JS event handlers (CBE accordion vs generic `.po-item` accordion) with `:not(.cbe-accordion)` selector

---

## ADR-002: Bot never discusses pricing (2026-03-27)

**Status:** Accepted

**Context:** The bot (Tay) previously had a nuanced pricing policy — it could discuss pricing qualitatively but not share specific amounts. The user decided the bot should never discuss pricing at all.

**Decision:** Updated SYSTEM_PROMPT in both backends with explicit instruction to never discuss pricing, costs, fees, or investment amounts — not even qualitatively. Redirects to `fermin@aztransform.com`.

**Consequences:**
- Both `netlify/functions/chat.js` and `chat-bot/server.js` must stay in sync
- Suggested questions redesigned to avoid pricing-related topics
- Bot greeting updated to not mention pricing

---

## ADR-003: Bot opens only on user click (2026-03-27)

**Status:** Accepted
**Supersedes:** Previous proactive-open behavior (scroll 50% + 10s timeout)

**Context:** The bot auto-opened when the user scrolled 50% down the page or after 10s idle. The user explicitly wanted it to only open on click.

**Decision:** Removed all proactive open logic (scroll listener, timeout, `scheduleProactive` function). Badge notification remains as passive indicator.

---

## ADR-004: Diagnosis section — 2 engagement models without pricing (2026-03-27)

**Status:** Accepted
**Supersedes:** Previous 2-option pricing cards (Option 1/Option 2 with US$XX,XX)

**Context:** The diagnosis cards previously showed phase badges (Intake/Discovery) and placeholder pricing. The user wanted a complete redesign with new content structure.

**Decision:** Two named models — "Core Diagnosis" and "Diagnosis + Change Enablement" (recommended). Each has "What Taylor receives" and "How it's built" sections. No pricing shown. Cards have distinct visual treatments (accent border + gradient + glow for recommended).

---

## ADR-005: AI pyramid — proportional clip-path shape (2026-03-27)

**Status:** Superseded by ADR-008

**Context:** The AI adoption pyramid had hardcoded widths (30%, 52%, 74%, 96%) that didn't reflect the actual percentages (7%, 31%, 30%, 32%).

**Decision:** True pyramid shape using `clip-path:polygon()` trapezoids. Each tier's width is proportional to its percentage. Labels positioned outside to the right.

---

## ADR-006: Spacing normalization — 3-tier token system (2026-04-01)

**Status:** Accepted

**Context:** Spacing across the pitch was inconsistent — margins ranged from 13px to 48px with no pattern. Same relationship (text→graphic) used different values in different sections. Most values were hardcoded pixels, not tokens.

**Decision:** Normalize all structural spacing to three tiers:
- `--space-xl` (32px) — between text and major visual components (grids, charts, tables, cards)
- `--space-lg` (24px) — inline elements (boxes, blockquotes, small tables), h2→text, h4 top margin
- `--space-md` (16px) — paragraph→paragraph, h3 bottom, ul/ol margin

**Consequences:**
- ~30 CSS rules updated from hardcoded px to token variables
- Internal micro-spacing within cards (2-6px) left hardcoded intentionally
- Intentional large gaps (120px, 160px for "page breaks") left as inline styles
- Future spacing changes can be made by adjusting token values in `:root`

---

## ADR-007: Quote attribution format — paper + author (2026-04-01)

**Status:** Accepted

**Context:** Interstitial quotes only showed the firm name (e.g., "— Accenture"). No reference to the specific paper, reducing credibility and traceability.

**Decision:** All interstitial quotes now show: paper name in italics on first line, firm name with em-dash on second line. Typographic curly quotes `" "` on all quotes. Every quote must have a corresponding entry in the Section 09 references table.

---

## ADR-008: AI pyramid — symmetric straight sides with pointy tip (2026-04-01)

**Status:** Accepted
**Supersedes:** ADR-005

**Context:** ADR-005 created proportional widths per tier, but the tip was flat (42%–58%) and the slope wasn't uniform — tier 1 had 14% per side while tiers 2-4 had 12%, creating a visible kink.

**Decision:** Tip converges at `50% 0%` (true point). Each tier contributes exactly 12.5% per side (50% / 4 tiers) for perfectly straight edges. Labels repositioned to match new right edges (62.5%, 75%, 87.5%, 100%).

---

## ADR-009: AI sub-accordions in HBW layer 3 (2026-04-01)

**Status:** Accepted

**Context:** The "Artificial Intelligence" card in How Digital Backbone Works showed all 4 AI types (Copilots, Generative, Analytical, Autonomous) as full subsections, making the expanded card very long.

**Decision:** Convert 4 subsections to collapsible mini-accordions (`.hbw-sub`). Header always visible (title + short description + toggle). Detail expands on click. JS uses `stopPropagation()` to prevent closing the parent HBW accordion. Animation via `max-height` + `opacity` per CLAUDE.md convention.

---

## ADR-010: Remove pricing data from bot SYSTEM_PROMPT (2026-04-01)

**Status:** Accepted
**Supersedes:** Part of ADR-002 (pricing restriction was semantic-only)

**Context:** ADR-002 instructed the bot to never discuss pricing, but the SYSTEM_PROMPT still contained exact dollar amounts ($18K, $42K, per-finding costs, friction estimates). A prompt injection attack could extract this data since the model has access to it regardless of instructions.

**Decision:** Remove all dollar amounts from the SYSTEM_PROMPT. The bot retains qualitative descriptions of findings and engagement options but has no access to specific pricing figures. Defense moved from semantic ("don't say this") to structural ("doesn't know this").

**Consequences:**
- Bot can still describe engagement options, deliverables, and timelines — just not prices
- Prompt injection for pricing extraction is now impossible (data doesn't exist in context)
- Both backends updated simultaneously via shared module

---

## ADR-011: Shared SYSTEM_PROMPT module (2026-04-01)

**Status:** Accepted

**Context:** The SYSTEM_PROMPT was duplicated in `netlify/functions/chat.js` and `clients/.../chat-bot/server.js`. They had already drifted (objeciones section was more detailed in server.js). Adding a third consumer (streaming function) would make drift worse.

**Decision:** Extract to `lib/tay-system-prompt.js` — exports SYSTEM_PROMPT, MODEL, MAX_TOKENS, TEMPERATURE, ALLOWED_ORIGINS, validateMessages(), buildSystemPrompt(). All three consumers import from this single file.

**Consequences:**
- Any prompt or config change is a single-file edit
- `chat-stream.mjs` (ESM) imports via `createRequire()` to consume the CJS module
- Relative import paths are long (`../../../../lib/...` for server.js) but functional

---

## ADR-012: SSE streaming via Netlify Functions v2 (2026-04-01)

**Status:** Accepted

**Context:** Bot responses (256→384 tokens) take 1-3 seconds. Users see only bouncing dots during this wait. Streaming gives immediate feedback.

**Decision:** New endpoint `/api/chat-stream` using Netlify Functions v2 format (ESM, `export default`, `Response` with `ReadableStream`). Returns SSE (`data: {"text":"..."}\n\n`). Frontend tries streaming first, falls back to `/api/chat` (v1 non-streaming) on error.

**Consequences:**
- First use of Functions v2 in the project — needs production verification
- Fallback ensures zero downtime if v2 has issues
- `esbuild` bundler must handle `.mjs` + `createRequire` — verified working in production

---

## ADR-013: Full SYSTEM_PROMPT rewrite from HTML source (2026-04-02)

**Status:** Accepted
**Supersedes:** All previous prompt content (was severely outdated)

**Context:** Content audit revealed the SYSTEM_PROMPT was out of sync with the HTML proposal. Section numbering 03-08 was completely wrong, engagement models had old names ("INTAKE/DISCOVERY" vs "Core Diagnosis/Diagnosis + Change Enablement"), company was "Taylor Group" instead of "Taylor Inc.", deliverables didn't match, and dimensions were 7 instead of 5.

**Decision:** Full rewrite of SYSTEM_PROMPT by extracting content directly from the live HTML. Every section (01-09) rewritten to match the actual proposal. Engagement models, deliverables, phase durations, dimensions, and company name all updated.

**Consequences:**
- Bot now gives accurate information matching what the user sees in the proposal
- Any future changes to the HTML proposal must be reflected in `lib/tay-system-prompt.js`
- Section references in bot responses are now clickable links that scroll to the correct section

---

## ADR-014: Scroll-to-section from bot responses (2026-04-02)

**Status:** Accepted

**Context:** The bot references sections by number ("Section 06 — Key Findings") but the user had to manually scroll to find them.

**Decision:** `formatResponse()` regex detects section references and converts them to clickable `<a>` tags with `data-section` attribute. Click triggers `scrollIntoView({behavior:'smooth'})` and auto-closes the chat panel. `SECTION_MAP` maps section numbers to HTML element IDs.

**Consequences:**
- Bot responses become navigational — users can jump to any section the bot mentions
- Chat auto-closes on section link click so user can see the content
- `SECTION_MAP` must stay in sync with actual section order in HTML
