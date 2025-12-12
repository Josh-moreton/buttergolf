# Tamagui "Missing theme" Hydration Error - Root Cause & Prevention

## 🚨 Critical Issue: DO NOT USE `useRootTheme()`

**This pattern causes hydration errors that have broken production twice.**

## Error Signature

```
[Error] Error: Missing theme.
  reportError (4472-9526a65117d13a3a.js:14:4991)
  p (3428-75404ecdef0a9f3d.js:2:90806)
  oR (548f96f9-4e0e2598d38c13a6.js:1:70408)
  ...React 19 hydration stack
```

**When**: ~3.16 seconds after page load (374ms after window.onload)
**Why**: React 19 concurrent hydration + Tamagui theme context race condition

## History of Fixes

### Fix #1: December 10, 2024 (Commit d8df9ed)

**Problem:**
```tsx
// ❌ CAUSED "Missing theme" ERRORS
function TamaguiThemeProvider({ children }) {
  const [theme] = useRootTheme(); // Race condition!
  return <Provider defaultTheme={theme ?? "light"}>{children}</Provider>;
}

export function NextTamaguiProvider({ children }) {
  return (
    <NextThemeProvider skipNextHead defaultTheme="system">
      <TamaguiThemeProvider>{children}</TamaguiThemeProvider>
    </NextThemeProvider>
  );
}
```

**Solution:**
```tsx
// ✅ FIXED: Hardcoded theme, no nested providers
export function NextTamaguiProvider({ children }) {
  return <Provider defaultTheme="light">{children}</Provider>;
}
```

**Actions Taken:**
- Removed `NextThemeProvider` + `useRootTheme()` pattern
- Deleted `ThemeToggleButton` component from ButterHeader
- Hardcoded `defaultTheme="light"`

### Fix #2: December 12, 2024 (Current)

**Problem:**
```tsx
// ❌ SAME ERROR, DIFFERENT CAUSE
export function NextTamaguiProvider({ children }) {
  return (
    <ClerkProvider>
      <BaseProvider>{children}</BaseProvider>  // Tamagui inside Clerk
    </ClerkProvider>
  );
}
```

**Root Cause**: Clerk components (UserButton) render during concurrent hydration before Tamagui theme context is ready.

**Solution:**
```tsx
// ✅ FIXED: Tamagui wraps Clerk
export function NextTamaguiProvider({ children }) {
  return (
    <BaseProvider>  // Theme context established first
      <ClerkProvider>
        {children}
      </ClerkProvider>
    </BaseProvider>
  );
}

// In packages/app/src/provider/NextTamaguiProvider.tsx:
<Provider
  defaultTheme="light"
  disableInjectCSS          // CSS via useServerInsertedHTML
  disableRootThemeClass     // Prevent hydration mismatch
>
```

**Actions Taken:**
- Swapped provider order (Tamagui → Clerk)
- Added `disableRootThemeClass` and `disableInjectCSS` props
- Deleted dead `ThemeToggleButton.tsx` file
- Added ESLint rule to block `useRootTheme()` imports

## Root Cause Explanation

### Why It Happens

**React 19 Concurrent Rendering:**
1. Server renders with theme context established
2. Client starts hydration (concurrent)
3. Multiple components try to render simultaneously
4. Some components access theme before TamaguiProvider finishes initialization
5. Tamagui throws "Missing theme" error

### Common Triggers

1. **`useRootTheme()` hook** - Reads theme before context is ready
2. **Nested providers** - Provider order matters; outer providers initialize first
3. **Third-party wrappers** - ClerkProvider, Sentry, etc. can delay Tamagui initialization

## Prevention Checklist

### ✅ DO:

1. **Always use hardcoded `defaultTheme`:**
   ```tsx
   <Provider defaultTheme="light">{children}</Provider>
   ```

2. **Initialize Tamagui FIRST:**
   ```tsx
   <TamaguiProvider>
     <ClerkProvider>
       <OtherProviders>
         {children}
       </OtherProviders>
     </ClerkProvider>
   </TamaguiProvider>
   ```

3. **Use hydration safety props:**
   ```tsx
   <Provider
     defaultTheme="light"
     disableRootThemeClass
     disableInjectCSS  // If using useServerInsertedHTML
   >
   ```

4. **Import theme from `@buttergolf/ui`:**
   ```tsx
   import { useTheme } from "@buttergolf/ui";  // ✅ Safe
   const theme = useTheme();
   ```

### ❌ DON'T:

1. **Never use `useRootTheme()`:**
   ```tsx
   import { useRootTheme } from "@tamagui/next-theme";  // ❌ BLOCKED BY ESLINT
   ```

2. **Never use `NextThemeProvider`:**
   ```tsx
   <NextThemeProvider>  // ❌ BLOCKED BY ESLINT
   ```

3. **Don't nest Tamagui inside other providers:**
   ```tsx
   <ClerkProvider>
     <TamaguiProvider>  // ❌ Wrong order
   ```

4. **Don't create theme toggle components:**
   - We don't support dark mode in v1
   - Theme switching causes hydration mismatches
   - Wait for proper design system in v2

## ESLint Protection

The following rule prevents reintroduction of this bug:

```js
// apps/web/eslint.config.mjs
{
  "no-restricted-imports": [
    "error",
    {
      "paths": [{
        "name": "@tamagui/next-theme",
        "importNames": ["useRootTheme", "NextThemeProvider"],
        "message": "useRootTheme() causes 'Missing theme' hydration errors. Use hardcoded defaultTheme='light' instead. See commit d8df9ed."
      }]
    }
  ]
}
```

**Result**: Any attempt to import these will fail at development/build time.

## Testing for Regressions

To verify this doesn't break again:

1. **Check provider order:**
   ```bash
   grep -A 10 "export function NextTamaguiProvider" apps/web/src/app/NextTamaguiProvider.tsx
   ```
   Should show TamaguiProvider wrapping ClerkProvider, not the reverse.

2. **Check for dead code:**
   ```bash
   grep -r "useRootTheme" apps/web/src
   ```
   Should return NO results (except this doc).

3. **Run development server:**
   ```bash
   pnpm dev:web
   ```
   Load homepage, open browser console, wait 5 seconds. Should see NO "Missing theme" errors.

4. **Check Safari Timeline:**
   - Record timeline from page load to 5 seconds
   - Filter for "error" events
   - Should see NO errors matching "Missing theme"

## Future: Proper Theme Switching

When we're ready to add dark mode (v2):

1. **Design system first:**
   - Complete Figma dark theme design
   - Update all semantic tokens in `tamagui.config.ts`
   - Test every component in both themes

2. **Use CSS-based theme switching:**
   ```tsx
   // Preferred approach (avoids JS hydration issues)
   <html className={theme}>
     {/* CSS handles theme switching */}
   </html>
   ```

3. **Avoid JS-based theme detection:**
   - Don't use `useColorScheme()` or `useRootTheme()`
   - Don't read `window.matchMedia('(prefers-color-scheme: dark)')`
   - All theme decisions must be deterministic on server

4. **If you must use JS themes:**
   - Use cookies to persist theme (read on server)
   - Never read from localStorage during render
   - Always match server and client theme on first render
   - Add theme to `<html>` tag via Server Component

## Related Files

- `apps/web/src/app/NextTamaguiProvider.tsx` - Web provider wrapper
- `packages/app/src/provider/NextTamaguiProvider.tsx` - Base Tamagui provider
- `packages/app/src/provider/Provider.tsx` - Core TamaguiProvider wrapper
- `packages/config/src/tamagui.config.ts` - Theme definitions
- `apps/web/eslint.config.mjs` - ESLint protection rules

## Related Commits

- `d8df9ed` - First fix (removed NextThemeProvider)
- Current - Second fix (provider order + hydration safety)

## Questions?

If you see this error again:
1. Check provider order in both NextTamaguiProvider files
2. Search codebase for `useRootTheme` imports
3. Review commit history for changes to provider setup
4. Refer to this document before making theme-related changes
