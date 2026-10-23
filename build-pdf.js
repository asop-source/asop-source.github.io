// Regenerates Asop-CV.pdf from index.html (A4, same layout as the print view)
// and Asop-CV-ATS.pdf from cv-ats.html (plain one-column version).
// Also writes cv-preview-1.jpg for the on-page preview (needs pdftoppm from poppler-utils).
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
  // plain one-column version for online job portals (ATS)
  await page.goto('file://' + path.join(__dirname, 'cv-ats.html'));
  await page.pdf({ path: path.join(__dirname, 'Asop-CV-ATS.pdf'), preferCSSPageSize: true });
  await browser.close();
  // drop previews left over from an earlier, longer PDF
  for (const f of require('fs').readdirSync(__dirname)) if (/^cv-preview-\d+\.jpg$/.test(f)) require('fs').unlinkSync(path.join(__dirname, f));
  execFileSync('pdftoppm', ['-r', '150', '-jpeg', '-jpegopt', 'quality=85', path.join(__dirname, 'Asop-CV.pdf'), path.join(__dirname, 'cv-preview')]);
})();
