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
