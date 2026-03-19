const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaLightbulb, FaTools, FaRocket, FaBrain, FaShieldAlt,
  FaChartLine, FaUsers, FaCogs, FaDatabase, FaCalendarAlt,
  FaQuoteLeft, FaArrowRight, FaExclamationTriangle, FaStar,
  FaCheckCircle, FaIndustry
} = require("react-icons/fa");

// ── COLORS ────────────────────────────────────
const C = {
  dark:       "1A1A2E",
  darkMid:    "252545",
  accent:     "7A7AE6",
  accentDim:  "5a5abf",
  light:      "F4F3F0",
  white:      "FFFFFF",
  text:       "1a1a1a",
  textMuted:  "6b6b6b",
  blue:       "2c5282",
  blueLight:  "e8f0fe",
  green:      "2a7d4f",
  greenLight: "e8f5ee",
  amber:      "9a6f1e",
  amberLight: "fdf5e6",
  red:        "c0392b",
  redLight:   "fdeaea",
  border:     "e0ddd6",
};

// ── ICON HELPER ───────────────────────────────
function renderIconSvg(IconComponent, color = "#000000", size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
}
async function iconToBase64Png(IconComponent, color, size = 256) {
  const svg = renderIconSvg(IconComponent, "#" + color, size);
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

// ── SHADOW HELPER (fresh object each time) ────
const makeShadow = () => ({ type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.12 });
const makeCardShadow = () => ({ type: "outer", blur: 4, offset: 1, angle: 135, color: "000000", opacity: 0.08 });

// ── MAIN ──────────────────────────────────────
(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "TransformAZ";
  pres.title = "Building the Digital Backbone — Taylor Group";

  // Pre-render icons
  const icons = {
    lightbulb: await iconToBase64Png(FaLightbulb, C.accent),
    tools:     await iconToBase64Png(FaTools, C.green),
    rocket:    await iconToBase64Png(FaRocket, C.amber),
    brain:     await iconToBase64Png(FaBrain, C.accent),
    shield:    await iconToBase64Png(FaShieldAlt, C.red),
    chart:     await iconToBase64Png(FaChartLine, C.accent),
    users:     await iconToBase64Png(FaUsers, C.green),
    cogs:      await iconToBase64Png(FaCogs, C.blue),
    database:  await iconToBase64Png(FaDatabase, C.amber),
    calendar:  await iconToBase64Png(FaCalendarAlt, C.accent),
    quote:     await iconToBase64Png(FaQuoteLeft, "FFFFFF"),
    arrow:     await iconToBase64Png(FaArrowRight, C.accent),
    warning:   await iconToBase64Png(FaExclamationTriangle, C.amber),
    star:      await iconToBase64Png(FaStar, C.accent),
    check:     await iconToBase64Png(FaCheckCircle, C.green),
    industry:  await iconToBase64Png(FaIndustry, C.accent),
    lightbulbW: await iconToBase64Png(FaLightbulb, "FFFFFF"),
    toolsW:    await iconToBase64Png(FaTools, "FFFFFF"),
    rocketW:   await iconToBase64Png(FaRocket, "FFFFFF"),
  };

  // ════════════════════════════════════════════
  // SLIDE 1 — TITLE
  // ════════════════════════════════════════════
  let s1 = pres.addSlide();
  s1.background = { color: C.dark };
  // Accent bar left
  s1.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: 5.625, fill: { color: C.accent } });
  // TransformAZ logo
  s1.addText([
    { text: "Transform", options: { color: C.white, fontFace: "Calibri", fontSize: 14, bold: false } },
    { text: "AZ", options: { color: C.accent, fontFace: "Calibri", fontSize: 14, bold: true } }
  ], { x: 0.7, y: 0.4, w: 3, h: 0.4, margin: 0 });
  // Title
  s1.addText("Building the\nDigital Backbone", {
    x: 0.7, y: 1.4, w: 6, h: 2,
    fontFace: "Georgia", fontSize: 40, color: C.white, bold: true,
    lineSpacingMultiple: 1.1, margin: 0
  });
  // Subtitle
  s1.addText("A Transformation Strategy for Taylor Group", {
    x: 0.7, y: 3.4, w: 6, h: 0.5,
    fontFace: "Calibri", fontSize: 16, color: C.accent, italic: true, margin: 0
  });
  // Meta line
  s1.addText("March 2026  |  Strategic Proposal  |  TAZ-TG-2026-02", {
    x: 0.7, y: 4.7, w: 6, h: 0.35,
    fontFace: "Calibri", fontSize: 10, color: C.textMuted, margin: 0
  });
  // Decorative shape right side
  s1.addShape(pres.shapes.RECTANGLE, { x: 7.5, y: 0, w: 2.5, h: 5.625, fill: { color: C.accent, transparency: 8 } });
  s1.addShape(pres.shapes.RECTANGLE, { x: 8.5, y: 0, w: 1.5, h: 5.625, fill: { color: C.accent, transparency: 5 } });

  // ════════════════════════════════════════════
  // SLIDE 2 — THE OPPORTUNITY (with urgency)
  // ════════════════════════════════════════════
  let s2 = pres.addSlide();
  s2.background = { color: C.light };
  // Section label
  s2.addText("01 — THE OPPORTUNITY", {
    x: 0.7, y: 0.4, w: 5, h: 0.3,
    fontFace: "Calibri", fontSize: 9, color: C.accent, bold: true, charSpacing: 3, margin: 0
  });
  s2.addText("95 Years of Growth.\nOne Moment of Strategic Advantage.", {
    x: 0.7, y: 0.8, w: 8.5, h: 1.1,
    fontFace: "Georgia", fontSize: 26, color: C.text, bold: true, lineSpacingMultiple: 1.15, margin: 0
  });

  // Stats row — 4 big numbers
  const stats = [
    { num: "$85M", label: "Revenue", color: C.accent },
    { num: "321", label: "People across 40+ countries", color: C.blue },
    { num: "$15.8B", label: "Industry at peak", color: C.green },
    { num: "16%", label: "Transformations that succeed", color: C.red },
  ];
  stats.forEach((st, i) => {
    const x = 0.7 + i * 2.3;
    s2.addShape(pres.shapes.RECTANGLE, {
      x, y: 2.15, w: 2.05, h: 1.4,
      fill: { color: C.white }, shadow: makeCardShadow()
    });
    s2.addShape(pres.shapes.RECTANGLE, {
      x, y: 2.15, w: 2.05, h: 0.06,
      fill: { color: st.color }
    });
    s2.addText(st.num, {
      x, y: 2.35, w: 2.05, h: 0.7,
      fontFace: "Georgia", fontSize: 28, color: st.color, bold: true, align: "center", margin: 0
    });
    s2.addText(st.label, {
      x, y: 3.0, w: 2.05, h: 0.45,
      fontFace: "Calibri", fontSize: 10, color: C.textMuted, align: "center", margin: 0
    });
  });

  // Urgency callout (replaces previous key message)
  s2.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 3.85, w: 8.6, h: 1.3,
    fill: { color: C.white }, shadow: makeCardShadow()
  });
  s2.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 3.85, w: 0.06, h: 1.3,
    fill: { color: C.red }
  });
  s2.addText([
    { text: "The cost of waiting is real: $350K\u2013$750K per quarter in operational friction.", options: { bold: true, color: C.text } },
    { text: " Freeman, GPJ, and Jack Morton have publicly announced AI programs. Every quarter without a strategy widens the gap.", options: { color: C.textMuted } },
  ], {
    x: 1.0, y: 3.95, w: 8.1, h: 1.1,
    fontFace: "Calibri", fontSize: 12, lineSpacingMultiple: 1.4, margin: 0, valign: "middle"
  });

  // ════════════════════════════════════════════
  // SLIDE 3 — KEY FINDINGS (tightened numbers)
  // ════════════════════════════════════════════
  let s3 = pres.addSlide();
  s3.background = { color: C.light };
  s3.addText("02 — KEY FINDINGS", {
    x: 0.7, y: 0.4, w: 5, h: 0.3,
    fontFace: "Calibri", fontSize: 9, color: C.accent, bold: true, charSpacing: 3, margin: 0
  });
  s3.addText("What Discovery Revealed", {
    x: 0.7, y: 0.8, w: 8.5, h: 0.6,
    fontFace: "Georgia", fontSize: 26, color: C.text, bold: true, margin: 0
  });

  const findings = [
    { title: "Asset Management\nBlind Spot", impact: "$500K \u2013 $1.2M/yr", tag: "HIGH IMPACT", tagColor: C.red, tagBg: C.redLight, quote: "$20-30M in assets we can't account for" },
    { title: "Sales \u2194 Production\nDisconnect", impact: "$400K \u2013 $800K/yr", tag: "HIGH IMPACT", tagColor: C.red, tagBg: C.redLight, quote: "Sales sells it, production finds out too late" },
    { title: "Executive\nTime Drain", impact: "$225K \u2013 $300K/yr", tag: "MEDIUM", tagColor: C.amber, tagBg: C.amberLight, quote: "400-500 emails/day, 70% unnecessary CCs" },
    { title: "Dormant AI\nInvestment", impact: "$75K \u2013 $150K/yr", tag: "MEDIUM", tagColor: C.amber, tagBg: C.amberLight, quote: "Paying for ClickUp Brain, nobody using it" },
    { title: "Generational\nAdoption Gap", impact: "6-mo delay = 2x cost", tag: "STRATEGIC", tagColor: C.blue, tagBg: C.blueLight, quote: "Younger staff adapt; seniors need a pathway" },
    { title: "Missing Strategic\nTech Layer", impact: "$200K \u2013 $400K/yr", tag: "STRATEGIC", tagColor: C.blue, tagBg: C.blueLight, quote: "No CTO. No one looks at this holistically" },
  ];

  findings.forEach((f, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.7 + col * 3.05;
    const y = 1.6 + row * 1.95;

    s3.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 2.8, h: 1.75,
      fill: { color: C.white }, shadow: makeCardShadow()
    });
    s3.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 2.8, h: 0.05,
      fill: { color: f.tagColor }
    });
    // Tag
    s3.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.12, y: y + 0.12, w: 0.95, h: 0.2,
      fill: { color: f.tagBg }
    });
    s3.addText(f.tag, {
      x: x + 0.12, y: y + 0.12, w: 0.95, h: 0.2,
      fontFace: "Calibri", fontSize: 6, color: f.tagColor, bold: true, align: "center", valign: "middle", charSpacing: 1.5, margin: 0
    });
    // Title
    s3.addText(f.title, {
      x: x + 0.12, y: y + 0.38, w: 2.55, h: 0.55,
      fontFace: "Georgia", fontSize: 11, color: C.text, bold: true, margin: 0, lineSpacingMultiple: 1.05
    });
    // Quote (italic, smaller)
    s3.addText('"' + f.quote + '"', {
      x: x + 0.12, y: y + 0.95, w: 2.55, h: 0.35,
      fontFace: "Calibri", fontSize: 8, color: C.textMuted, italic: true, margin: 0
    });
    // Impact
    s3.addText(f.impact, {
      x: x + 0.12, y: y + 1.35, w: 2.55, h: 0.28,
      fontFace: "Calibri", fontSize: 10, color: f.tagColor, bold: true, margin: 0
    });
  });

  // ════════════════════════════════════════════
  // SLIDE 4 — THE DIGITAL BACKBONE (same)
  // ════════════════════════════════════════════
  let s4 = pres.addSlide();
  s4.background = { color: C.dark };
  s4.addText("03 — THE DIGITAL BACKBONE", {
    x: 0.7, y: 0.4, w: 5, h: 0.3,
    fontFace: "Calibri", fontSize: 9, color: C.accent, bold: true, charSpacing: 3, margin: 0
  });
  s4.addText("One Connected Operation", {
    x: 0.7, y: 0.8, w: 8.5, h: 0.6,
    fontFace: "Georgia", fontSize: 28, color: C.white, bold: true, margin: 0
  });
  s4.addText("The nervous system that connects every part of Taylor's business \u2014 sales, production, assets, communication, and decisions.", {
    x: 0.7, y: 1.45, w: 8.5, h: 0.55,
    fontFace: "Calibri", fontSize: 13, color: C.textMuted, margin: 0, lineSpacingMultiple: 1.3
  });

  // C/B/E diagram — three phase boxes with arrows
  const phases = [
    { label: "CREATE", sub: "Strategy & Creative", color: C.blue, icon: icons.lightbulbW },
    { label: "BUILD", sub: "Experiences & Fabrication", color: C.green, icon: icons.toolsW },
    { label: "EXECUTE", sub: "Management & Measurement", color: C.amber, icon: icons.rocketW },
  ];
  phases.forEach((p, i) => {
    const x = 1.0 + i * 3.1;
    s4.addShape(pres.shapes.RECTANGLE, {
      x, y: 2.3, w: 2.6, h: 1.4,
      fill: { color: p.color }, shadow: makeShadow()
    });
    s4.addImage({ data: p.icon, x: x + 0.95, y: 2.4, w: 0.35, h: 0.35 });
    s4.addText(p.label, {
      x, y: 2.8, w: 2.6, h: 0.4,
      fontFace: "Calibri", fontSize: 16, color: C.white, bold: true, align: "center", charSpacing: 4, margin: 0
    });
    s4.addText(p.sub, {
      x, y: 3.15, w: 2.6, h: 0.35,
      fontFace: "Calibri", fontSize: 10, color: "FFFFFF", align: "center", margin: 0, transparency: 20
    });
    // Arrow between
    if (i < 2) {
      s4.addText("\u2192", {
        x: x + 2.55, y: 2.7, w: 0.6, h: 0.5,
        fontFace: "Calibri", fontSize: 20, color: C.accent, align: "center", valign: "middle", bold: true, margin: 0
      });
    }
  });

  // Backbone bar
  s4.addShape(pres.shapes.RECTANGLE, {
    x: 1.0, y: 4.0, w: 8.3, h: 0.5,
    fill: { color: C.accent }, shadow: makeShadow()
  });
  s4.addText("DIGITAL BACKBONE", {
    x: 1.0, y: 4.0, w: 8.3, h: 0.5,
    fontFace: "Calibri", fontSize: 12, color: C.white, bold: true, align: "center", valign: "middle", charSpacing: 6, margin: 0
  });

  // 5 pillar tags below
  const pillars = [
    { name: "People & Culture", color: C.green },
    { name: "Processes", color: C.blue },
    { name: "Tech Integrations", color: C.accent },
    { name: "Data", color: C.amber },
    { name: "Compliance", color: C.red },
  ];
  pillars.forEach((p, i) => {
    const x = 1.0 + i * 1.66;
    s4.addShape(pres.shapes.RECTANGLE, {
      x, y: 4.75, w: 1.5, h: 0.3,
      fill: { color: p.color, transparency: 80 }
    });
    s4.addText(p.name, {
      x, y: 4.75, w: 1.5, h: 0.3,
      fontFace: "Calibri", fontSize: 7, color: p.color, bold: true, align: "center", valign: "middle", margin: 0
    });
  });

  // Connector lines from backbone to pillars
  pillars.forEach((p, i) => {
    const x = 1.0 + i * 1.66 + 0.75;
    s4.addShape(pres.shapes.LINE, {
      x: x, y: 4.5, w: 0, h: 0.25,
      line: { color: C.accent, width: 1.5, transparency: 40 }
    });
  });

  // ════════════════════════════════════════════
  // SLIDE 5 — THE TRANSFORMATION (consolidated C·B·E)
  // ════════════════════════════════════════════
  let s5 = pres.addSlide();
  s5.background = { color: C.light };
  s5.addText("04 \u2014 THE TRANSFORMATION", {
    x: 0.7, y: 0.4, w: 5, h: 0.3,
    fontFace: "Calibri", fontSize: 9, color: C.accent, bold: true, charSpacing: 3, margin: 0
  });
  s5.addText("Create \u00B7 Build \u00B7 Execute", {
    x: 0.7, y: 0.8, w: 8.5, h: 0.6,
    fontFace: "Georgia", fontSize: 26, color: C.text, bold: true, margin: 0
  });

  // Three compact cards in a row
  const cbeCards = [
    {
      label: "CREATE",
      color: C.blue,
      iconData: icons.lightbulb,
      desc: "Institutional memory, proposal acceleration, AI-assisted ideation. Ideas build on what Taylor already knows."
    },
    {
      label: "BUILD",
      color: C.green,
      iconData: icons.tools,
      desc: "Design-to-build continuity, asset intelligence, capacity forecasting. The gap between sold and buildable closes."
    },
    {
      label: "EXECUTE",
      color: C.amber,
      iconData: icons.rocket,
      desc: "Connected orchestration, resource allocation, measurement loop. Each project makes the next one better."
    },
  ];
  cbeCards.forEach((card, i) => {
    const x = 0.7 + i * 3.05;
    // Card background
    s5.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.6, w: 2.8, h: 2.4,
      fill: { color: C.white }, shadow: makeCardShadow()
    });
    // Top color bar
    s5.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.6, w: 2.8, h: 0.05,
      fill: { color: card.color }
    });
    // Icon
    s5.addImage({ data: card.iconData, x: x + 0.15, y: 1.8, w: 0.3, h: 0.3 });
    // Label
    s5.addText(card.label, {
      x: x + 0.55, y: 1.8, w: 2.1, h: 0.3,
      fontFace: "Calibri", fontSize: 13, color: card.color, bold: true, charSpacing: 3, margin: 0, valign: "middle"
    });
    // Description
    s5.addText(card.desc, {
      x: x + 0.15, y: 2.25, w: 2.5, h: 1.55,
      fontFace: "Calibri", fontSize: 11, color: C.textMuted, margin: 0, lineSpacingMultiple: 1.45
    });
  });

  // Aggregate impact callout bar below cards
  s5.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.25, w: 8.6, h: 0.95,
    fill: { color: C.white }, shadow: makeCardShadow()
  });
  s5.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.25, w: 0.06, h: 0.95,
    fill: { color: C.accent }
  });
  s5.addText([
    { text: "Aggregate impact: $1.4M \u2013 $2.85M annually", options: { bold: true, color: C.text, fontSize: 13 } },
    { text: " in operational friction and unrealized value", options: { color: C.textMuted, fontSize: 13 } },
  ], {
    x: 1.0, y: 4.25, w: 8.1, h: 0.95,
    fontFace: "Calibri", lineSpacingMultiple: 1.3, margin: 0, valign: "middle"
  });

  // ════════════════════════════════════════════
  // SLIDE 6 — TIMELINE (renumbered from 07)
  // ════════════════════════════════════════════
  let s6 = pres.addSlide();
  s6.background = { color: C.light };
  s6.addText("05 \u2014 TIMELINE", {
    x: 0.7, y: 0.4, w: 5, h: 0.3,
    fontFace: "Calibri", fontSize: 9, color: C.accent, bold: true, charSpacing: 3, margin: 0
  });
  s6.addText("A Phased Approach", {
    x: 0.7, y: 0.8, w: 8.5, h: 0.6,
    fontFace: "Georgia", fontSize: 26, color: C.text, bold: true, margin: 0
  });

  // Month headers
  const months = ["APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  months.forEach((m, i) => {
    s6.addText(m, {
      x: 1.7 + i * 0.88, y: 1.55, w: 0.88, h: 0.3,
      fontFace: "Calibri", fontSize: 7, color: C.textMuted, bold: true, align: "center", margin: 0, charSpacing: 1
    });
  });
  // Separator line
  s6.addShape(pres.shapes.LINE, {
    x: 1.7, y: 1.85, w: 7.92, h: 0,
    line: { color: C.border, width: 0.5 }
  });

  // Phase bars
  const timelinePhases = [
    { name: "INTAKE", sub: "CREATE", y: 2.0, startCol: 0, span: 2, color: C.blue, activities: "SOP review, tech audit, stakeholder mapping" },
    { name: "DISCOVERY", sub: "CREATE", y: 2.65, startCol: 2, span: 1, color: C.green, activities: "Onsite Toronto: interviews, process mapping, AI vision" },
    { name: "IMPLEMENTATION", sub: "BUILD", y: 3.3, startCol: 3, span: 4, color: C.accent, activities: "Automation builds, platform optimization, champion training" },
    { name: "STABILIZATION", sub: "EXECUTE", y: 3.95, startCol: 7, span: 2, color: C.amber, activities: "Adoption, measurement, knowledge transfer, advisory" },
  ];
  timelinePhases.forEach((p) => {
    // Label
    s6.addText(p.name, {
      x: 0.3, y: p.y, w: 1.35, h: 0.22,
      fontFace: "Calibri", fontSize: 8, color: p.color, bold: true, align: "right", margin: 0
    });
    s6.addText(p.sub, {
      x: 0.3, y: p.y + 0.22, w: 1.35, h: 0.18,
      fontFace: "Calibri", fontSize: 7, color: C.textMuted, align: "right", margin: 0
    });
    // Bar
    const barX = 1.7 + p.startCol * 0.88;
    const barW = p.span * 0.88;
    s6.addShape(pres.shapes.RECTANGLE, {
      x: barX, y: p.y + 0.02, w: barW, h: 0.4,
      fill: { color: p.color }
    });
    s6.addText(p.activities, {
      x: barX + 0.1, y: p.y + 0.02, w: barW - 0.2, h: 0.4,
      fontFace: "Calibri", fontSize: 7, color: C.white, valign: "middle", margin: 0
    });
  });

  // Value delivered section below
  s6.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.65, w: 8.6, h: 0.65,
    fill: { color: C.white }, shadow: makeCardShadow()
  });
  s6.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.65, w: 0.06, h: 0.65,
    fill: { color: C.accent }
  });
  s6.addText([
    { text: "Each phase delivers standalone value. ", options: { bold: true, color: C.text } },
    { text: "Taylor sees results before committing to the next stage. No multi-year contracts. No lock-in. Prove value, then expand.", options: { color: C.textMuted } },
  ], {
    x: 1.0, y: 4.65, w: 8.1, h: 0.65,
    fontFace: "Calibri", fontSize: 11, valign: "middle", margin: 0
  });

  // ════════════════════════════════════════════
  // SLIDE 7 — MARKET INSIGHTS (renumbered from 08)
  // ════════════════════════════════════════════
  let s7 = pres.addSlide();
  s7.background = { color: C.light };
  s7.addText("06 \u2014 MARKET INSIGHTS", {
    x: 0.7, y: 0.4, w: 5, h: 0.3,
    fontFace: "Calibri", fontSize: 9, color: C.accent, bold: true, charSpacing: 3, margin: 0
  });
  s7.addText("AI in Experiential Marketing", {
    x: 0.7, y: 0.8, w: 8.5, h: 0.6,
    fontFace: "Georgia", fontSize: 24, color: C.text, bold: true, margin: 0
  });

  // Three horizon cards
  const horizons = [
    { title: "Now \u2192 12 Months", color: C.blue, bg: C.blueLight, items: "47% of marketing activities automatable\n30% productivity gains achievable\nQuick wins: email, meetings, content drafts" },
    { title: "1 \u2013 3 Years", color: C.amber, bg: C.amberLight, items: "Agentic AI replaces basic chatbots\nAsset tracking goes RFID/IoT-based\nEarly transformers win enterprise contracts" },
    { title: "5 \u2013 10 Years", color: C.green, bg: C.greenLight, items: "Predictive operations & digital twins\nAI-powered creative augmentation\nTaylor's IP becomes its competitive moat" },
  ];
  horizons.forEach((h, i) => {
    const x = 0.7 + i * 3.05;
    s7.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.6, w: 2.8, h: 2.1,
      fill: { color: h.bg }
    });
    s7.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.6, w: 2.8, h: 0.05,
      fill: { color: h.color }
    });
    s7.addText(h.title, {
      x: x + 0.15, y: 1.75, w: 2.5, h: 0.35,
      fontFace: "Georgia", fontSize: 12, color: h.color, bold: true, margin: 0
    });
    s7.addText(h.items, {
      x: x + 0.15, y: 2.15, w: 2.5, h: 1.4,
      fontFace: "Calibri", fontSize: 10, color: C.text, margin: 0, lineSpacingMultiple: 1.5
    });
  });

  // Stats row
  const mktStats = [
    { num: "16%", label: "succeed fully", color: C.red },
    { num: "70%", label: "fail to meet objectives", color: C.amber },
    { num: "25%", label: "achieve AI ROI", color: C.blue },
    { num: "40%", label: "cost reduction potential", color: C.green },
  ];
  mktStats.forEach((st, i) => {
    const x = 0.7 + i * 2.3;
    s7.addShape(pres.shapes.RECTANGLE, {
      x, y: 4.0, w: 2.05, h: 1.15,
      fill: { color: C.white }, shadow: makeCardShadow()
    });
    s7.addText(st.num, {
      x, y: 4.1, w: 2.05, h: 0.55,
      fontFace: "Georgia", fontSize: 24, color: st.color, bold: true, align: "center", margin: 0
    });
    s7.addText(st.label, {
      x, y: 4.6, w: 2.05, h: 0.4,
      fontFace: "Calibri", fontSize: 9, color: C.textMuted, align: "center", margin: 0
    });
  });

  // ════════════════════════════════════════════
  // SLIDE 8 — INVESTMENT & NEXT STEPS (new closing)
  // ════════════════════════════════════════════
  let s8 = pres.addSlide();
  s8.background = { color: C.dark };
  s8.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: 5.625, fill: { color: C.accent } });

  s8.addText("07 \u2014 NEXT STEPS", {
    x: 0.7, y: 0.4, w: 5, h: 0.3,
    fontFace: "Calibri", fontSize: 9, color: C.accent, bold: true, charSpacing: 3, margin: 0
  });
  s8.addText("Moving Forward", {
    x: 0.7, y: 0.85, w: 8, h: 0.6,
    fontFace: "Georgia", fontSize: 30, color: C.white, bold: true, margin: 0
  });

  // ── LEFT SIDE: Investment table (~55% width) ──
  const tableX = 0.7;
  const tableW = 5.1;
  const tableY = 1.7;
  const rowH = 0.55;
  const colWidths = [1.8, 1.4, 1.9]; // Phase, Fee model, Location

  // Table header
  s8.addShape(pres.shapes.RECTANGLE, {
    x: tableX, y: tableY, w: tableW, h: 0.35,
    fill: { color: C.accent }
  });
  const headerLabels = ["PHASE", "FEE MODEL", "ENGAGEMENT"];
  headerLabels.forEach((lbl, i) => {
    let hx = tableX;
    for (let j = 0; j < i; j++) hx += colWidths[j];
    s8.addText(lbl, {
      x: hx + 0.1, y: tableY, w: colWidths[i] - 0.1, h: 0.35,
      fontFace: "Calibri", fontSize: 7, color: C.white, bold: true, charSpacing: 2, valign: "middle", margin: 0
    });
  });

  // Table rows
  const investRows = [
    { phase: "INTAKE", period: "Apr \u2013 May", fee: "Fixed fee", location: "Remote", color: C.blue },
    { phase: "DISCOVERY", period: "Jun", fee: "Fixed fee", location: "Onsite Toronto", color: C.green },
    { phase: "IMPLEMENTATION", period: "Jul \u2013 Oct", fee: "Monthly retainer", location: "", color: C.accent },
    { phase: "STABILIZATION", period: "Nov+", fee: "Advisory retainer", location: "", color: C.amber },
  ];
  investRows.forEach((row, i) => {
    const ry = tableY + 0.35 + i * rowH;
    // Row background (alternating)
    s8.addShape(pres.shapes.RECTANGLE, {
      x: tableX, y: ry, w: tableW, h: rowH,
      fill: { color: C.accent, transparency: i % 2 === 0 ? 92 : 96 }
    });
    // Color indicator bar
    s8.addShape(pres.shapes.RECTANGLE, {
      x: tableX, y: ry, w: 0.05, h: rowH,
      fill: { color: row.color }
    });
    // Phase name + period
    s8.addText(row.phase, {
      x: tableX + 0.15, y: ry + 0.02, w: colWidths[0] - 0.15, h: 0.28,
      fontFace: "Calibri", fontSize: 10, color: C.white, bold: true, margin: 0, valign: "middle"
    });
    s8.addText(row.period, {
      x: tableX + 0.15, y: ry + 0.28, w: colWidths[0] - 0.15, h: 0.22,
      fontFace: "Calibri", fontSize: 8, color: C.textMuted, margin: 0, valign: "middle"
    });
    // Fee model
    s8.addText(row.fee, {
      x: tableX + colWidths[0] + 0.1, y: ry, w: colWidths[1] - 0.1, h: rowH,
      fontFace: "Calibri", fontSize: 9, color: C.textMuted, margin: 0, valign: "middle"
    });
    // Location
    s8.addText(row.location, {
      x: tableX + colWidths[0] + colWidths[1] + 0.1, y: ry, w: colWidths[2] - 0.1, h: rowH,
      fontFace: "Calibri", fontSize: 9, color: C.textMuted, margin: 0, valign: "middle"
    });
  });

  // ── RIGHT SIDE: Proposed Next Step (~45% width) ──
  const rightX = 6.1;
  const rightW = 3.5;

  s8.addText("PROPOSED NEXT STEP", {
    x: rightX, y: 1.7, w: rightW, h: 0.25,
    fontFace: "Calibri", fontSize: 8, color: C.accent, bold: true, charSpacing: 2, margin: 0
  });

  // Accent-colored box with CTA
  s8.addShape(pres.shapes.RECTANGLE, {
    x: rightX, y: 2.05, w: rightW, h: 1.0,
    fill: { color: C.accent }
  });
  s8.addText("Start with INTAKE in April 2026. Contained, fixed-fee engagement. No obligation to proceed further.", {
    x: rightX + 0.15, y: 2.1, w: rightW - 0.3, h: 0.9,
    fontFace: "Calibri", fontSize: 11, color: C.white, bold: true, margin: 0, lineSpacingMultiple: 1.4, valign: "middle"
  });

  // Deliverables list
  const deliverables = [
    "Evidence-based operational assessment",
    "Quantified impact (replacing ranges with precise figures)",
    "Prioritized quick wins + strategic workstreams",
    "Fully scoped proposal for next phases",
  ];
  deliverables.forEach((d, i) => {
    const dy = 3.25 + i * 0.4;
    s8.addImage({ data: icons.check, x: rightX + 0.05, y: dy + 0.05, w: 0.18, h: 0.18 });
    s8.addText(d, {
      x: rightX + 0.3, y: dy, w: rightW - 0.35, h: 0.35,
      fontFace: "Calibri", fontSize: 9, color: C.textMuted, margin: 0, valign: "middle", lineSpacingMultiple: 1.2
    });
  });

  // ── Bottom bar ──
  s8.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 5.1, w: 8.6, h: 0.01,
    fill: { color: C.accent, transparency: 50 }
  });
  s8.addText([
    { text: "Transform", options: { color: C.white, bold: false } },
    { text: "AZ", options: { color: C.accent, bold: true } },
    { text: "  \u2014  March 2026  \u2014  Prepared exclusively for Taylor Group", options: { color: C.textMuted } }
  ], {
    x: 0.7, y: 5.15, w: 8.6, h: 0.35,
    fontFace: "Calibri", fontSize: 9, align: "center", margin: 0
  });

  // ── WRITE FILE ──────────────────────────────
  await pres.writeFile({ fileName: "/Users/aguspereyra/Desktop/TransformAZ/Taylor Group/proposal-2.0/pitch/Taylor-Group-Strategic-Pitch.pptx" });
  console.log("PPTX generated successfully.");
})();
