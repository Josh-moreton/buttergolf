# Lighthouse Quality Improvement Plan

## Current Baseline (Preview URL)

| Category | Score | Status |
|----------|-------|--------|
| Performance | 66 | 🟠 Needs Work |
| Accessibility | 92 | 🟢 Good |
| Best Practices | 73 | 🟠 Needs Work |
| SEO | 66 | 🟠 Needs Work |

### Core Web Vitals

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| LCP (Largest Contentful Paint) | 10.8s | <2.5s | 🔴 Poor |
| FCP (First Contentful Paint) | 2.1s | <1.8s | 🟠 Needs Work |
| TBT (Total Blocking Time) | 80ms | <200ms | 🟢 Good |
| CLS (Cumulative Layout Shift) | 0 | <0.1 | 🟢 Excellent |
| Speed Index | 7.2s | <3.4s | 🔴 Poor |

---

## Priority 1: Critical Performance Issues 🔴

### 1.1 Fix Page Redirects (Est. savings: 2,030ms)

**Problem:** Multiple redirects detected on page load.

**Investigation needed:**
- Check Vercel redirect configuration
- Check Next.js middleware/proxy for unnecessary redirects
- Verify trailing slash handling

**Action items:**
```bash
# Verify redirects in vercel.json
cat apps/web/vercel.json

# Check proxy.ts for redirect logic
cat apps/web/src/proxy.ts
```

### 1.2 Reduce Unused JavaScript (Est. savings: 1,700ms / 363 KiB)

**Problem:** Large JS bundles being loaded but not fully used.

**Major offenders:**
| Bundle | Wasted |
|--------|--------|
| 1090-*.js | 87KB |
| Clerk UI common | 84KB |
| 753-*.js | 70KB |
| clerk.browser.js | 56KB |
| Clerk vendors | 44KB |

**Action items:**

1. **Lazy-load Clerk components**
   ```tsx
   // Instead of importing at top level
   import { SignInButton, UserButton } from "@clerk/nextjs";
   
   // Use dynamic imports
   import dynamic from "next/dynamic";
   const SignInButton = dynamic(() => import("@clerk/nextjs").then(m => m.SignInButton));
   const UserButton = dynamic(() => import("@clerk/nextjs").then(m => m.UserButton));
   ```

2. **Analyze bundle composition**
   ```bash
   cd apps/web && ANALYZE=true pnpm build
   ```
   Add to next.config.ts:
   ```js
   const withBundleAnalyzer = require("@next/bundle-analyzer")({
     enabled: process.env.ANALYZE === "true",
   });
   ```

3. **Code-split heavy routes**
   - Use `next/dynamic` for below-the-fold components
   - Defer non-critical third-party scripts

---

## Priority 2: SEO Issue 🔴

### 2.1 Page is Blocked from Indexing

**Problem:** The preview URL is blocked from search engine indexing.

**This is actually CORRECT for preview URLs!** Vercel preview deployments should not be indexed.

**Action for production:**
- Ensure production domain does NOT have `noindex`
- Verify `robots.txt` allows indexing on production
- Check `<meta name="robots">` tag is only `noindex` on non-production

**Verify current setup:**
```bash
# Check robots.txt
cat apps/web/public/robots.txt

# Check for meta robots tag in layout
grep -r "robots" apps/web/src/app/layout.tsx
```

---

## Priority 3: Accessibility Issues 🟠

### 3.1 Prohibited ARIA Attributes (5 elements)

**Problem:** Elements using ARIA attributes that are not valid for their role.

**Action items:**
1. Run audit to identify specific elements
2. Check Tamagui components for incorrect ARIA usage
3. Common fixes:
   - Remove `aria-*` from elements that don't need them
   - Ensure role matches allowed ARIA attributes

### 3.2 Color Contrast Issues (22 elements)

**Problem:** Text doesn't have sufficient contrast against background.

**Known areas to check:**
- Light text on light backgrounds
- Secondary/muted text colors
- Buttons and interactive elements

**Action items:**
1. Review `$textSecondary` and `$textMuted` token contrast ratios
2. Ensure 4.5:1 ratio for normal text, 3:1 for large text
3. Use Chrome DevTools color picker to verify

**Quick wins:**
```tsx
// In tamagui.config.ts, darken muted text colors
$textMuted: '#666666'  // Ensure 4.5:1 against white
$textSecondary: '#4A4A4A'  // Darker for better contrast
```

---

## Priority 4: Best Practices Issues 🟠

### 4.1 Incorrect Image Aspect Ratios (5 images)

**Problem:** Images displayed at different aspect ratios than source.

**Action items:**
1. Add explicit `width` and `height` to all `<Image>` components
2. Use `objectFit="cover"` or `objectFit="contain"` appropriately
3. Ensure Cloudinary transformations match display size

### 4.2 Third-Party Cookies (2 items)

**Problem:** Third-party cookies being set (likely by Clerk/analytics).

**Action items:**
1. Audit third-party scripts
2. Consider cookie consent banner if needed
3. Review Clerk cookie configuration

### 4.3 Missing Source Maps

**Problem:** Source maps missing for debugging.

**Action items:**
Add to `next.config.ts`:
```js
productionBrowserSourceMaps: true,
```

Note: This increases bundle size. Consider only for debugging.

---

## Implementation Roadmap

### Phase 1: Quick Wins (This PR) ⏱️ 1 hour

- [ ] Add explicit image dimensions to prevent aspect ratio issues
- [ ] Verify SEO meta tags are correct for production
- [ ] Add bundle analyzer for investigation

### Phase 2: Performance Deep Dive ⏱️ 2-3 hours

- [ ] Investigate and fix redirect chain
- [ ] Lazy-load Clerk components
- [ ] Dynamic import below-the-fold components
- [ ] Analyze bundle with `@next/bundle-analyzer`

### Phase 3: Accessibility Polish ⏱️ 1-2 hours

- [ ] Fix ARIA attribute violations
- [ ] Adjust color contrast for muted text
- [ ] Add proper labels to interactive elements

### Phase 4: Ongoing Monitoring

- [ ] Add Lighthouse CI to GitHub Actions
- [ ] Set performance budgets
- [ ] Monitor Core Web Vitals in Vercel Analytics

---

## Lighthouse CI Integration

Add to `.github/workflows/lighthouse.yml`:

```yaml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install -g @lhci/cli
      - run: lhci autorun
```

Add `lighthouserc.js`:
```js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      startServerCommand: 'pnpm dev:web',
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

---

## Target Scores

| Category | Current | Target | Goal Date |
|----------|---------|--------|-----------|
| Performance | 66 | 90+ | 2 weeks |
| Accessibility | 92 | 100 | 1 week |
| Best Practices | 73 | 90+ | 1 week |
| SEO | 66 | 95+ | Next deploy |

---

## Commands Reference

```bash
# Run Lighthouse locally
lighthouse http://localhost:3000 --output=html --output-path=./lighthouse.html

# Run on preview URL
lighthouse https://your-preview.vercel.app --output=json --output=html --output-path=./lighthouse-report

# Analyze bundles
cd apps/web && ANALYZE=true pnpm build

# Check unused dependencies
npx depcheck

# Analyze Lighthouse JSON
node scripts/analyze-lighthouse.js
```
