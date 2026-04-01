# Lessons Learned

## 2026-03-27

### Generic CSS selectors can silently capture elements from different components

**What happened:** `document.querySelectorAll('.po-item[role="button"]')` in the Phase Overview JS handler captured ALL `.po-item` elements in the document — including the new CBE accordion items that reuse the same class. Both handlers ran on the same click, fighting each other.

**Fix:** Scope the generic handler with `:not(.cbe-accordion)`: `document.querySelectorAll('.po-accordion:not(.cbe-accordion) .po-item[role="button"]')`.

**Rule:** When reusing CSS classes across different components, always scope JS event handlers to exclude the other component's container. Check for global `querySelectorAll` calls when adding new components that share classes.

---

### Click handlers on accordion items should target headers, not the full item

**What happened:** The CBE accordion bound its click handler to the entire `.po-item`, which meant clicking inside the expanded panel content would collapse it.

**Fix:** Bind to `item.querySelector('.po-item__header')` instead of `item`.

**Rule:** For expand/collapse components, always bind the toggle click to the header element, not the wrapper — otherwise interactive content inside the panel becomes unusable.

---

### `overflow:hidden` on cards clips absolutely-positioned children

**What happened:** The "Recommended" badge on the diagnosis card was `position:absolute; top:-14px` but the parent card had `overflow:hidden`, clipping the badge.

**Fix:** Removed `overflow:hidden` from `.invest-card`, added explicit `border-radius` to `.invest-card__head` and `.invest-card__footer` instead.

**Rule:** If a card needs children that overflow its bounds (badges, tooltips), don't use `overflow:hidden` on the card — apply border-radius to inner elements individually.

---

### Always sync index.html after editing the pitch

Netlify serves `index.html`, not `Taylor-Group-Interactive-Pitch.html`. Forgetting to `cp` means the deploy shows stale content. This was done correctly throughout this session but remains a perennial risk.

## 2026-04-01

### "Don't say X" is not the same as "doesn't know X"

**What happened:** The bot had pricing data ($18K, $42K, per-finding costs) embedded in its SYSTEM_PROMPT, with instructions to never share them. This is a semantic-only defense — a prompt injection could extract the data since the model has access to it.

**Fix:** Removed all dollar amounts from the prompt. The bot still describes engagement options qualitatively but has no access to specific figures.

**Rule:** For sensitive data in LLM prompts, prefer structural defense (don't include the data) over semantic defense (include it but say "don't share"). If the model doesn't need specific numbers to do its job, remove them.

---

### Duplicated config drifts silently

**What happened:** The SYSTEM_PROMPT was copy-pasted between `netlify/functions/chat.js` and `chat-bot/server.js`. The objeciones section had drifted — server.js was more detailed with different wording. Neither was "wrong" but they were inconsistent.

**Fix:** Extracted to `lib/tay-system-prompt.js` as single source of truth.

**Rule:** When 2+ files share identical config (prompts, constants, validation rules), extract to a shared module immediately. Don't wait for a third consumer to force it — drift starts with the second copy.

---

### Symmetric stacked clip-path shapes need equal slope per tier

**What happened:** The AI pyramid's tier 1 used 14% horizontal displacement per side while tiers 2-4 used 12%, creating a visible kink. The sides weren't straight lines even though each individual tier was symmetric.

**Fix:** For N tiers from point to full width: `50% / N` displacement per tier per side. With 4 tiers = 12.5% each.

**Rule:** Don't eyeball individual clip-path values. Calculate the per-tier slope from total geometry first, then derive each tier's coordinates.

---

### Don't present paraphrases as quotes

**What happened:** Several interstitial quotes were editorial text presented with quotation marks and firm attributions, but weren't direct citations from any paper. Research confirmed they were unattributable.

**Fix:** Replaced with real verifiable quotes from papers already in bibliography. Added paper name to all attributions.

**Rule:** If it's in quotation marks with an attribution, it must be a real citation with a traceable source. Otherwise frame it as editorial text without quotes.

---

### SYSTEM_PROMPT content drifts from HTML silently and catastrophically

**What happened:** The bot's SYSTEM_PROMPT had section numbering 03-08 completely wrong, engagement model names from an old version ("INTAKE/DISCOVERY" instead of "Core Diagnosis"), a company name that changed ("Taylor Group" → "Taylor Inc."), deliverables that don't exist in the HTML, and 7 dimensions instead of 5. The bot was confidently giving wrong information.

**Fix:** Full rewrite of SYSTEM_PROMPT by extracting content directly from the live HTML proposal. Every section verified against the actual source.

**Rule:** When the proposal HTML changes (section order, content, engagement models), the SYSTEM_PROMPT in `lib/tay-system-prompt.js` MUST be updated in the same session. Treat it like `index.html` sync — never ship without it. Consider adding a "last verified" date comment in the prompt file.
