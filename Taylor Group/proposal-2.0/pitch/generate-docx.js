const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageNumber, PageBreak,
  Tab, TabStopType, TabStopPosition
} = require("docx");

// ── COLORS ─────────────────────────────────
const C = {
  accent: "7A7AE6",
  accentLight: "EDEDFC",
  blue: "2C5282",
  blueLight: "E8F0FE",
  green: "2A7D4F",
  greenLight: "E8F5EE",
  amber: "9A6F1E",
  amberLight: "FDF5E6",
  red: "C0392B",
  redLight: "FDEAEA",
  text: "1A1A1A",
  textMuted: "5C5C5C",
  border: "D5D5D5",
  lightBg: "F4F3F0",
  white: "FFFFFF",
};

// ── HELPERS ─────────────────────────────────
const FONT_BODY = "Calibri";
const FONT_HEAD = "Georgia";
const PAGE_W = 12240; // US Letter
const PAGE_H = 15840;
const MARGIN = 1440; // 1 inch
const CONTENT_W = PAGE_W - 2 * MARGIN; // 9360

const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const thinBorder = (color = C.border) => ({ style: BorderStyle.SINGLE, size: 1, color });
const thinBorders = (color) => ({ top: thinBorder(color), bottom: thinBorder(color), left: thinBorder(color), right: thinBorder(color) });
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({ heading: level, children: [new TextRun(text)] });
}

function sectionLabel(text, color = C.accent) {
  return new Paragraph({
    spacing: { before: 100, after: 60 },
    children: [new TextRun({ text: text.toUpperCase(), font: FONT_BODY, size: 16, color, bold: true, characterSpacing: 60 })]
  });
}

function bodyText(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 160 },
    children: [new TextRun({ text, font: FONT_BODY, size: 22, color: opts.color || C.text, bold: opts.bold, italic: opts.italic })]
  });
}

function richParagraph(runs, spacing = { after: 160 }) {
  return new Paragraph({ spacing, children: runs });
}

function boldBodyText(label, text) {
  return new Paragraph({
    spacing: { after: 160 },
    children: [
      new TextRun({ text: label, font: FONT_BODY, size: 22, color: C.text, bold: true }),
      new TextRun({ text, font: FONT_BODY, size: 22, color: C.textMuted }),
    ]
  });
}

function bulletItem(text, ref = "bullets") {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, font: FONT_BODY, size: 22, color: C.text })]
  });
}

function bulletItemRich(runs, ref = "bullets") {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 80 },
    children: runs
  });
}

function quoteBlock(text, author) {
  return [
    new Paragraph({
      spacing: { before: 200, after: 40 },
      indent: { left: 400 },
      border: { left: { style: BorderStyle.SINGLE, size: 6, color: C.accent, space: 12 } },
      children: [new TextRun({ text: `\u201C${text}\u201D`, font: FONT_BODY, size: 21, color: C.textMuted, italic: true })]
    }),
    new Paragraph({
      spacing: { after: 200 },
      indent: { left: 400 },
      border: { left: { style: BorderStyle.SINGLE, size: 6, color: C.accent, space: 12 } },
      children: [new TextRun({ text: `\u2014 ${author}`, font: FONT_BODY, size: 18, color: C.textMuted, bold: true })]
    }),
  ];
}

function calloutBox(label, text, color = C.accent, bgColor = C.accentLight) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({
      children: [new TableCell({
        borders: {
          top: { style: BorderStyle.NONE, size: 0, color: bgColor },
          bottom: { style: BorderStyle.NONE, size: 0, color: bgColor },
          right: { style: BorderStyle.NONE, size: 0, color: bgColor },
          left: { style: BorderStyle.SINGLE, size: 12, color },
        },
        shading: { fill: bgColor, type: ShadingType.CLEAR },
        margins: { top: 120, bottom: 120, left: 200, right: 200 },
        width: { size: CONTENT_W, type: WidthType.DXA },
        children: [
          new Paragraph({
            spacing: { after: 60 },
            children: [new TextRun({ text: label.toUpperCase(), font: FONT_BODY, size: 14, color, bold: true, characterSpacing: 40 })]
          }),
          new Paragraph({
            children: [new TextRun({ text, font: FONT_BODY, size: 20, color: C.text })]
          }),
        ]
      })]
    })]
  });
}

function calloutBoxMultiParagraph(label, paragraphs, color = C.accent, bgColor = C.accentLight) {
  const cellChildren = [
    new Paragraph({
      spacing: { after: 60 },
      children: [new TextRun({ text: label.toUpperCase(), font: FONT_BODY, size: 14, color, bold: true, characterSpacing: 40 })]
    }),
  ];
  paragraphs.forEach(p => {
    cellChildren.push(new Paragraph({
      spacing: { after: 80 },
      children: [new TextRun({ text: p, font: FONT_BODY, size: 20, color: C.text })]
    }));
  });
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({
      children: [new TableCell({
        borders: {
          top: { style: BorderStyle.NONE, size: 0, color: bgColor },
          bottom: { style: BorderStyle.NONE, size: 0, color: bgColor },
          right: { style: BorderStyle.NONE, size: 0, color: bgColor },
          left: { style: BorderStyle.SINGLE, size: 12, color },
        },
        shading: { fill: bgColor, type: ShadingType.CLEAR },
        margins: { top: 120, bottom: 120, left: 200, right: 200 },
        width: { size: CONTENT_W, type: WidthType.DXA },
        children: cellChildren
      })]
    })]
  });
}

function spacer(pts = 200) {
  return new Paragraph({ spacing: { after: pts }, children: [] });
}

// Finding card as a table
function findingCard(title, tag, tagColor, tagBg, quote, author, whatMeans, impactLabel, impactText) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({
      children: [new TableCell({
        borders: {
          top: { style: BorderStyle.SINGLE, size: 6, color: tagColor },
          bottom: thinBorder(C.border),
          left: thinBorder(C.border),
          right: thinBorder(C.border),
        },
        margins: { top: 140, bottom: 140, left: 200, right: 200 },
        width: { size: CONTENT_W, type: WidthType.DXA },
        children: [
          // Tag + Title
          richParagraph([
            new TextRun({ text: `${tag}  `, font: FONT_BODY, size: 14, color: tagColor, bold: true, characterSpacing: 30 }),
          ], { after: 60 }),
          new Paragraph({
            spacing: { after: 100 },
            children: [new TextRun({ text: title, font: FONT_HEAD, size: 24, color: C.text, bold: true })]
          }),
          // Quote
          new Paragraph({
            spacing: { after: 60 },
            indent: { left: 200 },
            border: { left: { style: BorderStyle.SINGLE, size: 4, color: C.accent, space: 8 } },
            children: [new TextRun({ text: `\u201C${quote}\u201D`, font: FONT_BODY, size: 19, color: C.textMuted, italic: true })]
          }),
          new Paragraph({
            spacing: { after: 120 },
            indent: { left: 200 },
            border: { left: { style: BorderStyle.SINGLE, size: 4, color: C.accent, space: 8 } },
            children: [new TextRun({ text: `\u2014 ${author}`, font: FONT_BODY, size: 16, color: C.textMuted, bold: true })]
          }),
          // What this means
          new Paragraph({
            spacing: { after: 40 },
            children: [new TextRun({ text: "What this means", font: FONT_BODY, size: 18, color: C.text, bold: true })]
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [new TextRun({ text: whatMeans, font: FONT_BODY, size: 20, color: C.textMuted })]
          }),
          // Impact
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({ text: `${impactLabel}: `, font: FONT_BODY, size: 18, color: C.amber, bold: true }),
              new TextRun({ text: impactText, font: FONT_BODY, size: 20, color: C.amber }),
            ]
          }),
        ]
      })]
    })]
  });
}

// Before/After table
function beforeAfterTable(rows) {
  const colW = Math.floor(CONTENT_W / 2);
  const headerRow = new TableRow({
    children: [
      new TableCell({
        borders: { ...thinBorders(C.border), bottom: { style: BorderStyle.SINGLE, size: 4, color: C.text } },
        shading: { fill: C.lightBg, type: ShadingType.CLEAR },
        margins: cellMargins,
        width: { size: colW, type: WidthType.DXA },
        children: [new Paragraph({ children: [new TextRun({ text: "WITHOUT BACKBONE", font: FONT_BODY, size: 16, color: C.textMuted, bold: true, characterSpacing: 30 })] })]
      }),
      new TableCell({
        borders: { ...thinBorders(C.border), bottom: { style: BorderStyle.SINGLE, size: 4, color: C.text } },
        shading: { fill: C.accentLight, type: ShadingType.CLEAR },
        margins: cellMargins,
        width: { size: colW, type: WidthType.DXA },
        children: [new Paragraph({ children: [new TextRun({ text: "WITH BACKBONE", font: FONT_BODY, size: 16, color: C.accent, bold: true, characterSpacing: 30 })] })]
      }),
    ]
  });
  const dataRows = rows.map(r => new TableRow({
    children: [
      new TableCell({
        borders: thinBorders(C.border), margins: cellMargins, width: { size: colW, type: WidthType.DXA },
        children: [new Paragraph({ children: [new TextRun({ text: r[0], font: FONT_BODY, size: 20, color: C.textMuted })] })]
      }),
      new TableCell({
        borders: thinBorders(C.border), margins: cellMargins, width: { size: colW, type: WidthType.DXA },
        children: [new Paragraph({ children: [new TextRun({ text: r[1], font: FONT_BODY, size: 20, color: C.text })] })]
      }),
    ]
  }));
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [colW, colW],
    rows: [headerRow, ...dataRows]
  });
}

// ── BUILD DOCUMENT ──────────────────────────
const children = [];

// ════════════════════════════════════════
// COVER PAGE
// ════════════════════════════════════════
children.push(
  spacer(600),
  richParagraph([
    new TextRun({ text: "Transform", font: FONT_BODY, size: 28, color: C.text }),
    new TextRun({ text: "AZ", font: FONT_BODY, size: 28, color: C.accent, bold: true }),
  ], { after: 800 }),
  // Rule line (using a thin table)
  new Table({
    width: { size: 1200, type: WidthType.DXA },
    columnWidths: [1200],
    rows: [new TableRow({
      children: [new TableCell({
        borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 12, color: C.accent } },
        width: { size: 1200, type: WidthType.DXA },
        children: [new Paragraph({ spacing: { after: 0 }, children: [] })]
      })]
    })]
  }),
  spacer(400),
  new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text: "Building the Digital Backbone", font: FONT_HEAD, size: 52, color: C.text, bold: true })]
  }),
  new Paragraph({
    spacing: { after: 600 },
    children: [new TextRun({ text: "A Transformation Strategy for Taylor Group", font: FONT_HEAD, size: 24, color: C.textMuted, italic: true })]
  }),
  // Meta
  richParagraph([
    new TextRun({ text: "CLIENT  ", font: FONT_BODY, size: 14, color: C.textMuted, bold: true, characterSpacing: 40 }),
    new TextRun({ text: "Taylor Group", font: FONT_BODY, size: 20, color: C.text }),
  ], { after: 60 }),
  richParagraph([
    new TextRun({ text: "DATE  ", font: FONT_BODY, size: 14, color: C.textMuted, bold: true, characterSpacing: 40 }),
    new TextRun({ text: "March 2026", font: FONT_BODY, size: 20, color: C.text }),
  ], { after: 60 }),
  richParagraph([
    new TextRun({ text: "REFERENCE  ", font: FONT_BODY, size: 14, color: C.textMuted, bold: true, characterSpacing: 40 }),
    new TextRun({ text: "TAZ-TG-2026-02", font: FONT_BODY, size: 20, color: C.text }),
  ], { after: 300 }),
  // Badge
  new Table({
    width: { size: 2400, type: WidthType.DXA },
    columnWidths: [2400],
    rows: [new TableRow({
      children: [new TableCell({
        borders: { top: thinBorder(C.accent), bottom: thinBorder(C.accent), left: thinBorder(C.accent), right: thinBorder(C.accent) },
        shading: { fill: C.accentLight, type: ShadingType.CLEAR },
        margins: { top: 40, bottom: 40, left: 120, right: 120 },
        width: { size: 2400, type: WidthType.DXA },
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "STRATEGIC PROPOSAL", font: FONT_BODY, size: 14, color: C.accent, bold: true, characterSpacing: 60 })]
        })]
      })]
    })]
  }),
);

// ════════════════════════════════════════
// 01 — THE OPPORTUNITY
// ════════════════════════════════════════
children.push(
  new Paragraph({ children: [new PageBreak()] }),
  sectionLabel("01 \u2014 The Opportunity"),
  heading("95 Years of Growth. One Moment of Strategic Advantage."),
  spacer(100),
  bodyText("Taylor Group has grown organically for 95 years into an enterprise-scale operation \u2014 $85M revenue, 321 people, spanning 40+ countries. But this growth has been powered by startup-era processes. That\u2019s not a criticism; it\u2019s a testament to the caliber of the people. The question isn\u2019t whether Taylor has succeeded \u2014 it\u2019s what becomes possible when you add a digital foundation to that talent."),
  bodyText("The experiential marketing industry is at an inflection point. The market has reached $15.8B, with 74% of brands increasing event budgets. But the landscape is shifting radically: lead times that were 8 weeks are now 2 weeks. AI-powered competitors are entering the space. The companies that thrive won\u2019t be the ones with the most people \u2014 they\u2019ll be the ones with the smartest operations."),
  bodyText("The tools are already in place. ClickUp, Gemini, Microsoft 365 \u2014 Taylor has invested in the technology. But without a unified strategy, these tools sit dormant. The investment has been made; the return hasn\u2019t been realized."),
  bodyText("There is no CTO. No unified technology roadmap. No connective tissue between tools, teams, and offices. This isn\u2019t unusual for companies that grew through acquisition and organic expansion \u2014 but it means every department has optimized in isolation."),
  bodyText("Only 16% of digital transformations fully succeed (McKinsey). That means doing this right matters more than doing it fast. The approach matters. The sequencing matters. The culture matters."),
  spacer(100),
  calloutBox("The Digital Backbone", "The \u201CDigital Backbone\u201D is what transforms Taylor from a collection of talented teams into one connected, AI-amplified operation. Not new software \u2014 new connective tissue."),
  spacer(200),
  // The Cost of Waiting
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun("The Cost of Waiting")]
  }),
  spacer(100),
  calloutBoxMultiParagraph("Urgency", [
    "Every quarter without a unified digital strategy:",
    "\u2022 Redundant asset fabrication continues unchecked \u2014 estimated $125K\u2013$300K per quarter",
    "\u2022 Sales\u2194production misalignment compounds with growth \u2014 each new market multiplies the coordination gap",
    "\u2022 AI-powered competitors are already operationalizing \u2014 Freeman, GPJ, and Jack Morton have publicly announced AI and automation programs",
    "\u2022 ClickUp, Gemini, and M365 investments depreciate without activation \u2014 Taylor is paying for capability it isn\u2019t using",
    "This is not a 2027 problem with a 2026 option. The operational cost is being paid today.",
  ], C.amber, C.amberLight),
);

// ════════════════════════════════════════
// 02 — KEY FINDINGS
// ════════════════════════════════════════
children.push(
  new Paragraph({ children: [new PageBreak()] }),
  sectionLabel("02 \u2014 Key Findings"),
  heading("What Discovery Revealed"),
  spacer(100),
  bodyText("Six patterns emerged from our conversations with Dean, Mike, and the leadership team. Each represents both a current cost and a future opportunity."),
  spacer(100),
  findingCard("Asset Management Blind Spot", "HIGH IMPACT", C.red, C.redLight,
    "We probably have, I don\u2019t know, somewhere between $20 and $30 million worth of assets in our warehouses. And honestly, I couldn\u2019t tell you exactly what we have.",
    "Dean",
    "Without centralized asset tracking, teams rebuild what already exists. Across three warehouses and 40+ countries of event deployments, the duplication is invisible but costly.",
    "Estimated Annual Impact", "$500K \u2013 $1.2M in redundant fabrication, lost assets, and missed reuse opportunities. Based on 3-5% redundant fabrication rate across $15-25M annual asset-related spend."),
  spacer(200),
  findingCard("Sales \u2194 Production Disconnect", "HIGH IMPACT", C.red, C.redLight,
    "Sales will sell something and then production finds out and goes, \u2018Wait, we can\u2019t do that in that timeline.\u2019",
    "Dean",
    "Sales operates without real-time visibility into production capacity, leading to over-promises, compressed timelines, and margin erosion.",
    "Estimated Annual Impact", "$400K \u2013 $800K in rush costs, rework, and margin compression. Estimated from rush premiums (15-25%) on misaligned projects."),
  spacer(200),
  findingCard("Executive Time Drain", "MEDIUM IMPACT", C.amber, C.amberLight,
    "I get 400 to 500 emails a day. I\u2019d say 70% are CCs where I don\u2019t really need to be included.",
    "Dean",
    "Senior leadership spends hours daily processing communication that could be filtered, summarized, or routed automatically. This isn\u2019t just an email problem \u2014 it\u2019s a decision-making bottleneck.",
    "Estimated Annual Impact", "$225K \u2013 $300K in executive productivity lost to communication overhead. Based on 2-3 hours/day across 3-4 senior leaders at loaded cost."),
  new Paragraph({ children: [new PageBreak()] }),
  findingCard("Dormant AI Investment", "MEDIUM IMPACT", C.amber, C.amberLight,
    "We\u2019re paying for ClickUp Brain but nobody\u2019s really using it.",
    "Mike",
    "Taylor is already paying for AI capabilities embedded in its project management platform. The investment exists; the activation doesn\u2019t. This represents the lowest-hanging fruit in the transformation.",
    "Estimated Annual Impact", "$75K \u2013 $150K in unrealized productivity gains from tools already purchased."),
  spacer(200),
  findingCard("Generational Adoption Gap", "STRATEGIC", C.blue, C.blueLight,
    "The younger employees pick things up instantly. Some of our senior people... it\u2019s a harder conversation.",
    "Dean",
    "Without a segmented adoption strategy, technology rollouts create friction instead of momentum. Different personas need different pathways, different training, and different timelines.",
    "Strategic Importance", "Every month of delayed adoption costs momentum. Industry data shows 6-month delays double transformation costs."),
  spacer(200),
  findingCard("Missing Strategic Tech Layer", "STRATEGIC", C.blue, C.blueLight,
    "We don\u2019t have a CTO. We\u2019ve never had someone whose job is to look at all of this holistically.",
    "Dean",
    "Every technology decision has been made reactively and departmentally. There\u2019s no architecture, no roadmap, no governance. TransformAZ fills this gap during the engagement \u2014 and builds the framework so Taylor can sustain it after.",
    "Strategic Importance", "$200K \u2013 $400K annually in duplicated tools, unused licenses, and integration workarounds."),
  spacer(200),
  calloutBox("Aggregate Estimated Impact", "Aggregate Estimated Impact: $1.4M \u2013 $2.85M annually in operational friction, redundant spend, and unrealized technology value. These estimates are conservative. The actual figure becomes precise during the INTAKE phase \u2014 one of its primary deliverables.", C.red, C.redLight),
);

// ════════════════════════════════════════
// 03 — THE DIGITAL BACKBONE
// ════════════════════════════════════════
children.push(
  new Paragraph({ children: [new PageBreak()] }),
  sectionLabel("03 \u2014 The Digital Backbone"),
  heading("One Connected Operation"),
  spacer(100),
  bodyText("Think of the Digital Backbone as the nervous system of Taylor Group\u2019s operation. Just as the spine connects every part of the body \u2014 enabling the brain to communicate with the hands, the eyes to coordinate with the feet \u2014 the Digital Backbone connects every part of Taylor\u2019s business: sales, production, assets, communication, and decisions."),
  bodyText("In practice, this means: information flows seamlessly between offices. Production capacity is visible to sales in real time. Assets are tracked, cataloged, and reusable. Decisions are informed by data, not gut feel. And AI amplifies human talent rather than replacing it."),
  bodyText("Critically, the Digital Backbone is built on what Taylor already owns. This isn\u2019t about buying new software. It\u2019s about activating what\u2019s there, connecting what\u2019s siloed, and adding the intelligence layer that turns tools into a system."),
  spacer(200),
);

// C/B/E visual as table
const cbeColW = Math.floor(CONTENT_W / 3);
children.push(
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [cbeColW, cbeColW, cbeColW],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: { ...noBorders, top: { style: BorderStyle.SINGLE, size: 12, color: C.blue } },
            shading: { fill: C.blueLight, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
            width: { size: cbeColW, type: WidthType.DXA },
            children: [
              new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: "CREATE", font: FONT_BODY, size: 22, color: C.blue, bold: true, characterSpacing: 60 })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Strategy & Creative", font: FONT_BODY, size: 18, color: C.textMuted })] }),
            ]
          }),
          new TableCell({
            borders: { ...noBorders, top: { style: BorderStyle.SINGLE, size: 12, color: C.green } },
            shading: { fill: C.greenLight, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
            width: { size: cbeColW, type: WidthType.DXA },
            children: [
              new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: "BUILD", font: FONT_BODY, size: 22, color: C.green, bold: true, characterSpacing: 60 })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Experiences & Fabrication", font: FONT_BODY, size: 18, color: C.textMuted })] }),
            ]
          }),
          new TableCell({
            borders: { ...noBorders, top: { style: BorderStyle.SINGLE, size: 12, color: C.amber } },
            shading: { fill: C.amberLight, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
            width: { size: cbeColW, type: WidthType.DXA },
            children: [
              new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: "EXECUTE", font: FONT_BODY, size: 22, color: C.amber, bold: true, characterSpacing: 60 })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Management & Measurement", font: FONT_BODY, size: 18, color: C.textMuted })] }),
            ]
          }),
        ]
      }),
      // Backbone bar
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 3,
            borders: noBorders,
            shading: { fill: C.accent, type: ShadingType.CLEAR },
            margins: { top: 100, bottom: 100, left: 160, right: 160 },
            width: { size: CONTENT_W, type: WidthType.DXA },
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: "DIGITAL BACKBONE", font: FONT_BODY, size: 20, color: C.white, bold: true, characterSpacing: 120 })]
            })]
          }),
        ]
      }),
    ]
  }),
  spacer(200),
  bodyText("Taylor already operates in Create, Build, Execute. You create experiences for the world\u2019s biggest brands. You build everything from scenic environments to digital platforms. You execute programs across 40+ countries. The Digital Backbone doesn\u2019t change what you do \u2014 it transforms how well you can do it."),
  bodyText("Like the operational nervous system that Dassault Syst\u00e8mes is building for manufacturing \u2014 but tailored specifically for experiential marketing."),
);

// ════════════════════════════════════════
// 04 — THE TRANSFORMATION (CREATE/BUILD/EXECUTE + 5 DIMENSIONS)
// ════════════════════════════════════════

// Helper: dimension card (pillar card in DOCX)
function dimensionCard(title, color, bgColor, bullets, keyMessage) {
  const cellChildren = [
    // Title
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({ text: title, font: FONT_HEAD, size: 22, color, bold: true }),
        new TextRun({ text: "  DIMENSION", font: FONT_BODY, size: 12, color, bold: true, characterSpacing: 40 }),
      ]
    }),
  ];
  bullets.forEach(b => {
    cellChildren.push(new Paragraph({
      numbering: { reference: "bullets", level: 0 },
      spacing: { after: 60 },
      children: [
        new TextRun({ text: b.label, font: FONT_BODY, size: 20, color: C.text, bold: true }),
        new TextRun({ text: ` \u2014 ${b.desc}`, font: FONT_BODY, size: 20, color: C.textMuted }),
      ]
    }));
  });
  if (keyMessage) {
    cellChildren.push(new Paragraph({
      spacing: { before: 80, after: 0 },
      indent: { left: 200 },
      border: { left: { style: BorderStyle.SINGLE, size: 4, color, space: 8 } },
      children: [new TextRun({ text: keyMessage, font: FONT_BODY, size: 19, color: C.textMuted, italic: true })]
    }));
  }
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({
      children: [new TableCell({
        borders: {
          top: noBorder, bottom: noBorder, right: noBorder,
          left: { style: BorderStyle.SINGLE, size: 10, color },
        },
        shading: { fill: bgColor, type: ShadingType.CLEAR },
        margins: { top: 120, bottom: 120, left: 200, right: 200 },
        width: { size: CONTENT_W, type: WidthType.DXA },
        children: cellChildren,
      })]
    })]
  });
}

// Dimension tags as inline text
function dimTags(tags) {
  const runs = [];
  tags.forEach((t, i) => {
    if (i > 0) runs.push(new TextRun({ text: "   ", font: FONT_BODY, size: 18 }));
    runs.push(new TextRun({ text: t.name.toUpperCase(), font: FONT_BODY, size: 14, color: t.color, bold: true, characterSpacing: 30 }));
  });
  return new Paragraph({ spacing: { after: 120 }, children: runs });
}

// Sub-heading helper for C/B/E topics
function subHeading(text, color) {
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, font: FONT_HEAD, size: 22, color, bold: true })]
  });
}

children.push(
  new Paragraph({ children: [new PageBreak()] }),
  sectionLabel("04 \u2014 The Transformation"),
  heading("Your Language. Your Framework. Five Dimensions."),
  spacer(100),
  bodyText("Taylor already operates in Create, Build, Execute. It\u2019s how you conceive, produce, and deliver experiences for the world\u2019s most demanding brands. The Digital Backbone doesn\u2019t change that framework \u2014 it strengthens every layer of it."),
  richParagraph([
    new TextRun({ text: "Across all three phases, we address ", font: FONT_BODY, size: 22, color: C.text }),
    new TextRun({ text: "five transformation dimensions", font: FONT_BODY, size: 22, color: C.text, bold: true }),
    new TextRun({ text: " \u2014 the areas where operational maturity determines whether a company scales efficiently or simply grows larger:", font: FONT_BODY, size: 22, color: C.text }),
  ]),
  spacer(60),
  // 5 dimension tags
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [
      new TextRun({ text: "PEOPLE & CULTURE", font: FONT_BODY, size: 14, color: C.green, bold: true, characterSpacing: 20 }),
      new TextRun({ text: "    ", font: FONT_BODY, size: 14 }),
      new TextRun({ text: "PROCESSES", font: FONT_BODY, size: 14, color: C.blue, bold: true, characterSpacing: 20 }),
      new TextRun({ text: "    ", font: FONT_BODY, size: 14 }),
      new TextRun({ text: "TECH INTEGRATIONS", font: FONT_BODY, size: 14, color: C.accent, bold: true, characterSpacing: 20 }),
      new TextRun({ text: "    ", font: FONT_BODY, size: 14 }),
      new TextRun({ text: "DATA", font: FONT_BODY, size: 14, color: C.amber, bold: true, characterSpacing: 20 }),
      new TextRun({ text: "    ", font: FONT_BODY, size: 14 }),
      new TextRun({ text: "COMPLIANCE", font: FONT_BODY, size: 14, color: C.red, bold: true, characterSpacing: 20 }),
    ]
  }),
  bodyText("Each dimension shows up differently depending on the phase. Here\u2019s how the backbone transforms each layer \u2014 and what it means for Taylor."),
  spacer(100),

  // ══════════════════════════════════════
  // CREATE
  // ══════════════════════════════════════
  sectionLabel("Create \u2014 Strategy & Creative", C.blue),
  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("CREATE")] }),
  spacer(40),
  bodyText("The backbone helps teams think faster, think smarter, and create with more context.", { italic: true, color: C.textMuted }),
  bodyText("In the Create layer, the backbone enables teams to think with more context, move faster, and develop ideas that are better connected to business reality. Today, ideation depends almost entirely on the individuals in the room \u2014 their memory, their relationships, their experience. The backbone changes that equation."),
  spacer(60),

  subHeading("Strategic Intelligence", C.blue),
  bodyText("The backbone gives strategy and creative teams access to broader and better inputs at the start of the process:"),
  bulletItemRich([new TextRun({ text: "Client history and past program knowledge", font: FONT_BODY, size: 22, color: C.text })]),
  bulletItemRich([new TextRun({ text: "Competitor activity and experiential benchmarks", font: FONT_BODY, size: 22, color: C.text })]),
  bulletItemRich([new TextRun({ text: "Market trends, category patterns, and emerging formats", font: FONT_BODY, size: 22, color: C.text })]),
  bulletItemRich([new TextRun({ text: "Prior campaign learnings and results", font: FONT_BODY, size: 22, color: C.text })]),
  bodyText("This shifts ideation away from isolated inspiration and toward better-informed creative thinking."),

  subHeading("Creative Memory", C.blue),
  bodyText("Without a backbone, ideas live in people, decks, folders, and scattered files. With a backbone, the organization gains searchable archives of concepts, builds, and proposals; visibility into previous ideas for similar clients or sectors; and a reusable body of intellectual and creative work. This reduces reinvention and strengthens continuity across teams."),

  subHeading("Proposal Acceleration", C.blue),
  bodyText("A major value unlock in Create is speed. The backbone helps teams respond to opportunities faster, assemble proposals using past materials and pricing logic, build early concepts with stronger grounding, and shorten the time between brief and first strategic output. The business can think faster, propose faster, and generate more ideas."),

  subHeading("Better Forecasting During Ideation", C.blue),
  bodyText("The strongest ideas are not only exciting \u2014 they are also feasible. The backbone brings early visibility into approximate production complexity, likely resource intensity, delivery implications, and whether similar components or assets already exist. This creates a better link between creative ambition and operational reality."),

  subHeading("AI-Assisted Ideation", C.blue),
  bodyText("AI matters here, but as an accelerator inside a broader technology foundation. Potential value includes concept expansion, reference generation, draft narrative support, alternative routes for creative exploration, and faster synthesis of market and client inputs. The point is not automated creativity, but augmented creative velocity."),
  spacer(100),

  calloutBox("Create Outcome", "CREATE becomes: more informed, faster, more reusable, more grounded in reality, and more capable of generating quality ideas at speed.", C.blue, C.blueLight),
  spacer(100),
  beforeAfterTable([
    ["Ideas start from scratch, proposals assembled manually, institutional knowledge lives in people\u2019s heads", "Institutional memory searchable, proposals accelerated, creative ambition grounded in operational reality"],
  ]),
  spacer(200),

  // ══════════════════════════════════════
  // BUILD
  // ══════════════════════════════════════
  new Paragraph({ children: [new PageBreak()] }),
  sectionLabel("Build \u2014 Digital Experiences & Fabrication", C.green),
  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("BUILD")] }),
  spacer(40),
  bodyText("The backbone helps great ideas become buildable, scalable, and operationally viable.", { italic: true, color: C.textMuted }),
  bodyText("In the Build layer, the backbone connects concept to production. This is where the business translates ideas into things that can actually be made, configured, integrated, shipped, and deployed. It\u2019s Taylor\u2019s operational core \u2014 and it\u2019s where the biggest efficiency gaps live."),
  spacer(60),

  subHeading("Design-to-Build Continuity", C.green),
  bodyText("One of the biggest friction points in complex project businesses is the handoff between creative intent and production reality. The backbone enables continuity between design outputs and production inputs, shared documentation across creative, digital, and fabrication teams, clearer specifications with less interpretation loss, and stronger alignment between what is imagined and what is actually buildable. This reduces downstream confusion and rework."),

  subHeading("Asset Intelligence", C.green),
  bodyText("The backbone creates visibility into what the business already owns, has built, or can reuse: reusable scenic elements, prior fabrication components, historic build references, digital assets connected to physical experiences, and material precedents. Instead of starting from zero, teams can build from memory."),

  subHeading("Materials & Component Visibility", C.green),
  bodyText("The backbone creates a stronger picture of what is needed to build and what is already available \u2014 supporting material planning, component tracking, procurement coordination, and supplier-related visibility. This reduces unnecessary friction and helps control costs and timing."),

  subHeading("Capacity & Production Forecasting", C.green),
  bodyText("A major theme from discovery was the need to better align sales growth with production capacity. The backbone makes it easier to understand current production load, team capacity, likely constraints, timing conflicts across projects, and build implications of incoming pipeline. This is where the business starts moving from reactive production to planned production."),

  subHeading("Digital\u2013Physical Integration", C.green),
  bodyText("Taylor is unusual because Build includes both digital experiences and physical fabrication. The backbone creates alignment across physical environments, interactive experiences, content production, platform integration, and on-site digital behavior. This is a major strategic advantage if connected well."),

  subHeading("Cost Intelligence", C.green),
  bodyText("The backbone improves the ability to estimate and manage cost before problems surface \u2014 benchmark against past builds, anticipate cost drivers, understand design decisions with production implications, and price work with better historical reference. Build becomes not just faster, but more commercially informed."),
  spacer(100),

  calloutBox("Build Outcome", "BUILD becomes: more coordinated, more predictable, more reusable, more cost-aware, and more connected across digital and physical work.", C.green, C.greenLight),
  spacer(100),
  beforeAfterTable([
    ["Sales sells blind, assets rebuilt because nobody knows they exist, each office runs its own way", "Design-to-build continuity, searchable asset inventory, planned production, cost intelligence from history"],
  ]),
  spacer(200),

  // ══════════════════════════════════════
  // EXECUTE
  // ══════════════════════════════════════
  new Paragraph({ children: [new PageBreak()] }),
  sectionLabel("Execute \u2014 Program Management & Measurement", C.amber),
  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("EXECUTE")] }),
  spacer(40),
  bodyText("The backbone turns execution from something people discover too late into something they can manage actively.", { italic: true, color: C.textMuted }),
  bodyText("In the Execute layer, the backbone enables orchestration. This is where complexity peaks, because projects move from internal planning into real-world delivery. It\u2019s also where Taylor\u2019s leadership spends the most time today \u2014 often manually."),
  spacer(60),

  subHeading("Project Orchestration", C.amber),
  bodyText("Execution depends on multiple teams, timelines, vendors, dependencies, and deliverables moving together. The backbone helps create centralized project visibility, shared timelines and milestones, better coordination across departments, clearer dependencies and ownership, and stronger alignment between planning and delivery. This is the shift from fragmented execution to connected execution."),

  subHeading("Resource Allocation", C.amber),
  bodyText("Execution quality depends on whether the right people and capabilities are available at the right moment. The backbone supports better crew planning, specialist allocation, visibility into team utilization, and cross-project resource balancing. This reduces overload, blind spots, and fire-fighting."),

  subHeading("Logistics & Deployment Visibility", C.amber),
  bodyText("In experiential work, execution involves physical movement, deployment, timing, setup, breakdown, and on-site coordination. The backbone improves logistics tracking, deployment readiness, handoff from fabrication to site, installation sequencing, and clarity around what is arriving where and when. This reduces execution risk."),

  subHeading("Real-Time Execution Visibility", C.amber),
  bodyText("One of the highest-value outcomes of a backbone is making delivery visible while it is happening. Project status can be monitored more clearly, emerging issues seen earlier, leadership can intervene sooner, and decisions can be made with better information. When execution is visible in a system, leadership doesn\u2019t need to be CC\u2019d on every email to stay informed."),

  subHeading("Measurement & Learning", C.amber),
  bodyText("Taylor\u2019s Execute layer includes Measurement \u2014 execution does not end at delivery. The backbone captures event outcomes, attendee engagement, lead conversion data, performance patterns across formats, and post-event learnings. This closes the loop between delivery and future strategy."),

  subHeading("Continuous Improvement", C.amber),
  bodyText("Once execution data is captured and connected, the business gains something bigger than reporting: a learning system. Each project informs the next. Recurring issues become visible. High-performing formats become identifiable. The company becomes better over time, not just busier."),
  spacer(100),

  calloutBox("Execute Outcome", "EXECUTE becomes: more visible, more coordinated, more predictable, more measurable, and more capable of learning over time.", C.amber, C.amberLight),
  spacer(100),
  beforeAfterTable([
    ["Status via email chains, reactive fire-fighting, post-event learnings lost, no unified view", "Real-time visibility, connected execution, organizational learning compounds over time"],
  ]),
  spacer(200),

  // ══════════════════════════════════════
  // FIVE DIMENSIONS SUMMARY
  // ══════════════════════════════════════
  new Paragraph({ children: [new PageBreak()] }),
  new Paragraph({
    spacing: { after: 100 },
    children: [new TextRun({ text: "Five Dimensions Across Every Phase", font: FONT_HEAD, size: 26, color: C.accent, bold: true })]
  }),
  bodyText("The five transformation dimensions \u2014 People & Culture, Processes, Tech Integrations, Data, and Compliance \u2014 run through every layer of Create, Build, and Execute."),
  spacer(60),

  dimensionCard("People & Culture", C.green, C.greenLight, [
    { label: "Segmented adoption paths", desc: "for executives, operations, and creative teams." },
    { label: "Internal champions program", desc: "3-5 per department." },
    { label: "Skills development roadmap", desc: "role-specific, culture-first." },
  ], "\u201CTechnology changes fast. Culture changes slow. We start with culture.\u201D"),
  spacer(80),
  dimensionCard("Processes", C.blue, C.blueLight, [
    { label: "SOP modernization", desc: "actual workflows, not assumed ones." },
    { label: "Sales-to-production alignment", desc: "real-time capacity visibility." },
    { label: "Asset management lifecycle", desc: "cataloging, tracking, reuse-vs-rebuild." },
    { label: "Cross-office standardization", desc: "Toronto, Boston, Cleveland as one system." },
  ], "\u201CBefore automating a process, make sure it\u2019s the right process.\u201D"),
  spacer(80),
  dimensionCard("Tech Integrations", C.accent, C.accentLight, [
    { label: "ClickUp optimization + Brain", desc: "intelligent project assistance." },
    { label: "Gemini integration", desc: "email triage, meeting notes, drafts." },
    { label: "Automation engine", desc: "10\u201315 priority workflows." },
    { label: "Global Core \u2194 Operations", desc: "M365 + ClickUp connected." },
  ], "\u201CThe best technology strategy starts with what you already own.\u201D"),
  spacer(80),
  dimensionCard("Data", C.amber, C.amberLight, [
    { label: "Asset inventory intelligence", desc: "what exists, where, condition." },
    { label: "Production capacity data", desc: "real-time visibility for sales." },
    { label: "Executive dashboards", desc: "unified operational view." },
    { label: "Performance feedback loops", desc: "closing the Create\u2192Build\u2192Execute cycle." },
  ], "\u201CYou can\u2019t optimize what you can\u2019t measure.\u201D"),
  spacer(80),
  dimensionCard("Compliance", C.red, C.redLight, [
    { label: "AI governance policy", desc: "approved tools, data rules, guardrails." },
    { label: "Data handling standards", desc: "client IP, internal IP, vendor data." },
    { label: "IP protection strategy", desc: "protecting what makes Taylor valuable." },
    { label: "Regulatory readiness", desc: "pharma, healthcare client requirements." },
  ], "\u201CInnovation without guardrails is a liability.\u201D"),
  spacer(200),

  // Outcome callout
  calloutBox("Transformation Outcome", "Five dimensions. Three phases. One backbone. The Digital Backbone makes Taylor more informed in Create, more coordinated in Build, and more governed in Execute. It doesn\u2019t add complexity \u2014 it removes the friction that 95 years of organic growth naturally created.", C.accent, C.accentLight),
);

// ════════════════════════════════════════
// 05 — TIMELINE
// ════════════════════════════════════════
children.push(
  new Paragraph({ children: [new PageBreak()] }),
  sectionLabel("05 \u2014 Timeline"),
  heading("A Phased Approach"),
  spacer(100),
  bodyText("Transformation is sequenced for momentum. Each phase builds on the previous, ensuring that early wins fund and justify later investment."),
  spacer(100),
);

// Timeline as table
const tlLabelW = 2200;
const tlDateW = 2200;
const tlDescW = CONTENT_W - tlLabelW - tlDateW;
const tlPhases = [
  { name: "INTAKE", date: "April \u2013 May 2026", color: C.blue, maps: "CREATE", desc: "SOP documentation review, technology audit, stakeholder mapping, engagement preparation." },
  { name: "DISCOVERY", date: "June 2026", color: C.green, maps: "CREATE", desc: "Onsite Toronto interviews, process mapping workshops, technology assessment, AI vision alignment." },
  { name: "IMPLEMENTATION", date: "July \u2013 October 2026", color: C.accent, maps: "BUILD", desc: "Priority workstream execution, automation builds, platform optimization, champion training." },
  { name: "STABILIZATION", date: "November 2026+", color: C.amber, maps: "EXECUTE", desc: "Adoption reinforcement, measurement & reporting, knowledge transfer, advisory retainer." },
];

// Header row
const tlHeaderRow = new TableRow({
  children: [
    new TableCell({ borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.text } }, margins: cellMargins, width: { size: tlLabelW, type: WidthType.DXA },
      children: [new Paragraph({ children: [new TextRun({ text: "PHASE", font: FONT_BODY, size: 14, color: C.textMuted, bold: true, characterSpacing: 40 })] })] }),
    new TableCell({ borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.text } }, margins: cellMargins, width: { size: tlDateW, type: WidthType.DXA },
      children: [new Paragraph({ children: [new TextRun({ text: "TIMING", font: FONT_BODY, size: 14, color: C.textMuted, bold: true, characterSpacing: 40 })] })] }),
    new TableCell({ borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.text } }, margins: cellMargins, width: { size: tlDescW, type: WidthType.DXA },
      children: [new Paragraph({ children: [new TextRun({ text: "KEY ACTIVITIES", font: FONT_BODY, size: 14, color: C.textMuted, bold: true, characterSpacing: 40 })] })] }),
  ]
});

const tlDataRows = tlPhases.map(p => new TableRow({
  children: [
    new TableCell({
      borders: { ...noBorders, bottom: thinBorder(C.border), left: { style: BorderStyle.SINGLE, size: 8, color: p.color } },
      margins: cellMargins, width: { size: tlLabelW, type: WidthType.DXA },
      children: [
        new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: p.name, font: FONT_BODY, size: 20, color: p.color, bold: true })] }),
        new Paragraph({ children: [new TextRun({ text: `\u2192 ${p.maps}`, font: FONT_BODY, size: 16, color: C.textMuted })] }),
      ]
    }),
    new TableCell({
      borders: { ...noBorders, bottom: thinBorder(C.border) },
      margins: cellMargins, width: { size: tlDateW, type: WidthType.DXA },
      children: [new Paragraph({ children: [new TextRun({ text: p.date, font: FONT_BODY, size: 20, color: C.text })] })]
    }),
    new TableCell({
      borders: { ...noBorders, bottom: thinBorder(C.border) },
      margins: cellMargins, width: { size: tlDescW, type: WidthType.DXA },
      children: [new Paragraph({ children: [new TextRun({ text: p.desc, font: FONT_BODY, size: 20, color: C.textMuted })] })]
    }),
  ]
}));

children.push(
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [tlLabelW, tlDateW, tlDescW],
    rows: [tlHeaderRow, ...tlDataRows]
  }),
  spacer(300),
  calloutBox("Phased Value Delivery", "Each phase delivers standalone value. Taylor sees results before committing to the next stage. No multi-year contracts. No lock-in. Prove value, then expand."),
);

// ════════════════════════════════════════
// 06 — MARKET INSIGHTS
// ════════════════════════════════════════
children.push(
  new Paragraph({ children: [new PageBreak()] }),
  sectionLabel("06 \u2014 Market Insights"),
  heading("AI in Experiential Marketing: Three Horizons"),
  spacer(100),
  bodyText("Understanding where the industry is heading helps frame why transformation now is a strategic imperative, not a technology project."),
  spacer(100),
  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Horizon 1: Now \u2192 12 Months")] }),
  bulletItem("$15.8 billion global experiential marketing market at its peak"),
  bulletItem("82% of brands report that in-person events deliver higher ROI than digital alternatives"),
  bulletItem("AI is already automating 47% of marketing activities, with 30% productivity gains achievable"),
  bulletItem("Most companies are experimenting; few have operationalized AI into their workflows"),
  bulletItem("Quick wins available now: email automation, meeting summarization, content draft generation"),
  spacer(100),
  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Horizon 2: 1\u20133 Years")] }),
  bulletItem("Agentic AI replaces basic chatbots \u2014 ClickUp Brain evolves into autonomous project management agents"),
  bulletItem("Multimodal AI enables new forms of immersive experience design and visualization"),
  bulletItem("Asset tracking moves from spreadsheets to RFID/IoT-based real-time monitoring"),
  bulletItem("Companies that transformed early are winning enterprise contracts through operational proof points"),
  bulletItem("The gap between AI-enabled and AI-absent firms becomes a competitive divide"),
  spacer(100),
  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Horizon 3: 5\u201310 Years \u2014 Taylor Group in 2036")] }),
  bulletItem("Predictive operations: AI forecasts capacity needs, material costs, and client demands"),
  bulletItem("Digital twin technology: virtual replicas of warehouses, assets, and event spaces"),
  bulletItem("AI-powered creative augmentation: concept to fabrication specs to procurement \u2014 AI-assisted end-to-end"),
  bulletItem("Taylor\u2019s institutional knowledge becomes its competitive moat"),
  bulletItem("The companies that built their Digital Backbone in 2026 are the market leaders in 2036"),
  spacer(200),
);

// Stats box
children.push(
  calloutBox("The Transformation Landscape",
    "16% of digital transformations fully succeed (McKinsey)  \u2022  70% of change programs fail to meet objectives  \u2022  Only 25% achieve expected AI ROI  \u2022  40% cost reduction potential with unified digital operations (McKinsey Lighthouse Study)"),
  spacer(100),
  bodyText("These statistics aren\u2019t meant to discourage. They\u2019re meant to emphasize: approach matters more than ambition.", { italic: true, color: C.textMuted }),
);

// ════════════════════════════════════════
// 07 — WHY TRANSFORMAZ
// ════════════════════════════════════════
children.push(
  new Paragraph({ children: [new PageBreak()] }),
  sectionLabel("07 \u2014 Why TransformAZ"),
  heading("The Right Partner for This Moment"),
  spacer(100),
  boldBodyText("Industry experience that matters. ", "We\u2019ve worked with eSports organizations, trade show companies, and creative agencies \u2014 industries where the work is project-based, deadline-driven, and deeply human. We understand that Taylor\u2019s business isn\u2019t a factory floor. It\u2019s a creative operation that needs systems, not the other way around."),
  boldBodyText("Operational-first approach. ", "We don\u2019t start with technology. We start with how people actually work, what processes actually exist, and where the real friction lives. Technology is the enabler, not the answer."),
  boldBodyText("Activate what you have. ", "Our first instinct isn\u2019t to sell new software. It\u2019s to make the investments Taylor has already made \u2014 ClickUp, Gemini, M365 \u2014 actually deliver value. This reduces cost, accelerates timeline, and builds on familiar tools."),
  boldBodyText("People-centered transformation. ", "The 16% success rate for digital transformations isn\u2019t a technology problem. It\u2019s a people problem. We build adoption into every phase, not as an afterthought but as the primary design constraint."),
  boldBodyText("Phased, de-risked engagement. ", "Each phase delivers standalone value. Taylor sees results before committing to the next stage. No multi-year contracts. No lock-in. Prove value, then expand."),
);

// ════════════════════════════════════════
// 08 — NEXT STEPS
// ════════════════════════════════════════
children.push(
  new Paragraph({ children: [new PageBreak()] }),
  sectionLabel("08 \u2014 Next Steps"),
  heading("Moving Forward"),
  spacer(100),

  // Investment Framework
  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Investment Framework")] }),
  bodyText("TransformAZ structures engagements for accountability and de-risked investment. Each phase is scoped, priced, and delivered independently."),
  spacer(100),
);

// Investment table
const invColPhase = 2000;
const invColDuration = 1800;
const invColFormat = 2600;
const invColModel = CONTENT_W - invColPhase - invColDuration - invColFormat;

const invHeaderRow = new TableRow({
  children: [
    new TableCell({
      borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.text } },
      shading: { fill: C.lightBg, type: ShadingType.CLEAR },
      margins: cellMargins, width: { size: invColPhase, type: WidthType.DXA },
      children: [new Paragraph({ children: [new TextRun({ text: "PHASE", font: FONT_BODY, size: 14, color: C.textMuted, bold: true, characterSpacing: 40 })] })]
    }),
    new TableCell({
      borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.text } },
      shading: { fill: C.lightBg, type: ShadingType.CLEAR },
      margins: cellMargins, width: { size: invColDuration, type: WidthType.DXA },
      children: [new Paragraph({ children: [new TextRun({ text: "DURATION", font: FONT_BODY, size: 14, color: C.textMuted, bold: true, characterSpacing: 40 })] })]
    }),
    new TableCell({
      borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.text } },
      shading: { fill: C.lightBg, type: ShadingType.CLEAR },
      margins: cellMargins, width: { size: invColFormat, type: WidthType.DXA },
      children: [new Paragraph({ children: [new TextRun({ text: "FORMAT", font: FONT_BODY, size: 14, color: C.textMuted, bold: true, characterSpacing: 40 })] })]
    }),
    new TableCell({
      borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.text } },
      shading: { fill: C.lightBg, type: ShadingType.CLEAR },
      margins: cellMargins, width: { size: invColModel, type: WidthType.DXA },
      children: [new Paragraph({ children: [new TextRun({ text: "INVESTMENT MODEL", font: FONT_BODY, size: 14, color: C.textMuted, bold: true, characterSpacing: 40 })] })]
    }),
  ]
});

const invPhases = [
  { phase: "INTAKE", duration: "6-8 weeks", format: "Remote", model: "Fixed project fee", color: C.blue },
  { phase: "DISCOVERY", duration: "2 weeks", format: "Onsite Toronto + remote", model: "Fixed project fee", color: C.green },
  { phase: "IMPLEMENTATION", duration: "16 weeks", format: "Hybrid", model: "Monthly retainer with defined deliverables", color: C.accent },
  { phase: "STABILIZATION", duration: "Ongoing", format: "Remote", model: "Advisory retainer", color: C.amber },
];

const invDataRows = invPhases.map(p => new TableRow({
  children: [
    new TableCell({
      borders: { ...noBorders, bottom: thinBorder(C.border), left: { style: BorderStyle.SINGLE, size: 8, color: p.color } },
      margins: cellMargins, width: { size: invColPhase, type: WidthType.DXA },
      children: [new Paragraph({ children: [new TextRun({ text: p.phase, font: FONT_BODY, size: 20, color: p.color, bold: true })] })]
    }),
    new TableCell({
      borders: { ...noBorders, bottom: thinBorder(C.border) },
      margins: cellMargins, width: { size: invColDuration, type: WidthType.DXA },
      children: [new Paragraph({ children: [new TextRun({ text: p.duration, font: FONT_BODY, size: 20, color: C.text })] })]
    }),
    new TableCell({
      borders: { ...noBorders, bottom: thinBorder(C.border) },
      margins: cellMargins, width: { size: invColFormat, type: WidthType.DXA },
      children: [new Paragraph({ children: [new TextRun({ text: p.format, font: FONT_BODY, size: 20, color: C.textMuted })] })]
    }),
    new TableCell({
      borders: { ...noBorders, bottom: thinBorder(C.border) },
      margins: cellMargins, width: { size: invColModel, type: WidthType.DXA },
      children: [new Paragraph({ children: [new TextRun({ text: p.model, font: FONT_BODY, size: 20, color: C.textMuted })] })]
    }),
  ]
}));

children.push(
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [invColPhase, invColDuration, invColFormat, invColModel],
    rows: [invHeaderRow, ...invDataRows]
  }),
  spacer(100),
  bodyText("Specific investment figures are developed after INTAKE scoping confirms the precise workstreams and team requirements.", { italic: true, color: C.textMuted }),
  spacer(200),

  // What Taylor Gets in Each Phase
  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("What Taylor Gets in Each Phase")] }),
  spacer(60),
  bulletItemRich([
    new TextRun({ text: "INTAKE delivers: ", font: FONT_BODY, size: 22, color: C.text, bold: true }),
    new TextRun({ text: "Current-state assessment, technology audit, stakeholder map, workstream recommendations, and scoped proposal for next phases with defined deliverables and pricing.", font: FONT_BODY, size: 22, color: C.textMuted }),
  ]),
  bulletItemRich([
    new TextRun({ text: "DISCOVERY delivers: ", font: FONT_BODY, size: 22, color: C.text, bold: true }),
    new TextRun({ text: "Process maps, capability assessment, AI readiness evaluation, quick-win identification, and implementation roadmap validated onsite.", font: FONT_BODY, size: 22, color: C.textMuted }),
  ]),
  bulletItemRich([
    new TextRun({ text: "IMPLEMENTATION delivers: ", font: FONT_BODY, size: 22, color: C.text, bold: true }),
    new TextRun({ text: "Activated platforms, built automations, trained champions, documented SOPs, and measurable KPIs.", font: FONT_BODY, size: 22, color: C.textMuted }),
  ]),
  bulletItemRich([
    new TextRun({ text: "STABILIZATION delivers: ", font: FONT_BODY, size: 22, color: C.text, bold: true }),
    new TextRun({ text: "Adoption monitoring, optimization, quarterly reviews, and knowledge transfer.", font: FONT_BODY, size: 22, color: C.textMuted }),
  ]),
  spacer(200),

  // Proposed Next Step
  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Proposed Next Step")] }),
  spacer(100),
  calloutBoxMultiParagraph("Proposed Next Step", [
    "We propose starting with INTAKE in April 2026. This is a contained, fixed-fee engagement that delivers a comprehensive assessment \u2014 with no obligation to proceed further. At the end of INTAKE, Taylor will have:",
    "1. A clear, evidence-based picture of current operations",
    "2. Quantified impact estimates replacing the ranges in this document",
    "3. A prioritized list of quick wins and strategic workstreams",
    "4. A fully scoped and priced proposal for DISCOVERY and IMPLEMENTATION",
  ], C.accent, C.accentLight),
  spacer(200),
  bodyText("To discuss INTAKE scoping and timeline, contact TransformAZ to schedule a 45-minute alignment session."),
);

// ════════════════════════════════════════
// FOOTER
// ════════════════════════════════════════
children.push(
  spacer(600),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    border: { top: { style: BorderStyle.SINGLE, size: 2, color: C.border, space: 12 } },
    spacing: { before: 200 },
    children: [new TextRun({ text: "TransformAZ \u2014 March 2026 \u2014 Prepared exclusively for Taylor Group", font: FONT_BODY, size: 16, color: C.textMuted })]
  }),
);

// ── ASSEMBLE DOCUMENT ───────────────────
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: FONT_BODY, size: 22, color: C.text },
      }
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: FONT_HEAD, color: C.text },
        paragraph: { spacing: { before: 120, after: 200 }, outlineLevel: 0 }
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: FONT_HEAD, color: C.text },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 }
      },
    ]
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: PAGE_W, height: PAGE_H },
        margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ text: "Transform", font: FONT_BODY, size: 16, color: C.textMuted }),
            new TextRun({ text: "AZ", font: FONT_BODY, size: 16, color: C.accent, bold: true }),
            new TextRun({ text: "  |  Taylor Group  |  Strategic Proposal", font: FONT_BODY, size: 16, color: C.textMuted }),
          ]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Page ", font: FONT_BODY, size: 16, color: C.textMuted }),
            new TextRun({ children: [PageNumber.CURRENT], font: FONT_BODY, size: 16, color: C.textMuted }),
          ]
        })]
      })
    },
    children: children,
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/Users/aguspereyra/Desktop/TransformAZ/Taylor Group/proposal-2.0/pitch/Taylor-Group-Strategic-Pitch.docx", buffer);
  console.log("DOCX generated successfully.");
});
