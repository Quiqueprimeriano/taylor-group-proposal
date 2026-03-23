# TransformAZ Company Structure Design

**Goal:** Organizar TransformAZ como consultora boutique con dos sistemas conectados: Notion (workspace operativo) y Git repo (taller técnico de producción).

---

## Notion Workspace (Sistema Operativo)

```
⚡ TransformAZ — Project Hub
├── 🏢 Company — About, team, ways of working, decision log, onboarding
├── 💼 Clients — Per-client subpages (brief, contacts, feedback, retro)
│   ├── Taylor Group
│   └── SME Group
├── 📊 Pipeline de Clientes — Database (Board + Table views)
├── 🚀 Active Projects — Execution tracking, weekly updates, blockers
├── 🧠 Knowledge Base — Digital Backbone framework, methodology
├── 📁 Propuestas — Proposal library, pricing reference
├── 💰 Finance — Invoices, expenses, profitability, forecast
├── 📋 Legal & Admin — Entity, contracts, insurance, tax, IP
├── 📣 Business Development — Target industries, case studies, thought leadership
└── 📦 Resources — Brand assets, tool stack, research library, templates
```

## Git Repo (Taller Técnico)

```
TransformAZ/
├── CLAUDE.md, DESIGN.md, TODOS.md
├── netlify.toml, package.json
├── clients/
│   ├── sme-group/
│   │   ├── proposals/
│   │   ├── scripts/
│   │   └── screenshots/
│   └── taylor-group/
│       ├── brief/
│       ├── research/
│       ├── proposal-1.0/
│       ├── proposal-2.0/
│       └── scripts/
├── templates/ — Reusable proposal/pitch starters
├── brand/ — Logo SVGs, fonts, guidelines
├── scripts/ — Cross-client utilities
├── netlify/functions/
└── docs/plans/
```

## Connection Rules

| Type | Lives in | Why |
|------|----------|-----|
| HTML/CSS/JS source | Repo | Version control, Claude Code |
| PDFs/DOCX output | Notion (links) | Shared with client |
| Call notes | Notion | Fermín needs access |
| Contracts | Notion | Legal docs |
| Methodology (prose) | Notion | Collaborative |
| Methodology (implementation) | Repo | Interactive HTML |
| Brand assets (SVG) | Repo brand/ | Code consumes directly |
| Brand guidelines (prose) | Notion Resources | Visual reference |
| Research papers | Notion Resources | Reference, not buildable |
| Source bibliography | Repo | Linked from HTML |

---

*Created: 2026-03-23*
