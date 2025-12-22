const report = require('../lighthouse-report.report.json');

console.log('=== LIGHTHOUSE AUDIT ANALYSIS ===\n');

// Performance opportunities
console.log('--- PERFORMANCE OPPORTUNITIES (sorted by impact) ---');
const opportunities = Object.values(report.audits)
  .filter(a => a.details && a.details.type === 'opportunity' && a.score !== null && a.score < 1)
  .sort((a, b) => ((b.details && b.details.overallSavingsMs) || 0) - ((a.details && a.details.overallSavingsMs) || 0))
  .slice(0, 10);

opportunities.forEach(a => {
  const savings = a.details.overallSavingsMs || 0;
  console.log(`• ${a.title}`);
  console.log(`  Display: ${a.displayValue || 'N/A'}`);
  console.log(`  Potential savings: ${Math.round(savings)}ms`);
  console.log('');
});

console.log('\n--- ACCESSIBILITY ISSUES ---');
const accessibilityAudits = report.categories.accessibility.auditRefs.map(r => r.id);
const a11yIssues = Object.values(report.audits)
  .filter(a => a.score !== null && a.score < 1 && accessibilityAudits.includes(a.id));
a11yIssues.forEach(a => {
  console.log(`• ${a.title} (score: ${Math.round(a.score * 100)})`);
  if (a.details && a.details.items) {
    console.log(`  Affected: ${a.details.items.length} element(s)`);
  }
});

console.log('\n--- BEST PRACTICES ISSUES ---');
const bpAudits = report.categories['best-practices'].auditRefs.map(r => r.id);
const bpIssues = Object.values(report.audits)
  .filter(a => a.score !== null && a.score < 1 && bpAudits.includes(a.id));
bpIssues.forEach(a => {
  console.log(`• ${a.title} (score: ${Math.round(a.score * 100)})`);
  if (a.details && a.details.items) {
    console.log(`  Affected: ${a.details.items.length} item(s)`);
  }
});

console.log('\n--- SEO ISSUES ---');
const seoAudits = report.categories.seo.auditRefs.map(r => r.id);
const seoIssues = Object.values(report.audits)
  .filter(a => a.score !== null && a.score < 1 && seoAudits.includes(a.id));
seoIssues.forEach(a => {
  console.log(`• ${a.title} (score: ${Math.round(a.score * 100)})`);
});

console.log('\n--- LCP (LARGEST CONTENTFUL PAINT) ANALYSIS ---');
const lcpAudit = report.audits['largest-contentful-paint-element'];
if (lcpAudit && lcpAudit.details && lcpAudit.details.items) {
  lcpAudit.details.items.forEach(item => {
    if (item.node) {
      console.log(`LCP Element: ${item.node.nodeLabel || 'unknown'}`);
      console.log(`Selector: ${item.node.selector || 'unknown'}`);
    }
  });
}

// Check for render-blocking resources
console.log('\n--- RENDER-BLOCKING RESOURCES ---');
const renderBlocking = report.audits['render-blocking-resources'];
if (renderBlocking && renderBlocking.details && renderBlocking.details.items) {
  renderBlocking.details.items.forEach(item => {
    console.log(`• ${item.url}`);
    console.log(`  Wasted: ${Math.round(item.wastedMs || 0)}ms`);
  });
}

// Check for unused JavaScript
console.log('\n--- UNUSED JAVASCRIPT ---');
const unusedJs = report.audits['unused-javascript'];
if (unusedJs && unusedJs.details && unusedJs.details.items) {
  unusedJs.details.items.slice(0, 5).forEach(item => {
    console.log(`• ${item.url.split('/').pop()}`);
    console.log(`  Wasted bytes: ${Math.round((item.wastedBytes || 0) / 1024)}KB`);
  });
}

// Check image optimization
console.log('\n--- IMAGE OPTIMIZATION ---');
const imageOptimization = report.audits['uses-optimized-images'];
if (imageOptimization && imageOptimization.details && imageOptimization.details.items) {
  imageOptimization.details.items.forEach(item => {
    console.log(`• ${item.url}`);
    console.log(`  Potential savings: ${Math.round((item.wastedBytes || 0) / 1024)}KB`);
  });
}

const modernImages = report.audits['modern-image-formats'];
if (modernImages && modernImages.details && modernImages.details.items) {
  console.log('\nImages that could use modern formats (WebP/AVIF):');
  modernImages.details.items.slice(0, 5).forEach(item => {
    console.log(`• ${item.url.split('/').pop()}`);
    console.log(`  Potential savings: ${Math.round((item.wastedBytes || 0) / 1024)}KB`);
  });
}

// Check aspect ratio issues
console.log('\n=== IMAGE ASPECT RATIO ISSUES ===');
const aspectRatio = report.audits['image-aspect-ratio'];
if (aspectRatio && aspectRatio.details && aspectRatio.details.items) {
  aspectRatio.details.items.forEach(item => {
    console.log('Image URL:', item.url);
    console.log('Display Size:', item.displayedWidth + 'x' + item.displayedHeight);
    console.log('Actual Size:', item.actualWidth + 'x' + item.actualHeight);
    console.log('');
  });
} else {
  console.log('No aspect ratio issues found');
}

// Check color contrast issues
console.log('\n=== COLOR CONTRAST ISSUES (first 10) ===');
const contrast = report.audits['color-contrast'];
if (contrast && contrast.details && contrast.details.items) {
  contrast.details.items.slice(0, 10).forEach((item, i) => {
    if (item.node) {
      console.log((i+1) + '. Element:', item.node.nodeLabel || item.node.snippet);
      console.log('   Selector:', item.node.selector);
    }
  });
} else {
  console.log('No contrast issues found');
}

// Check ARIA issues
console.log('\n=== ARIA PROHIBITED ATTRIBUTE ISSUES ===');
const aria = report.audits['aria-prohibited-attr'];
if (aria && aria.details && aria.details.items) {
  aria.details.items.forEach((item, i) => {
    if (item.node) {
      console.log((i+1) + '. Element:', item.node.snippet);
      console.log('   Selector:', item.node.selector);
    }
  });
} else {
  console.log('No ARIA issues found');
}

console.log('\n=== SUMMARY ===');
console.log(`Performance Score: ${Math.round(report.categories.performance.score * 100)}`);
console.log(`Accessibility Score: ${Math.round(report.categories.accessibility.score * 100)}`);
console.log(`Best Practices Score: ${Math.round(report.categories['best-practices'].score * 100)}`);
console.log(`SEO Score: ${Math.round(report.categories.seo.score * 100)}`);
