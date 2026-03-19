const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const files = [
    { input: 'Taylor-Group-Proposals.html', output: 'Taylor-Group-Proposals.pdf' },
    { input: 'Internal-Breakdown-Taylor-Group.html', output: 'Internal-Breakdown-Taylor-Group.pdf' },
  ];

  const browser = await chromium.launch();

  for (const file of files) {
    const page = await browser.newPage();
    const htmlPath = path.resolve(__dirname, file.input);
    const pdfPath = path.resolve(__dirname, file.output);

    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      preferCSSPageSize: true,
    });

    await page.close();
    console.log(`PDF generated: ${pdfPath}`);
  }

  await browser.close();
  console.log('Done.');
})();
