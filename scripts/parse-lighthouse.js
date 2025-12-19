const fs = require('fs');

const routes = [
  { name: 'Homepage', file: 'lighthouse-home.json' },
  { name: '/listings', file: 'lighthouse-listings.json' },
  { name: '/sell', file: 'lighthouse-sell.json' },
  { name: '/category/drivers', file: 'lighthouse-category.json' },
  { name: '/sign-in', file: 'lighthouse-signin.json' }
];

console.log('');
console.log('=== LIGHTHOUSE AUDIT RESULTS - deploy/v1.1 ===');
console.log('');

const getEmoji = (score) => {
  if (score >= 90) return '🟢';
  if (score >= 50) return '🟠';
  return '🔴';
};

console.log('| Route              | Perf | A11y | Best | SEO  | FCP    | LCP    | CLS   |');
console.log('|--------------------|------|------|------|------|--------|--------|-------|');

routes.forEach(route => {
  try {
    const report = JSON.parse(fs.readFileSync(route.file));
    const perf = Math.round(report.categories.performance.score * 100);
    const a11y = Math.round(report.categories.accessibility.score * 100);
    const bp = Math.round(report.categories['best-practices'].score * 100);
    const seo = Math.round(report.categories.seo.score * 100);
    
    const fcp = report.audits['first-contentful-paint'].displayValue || 'N/A';
    const lcp = report.audits['largest-contentful-paint'].displayValue || 'N/A';
    const cls = report.audits['cumulative-layout-shift'].displayValue || 'N/A';
    
    const name = route.name.padEnd(18);
    console.log(`| ${name} | ${getEmoji(perf)}${perf.toString().padStart(2)} | ${getEmoji(a11y)}${a11y.toString().padStart(2)} | ${getEmoji(bp)}${bp.toString().padStart(2)} | ${getEmoji(seo)}${seo.toString().padStart(2)} | ${fcp.padStart(6)} | ${lcp.padStart(6)} | ${cls.padStart(5)} |`);
  } catch (e) {
    console.log(`| ${route.name.padEnd(18)} | ERROR: ${e.message.substring(0, 50)} |`);
  }
});

console.log('');
console.log('Legend: 🟢 90+ | 🟠 50-89 | 🔴 <50');
console.log('');

// Show top issues per route
console.log('=== TOP ISSUES BY ROUTE ===');
console.log('');

routes.forEach(route => {
  try {
    const report = JSON.parse(fs.readFileSync(route.file));
    console.log(`--- ${route.name} ---`);
    
    // Get failed audits sorted by impact
    const failedAudits = Object.values(report.audits)
      .filter(a => a.score !== null && a.score < 0.9 && a.details?.type === 'opportunity')
      .sort((a, b) => (b.numericValue || 0) - (a.numericValue || 0))
      .slice(0, 3);
    
    if (failedAudits.length === 0) {
      console.log('  No major opportunities found');
    } else {
      failedAudits.forEach(audit => {
        console.log(`  - ${audit.title}: ${audit.displayValue || 'No value'}`);
      });
    }
    console.log('');
  } catch (e) {
    // skip
  }
});
