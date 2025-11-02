#!/usr/bin/env node

/**
 * Tamagui Component Usage and Styling Audit Script
 * 
 * This script analyzes the codebase to identify:
 * 1. Hardcoded colors (hex values)
 * 2. Hardcoded spacing/sizing (raw pixel values)
 * 3. Non-themed styling patterns
 * 4. Component usage patterns
 * 5. Token usage vs hardcoded values
 */

const fs = require('fs');
const path = require('path');

const results = {
  hardcodedColors: [],
  hardcodedSizes: [],
  nonThemedStyles: [],
  componentUsage: {},
  tokenUsage: [],
  files: []
};

// Directories to scan
const dirsToScan = [
  'apps/web/src',
  'apps/mobile',
  'packages/app/src',
  'packages/ui/src'
];

// Regex patterns
const hexColorPattern = /#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})\b/g;
const rawSizePattern = /(?:width|height|padding|margin|fontSize|borderRadius|gap|top|left|right|bottom)\s*[=:]\s*["']?(\d+)["']?(?!\$|%)/g;
const tokenUsagePattern = /\$[a-zA-Z0-9]+/g;
const componentImportPattern = /from\s+['"](@buttergolf\/ui|tamagui|@tamagui\/[^'"]+)['"]/g;

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relPath = path.relative(process.cwd(), filePath);
  
  results.files.push(relPath);
  
  // Find hardcoded colors
  let match;
  while ((match = hexColorPattern.exec(content)) !== null) {
    const lineNum = content.substring(0, match.index).split('\n').length;
    results.hardcodedColors.push({
      file: relPath,
      line: lineNum,
      color: match[0],
      context: getLineContext(content, match.index)
    });
  }
  
  // Find hardcoded sizes
  const sizeMatches = content.matchAll(rawSizePattern);
  for (const match of sizeMatches) {
    const lineNum = content.substring(0, match.index).split('\n').length;
    const contextLine = getLineContext(content, match.index);
    
    // Skip if it's actually using tokens or percentages
    if (contextLine.includes('$') || contextLine.includes('%')) continue;
    
    // Skip common patterns like width="100%" that are valid
    if (match[0].includes('"100"') || match[0].includes("'100'")) continue;
    
    results.hardcodedSizes.push({
      file: relPath,
      line: lineNum,
      value: match[0],
      context: contextLine
    });
  }
  
  // Find token usage
  const tokens = content.match(tokenUsagePattern) || [];
  tokens.forEach(token => {
    if (!results.tokenUsage.find(t => t.token === token)) {
      results.tokenUsage.push({ token, count: 1 });
    } else {
      results.tokenUsage.find(t => t.token === token).count++;
    }
  });
  
  // Find component imports
  const imports = content.match(componentImportPattern) || [];
  imports.forEach(imp => {
    const pkg = imp.match(/['"]([^'"]+)['"]/)[1];
    results.componentUsage[pkg] = (results.componentUsage[pkg] || 0) + 1;
  });
}

function getLineContext(content, index) {
  const lines = content.split('\n');
  const lineNum = content.substring(0, index).split('\n').length - 1;
  return lines[lineNum]?.trim() || '';
}

function scanDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, .next, etc.
      if (['node_modules', '.next', '.expo', 'dist', 'build'].includes(item)) {
        continue;
      }
      scanDirectory(fullPath);
    } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts')) && !item.endsWith('.d.ts')) {
      scanFile(fullPath);
    }
  }
}

// Main execution
console.log('🎨 Tamagui Component Usage Audit\n');
console.log('Scanning directories:', dirsToScan.join(', '), '\n');

dirsToScan.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    scanDirectory(fullPath);
  }
});

// Sort and prepare output
results.hardcodedColors.sort((a, b) => a.file.localeCompare(b.file));
results.hardcodedSizes.sort((a, b) => a.file.localeCompare(b.file));
results.tokenUsage.sort((a, b) => b.count - a.count);

// Generate report
console.log('═══════════════════════════════════════════════════════════');
console.log('📊 AUDIT RESULTS');
console.log('═══════════════════════════════════════════════════════════\n');

console.log(`📁 Total files scanned: ${results.files.length}`);
console.log(`🎨 Hardcoded colors found: ${results.hardcodedColors.length}`);
console.log(`📏 Hardcoded sizes found: ${results.hardcodedSizes.length}`);
console.log(`🎯 Unique tokens used: ${results.tokenUsage.length}\n`);

console.log('─────────────────────────────────────────────────────────────');
console.log('🎨 HARDCODED COLORS (Top Issues)');
console.log('─────────────────────────────────────────────────────────────\n');

const colorsByFile = results.hardcodedColors.reduce((acc, item) => {
  if (!acc[item.file]) acc[item.file] = [];
  acc[item.file].push(item);
  return acc;
}, {});

Object.entries(colorsByFile).slice(0, 10).forEach(([file, colors]) => {
  console.log(`📄 ${file} (${colors.length} issues)`);
  colors.slice(0, 3).forEach(c => {
    console.log(`   Line ${c.line}: ${c.color} - ${c.context.substring(0, 60)}...`);
  });
  if (colors.length > 3) {
    console.log(`   ... and ${colors.length - 3} more`);
  }
  console.log('');
});

console.log('─────────────────────────────────────────────────────────────');
console.log('📦 COMPONENT IMPORTS USAGE');
console.log('─────────────────────────────────────────────────────────────\n');

Object.entries(results.componentUsage)
  .sort((a, b) => b[1] - a[1])
  .forEach(([pkg, count]) => {
    console.log(`  ${pkg}: ${count} imports`);
  });

console.log('\n─────────────────────────────────────────────────────────────');
console.log('🎯 TOP TOKENS USED');
console.log('─────────────────────────────────────────────────────────────\n');

results.tokenUsage.slice(0, 20).forEach(({ token, count }) => {
  console.log(`  ${token}: ${count} uses`);
});

console.log('\n═══════════════════════════════════════════════════════════');
console.log('💡 RECOMMENDATIONS');
console.log('═══════════════════════════════════════════════════════════\n');

const recommendations = [];

if (results.hardcodedColors.length > 0) {
  recommendations.push(
    `1. Replace ${results.hardcodedColors.length} hardcoded color values with theme tokens`,
    `   - Add semantic color tokens to tamagui.config.ts`,
    `   - Update components to use $colorName syntax`
  );
}

if (results.hardcodedSizes.length > 0) {
  recommendations.push(
    `2. Replace ${results.hardcodedSizes.length} hardcoded size values with tokens`,
    `   - Use $space tokens for padding/margin`,
    `   - Use $size tokens for width/height`,
    `   - Use $fontSize tokens for text sizes`
  );
}

if (Object.keys(colorsByFile).length > 5) {
  recommendations.push(
    `3. Focus refactoring on these high-priority files:`,
    ...Object.entries(colorsByFile)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 5)
      .map(([file, colors]) => `   - ${file} (${colors.length} issues)`)
  );
}

recommendations.push(
  `4. Create shared component variants for common patterns`,
  `5. Document token usage in TAMAGUI_BEST_PRACTICES.md`
);

recommendations.forEach(rec => console.log(rec));

console.log('\n');

// Write detailed JSON report
const reportPath = path.join(process.cwd(), 'TAMAGUI_AUDIT_REPORT.json');
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
console.log(`📄 Detailed report saved to: TAMAGUI_AUDIT_REPORT.json\n`);
