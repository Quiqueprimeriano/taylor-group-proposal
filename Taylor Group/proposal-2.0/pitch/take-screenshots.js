const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const sections = [
  { id: 'cover',            name: '00-cover' },
  { id: 'opportunity',      name: '01-opportunity' },
  { id: 'paradigm',         name: '02-paradigm' },
  { id: 'findings',         name: '03-findings' },
  { id: 'backbone',         name: '04-backbone' },
  { id: 'transformation',   name: '05-transformation' },
  { id: 'market',           name: '06-market' },
  { id: 'next-steps',       name: '07-next-steps' },
  { id: 'intake-proposal',  name: '08-intake-proposal' },
  { id: 'references',       name: '09-references' },
];

(async () => {
  const outDir = path.resolve(__dirname, 'screenshots');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,          // 2x for high-res Figma import
  });

  const htmlPath = path.resolve(__dirname, 'Taylor-Group-Interactive-Pitch.html');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });

  // Wait for cover animations to settle
  await page.waitForTimeout(3000);

  // Trigger all scroll animations by scrolling to bottom and back
  await page.evaluate(async () => {
    const delay = ms => new Promise(r => setTimeout(r, ms));
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await delay(300);
    }
    window.scrollTo(0, 0);
    await delay(500);
  });

  for (const { id, name } of sections) {
    const el = page.locator(`#${id}`);
    const box = await el.boundingBox();
    if (!box) { console.error(`✘ #${id} not found`); continue; }

    await el.screenshot({ path: path.join(outDir, `${name}.png`) });
    console.log(`✔ ${name}.png`);
  }

  // Full-page screenshot as bonus
  await page.screenshot({
    path: path.join(outDir, 'full-page.png'),
    fullPage: true,
  });
  console.log('✔ full-page.png');

  await browser.close();
  console.log(`\nDone — ${sections.length + 1} screenshots saved to ${outDir}`);
})();
