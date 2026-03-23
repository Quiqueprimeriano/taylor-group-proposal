const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
        PageBreak, Header, Footer, PageNumber } = require('docx');

const ACCENT = "7A7AE6";
const BLUE = "2563EB";
const GREEN = "1A9959";
const AMBER = "B45309";
const GRAY = "52525B";
const LIGHT_GRAY = "F4F4F5";
const ACCENT_BG = "EDEDFC";
const BLUE_BG = "EFF6FF";
const GREEN_BG = "ECFDF5";
const AMBER_BG = "FFFBEB";

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

// Page: US Letter, 1" margins → 9360 DXA content width
const PAGE_W = 12240;
const MARGIN = 1440;
const CONTENT_W = PAGE_W - 2 * MARGIN; // 9360

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({ heading: level, spacing: { before: 300, after: 150 },
    children: [new TextRun({ text, font: "Georgia", bold: true,
      size: level === HeadingLevel.HEADING_1 ? 36 : level === HeadingLevel.HEADING_2 ? 28 : 24 })] });
}

function para(text, opts = {}) {
  const runs = [];
  // Simple bold parsing: **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  parts.forEach(p => {
    if (p.startsWith('**') && p.endsWith('**')) {
      runs.push(new TextRun({ text: p.slice(2, -2), bold: true, font: "Calibri", size: 22, color: opts.color }));
    } else if (p) {
      runs.push(new TextRun({ text: p, font: "Calibri", size: 22, color: opts.color || GRAY,
        italics: opts.italic }));
    }
  });
  return new Paragraph({ spacing: { after: 160 }, alignment: opts.align, children: runs });
}

function monoLabel(text) {
  return new Paragraph({ spacing: { after: 40 },
    children: [new TextRun({ text: text.toUpperCase(), font: "Consolas", size: 16, bold: true,
      color: ACCENT })] });
}

function scopeCard(title, tag, tagColor, tagBg, summary, detail, output) {
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

function makeTableRow(cells, isHeader = false) {
  return new TableRow({
    children: cells.map((cell, i) => {
      const widths = cells.length === 3 ? [2800, 1800, 4760] : [2400, 6960];
      return new TableCell({
        borders,
        width: { size: widths[i], type: WidthType.DXA },
        margins: cellMargins,
        shading: isHeader ? { fill: LIGHT_GRAY, type: ShadingType.CLEAR } : undefined,
        children: [new Paragraph({
          children: [new TextRun({ text: cell, font: "Calibri", size: 20, bold: isHeader, color: "18181B" })]
        })]
      });
    })
  });
}

function makeTable(headers, rows, colCount) {
  const widths = colCount === 3 ? [2800, 1800, 4760] : [2400, 6960];
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      makeTableRow(headers, true),
      ...rows.map(r => makeTableRow(r))
    ]
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

// ─── BUILD DOCUMENT ───

const doc = new Document({
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
        children: [new TextRun({ text: "TransformAZ \u2014 INTAKE Proposal \u2014 Taylor Group",
          font: "Consolas", size: 14, color: "A1A1AA" })] })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "CONFIDENTIAL \u2014 Page ", font: "Consolas", size: 14, color: "A1A1AA" }),
          new TextRun({ children: [PageNumber.CURRENT], font: "Consolas", size: 14, color: "A1A1AA" })] })] })
    },
    children: [
      // ─── TITLE ───
      new Paragraph({ spacing: { after: 40 },
        children: [new TextRun({ text: "08 \u2014 Intake Proposal", font: "Consolas", size: 18,
          color: ACCENT, bold: true })] }),
      heading("The INTAKE: Where Evidence Replaces Assumptions"),

      para("Our initial assessment identified **$1.4M\u20132.85M in annual operational friction** across Taylor Group. But these are estimates \u2014 directional signals drawn from public data, initial conversations, and pattern recognition. The INTAKE transforms those signals into precision: observed workflows, measured inefficiencies, documented dependencies."),

      para("Everything presented so far is a hypothesis. The INTAKE is where we prove it \u2014 or disprove it. Either outcome is valuable. Taylor either gains a validated roadmap for transformation, or walks away knowing the current operation is better than we estimated."),

      // ─── KEY METRICS ───
      new Table({
        width: { size: CONTENT_W, type: WidthType.DXA },
        columnWidths: [2340, 2340, 2340, 2340],
        rows: [new TableRow({ children: [
          { value: "2 mo", label: "Duration" },
          { value: "12", label: "Stakeholder Interviews" },
          { value: "3", label: "Core Flows Mapped" },
          { value: "5", label: "Dimensions Assessed" },
        ].map(m => new TableCell({
          borders: noBorders,
          width: { size: 2340, type: WidthType.DXA },
          margins: { top: 120, bottom: 120, left: 80, right: 80 },
          shading: { fill: ACCENT_BG, type: ShadingType.CLEAR },
          verticalAlign: "center",
          children: [
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 },
              children: [new TextRun({ text: m.value, font: "Consolas", size: 32, bold: true, color: ACCENT })] }),
            new Paragraph({ alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: m.label.toUpperCase(), font: "Consolas", size: 14, color: GRAY })] })
          ]
        })) })]
      }),

      // ─── SCOPE OF WORK ───
      heading("Scope of Work", HeadingLevel.HEADING_2),

      ...scopeCard("1. SOP Documentation & Review", "FOUNDATION", BLUE, BLUE_BG,
        "Catalog existing procedures across departments.",
        "Comprehensive inventory of all Standard Operating Procedures across Sales, Production, Creative, Digital, and Healthcare divisions. Gap analysis against industry best practices. Assessment of documentation currency, accessibility, and actual adoption rates.",
        "SOP catalog with gap analysis report, prioritized update recommendations, and standardized documentation templates."),

      ...scopeCard("2. Technology Audit", "CORE", ACCENT, ACCENT_BG,
        "Full inventory of ClickUp, M365, Gemini, and departmental tools.",
        "Architecture review of the entire technology ecosystem: ClickUp configuration and utilization, Microsoft 365 suite activation (including underused features), Google Gemini/AI tool adoption, plus every departmental tool and shadow IT system. License utilization rates, integration gaps, and Brain/AI activation status mapped.",
        "Technology stack audit with utilization scores, integration map, license optimization recommendations, and AI readiness assessment."),

      ...scopeCard("3. Stakeholder Mapping", "PEOPLE", GREEN, GREEN_BG,
        "8\u201312 structured interviews across functions.",
        "Structured interview protocol covering Sales, Production, Creative, Digital, and Healthcare divisions. Each interview maps pain points, wish lists, current workarounds, and organizational dynamics. Identifies champions, blockers, and influence networks critical for transformation adoption.",
        "Synthesized interview findings by department, stakeholder influence map, change readiness assessment, and champion identification."),

      ...scopeCard("4. Process Mapping", "OPERATIONS", AMBER, AMBER_BG,
        "End-to-end documentation of 3 core flows.",
        "Detailed documentation of three critical workflows: **Sales-to-Production** (quote through handoff), **Creative-to-Fabrication** (design through build), and **Executive Operations** (reporting, approvals, resource allocation). Each flow mapped with bottlenecks, handoff points, time sinks, and rework loops identified.",
        "Visual process maps with narrative documentation, bottleneck analysis, and quantified time/cost impact at each friction point."),

      ...scopeCard("5. Digital Maturity Assessment", "CORE", ACCENT, ACCENT_BG,
        "Five-dimension evaluation across the organization.",
        "Structured assessment across five dimensions: **People & Culture** (digital literacy, change appetite), **Processes** (standardization, automation readiness), **Technology** (stack maturity, integration depth), **Data** (quality, accessibility, governance), and **Compliance** (regulatory, security, privacy). Each dimension scored, benchmarked against industry peers, and gaps identified.",
        "Digital Maturity Scorecard with dimension scores, peer benchmarks, gap analysis, and prioritized improvement recommendations."),

      ...scopeCard("6. Transformation Roadmap", "STRATEGY", BLUE, BLUE_BG,
        "Prioritized workstreams + scoped next-phase proposal.",
        "All findings synthesized into a prioritized transformation roadmap. Quick wins (30\u201360 day impact) separated from strategic plays (6\u201318 month horizon). Estimated investment ranges for Discovery and Implementation phases. Recommended sequencing based on dependencies, risk, and organizational readiness.",
        "Transformation Roadmap presentation with phased workstreams, investment ranges, risk assessment, and a scoped Discovery proposal ready for Taylor\u2019s review."),

      // ─── CBE NOTE ───
      new Paragraph({ spacing: { before: 240 } }),
      new Table({
        width: { size: CONTENT_W, type: WidthType.DXA },
        columnWidths: [CONTENT_W],
        rows: [new TableRow({ children: [new TableCell({
          borders: { top: border, bottom: border, right: border,
            left: { style: BorderStyle.SINGLE, size: 6, color: ACCENT } },
          margins: { top: 120, bottom: 120, left: 200, right: 200 },
          shading: { fill: ACCENT_BG, type: ShadingType.CLEAR },
          children: [
            monoLabel("Where This Fits"),
            para("INTAKE + DISCOVERY map primarily to **CREATE** \u2014 understanding how Taylor creates, builds, and executes today. No changes are made. No tools are reconfigured. Only observation, documentation, and analysis.")
          ]
        })] })]
      }),

      // ─── INTAKE DELIVERABLES ───
      new Paragraph({ children: [new PageBreak()] }),
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
        ], 3),

      // ─── DISCOVERY DELIVERABLES ───
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
        ], 3),

      // ─── INVESTMENT OPTIONS ───
      new Paragraph({ children: [new PageBreak()] }),
      heading("Your Investment", HeadingLevel.HEADING_2),
      para("Two paths forward. The INTAKE stands alone as a complete diagnostic. Or combine it with DISCOVERY to validate findings onsite and leave with automations already working."),

      tierBox("INTAKE", false, [
        ["What you get", "Complete remote assessment: 8\u201312 stakeholder interviews, technology audit, 3 process maps, 5-dimension maturity scorecard, transformation roadmap"],
        ["Deliverables", "6 (see table above)"],
        ["Duration", "2 months"],
        ["Format", "Fully remote"],
      ], "$18,000", "50% kickoff \u00b7 50% delivery"),

      new Paragraph({ spacing: { after: 200 } }),

      tierBox("INTAKE + DISCOVERY", true, [
        ["What you get", "Everything in INTAKE + onsite Toronto immersion (2 trips), process shadowing & validation, 3\u20135 quick-win automations, executive workshop, champion program, AI readiness pilot"],
        ["Deliverables", "12 (INTAKE deliverables + 6 DISCOVERY deliverables)"],
        ["Duration", "4 months"],
        ["Format", "Remote \u2192 Onsite + Remote"],
      ], "$42,000", "30% kickoff \u00b7 25% INTAKE close \u00b7 25% Discovery mid \u00b7 20% final"),

      para("Fixed project fee. Travel billed separately at cost. No obligation to proceed to subsequent phases.", { italic: true, align: AlignmentType.CENTER }),

      // ─── ROI ───
      new Paragraph({ spacing: { before: 240 } }),
      new Table({
        width: { size: CONTENT_W, type: WidthType.DXA },
        columnWidths: [CONTENT_W],
        rows: [new TableRow({ children: [new TableCell({
          borders: { top: { style: BorderStyle.SINGLE, size: 2, color: ACCENT },
            bottom: border, left: border, right: border },
          margins: { top: 160, bottom: 160, left: 240, right: 240 },
          shading: { fill: ACCENT_BG, type: ShadingType.CLEAR },
          children: [
            para("Against **$1.4M\u20132.85M in annual operational friction** identified in our initial assessment, the INTAKE at $18,000 represents roughly 1% of the problem cost. The full INTAKE + DISCOVERY at $42,000 delivers not just the diagnosis but working automations and a validated roadmap \u2014 at less than 3% of the annual friction.")
          ]
        })] })]
      }),

      para("\u201CIf the assessment confirms the opportunity, we proceed. If not, Taylor walks away with a valuable operational audit at minimal cost.\u201D", { italic: true }),

      // ─── ENGAGEMENT TERMS ───
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
        ], 2),

      // ─── CTA ───
      new Paragraph({ spacing: { before: 360 } }),
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

      // ─── FOOTER ───
      new Paragraph({ spacing: { before: 360 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "TransformAZ \u2014 March 2026 \u2014 Prepared exclusively for Taylor Group",
          font: "Consolas", size: 16, color: "A1A1AA" })] }),
    ]
  }]
});

const outPath = __dirname + '/Taylor-Group-Intake-Proposal-EDITABLE.docx';
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log('Created:', outPath);
  console.log('Size:', (buffer.length / 1024).toFixed(0) + ' KB');
});
