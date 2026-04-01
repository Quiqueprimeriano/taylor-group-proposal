# Session Notes

## Sesión 2026-04-01

### Qué se hizo

**Auditoría completa del Tay chatbot:**
- Auditoría en 3 frentes paralelos: frontend (UI/UX/a11y), backend Netlify (chat.js), backend dev (server.js)
- Reporte de hallazgos organizado en 6 categorías: seguridad, prompt engineering, UX, accesibilidad, reliability, código
- Plan de mejora priorizado P0–P3

**P0 — Seguridad:**
- Removidos todos los datos de pricing del SYSTEM_PROMPT (montos $18K/$42K, costos por finding $500K–$1.2M, friction estimates $1.6M–$2.85M) — el bot no necesita estos datos para redirigir a fermin@aztransform.com
- CORS restringido de `*` a allowlist: `taylor.transformaz.co` + localhost + `*.netlify.app` (preview deploys)
- Rate limiting in-memory: 10 req/min por IP en Netlify function, con cleanup cada 5min
- Input validation: formato de mensajes (role/content), max 1000 chars por mensaje

**P1 — UX:**
- Creado endpoint de streaming SSE (`netlify/functions/chat-stream.mjs`) usando Netlify Functions v2
- Frontend reescrito: intenta streaming primero, fallback a non-streaming si falla
- Greeting limpiado: removida mención a pricing que incentivaba preguntas sobre precios
- `maxlength="500"` en input del chat
- `aria-label` dinámico en FAB (Open/Close Tay assistant)
- `temperature: 0.3` y `max_tokens: 384` para respuestas más consistentes

**Arquitectura:**
- SYSTEM_PROMPT extraído a módulo compartido (`lib/tay-system-prompt.js`) — single source of truth
- Ambos backends (chat.js, server.js) refactorizados para importar de shared module
- Eliminado drift en sección de objeciones entre backends
- Config compartida: MODEL, MAX_TOKENS, TEMPERATURE, ALLOWED_ORIGINS, validateMessages(), buildSystemPrompt()

### Dónde quedamos
- Commit `3b60712` pushed a main, Netlify debería hacer deploy automático
- **VERIFICAR**: que la función v2 `chat-stream.mjs` se despliegue correctamente en Netlify (es el primer uso de Functions v2 en el proyecto)
- **VERIFICAR**: que el streaming funcione end-to-end en producción (taylor.transformaz.co)
- Si streaming falla, el frontend cae al endpoint non-streaming automáticamente

### Problemas abiertos
- **Streaming no testeado en producción**: la función v2 (.mjs) puede requerir ajustes de config de Netlify. Si no funciona, el fallback a `/api/chat` (v1) cubre
- **`createRequire` en chat-stream.mjs**: usa `createRequire(import.meta.url)` para importar el módulo CJS compartido — verificar que esbuild lo bundle correctamente
- **Focus trap**: el chat panel tiene `role="dialog"` pero no trap de foco — Tab puede salir del chat
- **Markdown parser básico**: `formatResponse()` solo maneja bold, paragraphs, bullets. No links ni listas numeradas

### Para la próxima sesión
- Empezar por: verificar en taylor.transformaz.co que el bot funciona con streaming. Si no, debuggear la función v2
- P2 pendiente: retry con backoff (frontend), focus trap en dialog, markdown parser más robusto, AbortController timeout
- P3 pendiente: analytics de preguntas (sin PII), error messages diferenciados
- CSS muerto del viejo CBE (`cbe-bar`, `cbe-dropdowns`) sigue pendiente de limpieza
- Verificar responsive mobile de pirámide AI y diagnosis cards (pendiente de sesiones anteriores)
