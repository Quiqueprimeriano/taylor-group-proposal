const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
        PageBreak, Header, Footer, PageNumber, LevelFormat } = require('docx');

// ─── COLORS ───
const ACCENT = "7A7AE6";
const BLUE = "2563EB";
const GREEN = "1A9959";
const AMBER = "B45309";
const RED = "DC2626";
const GRAY = "52525B";
const LIGHT_GRAY = "F4F4F5";
const ACCENT_BG = "EDEDFC";
const BLUE_BG = "EFF6FF";
const GREEN_BG = "ECFDF5";
const AMBER_BG = "FFFBEB";
const RED_BG = "FEF2F2";

// ─── BORDERS ───
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

// ─── PAGE ───
const PAGE_W = 12240;
const MARGIN = 1440;
const CONTENT_W = PAGE_W - 2 * MARGIN; // 9360

// ─── HELPERS ───
function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({ heading: level, spacing: { before: 300, after: 150 },
    children: [new TextRun({ text, font: "Georgia", bold: true,
      size: level === HeadingLevel.HEADING_1 ? 36 : level === HeadingLevel.HEADING_2 ? 28 : 24 })] });
}

function para(text, opts = {}) {
  const runs = [];
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  parts.forEach(p => {
    if (p.startsWith('**') && p.endsWith('**')) {
      runs.push(new TextRun({ text: p.slice(2, -2), bold: true, font: "Calibri", size: 22, color: opts.color }));
    } else if (p) {
      runs.push(new TextRun({ text: p, font: "Calibri", size: 22, color: opts.color || GRAY,
        italics: opts.italic }));
    }
  });
  return new Paragraph({ spacing: { after: opts.afterSpacing || 160 }, alignment: opts.align, children: runs });
}

function sectionNum(text) {
  return new Paragraph({ spacing: { before: 120, after: 60 },
    children: [new TextRun({ text: text.toUpperCase(), font: "Consolas", size: 18, bold: true, color: ACCENT })] });
}

function monoLabel(text) {
  return new Paragraph({ spacing: { after: 40 },
    children: [new TextRun({ text: text.toUpperCase(), font: "Consolas", size: 16, bold: true, color: ACCENT })] });
}

function interstitial(text, source) {
  const children = [
    new Paragraph({ spacing: { before: 400, after: source ? 60 : 400 }, alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `\u201C${text}\u201D`, font: "Georgia", size: 28, italics: true, color: ACCENT })] })
  ];
  if (source) {
    children.push(new Paragraph({ spacing: { after: 400 }, alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `\u2014 ${source}`, font: "Consolas", size: 16, color: GRAY })] }));
  }
  return children;
}

function statRow(metrics) {
  const colW = Math.floor(CONTENT_W / metrics.length);
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: metrics.map(() => colW),
    rows: [new TableRow({ children: metrics.map(m => new TableCell({
      borders: noBorders,
      width: { size: colW, type: WidthType.DXA },
      margins: { top: 120, bottom: 120, left: 80, right: 80 },
      shading: { fill: ACCENT_BG, type: ShadingType.CLEAR },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 },
          children: [new TextRun({ text: m.value, font: "Consolas", size: 32, bold: true, color: ACCENT })] }),
        new Paragraph({ alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: m.label.toUpperCase(), font: "Consolas", size: 14, color: GRAY })] }),
        ...(m.source ? [new Paragraph({ alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: m.source, font: "Consolas", size: 12, color: "A1A1AA" })] })] : [])
      ]
    })) })]
  });
}

function accentBox(label, text, color = ACCENT) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({
      borders: { top: border, bottom: border, right: border,
        left: { style: BorderStyle.SINGLE, size: 6, color } },
      margins: { top: 120, bottom: 120, left: 200, right: 200 },
      shading: { fill: color === AMBER ? AMBER_BG : color === BLUE ? BLUE_BG : color === GREEN ? GREEN_BG : ACCENT_BG, type: ShadingType.CLEAR },
      children: [
        ...(label ? [monoLabel(label)] : []),
        para(text)
      ]
    })] })]
  });
}

function findingCard(title, severity, sevColor, impact, quote, quoteAuthor, detail, impactText) {
  const children = [
    new Paragraph({ spacing: { before: 200, after: 40 },
      children: [
        new TextRun({ text: title, font: "Calibri", size: 24, bold: true }),
        new TextRun({ text: `  [${severity}]`, font: "Consolas", size: 16, color: sevColor }),
      ] }),
    new Paragraph({ spacing: { after: 60 },
      children: [new TextRun({ text: impact, font: "Consolas", size: 18, bold: true, color: sevColor })] }),
  ];
  if (quote) {
    children.push(new Paragraph({ spacing: { after: 60 }, indent: { left: 360 },
      children: [
        new TextRun({ text: `\u201C${quote}\u201D`, font: "Georgia", size: 20, italics: true, color: GRAY }),
        ...(quoteAuthor ? [new TextRun({ text: ` \u2014 ${quoteAuthor}`, font: "Consolas", size: 16, color: "A1A1AA" })] : [])
      ] }));
  }
  if (detail) children.push(para(detail));
  if (impactText) {
    children.push(new Paragraph({ spacing: { after: 60 },
      children: [
        new TextRun({ text: "ANNUAL IMPACT: ", font: "Consolas", size: 16, bold: true, color: AMBER }),
        new TextRun({ text: impactText, font: "Calibri", size: 20, color: GRAY })
      ] }));
  }
  return children;
}

function makeTableRow(cells, isHeader = false, colWidths) {
  return new TableRow({
    children: cells.map((cell, i) => new TableCell({
      borders,
      width: { size: colWidths[i], type: WidthType.DXA },
      margins: cellMargins,
      shading: isHeader ? { fill: LIGHT_GRAY, type: ShadingType.CLEAR } : undefined,
      children: [new Paragraph({
        children: [new TextRun({ text: cell, font: "Calibri", size: 20, bold: isHeader, color: "18181B" })]
      })]
    }))
  });
}

function makeTable(headers, rows, colWidths) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      makeTableRow(headers, true, colWidths),
      ...rows.map(r => makeTableRow(r, false, colWidths))
    ]
  });
}

function horizonCard(title, subtitle, items, color, recommended = false) {
  const children = [];
  if (recommended) {
    children.push(new Paragraph({ spacing: { after: 40 },
      children: [new TextRun({ text: "\u2605 RECOMMENDED", font: "Consolas", size: 16, bold: true, color: ACCENT })] }));
  }
  children.push(new Paragraph({ spacing: { after: subtitle ? 40 : 120 },
    children: [new TextRun({ text: title, font: "Georgia", size: 26, bold: true, color })] }));
  if (subtitle) {
    children.push(new Paragraph({ spacing: { after: 100 },
      children: [new TextRun({ text: subtitle, font: "Calibri", size: 18, italics: true, color: GRAY })] }));
  }
  items.forEach(item => {
    children.push(new Paragraph({ spacing: { after: 60 }, indent: { left: 240 },
      numbering: { reference: "bullets", level: 0 },
      children: [new TextRun({ text: item, font: "Calibri", size: 20, color: GRAY })] }));
  });

  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({
      borders: { top: { style: BorderStyle.SINGLE, size: 3, color },
        bottom: border, left: border, right: border },
      margins: { top: 160, bottom: 160, left: 200, right: 200 },
      shading: { fill: recommended ? ACCENT_BG : "FFFFFF", type: ShadingType.CLEAR },
      children
    })] })]
  });
}

function tierBox(title, recommended, items, price, payment) {
  const children = [];
  if (recommended) {
    children.push(new Paragraph({ spacing: { after: 40 },
      children: [new TextRun({ text: "\u2605 RECOMMENDED", font: "Consolas", size: 16, bold: true, color: ACCENT })] }));
  }
  children.push(new Paragraph({ spacing: { after: 120 },
    children: [new TextRun({ text: title, font: "Georgia", size: 28, bold: true })] }));
  items.forEach(([label, value]) => {
    children.push(new Paragraph({ spacing: { after: 40 },
      children: [
        new TextRun({ text: label.toUpperCase() + ": ", font: "Consolas", size: 16, bold: true, color: GRAY }),
        new TextRun({ text: value, font: "Calibri", size: 20, color: "18181B" })
      ] }));
  });
  children.push(new Paragraph({ spacing: { before: 160, after: 40 },
    children: [new TextRun({ text: price, font: "Consolas", size: 36, bold: true, color: ACCENT })] }));
  children.push(new Paragraph({ spacing: { after: 60 },
    children: [new TextRun({ text: payment, font: "Consolas", size: 16, color: GRAY })] }));

  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({
      borders: { top: { style: BorderStyle.SINGLE, size: 3, color: recommended ? ACCENT : BLUE },
        bottom: border, left: border, right: border },
      margins: { top: 200, bottom: 200, left: 240, right: 240 },
      shading: { fill: recommended ? ACCENT_BG : "FFFFFF", type: ShadingType.CLEAR },
      children
    })] })]
  });
}

function competitorCard(name, action, implication) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({
      borders: { top: { style: BorderStyle.SINGLE, size: 2, color: ACCENT },
        bottom: border, left: border, right: border },
      margins: { top: 120, bottom: 120, left: 200, right: 200 },
      children: [
        new Paragraph({ spacing: { after: 60 },
          children: [new TextRun({ text: name, font: "Georgia", size: 24, bold: true })] }),
        para(action),
        new Paragraph({ spacing: { after: 60 },
          children: [new TextRun({ text: implication, font: "Calibri", size: 20, italics: true, color: ACCENT })] })
      ]
    })] })]
  });
}

function phaseCard(tag, name, date, format, description, deliverables, color) {
  const children = [
    new Paragraph({ spacing: { after: 20 },
      children: [new TextRun({ text: tag.toUpperCase(), font: "Consolas", size: 14, bold: true, color })] }),
    new Paragraph({ spacing: { after: 40 },
      children: [new TextRun({ text: name, font: "Georgia", size: 26, bold: true, color })] }),
    new Paragraph({ spacing: { after: 60 },
      children: [new TextRun({ text: date, font: "Consolas", size: 16, color: GRAY })] }),
    new Paragraph({ spacing: { after: 40 },
      children: [new TextRun({ text: format, font: "Calibri", size: 20, bold: true, color: "18181B" })] }),
    para(description),
  ];
  deliverables.forEach(d => {
    children.push(new Paragraph({ spacing: { after: 40 }, indent: { left: 240 },
      numbering: { reference: "bullets", level: 0 },
      children: [new TextRun({ text: d, font: "Calibri", size: 20, color: GRAY })] }));
  });

  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({
      borders: { top: { style: BorderStyle.SINGLE, size: 3, color },
        bottom: border, left: border, right: border },
      margins: { top: 160, bottom: 160, left: 200, right: 200 },
      children
    })] })]
  });
}

function scopeCard(title, tag, tagColor, summary, detail, output) {
  return [
    new Paragraph({ spacing: { before: 240, after: 60 },
      children: [
        new TextRun({ text: title, font: "Calibri", size: 24, bold: true }),
        new TextRun({ text: `  [${tag}]`, font: "Consolas", size: 16, color: tagColor }),
      ] }),
    para(summary),
    para(detail),
    new Paragraph({ spacing: { after: 40 },
      children: [new TextRun({ text: "OUTPUT: ", font: "Consolas", size: 16, bold: true, color: tagColor }),
        new TextRun({ text: output, font: "Calibri", size: 20, color: GRAY })] }),
  ];
}

function cbeCard(title, description, color) {
  return [
    new Paragraph({ spacing: { before: 120, after: 40 },
      children: [new TextRun({ text: title, font: "Calibri", size: 22, bold: true, color })] }),
    para(description),
  ];
}

function spacer(size = 200) {
  return new Paragraph({ spacing: { before: size } });
}

// ─── BUILD DOCUMENT ───

const doc = new Document({
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
    }]
  },
  styles: {
    default: { document: { run: { font: "Calibri", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Georgia", color: "18181B" },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Georgia", color: "18181B" },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Georgia", color: "18181B" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: PAGE_W, height: 15840 },
        margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN }
      }
    },
    headers: {
      default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "TransformAZ \u2014 Building the Digital Backbone \u2014 Taylor Group",
          font: "Consolas", size: 14, color: "A1A1AA" })] })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "CONFIDENTIAL \u2014 Page ", font: "Consolas", size: 14, color: "A1A1AA" }),
          new TextRun({ children: [PageNumber.CURRENT], font: "Consolas", size: 14, color: "A1A1AA" })] })] })
    },
    children: [

      // ══════════════════════════════════════════════════════
      // COVER
      // ══════════════════════════════════════════════════════
      spacer(600),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 },
        children: [
          new TextRun({ text: "Transform", font: "Georgia", size: 28, color: GRAY }),
          new TextRun({ text: "AZ", font: "Georgia", size: 28, bold: true, color: ACCENT }),
        ] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 },
        children: [new TextRun({ text: "\u2500".repeat(40), font: "Consolas", size: 14, color: "A1A1AA" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 },
        children: [new TextRun({ text: "Building the Digital Backbone", font: "Georgia", size: 48, bold: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 },
        children: [new TextRun({ text: "A Transformation Strategy for Taylor Group", font: "Georgia", size: 28, color: GRAY })] }),

      makeTable(
        ["", ""],
        [
          ["Client", "Taylor Group"],
          ["Date", "March 2026"],
          ["Reference", "TAZ-TG-2026-02"],
        ],
        [2400, 6960]),

      spacer(200),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 },
        children: [new TextRun({ text: "Strategic Proposal", font: "Consolas", size: 20, bold: true, color: ACCENT })] }),

      new Paragraph({ children: [new PageBreak()] }),

      // ══════════════════════════════════════════════════════
      // 01 — THE OPPORTUNITY
      // ══════════════════════════════════════════════════════
      sectionNum("01 \u2014 The Opportunity"),
      heading("95 Years of Growth. One Moment of Strategic Advantage."),

      statRow([
        { value: "95 yrs", label: "Legacy" },
        { value: "$85M", label: "Revenue" },
        { value: "321", label: "People" },
        { value: "$128B", label: "Market Size" },
      ]),

      spacer(120),
      para("Taylor Group has grown organically for 95 years into an enterprise-scale operation \u2014 $85M revenue, 321 people, spanning 40+ countries. But this growth has been powered by startup-era processes. That\u2019s not a criticism; it\u2019s a testament to the caliber of the people. The question isn\u2019t whether Taylor has succeeded \u2014 it\u2019s what becomes possible when you add a digital foundation to that talent."),

      para("The experiential marketing industry is at an inflection point. Global spend hit a record **$128B in 2024**, with 74% of Fortune 1000 marketers increasing event budgets. But the landscape is shifting: lead times that were 8 weeks are now 2 weeks. AI-powered competitors are entering the space. The companies that thrive won\u2019t be the ones with the most people \u2014 they\u2019ll be the ones with the smartest operations."),

      para("The tools are already in place. ClickUp, Gemini, Microsoft 365 \u2014 Taylor has invested in the technology. But without a unified strategy, these tools sit dormant. The investment has been made; the return hasn\u2019t been realized."),

      accentBox("The Cost of Waiting",
        "Every quarter without a unified digital strategy: Redundant asset fabrication \u2014 $125K\u2013$300K per quarter. Sales\u2194production misalignment compounds with every new market. Freeman, GPJ, Jack Morton already operationalizing AI. ClickUp, Gemini, M365 investments depreciating without activation.", AMBER),

      new Paragraph({ children: [new PageBreak()] }),

      // ── INTERSTITIAL 1 ──
      ...interstitial("We probably have somewhere between $20 and $30 million worth of assets in our warehouses. And honestly, I couldn\u2019t tell you exactly what we have.", "Dean, CEO, Taylor Group"),

      // ══════════════════════════════════════════════════════
      // 02 — KEY FINDINGS
      // ══════════════════════════════════════════════════════
      sectionNum("02 \u2014 Key Findings"),
      heading("What Discovery Revealed"),

      accentBox(null, "Aggregate Estimated Impact: **$1.4M \u2013 $2.85M annually**", ACCENT),
      spacer(60),
      para("Six patterns emerged from our conversations with Dean, Mike, and the leadership team."),

      ...findingCard("1. Asset Management Blind Spot", "HIGH IMPACT", RED,
        "$500K \u2013 $1.2M / year",
        "We probably have somewhere between $20 and $30 million worth of assets in our warehouses. And honestly, I couldn\u2019t tell you exactly what we have.", "Dean",
        "Without centralized asset tracking, teams rebuild what already exists across three warehouses and 40+ countries.",
        "$500K \u2013 $1.2M in redundant fabrication, lost assets, and missed reuse."),

      ...findingCard("2. Sales \u2194 Production Disconnect", "HIGH IMPACT", RED,
        "$400K \u2013 $800K / year",
        "Sales will sell something and then production finds out and goes, \u2018Wait, we can\u2019t do that in that timeline.\u2019", "Dean",
        "Sales operates without visibility into production capacity, leading to over-promises and margin erosion.",
        "$400K \u2013 $800K in rush costs, rework, and margin compression."),

      ...findingCard("3. Executive Time Drain", "MEDIUM IMPACT", AMBER,
        "$225K \u2013 $300K / year",
        "I get 400 to 500 emails a day. I\u2019d say 70% are CCs where I don\u2019t really need to be included.", "Dean",
        null,
        "$225K \u2013 $300K in executive productivity lost to communication overhead."),

      ...findingCard("4. Dormant AI Investment", "MEDIUM IMPACT", AMBER,
        "$75K \u2013 $150K / year",
        "We\u2019re paying for ClickUp Brain but nobody\u2019s really using it.", "Mike",
        null,
        "$75K \u2013 $150K in unrealized productivity gains from tools already purchased."),

      ...findingCard("5. Generational Adoption Gap", "STRATEGIC", BLUE,
        "6-month delay = 2x cost",
        "The younger employees pick things up instantly. Some of our senior people... it\u2019s a harder conversation.", "Dean",
        null,
        "Every month of delayed adoption costs momentum. 6-month delays double transformation costs."),

      ...findingCard("6. Missing Strategic Tech Layer", "STRATEGIC", BLUE,
        "$200K \u2013 $400K / year",
        "We don\u2019t have a CTO. We\u2019ve never had someone whose job is to look at all of this holistically.", "Dean",
        null,
        "$200K \u2013 $400K in duplicated tools, unused licenses, integration workarounds."),

      new Paragraph({ children: [new PageBreak()] }),

      // ── INTERSTITIAL 2 ──
      ...interstitial("Not new software. New connective tissue.", null),

      // ══════════════════════════════════════════════════════
      // 03 — THE DIGITAL BACKBONE
      // ══════════════════════════════════════════════════════
      sectionNum("03 \u2014 The Digital Backbone"),
      heading("One Connected Operation"),

      para("Think of the Digital Backbone as the nervous system of Taylor Group\u2019s operation. It connects every part of Taylor\u2019s business: sales, production, assets, communication, and decisions. Information flows seamlessly. Production capacity is visible to sales in real time. Assets are tracked and reusable. AI amplifies human talent rather than replacing it."),

      para("Critically, the Digital Backbone is built on what Taylor already owns. This isn\u2019t about buying new software. It\u2019s about activating what\u2019s there, connecting what\u2019s siloed, and adding the intelligence layer that turns tools into a system."),

      heading("Five Dimensions Across Every Phase", HeadingLevel.HEADING_2),

      // Dimensions as compact table
      makeTable(
        ["Dimension", "Description"],
        [
          ["People & Culture", "Segmented adoption paths for executives, operations, and creative teams. Internal champions program. Skills development roadmap. Culture-first change management."],
          ["Processes", "SOP modernization. Sales-to-production alignment with real-time capacity visibility. Asset management lifecycle. Cross-office standardization."],
          ["Tech Integrations", "ClickUp architecture optimization + Brain activation. Gemini integration. Automation engine (10\u201315 priority workflows). Global Core \u2194 Operations tool alignment."],
          ["Data", "Asset inventory intelligence. Production capacity data. Project profitability tracking. Executive dashboards. Performance feedback loops."],
          ["Compliance", "AI governance policy. Data handling standards. IP protection strategy. Regulatory readiness for pharma and healthcare clients."],
        ],
        [2600, 6760]),

      spacer(120),
      accentBox(null, "**Five dimensions. Three phases. One backbone.** The Digital Backbone makes Taylor more informed in Create, more coordinated in Build, and more governed in Execute.", ACCENT),

      new Paragraph({ children: [new PageBreak()] }),

      // ── CREATE Panel ──
      heading("CREATE \u2014 Strategy & Creative", HeadingLevel.HEADING_2),
      para("The backbone helps teams think faster, think smarter, and create with more context. In the Create layer, ideation depends almost entirely on the individuals in the room. The backbone changes that equation."),

      ...cbeCard("Strategic Intelligence", "Client history, competitor activity, market trends, and prior campaign learnings available at the start of every brief. Ideation shifts from isolated inspiration to informed creative thinking.", BLUE),
      ...cbeCard("Creative Memory", "Searchable archives of concepts, builds, and proposals. Visibility into previous ideas for similar clients or sectors. A reusable body of intellectual and creative work.", BLUE),
      ...cbeCard("Proposal Acceleration", "Respond to opportunities faster. Assemble proposals using past materials and pricing logic. Shorten the time between brief and first strategic output.", BLUE),
      ...cbeCard("Better Forecasting", "Early visibility into production complexity, resource intensity, delivery implications, and whether similar components already exist. Creative ambition meets operational reality.", BLUE),
      ...cbeCard("AI-Assisted Ideation", "Concept expansion, reference generation, draft narrative support, and faster synthesis of market inputs. Not automated creativity \u2014 **augmented creative velocity**.", BLUE),

      accentBox(null, "**CREATE becomes:** more informed, faster, more reusable, more grounded in reality, and more capable of generating quality ideas at speed.", BLUE),

      makeTable(["Before", "After"],
        [["Ideas start from scratch, proposals assembled manually, institutional knowledge lives in people\u2019s heads",
          "Institutional memory searchable, proposals accelerated, creative ambition grounded in operational reality"]],
        [4680, 4680]),

      new Paragraph({ children: [new PageBreak()] }),

      // ── BUILD Panel ──
      heading("BUILD \u2014 Experiences & Fabrication", HeadingLevel.HEADING_2),
      para("The backbone helps great ideas become buildable, scalable, and operationally viable. This is Taylor\u2019s operational core \u2014 and it\u2019s where the biggest efficiency gaps live."),

      ...cbeCard("Design-to-Build Continuity", "Continuity between design outputs and production inputs. Shared documentation across creative, digital, and fabrication teams. Less interpretation loss.", GREEN),
      ...cbeCard("Asset Intelligence", "Visibility into what the business already owns, has built, or can reuse. Reusable scenic elements, historic build references, digital assets connected to physical experiences.", GREEN),
      ...cbeCard("Materials & Components", "Stronger picture of what is needed vs. what is available. Material planning, component tracking, procurement coordination, and supplier visibility.", GREEN),
      ...cbeCard("Capacity Forecasting", "Production load, team capacity, timing conflicts, and build implications of incoming pipeline. The shift from **reactive to planned production**.", GREEN),
      ...cbeCard("Digital\u2013Physical Integration", "Alignment across physical environments, interactive experiences, content production, platform integration, and on-site digital behavior.", GREEN),
      ...cbeCard("Cost Intelligence", "Benchmark against past builds, anticipate cost drivers, price work with better historical reference. Build becomes not just faster, but more **commercially informed**.", GREEN),

      accentBox(null, "**BUILD becomes:** more coordinated, more predictable, more reusable, more cost-aware, and more connected across digital and physical work.", GREEN),

      makeTable(["Before", "After"],
        [["Sales sells blind, assets rebuilt because nobody knows they exist, each office runs its own way",
          "Design-to-build continuity, searchable asset inventory, planned production, cost intelligence from history"]],
        [4680, 4680]),

      new Paragraph({ children: [new PageBreak()] }),

      // ── EXECUTE Panel ──
      heading("EXECUTE \u2014 Program Management", HeadingLevel.HEADING_2),
      para("The backbone turns execution from something people discover too late into something they can manage actively. Complexity peaks here. It\u2019s where Taylor\u2019s leadership spends the most time today \u2014 often manually."),

      ...cbeCard("Project Orchestration", "Centralized project visibility, shared timelines, clearer dependencies and ownership. The shift from fragmented execution to **connected execution**.", AMBER),
      ...cbeCard("Resource Allocation", "Better crew planning, specialist allocation, visibility into team utilization, and cross-project resource balancing. Fewer blind spots and less fire-fighting.", AMBER),
      ...cbeCard("Logistics & Deployment", "Logistics tracking, deployment readiness, installation sequencing, and clarity around what is arriving where and when. Reduced execution risk.", AMBER),
      ...cbeCard("Real-Time Visibility", "Project status monitored clearly, emerging issues seen earlier, leadership intervenes sooner. No need to be CC\u2019d on every email to stay informed.", AMBER),
      ...cbeCard("Measurement & Learning", "Event outcomes, attendee engagement, lead conversion, performance patterns. The loop between delivery and future strategy \u2014 closed.", AMBER),
      ...cbeCard("Continuous Improvement", "Each project informs the next. Recurring issues become visible. High-performing formats become identifiable. The company becomes **better over time, not just busier**.", AMBER),

      accentBox(null, "**EXECUTE becomes:** more visible, more coordinated, more predictable, more measurable, and more capable of learning over time.", AMBER),

      makeTable(["Before", "After"],
        [["Status via email chains, reactive fire-fighting, post-event learnings lost, no unified view",
          "Real-time visibility, connected execution, organizational learning compounds over time"]],
        [4680, 4680]),

      spacer(200),
      accentBox(null, "**Five dimensions. Three phases. One backbone.** The Digital Backbone makes Taylor more informed in Create, more coordinated in Build, and more governed in Execute. It doesn\u2019t add complexity \u2014 it removes the friction that 95 years of organic growth naturally created.", ACCENT),

      new Paragraph({ children: [new PageBreak()] }),

      // ══════════════════════════════════════════════════════
      // 04 — THE TRANSFORMATION (Phases)
      // ══════════════════════════════════════════════════════
      sectionNum("04 \u2014 The Transformation"),
      heading("Your Language. Your Framework. Five Dimensions."),

      para("Taylor already operates in Create, Build, Execute. It\u2019s how you conceive, produce, and deliver experiences for the world\u2019s most demanding brands. The Digital Backbone doesn\u2019t change that framework \u2014 it strengthens every layer of it."),

      para("Across all three phases, we address **five transformation dimensions** \u2014 the areas where operational maturity determines whether a company scales efficiently or simply grows larger:"),

      heading("The Phases", HeadingLevel.HEADING_2),

      phaseCard("Intake", "INTAKE", "Apr \u2013 May 2026", "Remote",
        "SOP documentation, technology audit, stakeholder mapping.",
        ["Current-state assessment", "Technology audit", "Prioritized workstreams", "Scoped next-phase proposal"], BLUE),
      spacer(120),

      phaseCard("Discovery", "DISCOVERY", "Jun \u2013 Jul 2026", "Onsite Toronto + Remote",
        "Interviews, process mapping, AI vision alignment.",
        ["Process maps", "AI readiness evaluation", "Quick-win identification", "Implementation roadmap"], GREEN),
      spacer(120),

      phaseCard("Implementation", "IMPLEMENTATION", "Aug \u2013 Oct 2026", "Hybrid",
        "Priority workstreams, automation builds, champion training.",
        ["Activated platforms", "Built automations", "Trained champions", "Measurable KPIs"], ACCENT),
      spacer(120),

      phaseCard("Stabilization", "STABILIZATION", "Nov 2026+", "Remote",
        "Adoption reinforcement, measurement, knowledge transfer.",
        ["Adoption monitoring", "Optimization recs", "Quarterly reviews", "Knowledge transfer"], AMBER),

      spacer(160),
      accentBox("How the phases map to Create, Build, Execute",
        "**INTAKE + DISCOVERY** \u2192 Primarily **CREATE** \u2014 understanding how Taylor creates, builds, and executes today.\n**IMPLEMENTATION** \u2192 Primarily **BUILD** \u2014 activating tools, connecting systems, building automations, training champions.\n**STABILIZATION** \u2192 Primarily **EXECUTE** \u2014 measuring adoption, optimizing workflows, ensuring the backbone sustains itself.", ACCENT),

      new Paragraph({ children: [new PageBreak()] }),

      // ══════════════════════════════════════════════════════
      // 05 — TIMELINE
      // ══════════════════════════════════════════════════════
      sectionNum("05 \u2014 Timeline"),
      heading("A Phased Approach"),
      para("Each phase builds on the previous, ensuring early wins fund later investment."),

      // Timeline as table
      makeTable(
        ["Phase", "Period", "Key Activities", "Value"],
        [
          ["INTAKE", "Apr \u2013 May 2026", "SOP review, technology audit, stakeholder mapping", "Clear baseline. No assumptions \u2014 only evidence."],
          ["DISCOVERY", "Jun \u2013 Jul 2026", "Onsite Toronto interviews, process mapping, AI vision alignment", "Shared understanding of what\u2019s possible."],
          ["IMPLEMENTATION", "Aug \u2013 Oct 2026", "Workstream execution, automation builds, champion training", "Tangible improvements. Measurable ROI."],
          ["STABILIZATION", "Nov 2026+", "Adoption reinforcement, knowledge transfer", "Taylor owns the transformation, not TransformAZ."],
        ],
        [1800, 1800, 3160, 2600]),

      new Paragraph({ children: [new PageBreak()] }),

      // ── INTERSTITIAL 3 ──
      ...interstitial("Only 16% of digital transformations fully succeed. Approach matters more than ambition.", "McKinsey"),

      // ── INTERSTITIAL 4 ──
      ...interstitial("Everyone is buying AI tools. Almost nobody is connecting them. The ones who wire it into how they actually work \u2014 they won\u2019t just compete. They\u2019ll set the rules.", null),

      // ══════════════════════════════════════════════════════
      // 06 — MARKET INSIGHTS
      // ══════════════════════════════════════════════════════
      sectionNum("06 \u2014 Market Insights"),
      heading("The AI Transformation Landscape"),

      para("88% of enterprises now use AI \u2014 but only 34% are truly reimagining their business. Here\u2019s where the industry stands, and why Taylor\u2019s timing is strategic."),

      statRow([
        { value: "88%", label: "AI Adoption", source: "McKinsey 2025" },
        { value: "53%", label: "Productivity Boost", source: "McKinsey/WEF 2025" },
        { value: "500%", label: "Predictive Maint. ROI", source: "Tech-Stack 2025" },
        { value: "$155B", label: "AI in Mfg by 2030", source: "Industry Reports" },
      ]),

      spacer(200),
      heading("Industry Evolution", HeadingLevel.HEADING_3),
      makeTable(
        ["Year", "Milestone", "Description"],
        [
          ["2025", "AI Copilots", "Copilot, Gemini, ClickUp Brain \u2014 AI assists, humans decide"],
          ["2026", "AI Agents", "AI acts autonomously \u2014 books, flags, follows up"],
          ["2029", "Connected Systems", "Machines talk to each other, predict failures"],
          ["2032", "Digital Twins", "Test spaces and layouts virtually before building"],
          ["2036", "AI End-to-End", "Concept to logistics, fully orchestrated"],
        ],
        [1200, 2400, 5760]),

      spacer(120),
      heading("Taylor Group\u2019s AI Journey", HeadingLevel.HEADING_3),
      makeTable(
        ["Year", "Milestone", "Description"],
        [
          ["2026", "Digital Backbone", "Audit, quick wins, first agents deployed"],
          ["2027", "AI-Powered Ops", "Automated proposals, predictive logistics"],
          ["2029", "Autonomous Ops", "Agents run staffing, logistics, reporting"],
          ["2032", "Experience Twins", "Test events and spaces virtually, iterate fast"],
          ["2036", "Industry Leader", "A century of knowledge, fully activated by AI"],
        ],
        [1200, 2400, 5760]),

      new Paragraph({ children: [new PageBreak()] }),

      // Horizon Cards
      horizonCard("Horizon 1: Now \u2192 12 months", null, [
        "88% of orgs use AI in at least one function; worker access rose 50% in 2025 \u2014 McKinsey",
        "Lighthouse factories: 53% labor productivity boost, 26% cost reduction \u2014 McKinsey/WEF",
        "95% of manufacturers invested or planning to invest in AI automation \u2014 Tech-Stack",
        "Microsoft 365 Copilot now ships agentic capabilities at $30/user/month",
        "Quick wins available now: the tools Taylor already owns are evolving fast",
      ], BLUE),

      spacer(160),
      horizonCard("Horizon 2: 1\u20133 Years", null, [
        "Agentic AI replaces chatbots \u2014 Microsoft 2026 Wave 1: autonomous agents in Dynamics 365",
        "By 2026: 45% of G2000 OEMs connect field + engineering data via AI \u2014 IDC",
        "Digital twins: $24.5B market, ~75% adoption in advanced industries \u2014 McKinsey",
        "Predictive maintenance: 300\u2013500% ROI; computer vision QC: 200\u2013300% ROI \u2014 Tech-Stack",
        "Jack Morton + Impact XM merged (Jan 2026) \u2014 competitors consolidating around data platforms",
      ], AMBER),

      spacer(160),
      horizonCard("Horizon 3: 5\u201310 Years", "Where We See Taylor Group in 2036", [
        "AI in manufacturing: $34B \u2192 $155B by 2030 at 35% CAGR \u2014 backbone builders become leaders",
        "Digital twin market: $24.5B today, projected to exceed $250B by 2034 \u2014 virtual replicas of warehouses, assets, spaces",
        "By 2028: 65% of G1000 manufacturers integrate AI agents into design/simulation \u2014 IDC",
        "By 2029: 30% of factories manage controls centrally via open automation platforms \u2014 IDC",
        "Taylor\u2019s 95 years of institutional knowledge + Digital Backbone = moat AI-only entrants can\u2019t replicate",
      ], GREEN),

      spacer(200),
      para("The gap isn\u2019t between companies that use AI and those that don\u2019t. It\u2019s between those that **connected their AI into a backbone** \u2014 and those still running pilots.", { italic: true }),

      new Paragraph({ children: [new PageBreak()] }),

      // Competitive Landscape
      heading("What Your Competitors Are Doing", HeadingLevel.HEADING_2),

      competitorCard("Jack Morton + Impact XM",
        "Merged in January 2026 to combine their client lists and data. Their bet: one bigger company with shared measurement tools can win more enterprise contracts \u2014 and prove ROI faster.",
        "They\u2019re getting bigger to move faster. Scale is their strategy."),
      spacer(120),

      competitorCard("Freeman",
        "The largest event services company in the industry. Already using virtual/augmented reality in activations and AI to manage event logistics. They measure everything digitally.",
        "They\u2019re not experimenting \u2014 they\u2019re operating with AI today."),
      spacer(120),

      competitorCard("George P. Johnson (GPJ)",
        "Part of Project Worldwide. Building experiences that blend physical and digital \u2014 from design through production. Using technology across the entire creative process.",
        "They\u2019re embedding tech into every step, not just the final event."),

      spacer(120),
      para("Your competitors aren\u2019t waiting. Taylor\u2019s advantage: 95 years of institutional knowledge and a team ready to activate \u2014 but that window won\u2019t stay open.", { italic: true }),

      // Stats Box
      spacer(120),
      accentBox("The Transformation Reality",
        "**Only 16%** of digital transformations fully succeed \u2014 McKinsey 2025. **Only 39%** report enterprise-level EBIT impact from AI. **53%** average productivity boost in Lighthouse factories \u2014 McKinsey/WEF 2025. **~75%** of advanced-industry companies have adopted digital twin technology. Everyone is buying AI tools. Almost nobody is connecting them.", ACCENT),

      new Paragraph({ spacing: { after: 60 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Sources: McKinsey State of AI 2025 \u00b7 McKinsey/WEF Global Lighthouse Network 2025 \u00b7 IDC FutureScape 2026 \u00b7 MarketsandMarkets 2025",
          font: "Consolas", size: 14, color: "A1A1AA" })] }),

      new Paragraph({ children: [new PageBreak()] }),

      // ══════════════════════════════════════════════════════
      // 07 — NEXT STEPS
      // ══════════════════════════════════════════════════════
      sectionNum("07 \u2014 Next Steps"),
      heading("Moving Forward"),

      makeTable(
        ["Phase", "Duration", "Format", "Investment"],
        [
          ["INTAKE", "2 months", "Remote", "Fixed project fee"],
          ["DISCOVERY", "2 months", "Onsite + remote", "Fixed project fee"],
          ["IMPLEMENTATION", "12 weeks", "Hybrid", "Monthly retainer"],
          ["STABILIZATION", "Ongoing", "Remote", "Advisory retainer"],
        ],
        [2000, 2000, 2680, 2680]),

      heading("What Taylor Gets", HeadingLevel.HEADING_3),

      new Paragraph({ spacing: { after: 60 }, numbering: { reference: "bullets", level: 0 },
        children: [
          new TextRun({ text: "INTAKE: ", font: "Calibri", size: 22, bold: true }),
          new TextRun({ text: "Current-state assessment, technology audit, stakeholder map, scoped proposal for next phases.", font: "Calibri", size: 22, color: GRAY }),
        ] }),
      new Paragraph({ spacing: { after: 60 }, numbering: { reference: "bullets", level: 0 },
        children: [
          new TextRun({ text: "DISCOVERY: ", font: "Calibri", size: 22, bold: true }),
          new TextRun({ text: "Process maps, AI readiness evaluation, quick-wins, implementation roadmap.", font: "Calibri", size: 22, color: GRAY }),
        ] }),
      new Paragraph({ spacing: { after: 60 }, numbering: { reference: "bullets", level: 0 },
        children: [
          new TextRun({ text: "IMPLEMENTATION: ", font: "Calibri", size: 22, bold: true }),
          new TextRun({ text: "Activated platforms, automations, trained champions, measurable KPIs.", font: "Calibri", size: 22, color: GRAY }),
        ] }),
      new Paragraph({ spacing: { after: 60 }, numbering: { reference: "bullets", level: 0 },
        children: [
          new TextRun({ text: "STABILIZATION: ", font: "Calibri", size: 22, bold: true }),
          new TextRun({ text: "Adoption monitoring, optimization, quarterly reviews, knowledge transfer.", font: "Calibri", size: 22, color: GRAY }),
        ] }),

      spacer(120),
      accentBox(null, "**Start INTAKE \u2014 April 2026.** A contained, fixed-fee engagement. Comprehensive assessment. Scoped roadmap. No obligation to proceed further.", ACCENT),

      spacer(60),
      para("If the assessment confirms the opportunity, we proceed. If not, Taylor walks away with a valuable operational audit at minimal cost.", { italic: true }),

      new Paragraph({ children: [new PageBreak()] }),

      // ══════════════════════════════════════════════════════
      // 08 — INTAKE PROPOSAL
      // ══════════════════════════════════════════════════════
      sectionNum("08 \u2014 Intake Proposal"),
      heading("The INTAKE: Where Evidence Replaces Assumptions"),

      para("Our initial assessment identified **$1.4M\u20132.85M in annual operational friction** across Taylor Group. But these are estimates \u2014 directional signals drawn from public data, initial conversations, and pattern recognition. The INTAKE transforms those signals into precision: observed workflows, measured inefficiencies, documented dependencies."),

      para("Everything presented so far is a hypothesis. The INTAKE is where we prove it \u2014 or disprove it. Either outcome is valuable. Taylor either gains a validated roadmap for transformation, or walks away knowing the current operation is better than we estimated."),

      statRow([
        { value: "2 mo", label: "Duration" },
        { value: "12", label: "Stakeholder Interviews" },
        { value: "3", label: "Core Flows Mapped" },
        { value: "5", label: "Dimensions Assessed" },
      ]),

      heading("Scope of Work", HeadingLevel.HEADING_2),

      ...scopeCard("1. SOP Documentation & Review", "FOUNDATION", BLUE,
        "Catalog existing procedures across departments.",
        "Comprehensive inventory of all Standard Operating Procedures across Sales, Production, Creative, Digital, and Healthcare divisions. Gap analysis against industry best practices. Assessment of documentation currency, accessibility, and actual adoption rates.",
        "SOP catalog with gap analysis report, prioritized update recommendations, and standardized documentation templates."),

      ...scopeCard("2. Technology Audit", "CORE", ACCENT,
        "Full inventory of ClickUp, M365, Gemini, and departmental tools.",
        "Architecture review of the entire technology ecosystem: ClickUp configuration and utilization, Microsoft 365 suite activation (including underused features), Google Gemini/AI tool adoption, plus every departmental tool and shadow IT system. License utilization rates, integration gaps, and Brain/AI activation status mapped.",
        "Technology stack audit with utilization scores, integration map, license optimization recommendations, and AI readiness assessment."),

      ...scopeCard("3. Stakeholder Mapping", "PEOPLE", GREEN,
        "8\u201312 structured interviews across functions.",
        "Structured interview protocol covering Sales, Production, Creative, Digital, and Healthcare divisions. Each interview maps pain points, wish lists, current workarounds, and organizational dynamics. Identifies champions, blockers, and influence networks critical for transformation adoption.",
        "Synthesized interview findings by department, stakeholder influence map, change readiness assessment, and champion identification."),

      ...scopeCard("4. Process Mapping", "OPERATIONS", AMBER,
        "End-to-end documentation of 3 core flows.",
        "Detailed documentation of three critical workflows: **Sales-to-Production** (quote through handoff), **Creative-to-Fabrication** (design through build), and **Executive Operations** (reporting, approvals, resource allocation). Each flow mapped with bottlenecks, handoff points, time sinks, and rework loops identified.",
        "Visual process maps with narrative documentation, bottleneck analysis, and quantified time/cost impact at each friction point."),

      ...scopeCard("5. Digital Maturity Assessment", "CORE", ACCENT,
        "Five-dimension evaluation across the organization.",
        "Structured assessment across five dimensions: **People & Culture** (digital literacy, change appetite), **Processes** (standardization, automation readiness), **Technology** (stack maturity, integration depth), **Data** (quality, accessibility, governance), and **Compliance** (regulatory, security, privacy). Each dimension scored, benchmarked against industry peers, and gaps identified.",
        "Digital Maturity Scorecard with dimension scores, peer benchmarks, gap analysis, and prioritized improvement recommendations."),

      ...scopeCard("6. Transformation Roadmap", "STRATEGY", BLUE,
        "Prioritized workstreams + scoped next-phase proposal.",
        "All findings synthesized into a prioritized transformation roadmap. Quick wins (30\u201360 day impact) separated from strategic plays (6\u201318 month horizon). Estimated investment ranges for Discovery and Implementation phases. Recommended sequencing based on dependencies, risk, and organizational readiness.",
        "Transformation Roadmap presentation with phased workstreams, investment ranges, risk assessment, and a scoped Discovery proposal ready for Taylor\u2019s review."),

      spacer(160),
      accentBox("Where This Fits",
        "INTAKE + DISCOVERY map primarily to **CREATE** \u2014 understanding how Taylor creates, builds, and executes today. No changes are made. No tools are reconfigured. Only observation, documentation, and analysis.", ACCENT),

      new Paragraph({ children: [new PageBreak()] }),

      // INTAKE Deliverables
      heading("INTAKE Deliverables", HeadingLevel.HEADING_2),
      makeTable(
        ["Deliverable", "Format", "Description"],
        [
          ["Current-State Assessment", "Report (PDF)", "Executive summary of findings across all 5 dimensions"],
          ["Technology Stack Audit", "Spreadsheet + Report", "Every tool, utilization score, integration status, recommendations"],
          ["Stakeholder Interview Findings", "Report", "Synthesized themes, pain points, opportunities by department"],
          ["Process Maps (\u00d73)", "Visual diagrams + narrative", "Sales-to-Production, Creative-to-Fabrication, Executive Operations"],
          ["Digital Maturity Scorecard", "Interactive dashboard", "Five-dimension scores with benchmarks and gap analysis"],
          ["Transformation Roadmap", "Presentation + Report", "Prioritized workstreams, phasing, investment ranges, scoped Discovery proposal"],
        ],
        [2800, 1800, 4760]),

      // DISCOVERY Deliverables
      heading("What DISCOVERY Adds", HeadingLevel.HEADING_2),
      para("DISCOVERY extends the INTAKE with onsite validation in Toronto and tangible quick wins. Taylor doesn\u2019t just get a report \u2014 Taylor gets results."),
      makeTable(
        ["Deliverable", "Format", "Description"],
        [
          ["Validated Process Maps", "Updated diagrams", "INTAKE maps refined with onsite shadowing \u2014 observed reality vs. interview data"],
          ["Quick-Win Automations (\u00d73\u20135)", "Live in production", "ClickUp/M365 automations targeting highest-friction points, with documentation"],
          ["AI Readiness Report", "Report + Pilot Plan", "ClickUp Brain activation strategy, M365 Copilot assessment, pilot design"],
          ["Champion Playbook", "Guide + Materials", "2\u20133 champions per division identified, training framework, program kickoff"],
          ["Executive Workshop", "Half-day session", "Findings, roadmap, and change management framework with leadership team"],
          ["Implementation Proposal", "Presentation + Report", "Scoped next phase with timelines, resources, costs, and KPIs"],
        ],
        [2800, 1800, 4760]),

      new Paragraph({ children: [new PageBreak()] }),

      // Investment Options
      heading("Your Investment", HeadingLevel.HEADING_2),
      para("Two paths forward. The INTAKE stands alone as a complete diagnostic. Or combine it with DISCOVERY to validate findings onsite and leave with automations already working."),

      tierBox("INTAKE", false, [
        ["What you get", "Complete remote assessment: 8\u201312 stakeholder interviews, technology audit, 3 process maps, 5-dimension maturity scorecard, transformation roadmap"],
        ["Deliverables", "6 (see table above)"],
        ["Duration", "2 months"],
        ["Format", "Fully remote"],
      ], "$18,000", "50% kickoff \u00b7 50% delivery"),

      spacer(200),

      tierBox("INTAKE + DISCOVERY", true, [
        ["What you get", "Everything in INTAKE + onsite Toronto immersion (2 trips), process shadowing & validation, 3\u20135 quick-win automations, executive workshop, champion program, AI readiness pilot"],
        ["Deliverables", "12 (INTAKE deliverables + 6 DISCOVERY deliverables)"],
        ["Duration", "4 months"],
        ["Format", "Remote \u2192 Onsite + Remote"],
      ], "$42,000", "30% kickoff \u00b7 25% INTAKE close \u00b7 25% Discovery mid \u00b7 20% final"),

      para("Fixed project fee. Travel billed separately at cost. No obligation to proceed to subsequent phases.", { italic: true, align: AlignmentType.CENTER }),

      // ROI
      spacer(200),
      accentBox(null, "Against **$1.4M\u20132.85M in annual operational friction** identified in our initial assessment, the INTAKE at $18,000 represents roughly 1% of the problem cost. The full INTAKE + DISCOVERY at $42,000 delivers not just the diagnosis but working automations and a validated roadmap \u2014 at less than 3% of the annual friction.", ACCENT),

      para("\u201CIf the assessment confirms the opportunity, we proceed. If not, Taylor walks away with a valuable operational audit at minimal cost.\u201D", { italic: true }),

      // Engagement Terms
      heading("Engagement Terms", HeadingLevel.HEADING_2),
      makeTable(
        ["Term", "Detail"],
        [
          ["Confidentiality", "Full NDA. Findings shared only with designated Taylor leadership."],
          ["Scope Protection", "If Discovery reveals scope changes, adjustments proposed before proceeding."],
          ["Client Dependencies", "Access to systems, stakeholder availability, documentation."],
          ["Cancellation", "Either party, 10 business days written notice."],
          ["Travel", "Billed at cost, not included in project fee."],
          ["No Obligation", "INTAKE stands alone \u2014 no commitment to subsequent phases."],
        ],
        [2400, 6960]),

      // CTA
      spacer(300),
      new Table({
        width: { size: CONTENT_W, type: WidthType.DXA },
        columnWidths: [CONTENT_W],
        rows: [new TableRow({ children: [new TableCell({
          borders: { top: { style: BorderStyle.SINGLE, size: 2, color: ACCENT },
            bottom: border, left: border, right: border },
          margins: { top: 240, bottom: 240, left: 240, right: 240 },
          children: [
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
              children: [new TextRun({ text: "Let\u2019s Begin \u2014 April 2026", font: "Georgia",
                size: 32, bold: true, color: ACCENT })] }),
            new Paragraph({ alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: "The first step is a 30-minute scoping call to align on priorities, confirm stakeholder access, and schedule the kickoff. No preparation needed \u2014 we come to you.",
                font: "Calibri", size: 22, color: GRAY })] })
          ]
        })] })]
      }),

      // Footer
      spacer(300),
      new Paragraph({ alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "TransformAZ \u2014 March 2026 \u2014 Prepared exclusively for Taylor Group",
          font: "Consolas", size: 16, color: "A1A1AA" })] }),
    ]
  }]
});

// ─── GENERATE ───
const outPath = __dirname + '/Taylor-Group-Full-Pitch-EDITABLE.docx';
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log('Created:', outPath);
  console.log('Size:', (buffer.length / 1024).toFixed(0) + ' KB');
});
