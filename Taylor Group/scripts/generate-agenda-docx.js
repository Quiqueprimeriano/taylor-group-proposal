const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
        BorderStyle, WidthType, ShadingType, PageNumber, PageBreak } = require('docx');

// Brand colors
const PURPLE = "7A7AE6";
const RED = "C0392B";
const DARK = "1A1A2E";
const GRAY_BG = "F5F4FF";
const LIGHT_BORDER = "E0D6D6";
const WHITE = "FFFFFF";

// Table helpers
const border = { style: BorderStyle.SINGLE, size: 1, color: LIGHT_BORDER };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

// Page: A4 with 1-inch margins
const PAGE_W = 11906;
const MARGIN = 1440;
const CONTENT_W = PAGE_W - 2 * MARGIN; // 9026

function headerCell(text, width) {
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA },
    shading: { fill: PURPLE, type: ShadingType.CLEAR },
    margins: cellMargins,
    verticalAlign: "center",
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, font: "Calibri", size: 18, color: WHITE })] })]
  });
}

function cell(runs, width, opts = {}) {
  const children = Array.isArray(runs) ? runs : [runs];
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA },
    shading: opts.shading ? { fill: opts.shading, type: ShadingType.CLEAR } : undefined,
    margins: cellMargins,
    verticalAlign: "top",
    children: children.map(r => {
      if (r instanceof Paragraph) return r;
      return new Paragraph({ children: Array.isArray(r) ? r : [r] });
    })
  });
}

function tr(text, opts = {}) {
  return new TextRun({ text, font: "Calibri", size: 20, ...opts });
}

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
    children: [new TextRun({ text, font: "Source Serif 4", size: 32, bold: true, color: PURPLE })]
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_BORDER, space: 4 } },
    children: [new TextRun({ text, font: "Source Serif 4", size: 26, bold: true, color: RED })]
  });
}

function heading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, font: "Calibri", size: 22, bold: true, color: DARK })]
  });
}

function para(runs, opts = {}) {
  const children = Array.isArray(runs) ? runs : [typeof runs === 'string' ? tr(runs) : runs];
  return new Paragraph({ spacing: { after: 100 }, ...opts, children });
}

function bullet(runs, ref = "bullets", level = 0) {
  const children = Array.isArray(runs) ? runs : [typeof runs === 'string' ? tr(runs) : runs];
  return new Paragraph({ numbering: { reference: ref, level }, spacing: { after: 60 }, children });
}

function spacer(pts = 120) {
  return new Paragraph({ spacing: { after: pts }, children: [] });
}

function recBox(title, body) {
  // Recommendation box as a single-cell table with purple left border
  const purpleBorder = { style: BorderStyle.SINGLE, size: 12, color: PURPLE };
  const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: LIGHT_BORDER };
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({
      children: [new TableCell({
        borders: { left: purpleBorder, top: thinBorder, bottom: thinBorder, right: thinBorder },
        shading: { fill: GRAY_BG, type: ShadingType.CLEAR },
        margins: { top: 100, bottom: 100, left: 200, right: 200 },
        width: { size: CONTENT_W, type: WidthType.DXA },
        children: [
          new Paragraph({ spacing: { after: 60 }, children: [
            tr("RECOMENDACI\u00D3N: ", { bold: true, color: PURPLE, size: 20 }),
            tr(title, { bold: true, size: 20 })
          ]}),
          new Paragraph({ children: [tr(body, { size: 18, color: "444444" })] })
        ]
      })]
    })]
  });
}

// Build document
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Calibri", size: 20 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Source Serif 4", color: PURPLE },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Source Serif 4", color: RED },
        paragraph: { spacing: { before: 300, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Calibri", color: DARK },
        paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
          { level: 1, format: LevelFormat.BULLET, text: "\u2013", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1440, hanging: 360 } } } }
        ] },
      { reference: "numbers",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [
    // === COVER / TITLE ===
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN }
        }
      },
      headers: {
        default: new Header({ children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [tr("TRANSFORMAZ \u2014 CONFIDENCIAL / INTERNO", { size: 16, color: "999999", italics: true })]
        })] })
      },
      footers: {
        default: new Footer({ children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            tr("TransformAZ \u2014 Agenda Pre-Taylor  |  P\u00E1gina ", { size: 16, color: "999999" }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Calibri", size: 16, color: "999999" })
          ]
        })] })
      },
      children: [
        spacer(600),
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { after: 80 },
          children: [new TextRun({ text: "TRANSFORMAZ", font: "Source Serif 4", size: 44, bold: true, color: PURPLE })]
        }),
        new Paragraph({
          spacing: { after: 40 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: PURPLE, space: 8 } },
          children: [new TextRun({ text: "Agenda de Decisi\u00F3n Pre-Taylor Group", font: "Source Serif 4", size: 36, color: DARK })]
        }),
        spacer(200),
        para([tr("Reuni\u00F3n Ferm\u00EDn + Agust\u00EDn", { size: 24, bold: true })]),
        para([tr("Deadline: 27 de marzo de 2026 (presentaci\u00F3n a Taylor Group)", { size: 22, color: "666666" })]),
        para([tr("Documento generado por /plan-ceo-review", { size: 18, color: "999999", italics: true })]),
        spacer(400),

        // Context box
        new Table({
          width: { size: CONTENT_W, type: WidthType.DXA },
          columnWidths: [CONTENT_W],
          rows: [new TableRow({
            children: [new TableCell({
              borders: { left: { style: BorderStyle.SINGLE, size: 12, color: RED }, top: border, bottom: border, right: border },
              shading: { fill: "FFF5F5", type: ShadingType.CLEAR },
              margins: { top: 120, bottom: 120, left: 200, right: 200 },
              width: { size: CONTENT_W, type: WidthType.DXA },
              children: [
                new Paragraph({ spacing: { after: 80 }, children: [tr("CONTEXTO", { bold: true, color: RED, size: 22 })] }),
                para([tr("Taylor Group ($85M revenue, 321 personas, 40+ pa\u00EDses) dio verbal go. Presentamos en 4 d\u00EDas. Tenemos la mejor propuesta del mercado pero cero infraestructura operativa detr\u00E1s. Esta reuni\u00F3n define las decisiones que no pueden esperar.", { size: 18 })]),
              ]
            })]
          })]
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // ========================================
        // SECTION 1: ENTIDAD LEGAL
        // ========================================
        heading2("1. ENTIDAD LEGAL"),
        para([tr("PRIORIDAD: ", { bold: true, color: RED }), tr("BLOQUEANTE \u2014 sin esto no hay contrato")]),
        spacer(40),

        heading3("Preguntas para definir"),
        bullet([tr("\u00BFTransformAZ tiene entidad registrada?", { bold: true }), tr(" (LLC, SAS, aut\u00F3nomo, sociedad)")]),
        bullet([tr("\u00BFEn qu\u00E9 jurisdicci\u00F3n?", { bold: true }), tr(" Espa\u00F1a (donde vive Ferm\u00EDn), USA (Delaware), Argentina, otra")]),
        bullet([tr("\u00BFQui\u00E9n firma el MSA con Taylor Group?", { bold: true })]),
        bullet([tr("\u00BFHay cuenta bancaria que pueda recibir USD?", { bold: true })]),
        spacer(60),

        heading3("Por qu\u00E9 importa"),
        bullet("Taylor Group es una empresa de $85M con equipo legal propio. Van a pedir que el contrato sea con una entidad, no con una persona f\u00EDsica."),
        bullet("Sin entidad = sin liability cap. Si algo sale mal, la responsabilidad es personal e ilimitada."),
        bullet("La jurisdicci\u00F3n del contrato determina la ley aplicable en caso de disputas."),
        spacer(60),

        recBox(
          "Registrar entidad antes de firmar (o usar la de Ferm\u00EDn como aut\u00F3nomo en Espa\u00F1a como puente temporal).",
          "Una LLC en Delaware cuesta ~$300 y se abre en 24-48hs online. Es la opci\u00F3n m\u00E1s r\u00E1pida y aceptada internacionalmente. Si ya existe entidad de Ferm\u00EDn en Espa\u00F1a, puede servir como puente mientras se formaliza una estructura definitiva. Lo clave: que Taylor firme con una entidad, no con personas."
        ),
        spacer(120),

        // ========================================
        // SECTION 2: ABOGADO
        // ========================================
        heading2("2. ABOGADO Y CONTRATOS"),
        para([tr("PRIORIDAD: ", { bold: true, color: RED }), tr("CRITICAL PATH \u2014 lead time de 1-2 semanas")]),
        spacer(40),

        heading3("Preguntas para definir"),
        bullet([tr("\u00BFFerm\u00EDn tiene abogado de confianza?", { bold: true }), tr(" (comercial/mercantil, no necesariamente tech)")]),
        bullet([tr("\u00BFTaylor va a mandar su propio contrato o aceptan el nuestro?", { bold: true })]),
        bullet([tr("\u00BFPresupuesto para abogado?", { bold: true }), tr(" Estimaci\u00F3n: $500-$2,000 USD por MSA+SOW+NDA")]),
        spacer(60),

        heading3("Documentos necesarios"),
        new Table({
          width: { size: CONTENT_W, type: WidthType.DXA },
          columnWidths: [2500, 4526, 2000],
          rows: [
            new TableRow({ children: [
              headerCell("DOCUMENTO", 2500), headerCell("PROP\u00D3SITO", 4526), headerCell("DEADLINE", 2000)
            ]}),
            new TableRow({ children: [
              cell(tr("MSA", { bold: true }), 2500),
              cell(tr("Relaci\u00F3n general: liability cap, IP, confidencialidad, no-solicitation, terminaci\u00F3n"), 4526),
              cell(tr("Antes de presentar", { bold: true, color: RED }), 2000)
            ]}),
            new TableRow({ children: [
              cell(tr("SOW \u2014 INTAKE", { bold: true }), 2500, { shading: GRAY_BG }),
              cell(tr("Espec\u00EDfico de INTAKE: 6 deliverables, timeline, pagos, criterios de aceptaci\u00F3n, l\u00EDmite de revisiones"), 4526, { shading: GRAY_BG }),
              cell(tr("Con el MSA"), 2000, { shading: GRAY_BG })
            ]}),
            new TableRow({ children: [
              cell(tr("NDA", { bold: true }), 2500),
              cell(tr("Mutual. Protege datos de Taylor y metodolog\u00EDa de TransformAZ"), 4526),
              cell(tr("Antes de kickoff"), 2000)
            ]}),
          ]
        }),
        spacer(60),

        heading3("Cl\u00E1usulas cr\u00EDticas que no pueden faltar"),
        bullet([tr("Liability cap:", { bold: true }), tr(" Limitar responsabilidad a 1x los fees pagados. Sin esto, un engagement de $42K genera exposici\u00F3n ilimitada")]),
        bullet([tr("IP ownership:", { bold: true }), tr(" TransformAZ retiene la metodolog\u00EDa (Digital Backbone). Taylor se queda con los deliverables espec\u00EDficos. Clave para reusar con futuros clientes")]),
        bullet([tr("Non-solicitation:", { bold: true }), tr(" 12 meses. Protege contra que Taylor contrate directamente a Ferm\u00EDn o Agust\u00EDn")]),
        bullet([tr("Scope protection:", { bold: true }), tr(" Cambios requieren change order escrito con pricing. Es la defensa principal contra scope creep (riesgo #1 del proyecto)")]),
        bullet([tr("Payment terms:", { bold: true }), tr(" Net 15. Trabajo se pausa si pago >30 d\u00EDas de atraso")]),
        bullet([tr("Revision cap:", { bold: true }), tr(" 2 rondas de revisiones por deliverable incluidas. Adicionales se facturan aparte")]),
        spacer(60),

        recBox(
          "Contratar abogado esta semana. No esperar a que Taylor mande su contrato.",
          "Si Taylor manda su propio contrato primero, negociamos desde su terreno. Si mandamos nosotros el MSA, establecemos los t\u00E9rminos base. La inversi\u00F3n de $1-2K en abogado es el mejor ROI pre-engagement: protege contra $42K+ de exposici\u00F3n."
        ),

        new Paragraph({ children: [new PageBreak()] }),

        // ========================================
        // SECTION 3: PRICING
        // ========================================
        heading2("3. PRICING \u2014 \u00BFEstamos c\u00F3modos?"),
        para([tr("PRIORIDAD: ", { bold: true, color: RED }), tr("Definir antes de la presentaci\u00F3n")]),
        spacer(40),

        heading3("Realidad financiera"),
        new Table({
          width: { size: CONTENT_W, type: WidthType.DXA },
          columnWidths: [2200, 1700, 1700, 1700, 1726],
          rows: [
            new TableRow({ children: [
              headerCell("ESCENARIO", 2200), headerCell("REVENUE", 1700), headerCell("COSTOS", 1700),
              headerCell("MARGEN CASH", 1700), headerCell("RATE EFECTIVO", 1726)
            ]}),
            new TableRow({ children: [
              cell(tr("INTAKE only", { bold: true }), 2200),
              cell(tr("$18,000"), 1700), cell(tr("~$2,000"), 1700),
              cell(tr("$16,000 (89%)"), 1700), cell(tr("$106/hr"), 1726)
            ]}),
            new TableRow({ children: [
              cell(tr("INTAKE + DISCOVERY", { bold: true }), 2200, { shading: GRAY_BG }),
              cell(tr("$42,000"), 1700, { shading: GRAY_BG }), cell(tr("~$6,000"), 1700, { shading: GRAY_BG }),
              cell(tr("$36,000 (86%)"), 1700, { shading: GRAY_BG }), cell(tr("$124/hr"), 1726, { shading: GRAY_BG })
            ]}),
          ]
        }),
        spacer(60),

        para([tr("\u26A0\uFE0F Nota importante:", { bold: true, color: RED }), tr(" Si contamos el costo de oportunidad del tiempo de ambos (~$125/hr blended), INTAKE es -18% y INTAKE+DISCOVERY es breakeven. ", { size: 19 }), tr("Esto es aceptable para cliente #1", { bold: true, size: 19 }), tr(" (track record, caso de estudio, validar metodolog\u00EDa). No es sostenible para cliente #2.", { size: 19 })]),
        spacer(60),

        heading3("Pregunta para Ferm\u00EDn"),
        bullet([tr("\u00BFAceptamos estos m\u00E1rgenes como inversi\u00F3n en el primer cliente?", { bold: true })]),
        bullet([tr("\u00BFO queremos renegociar antes de firmar?", { bold: true }), tr(" Para ser rentables, INTAKE deber\u00EDa ser $24-28K y INTAKE+DISCOVERY $55-65K")]),
        bullet([tr("Travel budget:", { bold: true }), tr(" Ferm\u00EDn Madrid\u2192Toronto ~$1,200. Agus Sydney\u2192Toronto ~$3,500. \u00BFViajamos los dos a Toronto en DISCOVERY o solo Ferm\u00EDn?")]),
        spacer(60),

        recBox(
          "Mantener pricing actual ($18K / $42K) para cliente #1. Ajustar +35% para cliente #2.",
          "Taylor ya vio estos n\u00FAmeros en la propuesta. Cambiar ahora genera fricci\u00F3n y desconfianza. El valor real de este engagement no es el margen \u2014 es el caso de estudio, la validaci\u00F3n de la metodolog\u00EDa, y la referencia de una empresa de $85M. Eso vale mucho m\u00E1s que $3K de margen perdido."
        ),

        new Paragraph({ children: [new PageBreak()] }),

        // ========================================
        // SECTION 4: ROLES
        // ========================================
        heading2("4. ROLES Y DIVISI\u00D3N DE TRABAJO"),
        para([tr("PRIORIDAD: ", { bold: true, color: RED }), tr("Confirmar antes de la presentaci\u00F3n")]),
        spacer(40),

        heading3("Modelo propuesto"),
        new Table({
          width: { size: CONTENT_W, type: WidthType.DXA },
          columnWidths: [1800, 1800, 3426, 2000],
          rows: [
            new TableRow({ children: [
              headerCell("ROL", 1800), headerCell("QUI\u00C9N", 1800), headerCell("RESPONSABILIDADES", 3426), headerCell("TIMEZONE", 2000)
            ]}),
            new TableRow({ children: [
              cell(tr("Lead Consultant", { bold: true }), 1800),
              cell(tr("Ferm\u00EDn"), 1800),
              cell(tr("Cliente, entrevistas stakeholders, estrategia, ventas, workshop ejecutivo"), 3426),
              cell(tr("Madrid (CEST) \u2014 6hrs overlap Toronto"), 2000)
            ]}),
            new TableRow({ children: [
              cell(tr("Operations & Impl.", { bold: true }), 1800, { shading: GRAY_BG }),
              cell(tr("Agust\u00EDn"), 1800, { shading: GRAY_BG }),
              cell(tr("Tech audit, process mapping, data analysis, producci\u00F3n de deliverables, automatizaciones"), 3426, { shading: GRAY_BG }),
              cell(tr("Sydney (AEST) \u2014 2hrs overlap Toronto"), 2000, { shading: GRAY_BG })
            ]}),
          ]
        }),
        spacer(60),

        heading3("Modelo de comunicaci\u00F3n"),
        bullet([tr("Ferm\u00EDn \u2194 Agust\u00EDn:", { bold: true }), tr(" Daily sync 9am Madrid / 5pm Sydney (3 hrs de overlap)")]),
        bullet([tr("Ferm\u00EDn \u2194 Taylor:", { bold: true }), tr(" Calls en tarde Madrid = ma\u00F1ana Toronto (6 hrs overlap)")]),
        bullet([tr("Agust\u00EDn \u2194 Taylor:", { bold: true }), tr(" Limitado (2hrs overlap). Comunicaci\u00F3n async v\u00EDa ClickUp")]),
        bullet([tr("Workflow:", { bold: true }), tr(" Async-first. ClickUp updates + Loom recordings reemplazan standups en vivo")]),
        spacer(60),

        heading3("Preguntas para Ferm\u00EDn"),
        bullet([tr("\u00BFEst\u00E1s de acuerdo con ser el single point of contact con Taylor?", { bold: true })]),
        bullet([tr("\u00BFFunciona el daily sync a las 9am Madrid?", { bold: true })]),
        bullet([tr("\u00BFHay capacidad para dedicar ~30 hrs/semana al delivery + 10-15 hrs/semana a biz dev en paralelo?", { bold: true })]),
        spacer(60),

        recBox(
          "Ferm\u00EDn lidera la relaci\u00F3n con Taylor. Agust\u00EDn ejecuta async.",
          "Es la \u00FAnica configuraci\u00F3n que funciona por timezone. Ferm\u00EDn tiene 6 horas de overlap con Toronto, Agust\u00EDn solo 2. Forzar que Agust\u00EDn atienda calls con Taylor significar\u00EDa horarios de 9-11pm Sydney \u2014 insostenible por 4 meses."
        ),

        new Paragraph({ children: [new PageBreak()] }),

        // ========================================
        // SECTION 5: COBRO E IMPUESTOS
        // ========================================
        heading2("5. COBRO, IMPUESTOS Y REPARTO"),
        para([tr("PRIORIDAD: ", { bold: true, color: RED }), tr("Resolver antes de facturar (semana 1 del engagement)")]),
        spacer(40),

        heading3("Preguntas para definir"),
        bullet([tr("\u00BFC\u00F3mo recibimos USD?", { bold: true }), tr(" Cuenta bancaria en USD, Wise, Payoneer, cuenta en Espa\u00F1a")]),
        bullet([tr("\u00BFC\u00F3mo se reparten los ingresos?", { bold: true }), tr(" 50/50, proporcional a horas, fee fijo para uno y variable para el otro")]),
        bullet([tr("Impuestos cross-border:", { bold: true }), tr(" Ferm\u00EDn (Espa\u00F1a) facturando a Taylor (Canad\u00E1/US). \u00BFHay retenci\u00F3n? \u00BFDoble imposici\u00F3n?")]),
        bullet([tr("\u00BFConsultar con contador esta semana?", { bold: true }), tr(" Costo: ~$300-$500 por la consulta. Evita sorpresas de $3-5K despu\u00E9s")]),
        spacer(60),

        heading3("Por qu\u00E9 no puede esperar"),
        bullet("El primer pago ($9K o $12.6K) llega en el kickoff. Necesitamos saber a qu\u00E9 cuenta, con qu\u00E9 entidad, y qu\u00E9 impuestos aplican ANTES de emitir la factura."),
        bullet("Si la estructura fiscal es ineficiente, puede comerse entre 15-30% del revenue en retenciones evitables."),
        spacer(60),

        recBox(
          "Consultar con contador esta semana. Definir estructura de cobro antes del kickoff.",
          "Es una inversi\u00F3n de $300-500 que puede ahorrar miles en retenciones. Wise Business es la opci\u00F3n m\u00E1s r\u00E1pida para recibir USD desde Canad\u00E1 con comisiones bajas (~0.5%). Se abre en 24-48hs."
        ),

        new Paragraph({ children: [new PageBreak()] }),

        // ========================================
        // SECTION 6: PRESENTACIÓN A TAYLOR
        // ========================================
        heading2("6. PRESENTACI\u00D3N A TAYLOR (27 Mar)"),
        para([tr("PRIORIDAD: ", { bold: true, color: RED }), tr("Alinear formato, roles y objetivo")]),
        spacer(40),

        heading3("Preguntas para definir"),
        bullet([tr("\u00BFQu\u00E9 formato?", { bold: true }), tr(" Recomendaci\u00F3n: screenshare del Interactive Pitch + live demo de Tay (chatbot)")]),
        bullet([tr("\u00BFQui\u00E9n presenta qu\u00E9?", { bold: true })]),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 }, spacing: { after: 60 },
          children: [tr("Ferm\u00EDn: lidera la narrativa, presenta el problema ($1.6-2.85M de fricci\u00F3n), la soluci\u00F3n (Digital Backbone), los pr\u00F3ximos pasos")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 }, spacing: { after: 60 },
          children: [tr("Agust\u00EDn: en la call para preguntas t\u00E9cnicas (ClickUp, automations, tech audit)")]
        }),
        bullet([tr("\u00BFQu\u00E9 queremos que salga de la reuni\u00F3n?", { bold: true })]),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 }, spacing: { after: 60 },
          children: [tr("Objetivo m\u00EDnimo: verbal \u201Cgo\u201D + timeline para firmar contrato")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 }, spacing: { after: 60 },
          children: [tr("Objetivo ideal: \u201CMand\u00E9nnos el contrato\u201D")]
        }),
        bullet([tr("\u00BFLlevamos pricing visible o lo dejamos para despu\u00E9s?", { bold: true })]),
        bullet([tr("\u00BFPedimos algo a Taylor antes de la call?", { bold: true }), tr(" (NDA firmado, lista de stakeholders, acceso a ClickUp)")]),
        spacer(60),

        heading3("Estructura sugerida de la presentaci\u00F3n (45-60 min)"),
        new Table({
          width: { size: CONTENT_W, type: WidthType.DXA },
          columnWidths: [1200, 2400, 3426, 2000],
          rows: [
            new TableRow({ children: [
              headerCell("TIEMPO", 1200), headerCell("BLOQUE", 2400), headerCell("CONTENIDO", 3426), headerCell("QUI\u00C9N", 2000)
            ]}),
            new TableRow({ children: [
              cell(tr("5 min"), 1200), cell(tr("Apertura", { bold: true }), 2400),
              cell(tr("Agradecer, contexto, agenda de la reuni\u00F3n"), 3426), cell(tr("Ferm\u00EDn"), 2000)
            ]}),
            new TableRow({ children: [
              cell(tr("10 min"), 1200, { shading: GRAY_BG }), cell(tr("El problema", { bold: true }), 2400, { shading: GRAY_BG }),
              cell(tr("$1.6-2.85M en fricci\u00F3n operativa. Datos de las entrevistas iniciales. Costo de no hacer nada"), 3426, { shading: GRAY_BG }),
              cell(tr("Ferm\u00EDn"), 2000, { shading: GRAY_BG })
            ]}),
            new TableRow({ children: [
              cell(tr("15 min"), 1200), cell(tr("Digital Backbone", { bold: true }), 2400),
              cell(tr("Create-Build-Execute. Visualizaci\u00F3n SVG. C\u00F3mo conecta lo que ya tienen (ClickUp, M365, Gemini)"), 3426),
              cell(tr("Ferm\u00EDn + Agus"), 2000)
            ]}),
            new TableRow({ children: [
              cell(tr("5 min"), 1200, { shading: GRAY_BG }), cell(tr("Demo Tay", { bold: true }), 2400, { shading: GRAY_BG }),
              cell(tr("Live demo del chatbot. Muestra capacidad t\u00E9cnica y personalizaci\u00F3n"), 3426, { shading: GRAY_BG }),
              cell(tr("Agus"), 2000, { shading: GRAY_BG })
            ]}),
            new TableRow({ children: [
              cell(tr("10 min"), 1200), cell(tr("Pr\u00F3ximos pasos", { bold: true }), 2400),
              cell(tr("INTAKE vs INTAKE+DISCOVERY. Timeline. Pricing. Qu\u00E9 necesitamos de Taylor"), 3426),
              cell(tr("Ferm\u00EDn"), 2000)
            ]}),
            new TableRow({ children: [
              cell(tr("10 min"), 1200, { shading: GRAY_BG }), cell(tr("Q&A", { bold: true }), 2400, { shading: GRAY_BG }),
              cell(tr("Preguntas abiertas. Escuchar preocupaciones. Confirmar next steps"), 3426, { shading: GRAY_BG }),
              cell(tr("Ambos"), 2000, { shading: GRAY_BG })
            ]}),
          ]
        }),
        spacer(60),

        recBox(
          "Mostrar pricing en la presentaci\u00F3n. No esconderlo.",
          "Taylor ya vio los n\u00FAmeros en la propuesta escrita (si la recibieron). Esconder el pricing genera desconfianza. Mostrarlo con confianza, enmarcado en el ROI ($18K = 1% del problema de $1.6M), es la mejor postura. La transparencia cierra deals m\u00E1s r\u00E1pido que la ambig\u00FCedad."
        ),

        new Paragraph({ children: [new PageBreak()] }),

        // ========================================
        // SECTION 7: HERRAMIENTAS
        // ========================================
        heading2("7. HERRAMIENTAS \u2014 Decisi\u00F3n r\u00E1pida"),
        para([tr("PRIORIDAD: ", { bold: true }), tr("Baja. 30 minutos de setup cada una")]),
        spacer(40),

        new Table({
          width: { size: CONTENT_W, type: WidthType.DXA },
          columnWidths: [2000, 2500, 2500, 2026],
          rows: [
            new TableRow({ children: [
              headerCell("HERRAMIENTA", 2000), headerCell("RECOMENDACI\u00D3N", 2500),
              headerCell("POR QU\u00C9", 2500), headerCell("COSTO", 2026)
            ]}),
            new TableRow({ children: [
              cell(tr("Project Management", { bold: true }), 2000),
              cell(tr("ClickUp", { bold: true, color: PURPLE }), 2500),
              cell(tr("Practicamos lo que predicamos. Nos da expertise profunda para el audit de Taylor"), 2500),
              cell(tr("Free tier"), 2026)
            ]}),
            new TableRow({ children: [
              cell(tr("Time Tracking", { bold: true }), 2000, { shading: GRAY_BG }),
              cell(tr("Toggl", { bold: true, color: PURPLE }), 2500, { shading: GRAY_BG }),
              cell(tr("Simple, gratis, reportes claros. Necesario para calcular m\u00E1rgenes reales"), 2500, { shading: GRAY_BG }),
              cell(tr("Free tier"), 2026, { shading: GRAY_BG })
            ]}),
            new TableRow({ children: [
              cell(tr("Docs / Storage", { bold: true }), 2000),
              cell(tr("Google Drive"), 2500),
              cell(tr("Ya lo usamos. Compartir deliverables con Taylor v\u00EDa links controlados"), 2500),
              cell(tr("Free"), 2026)
            ]}),
            new TableRow({ children: [
              cell(tr("Facturaci\u00F3n", { bold: true }), 2000, { shading: GRAY_BG }),
              cell(tr("Wise Business"), 2500, { shading: GRAY_BG }),
              cell(tr("Recibe USD con comisiones bajas (~0.5%). Emite facturas. Abre en 48hrs"), 2500, { shading: GRAY_BG }),
              cell(tr("~$30/a\u00F1o"), 2026, { shading: GRAY_BG })
            ]}),
          ]
        }),
        spacer(120),

        // ========================================
        // RESUMEN DE DECISIONES
        // ========================================
        heading2("RESUMEN: LAS 3 QUE NO PUEDEN QUEDAR SIN DEFINIR"),
        spacer(40),

        new Table({
          width: { size: CONTENT_W, type: WidthType.DXA },
          columnWidths: [500, 3500, 3000, 2026],
          rows: [
            new TableRow({ children: [
              headerCell("#", 500), headerCell("DECISI\u00D3N", 3500),
              headerCell("POR QU\u00C9 ES BLOQUEANTE", 3000), headerCell("DEADLINE", 2026)
            ]}),
            new TableRow({ children: [
              cell([new Paragraph({ alignment: AlignmentType.CENTER, children: [tr("1", { bold: true, size: 24, color: RED })] })], 500),
              cell(tr("Qui\u00E9n firma y con qu\u00E9 entidad", { bold: true }), 3500),
              cell(tr("Sin entidad no hay contrato, sin contrato no hay engagement"), 3000),
              cell(tr("Hoy"), 2026)
            ]}),
            new TableRow({ children: [
              cell([new Paragraph({ alignment: AlignmentType.CENTER, children: [tr("2", { bold: true, size: 24, color: RED })] })], 500, { shading: GRAY_BG }),
              cell(tr("Divisi\u00F3n de roles confirmada", { bold: true }), 3500, { shading: GRAY_BG }),
              cell(tr("Sin roles claros no hay plan de delivery. Taylor pregunta \u201Cqui\u00E9n hace qu\u00E9\u201D"), 3000, { shading: GRAY_BG }),
              cell(tr("Hoy"), 2026, { shading: GRAY_BG })
            ]}),
            new TableRow({ children: [
              cell([new Paragraph({ alignment: AlignmentType.CENTER, children: [tr("3", { bold: true, size: 24, color: RED })] })], 500),
              cell(tr("Objetivo de la presentaci\u00F3n del 27", { bold: true }), 3500),
              cell(tr("Sin objetivo claro vamos a improvisar. Con objetivo, cada minuto trabaja a favor"), 3000),
              cell(tr("Hoy"), 2026)
            ]}),
          ]
        }),
        spacer(200),

        // Closing
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 },
          border: { top: { style: BorderStyle.SINGLE, size: 2, color: PURPLE, space: 12 } },
          children: [tr("Documento generado por TransformAZ CEO Review \u2014 23 de marzo de 2026", { size: 16, color: "999999", italics: true })]
        }),
      ]
    }
  ]
});

// Generate
Packer.toBuffer(doc).then(buffer => {
  const outPath = '/Users/aguspereyra/Desktop/TransformAZ/Taylor Group/TransformAZ-Agenda-Fermin-Pre-Taylor.docx';
  fs.writeFileSync(outPath, buffer);
  console.log(`DOCX generated: ${outPath}`);
});
