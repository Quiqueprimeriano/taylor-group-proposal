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

**Status:** Accepted

**Context:** The AI adoption pyramid had hardcoded widths (30%, 52%, 74%, 96%) that didn't reflect the actual percentages (7%, 31%, 30%, 32%).

**Decision:** True pyramid shape using `clip-path:polygon()` trapezoids. Each tier's width is proportional to its percentage. Labels positioned outside to the right.
