// Regenerates Asop-CV.pdf from index.html (A4, same layout as the print view).
// Also writes cv-preview-1.jpg / cv-preview-2.jpg for the on-page preview (needs pdftoppm from poppler-utils).
// Run: node build-pdf.js
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('file://' + path.join(__dirname, 'index.html'));
  await page.waitForLoadState('networkidle');
  await page.pdf({ path: path.join(__dirname, 'Asop-CV.pdf'), preferCSSPageSize: true, printBackground: true });
  await browser.close();
  execFileSync('pdftoppm', ['-r', '150', '-jpeg', '-jpegopt', 'quality=85', path.join(__dirname, 'Asop-CV.pdf'), path.join(__dirname, 'cv-preview')]);
})();
