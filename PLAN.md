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

## Pendiente — Bot P2 (Robustez)

- [ ] Retry con backoff en frontend (1 retry automático antes de mostrar error)
- [ ] Focus trap en dialog del chat (Tab cycling dentro del panel)
- [ ] Markdown parser más robusto (links, listas numeradas)
- [ ] AbortController con timeout 15s en fetch del frontend

## Pendiente — Bot P3 (Nice to Have)

- [ ] Analytics básico: loggear preguntas frecuentes (sin PII)
- [ ] Error messages diferenciados (sin internet vs API caída vs rate limited)

## Pendiente — Pitch Cleanup/Visual

- [ ] Eliminar CSS muerto del viejo CBE bar/dropdown (`.cbe-bar`, `.cbe-dropdowns`, etc.)
- [ ] Verificar responsive mobile de pirámide AI, Diagnosis cards, y sub-accordions AI
- [ ] Reconciliar `--content-w` (CLAUDE.md dice 960px, `:root` tiene 1120px)
- [ ] Decidir fuente para interstitial "Everyone is buying AI tools..." (BCG o McKinsey 2025)
- [ ] Revisar segunda aparición de "Not a lack of capability" en findings intro (~línea 3258)

## Próximo milestone

1. Verificar deploy de streaming en producción (taylor.transformaz.co)
2. QA visual completo del pitch (responsive, cross-browser)
3. Bot P2 improvements si el tiempo lo permite
