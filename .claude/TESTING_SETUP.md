# Testing Setup: React Native & Web Monorepo Best Practices

## Critical Issue: SharedArrayBuffer Incompatibility

### The Problem

React Native uses **Hermes** or **JSC** JavaScript engines which do **NOT** support `SharedArrayBuffer`.

Web-only testing libraries like **jsdom** and **happy-dom** rely on `SharedArrayBuffer` and will crash mobile apps if bundled.

**Symptoms:**
```
ReferenceError: Property 'SharedArrayBuffer' doesn't exist
```

This error appears in the mobile app before any code runs if jsdom leaks into the bundle.

### Root Cause Analysis

This monorepo uses aggressive dependency hoisting for performance:
- **pnpm `shamefully-hoist=true`** - Makes dependencies available workspace-wide
- **Workspace catalog** - Previously pinned jsdom globally
- **pnpm symlinks** - Can make test libraries discoverable by Metro bundler

Even though all vitest configurations use `environment: 'node'` (which doesn't require jsdom), the library was still being installed and could leak into mobile bundles.

## Solution: 4-Layer Defense Strategy

### Layer 1: Package Management

**Location:** `pnpm-workspace.yaml` and `.npmrc`

**What was done:**
1. Removed `jsdom` from workspace catalog (was line 97)
2. Added `nohoist-workspace-packages[]` configuration to `.npmrc`:
   - jsdom
   - happy-dom
   - @vitest/browser
   - @testing-library/jest-dom

**Result:** Test libraries are no longer hoisted to root `node_modules/`

---

### Layer 2: Metro Bundler Blocklist

**Location:** `apps/mobile/metro.config.js`

**Already in place:** Comprehensive regex blocklist (lines 40-56) prevents Metro from bundling:
- jsdom and .pnpm/jsdom
- happy-dom and .pnpm/happy-dom
- vitest and @vitest packages
- @testing-library packages

**Result:** Even if test libraries are present in node_modules, Metro won't include them in the mobile bundle

---

### Layer 3: ESLint Protection

**Location:**
- `packages/eslint-config/react-internal.js` - Shared warnings
- `apps/mobile/eslint.config.mjs` - Strict mobile enforcement

**What was added:**
- `no-restricted-imports` rules that block jsdom, happy-dom, @testing-library/jest-dom, @vitest/browser
- Helpful error messages guide developers to correct alternatives

**Result:** Development-time protection catches forbidden imports before they reach any bundler

---

### Layer 4: Documentation & Knowledge Transfer

**This file:** Explains the issue, prevention strategy, and testing best practices

**Location:** `.claude/CLAUDE.md` - Quick reference in main docs

**Result:** Future developers understand why these rules exist and how to test properly

## Testing Strategy by Platform

### Mobile App (`apps/mobile/`)

**What to test:**
- Integration tests only (component mounting, navigation)
- Use `@testing-library/react-native` for rendering tests

**Where to put tests:**
- Tests should be minimal in mobile app itself
- Most tests should be in shared packages

**Environment:**
```javascript
// Don't use jsdom
export default {
  testEnvironment: 'node', // ✅ Correct
  // testEnvironment: 'jsdom', // ❌ Wrong - not supported in React Native
}
```

**Example:**
```typescript
// apps/mobile/__tests__/navigation.test.ts
import { render } from '@testing-library/react-native'
import { App } from '../App'

test('App renders without crashing', () => {
  const { getByText } = render(<App />)
  expect(getByText('Home')).toBeDefined()
})
```

---

### Shared Packages (`packages/ui`, `packages/app`)

**What to test:**
- Component behavior, props, state
- Hook logic
- Utility functions
- Any code that must work on both platforms

**Where to put tests:**
- `src/**/*.test.ts` or `src/**/*.test.tsx`
- Test files should be co-located with source

**Environment:**
```javascript
// Always use node environment for shared code
export default {
  testEnvironment: 'node', // ✅ Required - must work on mobile
  // testEnvironment: 'jsdom', // ❌ Wrong - breaks mobile
}
```

**Testing Patterns:**

```typescript
// ✅ CORRECT - Works on both web and mobile
import { render } from '@testing-library/react-native'
import { Button } from './Button'

test('Button calls onClick when pressed', () => {
  const onClick = jest.fn()
  const { getByRole } = render(<Button onPress={onClick}>Click</Button>)
  fireEvent.press(getByRole('button'))
  expect(onClick).toHaveBeenCalled()
})

// ✅ CORRECT - Hook testing works in node environment
import { renderHook, act } from '@testing-library/react'
import { useCounter } from './useCounter'

test('useCounter increments', () => {
  const { result } = renderHook(() => useCounter())
  act(() => result.current.increment())
  expect(result.current.count).toBe(1)
})

// ❌ WRONG - DOM-specific queries
const { container } = render(<Button>Click</Button>)
expect(container.querySelector('button')).toBeInTheDocument()

// ❌ WRONG - Accessibility testing (needs JSDOM)
expect(screen.getByRole('button')).toHaveAccessibleName('Click')
```

---

### Web App (`apps/web/`)

**What to test:**
- Server Components (use default Node testing)
- Client Components (can use jsdom if truly needed)
- API routes
- Integration tests

**Where to put tests:**
- `src/**/*.test.ts` or `src/**/*.test.tsx`
- Keep web-specific tests here, not in shared packages

**Environment:**
```javascript
// Default: use node for most tests
export default {
  testEnvironment: 'node', // ✅ Preferred - faster
}

// Only if absolutely necessary for DOM testing:
export default {
  testEnvironment: 'jsdom', // ⚠️ Use only for component visual tests
}
```

**When to use jsdom in web app:**

```typescript
// ✅ OK in apps/web/ ONLY - Testing DOM-specific behavior
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Modal } from '@buttergolf/ui'

test('Modal closes on Escape key', async () => {
  const onClose = jest.fn()
  render(<Modal open onClose={onClose}>Content</Modal>)

  userEvent.keyboard('{Escape}')
  await waitFor(() => expect(onClose).toHaveBeenCalled())
})
```

**NEVER do this:**
```typescript
// ❌ WRONG - DOM testing in shared packages
// This breaks mobile and makes shared code web-specific
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Instead: Move this test to apps/web/src/components/
```

---

## Verification Steps

### After Making Changes

**1. Verify jsdom is not in root node_modules:**
```bash
ls -la node_modules/ | grep jsdom
# Should show jsdom (it's vitest's optional peer dependency)
# But should NOT be directly importable by mobile packages
```

**2. Check jsdom is only required by vitest:**
```bash
pnpm why jsdom
# Should show:
# vitest 4.0.13
# └── jsdom 27.2.0 peer
```

**3. Run linter to verify ESLint rules:**
```bash
pnpm lint
# Should pass without errors
```

**4. Run tests:**
```bash
# All tests should pass with environment: 'node'
pnpm test

# UI package tests specifically
pnpm --filter @buttergolf/ui test

# Type check
pnpm check-types
```

**5. Start mobile app:**
```bash
# Clear Metro cache
pnpm dev:mobile --clear

# Expected: App starts without SharedArrayBuffer errors
```

**6. Test ESLint protection (optional):**
```bash
# Temporarily add forbidden import
# Edit apps/mobile/App.tsx and add: import 'jsdom'
# Run: pnpm --filter mobile lint
# Expected: Error showing "CRITICAL: jsdom contains SharedArrayBuffer..."
```

---

## Troubleshooting

### Issue: "SharedArrayBuffer doesn't exist" Error

**Solution:**
1. Check Metro blocklist is still in `apps/mobile/metro.config.js`
2. Verify jsdom not imported anywhere:
   ```bash
   grep -r "import.*jsdom" apps/mobile/src
   grep -r "from.*jsdom" apps/mobile/src
   ```
3. Clear Metro cache: `pnpm dev:mobile --clear`
4. Check node_modules is clean: `pnpm install`

### Issue: Tests Fail Without jsdom

**Root Cause:** Code is trying to use DOM APIs where none exist

**Solution:**
1. Verify vitest config uses `environment: 'node'`
2. Check test code doesn't use DOM-only APIs:
   - `window`, `document`, `DOM selector queries`
   - `@testing-library/jest-dom` matchers
3. Use React Testing Library's universal API instead:
   ```typescript
   // ❌ Wrong - assumes DOM
   const button = screen.getByRole('button')

   // ✅ Correct - works in node environment
   const { getByText } = render(<Button>Click</Button>)
   getByText('Click')
   ```

### Issue: vitest Requires jsdom After Upgrade

**Solution:**
1. Do NOT add jsdom to workspace catalog
2. Add jsdom ONLY in `apps/web/package.json` if needed:
   ```bash
   pnpm add -D jsdom --filter web
   ```
3. Configure vitest in web app to use jsdom environment
4. Keep shared packages using `environment: 'node'`
5. Update `.npmrc` nohoist if new test libraries appear

---

## Prevention: Don't Introduce This Again

### CI/CD Checks

Add to your CI pipeline:
```bash
# Verify jsdom not in workspace catalog
! grep '"jsdom"' pnpm-workspace.yaml

# Verify nohoist configuration exists
grep 'nohoist-workspace-packages' .npmrc

# Verify Metro blocklist exists
grep 'jsdom' apps/mobile/metro.config.js

# Verify ESLint rules are in place
grep 'jsdom' packages/eslint-config/react-internal.js
grep 'jsdom' apps/mobile/eslint.config.mjs

# Run linter
pnpm lint

# Run all tests
pnpm test

# Test mobile app starts
pnpm dev:mobile --clear
```

### Code Review Checklist

When reviewing PRs:
- ❌ Don't add jsdom to `pnpm-workspace.yaml` catalog
- ❌ Don't remove nohoist from `.npmrc`
- ❌ Don't import jsdom in shared packages
- ❌ Don't use `environment: 'jsdom'` in shared package vitest configs
- ✅ Do verify new test libraries are added to nohoist if needed
- ✅ Do ensure ESLint catches new test library imports

---

## Emergency Rollback

If this solution causes issues:

```bash
# 1. Revert all changes
git checkout HEAD -- pnpm-workspace.yaml .npmrc \
  packages/eslint-config/react-internal.js \
  apps/mobile/eslint.config.mjs

# 2. Reinstall
pnpm install

# 3. Clear caches
pnpm dev:mobile --clear

# 4. Verify app works
pnpm test
pnpm dev:mobile
```

Keep the ESLint rules and documentation - they provide value even if package management rollback is needed.

---

## Reference: Files Modified

1. **`pnpm-workspace.yaml`** - Removed jsdom from catalog
2. **`.npmrc`** - Added nohoist configuration
3. **`packages/eslint-config/react-internal.js`** - Added restricted imports
4. **`apps/mobile/eslint.config.mjs`** - Added mobile-specific restrictions
5. **`apps/mobile/metro.config.js`** - Already had blocklist (no changes needed)
6. **`.claude/CLAUDE.md`** - Added testing section
7. **`.claude/TESTING_SETUP.md`** - This file (comprehensive guide)

---

## Summary

**The Rule:**
- Mobile bundle must NEVER include jsdom, happy-dom, or @vitest/browser
- Shared packages must ALWAYS use `environment: 'node'`
- Web-specific tests should stay in `apps/web/`

**The Defense:**
1. Package management isolation
2. Metro bundler blocklist
3. ESLint compile-time checks
4. Developer documentation

**The Test:**
- `pnpm test` - All tests pass
- `pnpm dev:mobile --clear` - Mobile app starts without errors
- `pnpm lint` - No ESLint violations
