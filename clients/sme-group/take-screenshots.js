const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 }
  });

  const htmlPath = path.resolve(__dirname, 'SME-Group-Transformation-Proposal.html');
  const outDir = path.resolve(__dirname, 'screenshots');

  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });

  // 1. cover.png — screenshot of the .cover element
  const cover = await page.locator('.cover');
  await cover.screenshot({ path: path.join(outDir, 'cover.png') });
  console.log('✔ cover.png');

  // 2. section-exec.png — screenshot of #executive-summary
  const exec = await page.locator('#executive-summary');
  await exec.screenshot({ path: path.join(outDir, 'section-exec.png') });
  console.log('✔ section-exec.png');

  // 3. section-approach.png — screenshot of #approach
  const approach = await page.locator('#approach');
  await approach.screenshot({ path: path.join(outDir, 'section-approach.png') });
  console.log('✔ section-approach.png');

  // 4. section-investment.png — screenshot of #investment
  const investment = await page.locator('#investment');
  await investment.screenshot({ path: path.join(outDir, 'section-investment.png') });
  console.log('✔ section-investment.png');

  // 5. section-nextsteps.png — #next-steps and .closing combined
  // Use bounding boxes to capture the combined area via a full-page screenshot
  const nextSteps = await page.locator('#next-steps');
  const closing = await page.locator('.closing');

  const nsBox = await nextSteps.boundingBox();
  const clBox = await closing.boundingBox();

  if (nsBox && clBox) {
    const x = Math.min(nsBox.x, clBox.x);
    const y = Math.min(nsBox.y, clBox.y);
    const right = Math.max(nsBox.x + nsBox.width, clBox.x + clBox.width);
    const bottom = Math.max(nsBox.y + nsBox.height, clBox.y + clBox.height);

    await page.screenshot({
      path: path.join(outDir, 'section-nextsteps.png'),
      fullPage: true,
      clip: { x, y, width: right - x, height: bottom - y }
    });
    console.log('✔ section-nextsteps.png');
  } else {
    console.error('Could not find bounding boxes for #next-steps or .closing');
  }

  await browser.close();
  console.log('Done — all screenshots saved to', outDir);
})();
