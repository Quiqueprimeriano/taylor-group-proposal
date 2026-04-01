# Plan — Taylor Group Interactive Pitch

## Completado (2026-03-27)

- [x] CBE section: reemplazar bar+dropdown por acordeón con títulos oversized
- [x] Diagnosis section: rediseñar cards (Core Diagnosis vs Diagnosis + Change Enablement)
- [x] Bot: eliminar auto-open, bloquear pricing, preguntas que desaparecen al clickear
- [x] Sección 02: fusionar párrafos, eliminar bridge paragraph
- [x] Pirámide AI: forma proporcional real con clip-path
- [x] AI Journey: texto alineado izquierda, tipografía comprimida
- [x] Findings hero: layout columna para label debajo de números
- [x] Interstitial: cita BCG
- [x] Eliminar "Your competitors aren't waiting" paragraph
- [x] Espacio visual entre diagrama Before/After y "Digital Backbone addresses this gap"

## Completado (2026-04-01)

- [x] Pirámide AI: punta puntiaguda + simetría perfecta (12.5% por tier)
- [x] Eliminar líneas violetas de interstitials
- [x] Atribuciones de quotes con paper + autor
- [x] Spacing normalización completa (3-tier token system)
- [x] Fusionar párrafos $128B + bold en frase final
- [x] Quote BCG real reemplazando "Not a lack of capability"
- [x] Sub-accordions AI dentro de HBW layer 3
- [x] 160px separador entre "Defining the Path Forward" y "Diagnosis Engagement Models"
- [x] Link "Sources & methodology → 09" en sección opportunity
- [x] Comillas tipográficas en todas las quotes
- [x] "Estimated annual impact*" (sin "Aggregate")

## Completado (2026-04-01) — Bot Hardening

- [x] P0: Remover datos de pricing del SYSTEM_PROMPT (ambos backends)
- [x] P0: Restringir CORS a allowlist (taylor.transformaz.co + localhost + *.netlify.app)
- [x] P0: Rate limiting 10 req/min por IP en Netlify function
- [x] P0: Input validation (formato, 1000 chars max)
- [x] P1: Extraer SYSTEM_PROMPT a módulo compartido (lib/tay-system-prompt.js)
- [x] P1: Crear endpoint de streaming SSE (chat-stream.mjs, Functions v2)
- [x] P1: Frontend streaming con fallback a non-streaming
- [x] P1: Greeting sin mención a pricing
- [x] P1: maxlength=500 en input, aria-label dinámico en FAB
- [x] P1: temperature:0.3, max_tokens:384
- [x] Sincronizar SYSTEM_PROMPT entre backends (eliminado drift en objeciones)

## Completado (2026-04-01/02) — Bot P2 (Robustez)

- [x] AbortController 15s timeout en todos los fetch
- [x] Retry con 1.5s backoff en errores 500+ (solo fallback)
- [x] Focus trap en dialog (Tab cycling input → send → pills)
- [x] Markdown parser: inline code, links, listas numeradas

## Completado (2026-04-01/02) — Bot P3 (Analytics + Error UX)

- [x] Structured JSON logs en ambas Netlify Functions
- [x] 5 error states diferenciados (offline, rate-limit, timeout, server, genérico)
- [x] isRetryable() para evitar fallback en errores no recuperables

## Completado (2026-04-01/02) — Bot Extras

- [x] Chrome password prompt fix (type="search" + autocomplete="one-time-code")
- [x] SYSTEM_PROMPT reescrito completo — contenido matchea HTML actual
- [x] Section numbering corregida (03-08 estaban cruzadas)
- [x] Engagement models actualizados (Core Diagnosis / Diagnosis + Change Enablement)
- [x] Company name corregido (Taylor Inc.), $85M revenue removido
- [x] Scroll-to-section: links clickeables en respuestas del bot
- [x] SECTION_MAP corregido en frontend

## Completado (2026-04-01/02) — Pitch Cleanup

- [x] CSS muerto CBE: ya no existía
- [x] Deduplicado CSS responsive pirámide AI, removido invest-card__price dead CSS
- [x] hbw-sub text wrap en mobile
- [x] --content-w reconciliado (1120px)
- [x] "Not a lack of capability": solo 1 aparición, no había duplicado
- [x] "Everyone is buying AI tools": texto editorial sin comillas, no necesita fuente

## Pendiente — Minor

- [ ] Cambiar "Taylor Group Assistant" → "Taylor Inc. Assistant" en header del chat
- [ ] Investigar 2 console errors en producción (detectados en test Playwright)

## Próximo milestone

QA visual completo del pitch (responsive, cross-browser). El bot está completo.
