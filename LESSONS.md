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
