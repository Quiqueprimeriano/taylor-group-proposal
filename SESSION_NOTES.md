# Session Notes

## Sesión 2026-04-02 / 2026-04-03

### Qué se hizo

**Auditoría profesional completa del pitch** como consultora — evaluación de contenido, propuesta, diseño, storytelling, pricing, target, credibilidad. Score: 8.5/10. Se identificaron ~12 mejoras, de las cuales 4 se priorizaron con Agus y se compartieron con Fermín por WhatsApp.

**4 cambios estratégicos implementados en el pitch:**

1. **Key Findings movido a sección 02** (era 06) — El lector ahora siente el dolor ($1.6M–$3.4M/año de impacto) antes de ver la solución y el precio. Interstitial BCG reubicado entre findings y paradigm. Renumeración completa: sidebar nav, section-num spans, JS SECTION_MAP, tay-system-prompt.js.

2. **Competidores movidos a sección Paradigm (03)** — Jack Morton, Freeman y GPJ ahora aparecen como tarjetas expandibles dentro de la sección de paradigma, justo antes del "Cost of Waiting". Formato: 3 tarjetas visibles (nombre + implicación), click expande detalle con quotes y bullets. CSS nuevo para `.competitor-card__panel` + `.competitor-card__toggle`. JS handler nuevo para expand/collapse.

3. **Prosci quote en invest card de Change Enablement** — Reemplazó "Ideal for organizations ready to move from diagnosis into action" por "Organizations that invest in change management are 6× more likely to meet project objectives — Prosci Best Practices".

4. **Pre-engagement "No investment required"** — Reemplazó "N/A" en la service matrix para hacer explícito que la fase 0 es sin costo.

**Archivos modificados:**
- `clients/taylor-group/proposal-2.0/pitch/Taylor-Group-Interactive-Pitch.html` — reorder de secciones, competitors accordion, invest card text, service matrix text, CSS nuevo
- `clients/taylor-group/proposal-2.0/pitch/index.html` — sync
- `lib/tay-system-prompt.js` — secciones renumeradas y reordenadas, competitors en S03, "no investment required" en pre-engagement, Prosci quote en change enablement

### Dónde quedamos
- Cambios sin commitear — pendiente revisión visual por Agus
- Nuevo orden de secciones: 00 Cover, 01 Opportunity, 02 Key Findings, 03 Paradigm, 04 Backbone, 05 Transformation, 06 Services, 07 Phase Overview, 08 Market, 09 References
- Los section IDs no cambiaron (opportunity, findings, paradigm, etc.) — solo los números visibles

### Problemas abiertos
- CSS muerto: las clases `.competitor-accordion-item*` y las viejas `.competitor-grid`/`.competitor-card` originales quedan como dead code (inofensivo, limpieza menor)
- Header del chat sigue diciendo "Taylor Group Assistant" (pendiente de sesión anterior)
- 2 console errors en producción sin investigar (pendiente de sesión anterior)
- Auditoría identificó más mejoras no implementadas: ROI explícito junto al precio, comparar con gasto actual en tools, Intake como landing zone separada, rango indicativo para Execution retainer, About TransformAZ / bios de equipo, executive summary one-pager

### Para la próxima sesión
- Empezar por: verificación visual del pitch completo con el nuevo orden (especialmente findings en S02, competitors en S03, transiciones entre secciones)
- Verificar que el chatbot responda correctamente con la nueva numeración
- Decidir si implementar más cambios de la auditoría (ROI junto al precio, Intake standalone, rango de Execution)
- Pendiente: diseño del "Why Now" one-pager (se comenzó brainstorming pero se pausó para priorizar los cambios al pitch)
