# Pitch Design Polish — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Elevar el diseño del Interactive Pitch de 7/10 a 9/10 corrigiendo patrones de AI slop, accesibilidad, y system tokens.

**Architecture:** Todos los cambios son en un solo archivo HTML (CSS + JS inline). No hay build step — Playwright genera el PDF directo del HTML. Verificación visual en browser + print preview.

**Tech Stack:** HTML/CSS/JS vanilla, Playwright (chromium) para PDF

**File:** `Taylor Group/proposal-2.0/pitch/Taylor-Group-Interactive-Pitch.html`

---

## Priority Map

| # | Task | Why | Impact | Effort |
|---|------|-----|--------|--------|
| 1 | Diversificar card accents (AI slop) | 5 familias de cards usan el mismo `border-left: 3px` | Visual | ~20 min |
| 2 | Fix `phases-grid` breakout layout | Memory dice que causa asimetría con sidebar | Layout bug | ~5 min |
| 3 | Accessibility: skip-link + touch target + ARIA | WCAG compliance | A11y | ~15 min |
| 4 | Extraer spacing/radius/shadow tokens | El design system tiene color y tipo pero le faltan estos 3 | System | ~20 min |
| 5 | Chatbot error visual distinction | El error llega como burbuja normal — no se distingue | Polish | ~10 min |
| 6 | Verificación visual + print | Confirmar que nada se rompió | QA | ~10 min |

---

### Task 1: Diversificar card accents — matar el AI slop

**Context:** Actualmente 5 familias de componentes usan `border-left: 3px solid <color>`:
- `.box` (línea 261)
- `.finding-card` (línea 298)
- `.cbe-card::before` (línea 480 — es `::before` left bar)
- `.competitor-card` (línea 672)
- `.pillar-card::before` (línea 352 — es `::before` left bar)

El patrón es el #8 de la blacklist de AI slop. La fix no es eliminar TODOS los left-borders — es usar 2-3 treatments distintos para que el design system sienta curado, no generado.

**Design decision:**
- **`.box` → mantener left-border.** Es un callout/aside — el left-border es semánticamente correcto (similar a `<blockquote>`). Es el componente que MÁS justifica este patrón.
- **`.finding-card` → cambiar a `::after` top gradient bar.** Ya tiene el `::after` del `severity-tag`. Usar un top bar como `stat-card` (que ya usa `::after` top bar con gradient). Esto unifica finding-card con stat-card visualmente.
- **`.competitor-card` → remover accent, usar hover border.** Las competitor cards no necesitan accent permanente — son informativas. Un borde sutil que se acentúa en hover alcanza.
- **`.cbe-card::before` y `.pillar-card::before` → mantener.** Están dentro de paneles expandibles/tabs — el usuario las ve de a una familia a la vez, no todas juntas. El left-bar acá ayuda a orientar por color (blue/green/amber para CBE, semantic para pillars).

**Step 1: Modificar `.finding-card` — de left-border a top-bar**

Cambiar en CSS (líneas ~292-318):

```css
/* ANTES */
.finding-card{
  ...
  border-left:3px solid var(--accent);
}
.finding-card:hover{border-color:rgba(122,122,230,.25);border-left-color:var(--accent);...}
.finding-card:has(.severity-tag--red){border-left-color:var(--accent)}
.finding-card:has(.severity-tag--amber){border-left-color:var(--accent-dark)}
.finding-card:has(.severity-tag--blue){border-left-color:var(--text-tertiary)}

/* DESPUÉS */
.finding-card{
  ...
  /* Remover border-left:3px solid var(--accent) */
  /* Agregar position:relative + overflow:hidden (ya tiene ambos) */
  padding:24px 24px 24px 24px;  /* era 24px 24px 24px 28px — ya no necesita espacio para left bar */
}
/* Top gradient bar via ::after — reemplaza el left border */
.finding-card::after{
  content:'';position:absolute;top:0;left:0;right:0;height:3px;
  background:var(--gradient);border-radius:14px 14px 0 0;
}
.finding-card:has(.severity-tag--red)::after{background:linear-gradient(90deg,var(--red),var(--accent))}
.finding-card:has(.severity-tag--amber)::after{background:linear-gradient(90deg,var(--amber),var(--accent-dark))}
.finding-card:has(.severity-tag--blue)::after{background:linear-gradient(90deg,var(--blue),var(--text-tertiary))}
/* Remover las reglas de border-left-color por severity */
.finding-card:hover{border-color:rgba(122,122,230,.25);...}  /* sin border-left-color */
```

**Step 2: Modificar `.competitor-card` — de left-border a hover accent**

Cambiar en CSS (línea ~672):

```css
/* ANTES */
.competitor-card{...border-left:3px solid var(--text-tertiary);border-radius:0 14px 14px 0;...}

/* DESPUÉS */
.competitor-card{...border:1px solid var(--border-light);border-radius:14px;...}
.competitor-card:hover{box-shadow:0 8px 32px rgba(0,0,0,.06);transform:translateY(-2px);border-color:rgba(122,122,230,.2)}
```

**Step 3: Verificar visualmente**

Abrir en browser. Confirmar:
- Finding cards tienen top-bar con color de severidad ✓
- Competitor cards se ven como cards neutras con hover sutil ✓
- Boxes, CBE cards, y pillar cards mantienen left-border ✓
- Print: finding cards siguen viéndose bien sin animaciones ✓

**Step 4: Commit**

```bash
git add "Taylor Group/proposal-2.0/pitch/Taylor-Group-Interactive-Pitch.html"
git commit -m "design: diversify card accents — finding-cards get top-bar, competitors lose left-border"
```

---

### Task 2: Fix `phases-grid` breakout layout

**Context:** Línea 513-515 usa `width:calc(100vw - 140px)` con `margin-left:50%; transform:translateX(-50%)`. La memory de feedback (línea 8) dice explícitamente: "Never use breakout layout with a sidebar — it centers relative to parent, not viewport, causing asymmetry."

En mobile (línea 845) ya se resetea a `width:100%`, pero en desktop el problema persiste.

**Step 1: Remover breakout**

Cambiar en CSS (líneas 513-515):

```css
/* ANTES */
.phases-grid{
  display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:28px 0;position:relative;
  width:calc(100vw - 140px);max-width:1280px;margin-left:50%;transform:translateX(-50%);
}

/* DESPUÉS */
.phases-grid{
  display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:28px 0;position:relative;
}
```

Y en el responsive 768px (línea 845), remover la línea que ya no es necesaria:

```css
/* ANTES */
.phases-grid{width:100%;transform:none;margin-left:0}

/* DESPUÉS — remover esta línea entera, ya no hace falta */
```

**Step 2: Verificar**

Abrir en browser a 1440px de ancho. Las phase cards deben respetar `--content-w: 960px` como todo lo demás. No más asimetría.

**Step 3: Commit**

```bash
git add "Taylor Group/proposal-2.0/pitch/Taylor-Group-Interactive-Pitch.html"
git commit -m "fix: remove phases-grid breakout layout — causes asymmetry with sidebar"
```

---

### Task 3: Accessibility fixes

**3 sub-fixes independientes en un commit.**

**Step 1: Skip-to-content link**

Agregar después de `<body>` (antes de línea 1037):

```html
<a href="#cover" class="skip-link">Skip to content</a>
```

Agregar en CSS (después del reset, ~línea 61):

```css
.skip-link{
  position:absolute;top:-100%;left:16px;z-index:9999;
  padding:8px 16px;background:var(--accent);color:#fff;
  font-family:var(--sans);font-size:var(--text-sm);font-weight:600;
  border-radius:0 0 8px 8px;text-decoration:none;
  transition:top .2s var(--ease);
}
.skip-link:focus{top:0}
```

**Step 2: Chat send button touch target**

Cambiar en CSS (línea ~1018):

```css
/* ANTES */
.tay-send{
  width:34px;height:34px;...
}

/* DESPUÉS */
.tay-send{
  width:44px;height:44px;...
}
.tay-send svg{width:18px;height:18px}  /* era 16px, escalar proporcionalmente */
```

**Step 3: ARIA en pillar tabs**

Agregar `role="tabpanel"` y `aria-labelledby` a cada `.pillar-tab-content` (líneas ~1442-1446). Y agregar `id` a cada tab button para el `aria-labelledby`.

En los botones tab (líneas ~1436-1440), agregar `id`:

```html
<button class="pillar-tab is-active" role="tab" aria-selected="true" data-tab="people" id="tab-btn-people">People &amp; Culture</button>
<button class="pillar-tab" role="tab" aria-selected="false" data-tab="process" id="tab-btn-process">Processes</button>
<!-- etc. para tech, data, compliance -->
```

En los paneles (líneas ~1442-1446), agregar `role` y `aria-labelledby`:

```html
<div class="pillar-tab-content is-active" id="tab-people" role="tabpanel" aria-labelledby="tab-btn-people">...</div>
<div class="pillar-tab-content" id="tab-process" role="tabpanel" aria-labelledby="tab-btn-process">...</div>
<!-- etc. -->
```

Agregar `aria-live="polite"` al contenedor de mensajes del chatbot (línea ~2236):

```html
<div class="tay-messages" id="tay-messages" aria-live="polite"></div>
```

**Step 4: Verificar**

- Tab through page: skip-link aparece en focus ✓
- En mobile: send button es 44x44 ✓
- Screen reader: tab panels anuncian nombre ✓
- Chatbot: nuevos mensajes se anuncian ✓

**Step 5: Commit**

```bash
git add "Taylor Group/proposal-2.0/pitch/Taylor-Group-Interactive-Pitch.html"
git commit -m "a11y: add skip-link, fix chat touch target (44px), add ARIA tabpanel + live region"
```

---

### Task 4: Extraer spacing, radius, y shadow tokens

**Context:** El design system tiene tokens de color y tipografía pero le faltan spacing, border-radius, y box-shadow. Esto causa drift — el mismo `padding:24px` aparece 15+ veces con variaciones menores (22px, 24px, 28px).

**Step 1: Definir tokens en `:root`**

Agregar después de los layout widths (después de línea 54):

```css
/* Spacing */
--space-xs:4px;
--space-sm:8px;
--space-md:16px;
--space-lg:24px;
--space-xl:32px;
--space-2xl:48px;
--space-3xl:56px;

/* Radius */
--radius-sm:8px;
--radius-md:10px;
--radius-lg:14px;
--radius-xl:18px;
--radius-pill:20px;

/* Shadows */
--shadow-sm:0 1px 3px rgba(0,0,0,.06);
--shadow-md:0 4px 16px rgba(0,0,0,.06);
--shadow-lg:0 8px 32px rgba(0,0,0,.08);
--shadow-xl:0 16px 48px rgba(0,0,0,.07);
--shadow-accent:0 8px 24px rgba(122,122,230,.3);
```

**Step 2: Migrar usos más frecuentes**

No migrar TODO de golpe — eso son 100+ cambios en una pasada y es riesgoso. Migrar los componentes principales:

- `stat-card`: `padding:32px 16px` → `padding:var(--space-xl) var(--space-md)`, `border-radius:14px` → `border-radius:var(--radius-lg)`, `box-shadow:0 1px 3px rgba(0,0,0,.06)` → `box-shadow:var(--shadow-sm)`
- `finding-card`: `border-radius:14px` → `var(--radius-lg)`, `padding:24px` → `var(--space-lg)`
- `phase-card`: `border-radius:14px` → `var(--radius-lg)`, `padding:32px` → `var(--space-xl)`
- `horizon-card`: `border-radius:14px` → `var(--radius-lg)`, `padding:24px` → `var(--space-lg)`
- `cta-box`: `border-radius:18px` → `var(--radius-xl)`
- `.box`: `border-radius:10px` → `var(--radius-md)`
- Severity/pillar tags: `border-radius:20px` → `var(--radius-pill)`
- Hover shadows: migrar a `var(--shadow-lg)` o `var(--shadow-xl)`

**Step 3: Verificar visualmente**

Comparar pixel-por-pixel (los valores son idénticos, solo migrados a tokens). No debería haber cambios visuales.

**Step 4: Commit**

```bash
git add "Taylor Group/proposal-2.0/pitch/Taylor-Group-Interactive-Pitch.html"
git commit -m "design: extract spacing, radius, and shadow tokens to CSS custom properties"
```

---

### Task 5: Chatbot error visual distinction

**Context:** Cuando la API falla, el error llega como burbuja normal de bot (`.tay-msg--bot`). Funciona, pero no se distingue visualmente de una respuesta exitosa. Un tratamiento sutil ayuda al usuario a entender que algo falló.

**Step 1: Agregar CSS para error bubble**

Agregar después de `.tay-msg--bot` (línea ~975):

```css
.tay-msg--error{
  align-self:flex-start;
  background:var(--red-bg);color:var(--text-secondary);
  border:1px solid rgba(220,38,38,.15);
  border-bottom-left-radius:4px;
  font-style:italic;
}
```

**Step 2: Modificar `callAPI` para marcar errores**

En el JS, modificar `callAPI` (línea ~2979) para que retorne un objeto en vez de un string:

```javascript
/* ANTES — líneas 2997-3001 */
  conversationHistory.push({role:'assistant',content:answer});
  return formatResponse(answer);
}catch(err){
  console.warn('Tay API error:',err);
  return 'I\'m having trouble connecting right now. Please try again in a moment, or scroll through the proposal — the information you need is all here.';
}

/* DESPUÉS */
  conversationHistory.push({role:'assistant',content:answer});
  return {text:formatResponse(answer),error:false};
}catch(err){
  console.warn('Tay API error:',err);
  return {text:'I\'m having trouble connecting right now. Please try again in a moment, or scroll through the proposal — the information you need is all here.',error:true};
}
```

Y modificar `handleUserInput` (línea ~3005) para usar el tipo:

```javascript
/* ANTES — líneas 3012-3015 */
showTyping();
var answer = await callAPI(text);
removeTyping();
addMsg(answer,'bot');

/* DESPUÉS */
showTyping();
var result = await callAPI(text);
removeTyping();
addMsg(result.text, result.error ? 'error' : 'bot');
```

**Step 3: Verificar**

Desconectar internet o apagar el API server local → enviar mensaje → debería aparecer burbuja con fondo rojo tenue en itálica. Reconectar → mensajes normales con fondo accent-light.

**Step 4: Commit**

```bash
git add "Taylor Group/proposal-2.0/pitch/Taylor-Group-Interactive-Pitch.html"
git commit -m "design: visually distinguish chatbot error messages from normal responses"
```

---

### Task 6: Verificación visual + print

**Step 1: Abrir en browser**

```bash
open "Taylor Group/proposal-2.0/pitch/Taylor-Group-Interactive-Pitch.html"
```

Checklist visual:
- [ ] Cover: word-reveal funciona
- [ ] Finding cards: top-bar con colores de severidad
- [ ] Competitor cards: sin left-border, hover sutil
- [ ] Boxes: mantienen left-border (son callouts)
- [ ] Phase cards: respetan `--content-w`, no breakout
- [ ] Pillar tabs: cambian contenido correctamente
- [ ] Chatbot: send button más grande, welcome message aparece
- [ ] Skip-link: visible con Tab desde arriba
- [ ] Tokens: nada cambió visualmente (mismos valores)

**Step 2: Print preview**

Cmd+P en browser. Verificar:
- Finding cards: top-bar visible en print ✓
- Cards no se cortan entre páginas ✓
- Sidebar/chatbot ocultos ✓

**Step 3: Generar PDF**

```bash
node "Taylor Group/generate-pdf.js"
```

Abrir el PDF resultante. Verificar consistencia con browser.

**Step 4: Commit final (si hubo fixes)**

```bash
git add "Taylor Group/proposal-2.0/pitch/Taylor-Group-Interactive-Pitch.html"
git commit -m "fix: visual/print QA adjustments after design polish"
```

---

## NOT in scope

- **Content/copy editing** — el copy es responsabilidad de Agus, no de este plan
- **New features** — no agregar funcionalidad, solo pulir lo existente
- **Color system changes** — el `#7A7AE6` es la marca, no se toca
- **JS refactoring** — el JS funciona, solo se modifica el retorno de `callAPI`
- **Full token migration** — Task 4 migra los componentes principales, no las 100+ instancias

## Post-plan score projection

| Dimension | Before | After |
|-----------|--------|-------|
| Info Architecture | 8 | 8 |
| Interaction States | 7 | 8 |
| User Journey | 8 | 8 |
| AI Slop | 7 | 9 |
| Design System | 7 | 8 |
| Responsive & A11y | 7 | 8 |
| **Overall** | **7** | **8.5** |
