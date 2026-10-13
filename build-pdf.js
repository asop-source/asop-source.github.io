// Regenerates Asop-CV.pdf from index.html (A4, same layout as the print view).
// Run: node build-pdf.js
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('file://' + path.join(__dirname, 'index.html'));
  await page.waitForLoadState('networkidle');
  await page.pdf({ path: path.join(__dirname, 'Asop-CV.pdf'), preferCSSPageSize: true, printBackground: true });
  await browser.close();
})();
