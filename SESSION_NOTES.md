# Session Notes

## Sesión 2026-04-01

### Qué se hizo

**Pirámide AI (Sección 08):**
- Punta de pirámide: clip-path del tier 1 ahora converge en `50% 0%` (triángulo)
- Simetría corregida: todos los tiers usan 12.5% de desplazamiento por lado para lados perfectamente rectos
- Labels reposicionados al borde derecho correcto (62.5%, 75%, 87.5%, 100%)

**Interstitials / Quotes:**
- Eliminada línea violeta decorativa (`::before` del `.interstitial`) y reglas mobile que la ocultaban
- Todas las quotes ahora tienen comillas tipográficas `" "`
- Atribuciones actualizadas con nombre de paper en itálica + autor abajo:
  - Taylor Group Leadership → + "Initial Conversation"
  - Accenture → + "Reinvent Enterprise Models with Generative AI"
  - McKinsey → + "Unlocking Success in Digital Transformations"
  - BCG → + "Flipping the Odds of Digital Transformation Success"
- Quote "Not a lack of capability" reemplazada por cita real de BCG: "Surface-level digital adoption — without cultural and structural change — yields marginal improvements at best and cynicism at worst."
- Nueva cita agregada a tabla de references (sección 09)

**Spacing normalización (todo el pitch):**
- Reglas base tokenizadas: h2→`--space-lg`, h3→`--space-xl`/`--space-md`, h4→`--space-lg`/`--space-sm`, p→`--space-md`
- Componentes grandes (grids, charts, tables): `--space-xl` (32px)
- Elementos inline (box, blockquote, ba-table): `--space-lg` (24px)
- ul/ol, section-header__right p, section-header__right padding-top: tokenizados
- Componentes específicos normalizados: stats-grid, insight-grid, horizons-grid, competitor-grid, timeline, phase-stack, findings-hero, transformation-reality, stats-box, value-prop, paradigm-table, ai-phase-chart, gantt-wrapper, cta-box, invest-grid, s04-toggle-wrap, evidence-group-label, market-closing, market-sources, section-quote, po-panel__inner

**Contenido:**
- Dos párrafos sobre $128B fusionados en uno, con "to design the system that enables its next phase of growth" en negrita
- Frase "The gap is no longer defined by access to technology..." eliminada, reemplazada por link "Sources & methodology → 09"
- "Aggregate estimated annual impact*" cambiado a "Estimated annual impact*"
- 160px margin-top entre "Defining the Path Forward" y "Diagnosis Engagement Models" (efecto cambio de página)

**HBW — AI Sub-accordions (Sección 04):**
- 4 subsections de "Artificial Intelligence" convertidas en mini-accordions colapsables
- CSS: `.hbw-sub`, `.hbw-sub__header`, `.hbw-sub__panel`, toggle circular con `+` que rota a `×`
- JS: handler con `stopPropagation()` para no cerrar el padre HBW
- Contenido reorganizado: h4 + descripción corta siempre visibles, detalle expandible

### Dónde quedamos
- Archivo principal: `clients/taylor-group/proposal-2.0/pitch/Taylor-Group-Interactive-Pitch.html` (~4950 líneas)
- index.html sincronizado
- Todo funcional, no pusheado a main aún

### Problemas abiertos
- CSS muerto del viejo CBE bar/dropdown (`.cbe-bar`, `.cbe-dropdowns`) sigue sin limpiar
- `--content-w` sin reconciliar (CLAUDE.md dice 960px en un lado pero `:root` tiene 1120px)
- QA mobile pendiente (pirámide, diagnosis cards, sub-accordions AI)
- Interstitial "Everyone is buying AI tools..." sin fuente — research hecho (McKinsey 2025 "The State of AI" y BCG "Where's the Value in AI?" son candidatos), decisión diferida
- Segunda aparición de "Not a lack of capability" en línea ~3258 (dentro del findings intro) podría necesitar actualización por consistencia

### Para la próxima sesión
- Decidir fuente para la quote "Everyone is buying AI tools..." (ver research de BCG/McKinsey)
- Limpiar CSS muerto del viejo CBE
- Reconciliar `--content-w`
- QA mobile de los componentes nuevos (sub-accordions, pirámide con punta, spacing)
- Verificar visualmente el pitch completo tras los cambios de spacing
- Commit y push cuando esté validado
