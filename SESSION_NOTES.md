# Session Notes

## Sesión 2026-04-01 / 2026-04-02

### Qué se hizo

**Auditoría completa del Tay chatbot** — 3 agentes paralelos auditaron frontend, backend Netlify, y backend dev. Reporte de hallazgos en 6 categorías. Plan P0–P3 priorizado y ejecutado completo.

**P0 — Seguridad:**
- Removidos datos de pricing del SYSTEM_PROMPT ($18K/$42K, costos por finding, friction estimates)
- CORS restringido de `*` a allowlist: `taylor.transformaz.co` + localhost + `*.netlify.app`
- Rate limiting 10 req/min por IP en Netlify function (in-memory Map con cleanup)
- Input validation: formato de mensajes (role/content string), max 1000 chars

**P1 — UX + Arquitectura:**
- SYSTEM_PROMPT extraído a módulo compartido `lib/tay-system-prompt.js` (single source of truth)
- Endpoint SSE streaming `netlify/functions/chat-stream.mjs` (Netlify Functions v2)
- Frontend reescrito: streaming con fallback a non-streaming
- Greeting limpiado (sin mención a pricing), `temperature:0.3`, `max_tokens:384`
- `maxlength="500"` en input, `aria-label` dinámico en FAB

**P2 — Robustez:**
- AbortController 15s timeout en todos los fetch
- Retry con 1.5s backoff en errores 500+ (solo fallback endpoint)
- Focus trap en chat dialog (Tab cycles input → send → pills)
- Markdown parser mejorado: inline code, links, listas numeradas

**P3 — Analytics + Error UX:**
- Structured JSON logs en ambas Netlify Functions (section, question truncada, turn count)
- `errorMsg()` helper con 5 estados: offline, rate-limited, timeout, server error, genérico
- `isRetryable()` evita fallback en errores no recuperables

**Chrome password prompt fix:**
- Input cambiado a `type="search"` + `autocomplete="one-time-code"` + `<form role="search">`

**SYSTEM_PROMPT reescrito completo (CRÍTICO):**
- Contenido estaba totalmente desactualizado vs HTML actual
- Numeración de secciones 03-08 estaba cruzada
- Engagement models decían "INTAKE/DISCOVERY" pero el HTML dice "Core Diagnosis/Diagnosis + Change Enablement"
- Company name "Taylor Group" → "Taylor Inc.", $85M revenue removido (no existe en HTML)
- Deliverables actualizados, dimensiones corregidas (5, no 7), títulos de secciones actualizados

**Scroll-to-section:**
- `SECTION_MAP` mapeando números de sección a IDs de HTML
- `formatResponse()` convierte "Section 06 — Key Findings" en links clickeables
- Click en link → `scrollIntoView` suave + auto-close del chat
- CSS `.tay-section-link` con pill style purple
- Event delegation en `msgs` container
- Testeado end-to-end en producción con Playwright

**Pitch cleanup:**
- CSS muerto del viejo CBE: ya no existía (limpiado en sesión anterior)
- Deduplicado CSS responsive de pirámide AI
- Removido `invest-card__price` dead CSS
- `hbw-sub` description text wrap en mobile
- `--content-w` ya reconciliado (1120px en ambos)

### Dónde quedamos
- Commit `4fba6c2` pushed a main, todo deployado en taylor.transformaz.co
- Bot testeado en producción: streaming funciona, scroll-to-section funciona
- Toda la auditoría P0–P3 + cleanup completada

### Problemas abiertos
- Header del chat dice "Taylor Group Assistant" — debería decir "Taylor Inc. Assistant" para consistencia (cambio menor en HTML)
- La función streaming `chat-stream.mjs` usa `createRequire` para importar CJS — funciona pero es un patrón frágil. Si se migra `lib/tay-system-prompt.js` a ESM en el futuro, simplificar
- Los console errors en producción (2 en el test de Playwright) no se investigaron — podrían ser benignos o no

### Para la próxima sesión
- Empezar por: verificar los 2 console errors en producción
- Opcional: cambiar "Taylor Group Assistant" → "Taylor Inc. Assistant" en el header del chat
- El bot está completo — no hay más items pendientes de la auditoría
- Quedan pendientes de pitch visual: responsive mobile de pirámide AI y diagnosis cards (verificación visual), fuente de la quote "Everyone is buying AI tools"
