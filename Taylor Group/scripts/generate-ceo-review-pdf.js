const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Simple Markdown to HTML converter (handles tables, headers, lists, code blocks, bold, emphasis)
function mdToHtml(md) {
  // Remove YAML frontmatter
  md = md.replace(/^---[\s\S]*?---\n*/, '');

  const lines = md.split('\n');
  let html = '';
  let inTable = false;
  let inCodeBlock = false;
  let inList = false;
  let tableRows = [];
  let listItems = [];

  function flushList() {
    if (inList && listItems.length) {
      html += '<ul>' + listItems.join('') + '</ul>\n';
      listItems = [];
      inList = false;
    }
  }

  function flushTable() {
    if (inTable && tableRows.length) {
      html += '<div class="table-wrap"><table>\n';
      tableRows.forEach((row, i) => {
        const tag = i === 0 ? 'th' : 'td';
        const cells = row.split('|').filter(c => c.trim() !== '');
        if (cells.length === 0) return;
        // Skip separator rows (---|---|---)
        if (cells.every(c => /^[\s\-:]+$/.test(c))) return;
        html += '<tr>' + cells.map(c => `<${tag}>${inlineFormat(c.trim())}</${tag}>`).join('') + '</tr>\n';
      });
      html += '</table></div>\n';
      tableRows = [];
      inTable = false;
    }
  }

  function inlineFormat(text) {
    // Bold + italic
    text = text.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    // Bold
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italic
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // Inline code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Strikethrough
    text = text.replace(/~~(.+?)~~/g, '<del>$1</del>');
    return text;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        html += '</code></pre>\n';
        inCodeBlock = false;
      } else {
        flushList();
        flushTable();
        inCodeBlock = true;
        html += '<pre><code>';
      }
      continue;
    }
    if (inCodeBlock) {
      html += line.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '\n';
      continue;
    }

    // Tables
    if (line.includes('|') && line.trim().startsWith('|')) {
      flushList();
      if (!inTable) inTable = true;
      tableRows.push(line);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Headers
    const headerMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (headerMatch) {
      flushList();
      const level = headerMatch[1].length;
      const text = inlineFormat(headerMatch[2]);
      html += `<h${level}>${text}</h${level}>\n`;
      continue;
    }

    // List items (- or *)
    const listMatch = line.match(/^(\s*)-\s+(.+)/);
    if (listMatch) {
      if (!inList) inList = true;
      // Checkbox handling
      let content = listMatch[2];
      content = content.replace(/\[ \]/g, '&#9744;').replace(/\[x\]/g, '&#9745;');
      listItems.push(`<li>${inlineFormat(content)}</li>`);
      continue;
    }

    // Numbered list
    const numListMatch = line.match(/^(\s*)\d+\.\s+(.+)/);
    if (numListMatch) {
      flushList();
      if (!inList) {
        inList = true;
        // Switch to ordered list
      }
      listItems.push(`<li>${inlineFormat(numListMatch[2])}</li>`);
      continue;
    }

    // Blockquote
    if (line.startsWith('>')) {
      flushList();
      html += `<blockquote>${inlineFormat(line.replace(/^>\s*/, ''))}</blockquote>\n`;
      continue;
    }

    // Horizontal rule
    if (/^[-*_]{3,}\s*$/.test(line.trim())) {
      flushList();
      html += '<hr>\n';
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      flushList();
      continue;
    }

    // Paragraph
    flushList();
    html += `<p>${inlineFormat(line)}</p>\n`;
  }

  flushList();
  flushTable();
  if (inCodeBlock) html += '</code></pre>\n';

  return html;
}

function wrapHtml(bodyHtml, title) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  @page {
    size: A4;
    margin: 20mm 18mm 20mm 18mm;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 9.5pt;
    line-height: 1.55;
    color: #1a1a2e;
    background: #fff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  h1 {
    font-family: 'Source Serif 4', Georgia, serif;
    font-size: 20pt;
    font-weight: 700;
    color: #7A7AE6;
    margin: 0 0 6pt 0;
    padding-bottom: 6pt;
    border-bottom: 2.5pt solid #7A7AE6;
    page-break-after: avoid;
  }

  h2 {
    font-family: 'Source Serif 4', Georgia, serif;
    font-size: 14pt;
    font-weight: 600;
    color: #c0392b;
    margin: 18pt 0 6pt 0;
    padding-bottom: 3pt;
    border-bottom: 1pt solid #e0d6d6;
    page-break-after: avoid;
  }

  h3 {
    font-family: 'Inter', sans-serif;
    font-size: 11pt;
    font-weight: 700;
    color: #2c2c54;
    margin: 14pt 0 4pt 0;
    page-break-after: avoid;
  }

  h4 {
    font-family: 'Inter', sans-serif;
    font-size: 10pt;
    font-weight: 600;
    color: #474787;
    margin: 10pt 0 3pt 0;
    page-break-after: avoid;
  }

  p {
    margin: 0 0 6pt 0;
    text-align: left;
  }

  strong { font-weight: 600; }

  code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5pt;
    background: #f4f3ff;
    padding: 1pt 3pt;
    border-radius: 2pt;
    color: #474787;
  }

  pre {
    background: #1a1a2e;
    color: #e8e8f0;
    padding: 10pt 12pt;
    border-radius: 4pt;
    margin: 6pt 0 10pt 0;
    overflow-x: auto;
    font-size: 8pt;
    line-height: 1.5;
    page-break-inside: avoid;
  }

  pre code {
    background: none;
    padding: 0;
    color: inherit;
    font-size: inherit;
  }

  .table-wrap {
    margin: 6pt 0 10pt 0;
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 8.5pt;
    page-break-inside: auto;
  }

  th {
    background: #7A7AE6;
    color: #fff;
    font-weight: 600;
    text-align: left;
    padding: 5pt 6pt;
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.3pt;
  }

  td {
    padding: 4pt 6pt;
    border-bottom: 0.5pt solid #e8e8f0;
    vertical-align: top;
  }

  tr:nth-child(even) td {
    background: #fafafe;
  }

  ul, ol {
    margin: 4pt 0 8pt 16pt;
    padding: 0;
  }

  li {
    margin: 2pt 0;
  }

  blockquote {
    border-left: 3pt solid #7A7AE6;
    margin: 6pt 0;
    padding: 4pt 10pt;
    background: #f9f8ff;
    color: #474787;
    font-style: italic;
  }

  hr {
    border: none;
    border-top: 1pt solid #e0d6d6;
    margin: 14pt 0;
  }

  /* Warning/alert styling for lines starting with warning emoji */
  p:has(strong:first-child) {
    margin-top: 2pt;
  }

  /* Page break hints */
  h2 { page-break-before: auto; }
  h1 + *, h2 + *, h3 + * { page-break-before: avoid; }
  table, pre, blockquote { page-break-inside: avoid; }

  /* Cover area */
  .meta {
    color: #888;
    font-size: 8pt;
    margin-bottom: 12pt;
  }
</style>
</head>
<body>
${bodyHtml}
</body>
</html>`;
}

(async () => {
  const ceoMdPath = path.resolve(
    process.env.HOME,
    '.gstack/projects/Quiqueprimeriano-taylor-group-proposal/ceo-plans/2026-03-23-operational-readiness.md'
  );
  const todosMdPath = path.resolve('/Users/aguspereyra/Desktop/TransformAZ/TODOS.md');
  const outputDir = '/Users/aguspereyra/Desktop/TransformAZ/Taylor Group';

  const files = [
    {
      mdPath: ceoMdPath,
      title: 'CEO Plan — TransformAZ Operational Readiness',
      outputName: 'TransformAZ-CEO-Plan-Operational-Readiness.pdf',
    },
    {
      mdPath: todosMdPath,
      title: 'TODOS — TransformAZ',
      outputName: 'TransformAZ-TODOS.pdf',
    },
  ];

  const browser = await chromium.launch();

  for (const file of files) {
    const md = fs.readFileSync(file.mdPath, 'utf-8');
    const bodyHtml = mdToHtml(md);
    const fullHtml = wrapHtml(bodyHtml, file.title);

    // Write temp HTML
    const tmpHtml = path.join(outputDir, file.outputName.replace('.pdf', '.tmp.html'));
    fs.writeFileSync(tmpHtml, fullHtml);

    const page = await browser.newPage();
    await page.goto(`file://${tmpHtml}`, { waitUntil: 'networkidle' });

    // Wait for fonts to load
    await page.waitForTimeout(1500);

    const pdfPath = path.join(outputDir, file.outputName);
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', right: '18mm', bottom: '20mm', left: '18mm' },
    });

    await page.close();
    // Clean up temp HTML
    fs.unlinkSync(tmpHtml);
    console.log(`PDF generated: ${pdfPath}`);
  }

  await browser.close();
  console.log('Done.');
})();
