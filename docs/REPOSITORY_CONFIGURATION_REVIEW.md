# Repository Configuration Review

## Summary of Issues and Fixes

### The Root Cause - TypeScript Module Resolution (NOT Turborepo)

**Problem**: TypeScript was unable to resolve Tamagui exports, showing errors like:
```
Module '"tamagui"' has no exported member 'Button'
```

**Root Cause**: 
- Tamagui publishes as ESM with `"type": "module"` in its package.json
- Tamagui uses re-export patterns: `tamagui` → `@tamagui/button` → `Button`
- Your TypeScript configs used `"moduleResolution": "NodeNext"` which follows Node.js CommonJS-style module resolution
- `"NodeNext"` could NOT properly traverse the ESM re-export chain

**Solution**:
Changed `packages/ui/tsconfig.json` to use:
```json
{
  "compilerOptions": {
    "moduleResolution": "Bundler",
    "module": "ESNext"
  }
}
```

This tells TypeScript to use bundler-style module resolution, which properly handles ESM re-exports.

---

## Configuration Issues Fixed

### 1. ✅ Tamagui Module Resolution (Critical)
**File**: `packages/ui/tsconfig.json`

**Changes**:
- Added `"moduleResolution": "Bundler"`
- Added `"module": "ESNext"`
- Added `"skipLibCheck": true"`
- Included `tamagui.config.ts` in compilation

**Why**: Allows TypeScript to properly resolve Tamagui's ESM re-exports.

---

### 2. ✅ Inconsistent Path Aliases (Critical)
**Files**: `apps/web/tsconfig.json`, `apps/mobile/tsconfig.json`

**Problem**: Both files had leftover `@my-scope/*` path aliases from the original template.

**Changes**:
```diff
- "@my-scope/*": ["../../packages/*/src"]
+ "@buttergolf/*": ["../../packages/*/src"]
```

**Why**: Ensures consistent naming across the monorepo.

---

### 3. ✅ Tamagui Component Exports (Critical)
**Files**: `packages/ui/src/components/Button.tsx`, `packages/ui/src/components/Text.tsx`

**Changes**:
```typescript
// Button.tsx
export { Button } from 'tamagui'
export type { ButtonProps } from 'tamagui'

// Text.tsx
export { Paragraph as Text } from 'tamagui'
export type { ParagraphProps as TextProps } from 'tamagui'
```

**Why**: Import from the main `tamagui` package (not individual `@tamagui/*` packages) for proper re-export resolution.

---

### 4. ✅ Tamagui Config Module Augmentation (Critical)
**File**: `packages/ui/tamagui.config.ts`

**Changes**:
```typescript
import { createTamagui } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'

// ... config setup ...

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}
```

**Why**: Module augmentation must target the `'tamagui'` module (not `'@tamagui/core'`).

---

### 5. ✅ TamaguiProvider Export (Important)
**File**: `packages/ui/src/index.ts`

**Added**:
```typescript
export { TamaguiProvider } from 'tamagui'
```

**Why**: Centralizes Tamagui exports so apps import from `@buttergolf/ui` instead of directly from `tamagui`.

---

### 6. ✅ Mobile App TamaguiProvider Import (Important)
**File**: `apps/mobile/App.tsx`

**Changes**:
```diff
- import { TamaguiProvider } from 'tamagui'
+ import { TamaguiProvider, config, Button, Text } from '@buttergolf/ui'
```

**Why**: Use centralized exports from `@buttergolf/ui` for consistency.

---

### 7. ✅ Missing Dependencies (Important)
**Files**: `packages/app/package.json`, `apps/web/package.json`

**Changes**:
- Added `next@^16.0.1` as devDependency to `packages/app`
- Added `react-native@0.81.5` as devDependency to `apps/web`

**Why**: TypeScript needs these type definitions for cross-platform code.

---

### 8. ✅ Solito Version Alignment (Minor)
**File**: `packages/app/package.json`

**Changes**:
```diff
- "solito": "^4.3.2"
+ "solito": "^5.0.0"
```

**Why**: Aligns with versions used in `apps/web` and `apps/mobile`.

---

## Current Configuration Status

### ✅ All Packages Passing Type Checks

```bash
pnpm check-types
```

**Output**:
```
Tasks:    4 successful, 4 total
Cached:    2 cached, 4 total
  Time:    6.267s
```

All packages (`@buttergolf/ui`, `@buttergolf/app`, `web`, `mobile`) pass TypeScript type checking.

---

## Configuration Overview

### TypeScript Configs

#### Shared Base Configs (`packages/typescript-config/`)

1. **`base.json`**:
   ```json
   {
     "compilerOptions": {
       "module": "NodeNext",
       "moduleResolution": "NodeNext",
       "target": "ES2022",
       "lib": ["es2022", "DOM", "DOM.Iterable"],
       "strict": true
     }
   }
   ```

2. **`react-library.json`**:
   ```json
   {
     "extends": "./base.json",
     "compilerOptions": {
       "jsx": "react-jsx"
     }
   }
   ```

3. **`nextjs.json`**:
   ```json
   {
     "extends": "./base.json",
     "compilerOptions": {
       "module": "ESNext",
       "moduleResolution": "Bundler",
       "jsx": "preserve"
     }
   }
   ```

#### Package Configs

1. **`packages/ui/tsconfig.json`**:
   - Extends: `@buttergolf/typescript-config/react-library.json`
   - Overrides: `moduleResolution: "Bundler"`, `module: "ESNext"`
   - Why override: Tamagui requires bundler-style module resolution for ESM re-exports

2. **`packages/app/tsconfig.json`**:
   - Extends: `@buttergolf/typescript-config/react-library.json`
   - Path aliases: `@buttergolf/app/*`

3. **`packages/db/tsconfig.json`**:
   - Extends: `@buttergolf/typescript-config/base.json`
   - Composite: `true` (for project references)

4. **`apps/web/tsconfig.json`**:
   - Extends: `@buttergolf/typescript-config/nextjs.json`
   - Module resolution: `bundler` (lowercase, inherited)
   - Path aliases: `@/*`, `@buttergolf/ui`, `@buttergolf/*`

5. **`apps/mobile/tsconfig.json`**:
   - Extends: `expo/tsconfig.base`
   - Path aliases: `@buttergolf/ui`, `@buttergolf/*`
   - Strict: `true`

---

## Dependency Versions

### Key Dependencies Aligned

| Package | Version |
|---------|---------|
| React | `19.2.0` (all apps) |
| React Native | `0.81.5` (all apps) |
| TypeScript | `5.9.2` (all packages) |
| Tamagui | `^1.135.6` (all packages) |
| Next.js | `16.0.1` (web app) |
| Expo | `~54.0.20` (mobile app) |
| Solito | `^5.0.0` (all apps) |
| Turborepo | `2.5.8` (root) |
| pnpm | `9.0.0` (root) |

---

## Tamagui Integration

### Correct Import Pattern

**✅ Do this**:
```typescript
// Import from main 'tamagui' package
import { Button, Text, styled, createTamagui } from 'tamagui'
```

**❌ Don't do this**:
```typescript
// Don't import from individual @tamagui/* packages
import { Button } from '@tamagui/button'
import { styled } from '@tamagui/core'
```

### Why?

The `tamagui` package re-exports all components from individual `@tamagui/*` packages. When using `"moduleResolution": "Bundler"`, TypeScript can properly traverse these re-exports. Individual imports work at runtime but TypeScript's type checker may struggle with the resolution.

---

## Module Resolution Strategy Explained

### NodeNext vs Bundler

**`"moduleResolution": "NodeNext"`** (Node.js-style):
- Follows Node.js module resolution algorithm
- Designed for CommonJS and Node.js ESM
- Struggles with complex re-export chains in ESM packages
- Best for: Node.js servers, CLI tools

**`"moduleResolution": "Bundler"`** (Modern bundlers):
- Designed for webpack, Vite, Metro, etc.
- Handles ESM re-exports seamlessly
- Supports package.json `exports` field properly
- Best for: Web apps, React Native apps, libraries using modern ESM

### Why Different Strategies?

- **`packages/ui`**: Uses `"Bundler"` because it imports Tamagui (ESM with re-exports)
- **`apps/web`**: Uses `"Bundler"` (via nextjs.json) because Next.js is a bundler environment
- **`apps/mobile`**: Uses Expo's default (bundler-compatible) because Metro is a bundler
- **`packages/db`**: Uses `"NodeNext"` because Prisma is a Node.js tool

---

## Potential Future Improvements

### 1. Standardize Module Resolution (Optional)

Consider updating `packages/typescript-config/base.json` to use:
```json
{
  "compilerOptions": {
    "moduleResolution": "Bundler",
    "module": "ESNext"
  }
}
```

**Pros**:
- Consistent across all packages
- Better ESM support
- Aligns with modern JavaScript practices

**Cons**:
- May require testing with Prisma and other Node.js tools
- Could affect how types are resolved in non-bundler environments

### 2. Create Separate Base Config for UI Libraries (Optional)

Create `packages/typescript-config/ui-library.json`:
```json
{
  "extends": "./react-library.json",
  "compilerOptions": {
    "moduleResolution": "Bundler",
    "module": "ESNext",
    "skipLibCheck": true
  }
}
```

Then use it in `packages/ui/tsconfig.json`:
```json
{
  "extends": "@buttergolf/typescript-config/ui-library.json"
}
```

**Benefits**:
- Removes need for overrides in `packages/ui`
- Makes pattern reusable for future UI packages
- Centralizes "bundler-style" config

### 3. Update Tamagui to Latest (Optional)

Current: `^1.135.6`  
Latest: Check https://github.com/tamagui/tamagui/releases

**Benefits**:
- Bug fixes
- Performance improvements
- New features

**Considerations**:
- Review changelog for breaking changes
- Test thoroughly on both web and mobile

---

## Testing Checklist

### ✅ All Passed

- [x] TypeScript type checking passes for all packages
- [x] `pnpm check-types` exits with code 0
- [x] No module resolution errors
- [x] Path aliases resolve correctly
- [x] Tamagui components import successfully
- [x] Prisma Client generates without errors

### Before Deployment

- [ ] Run `pnpm build` to verify all apps build successfully
- [ ] Test web app: `pnpm dev:web`
- [ ] Test mobile app: `pnpm dev:mobile`
- [ ] Verify Tamagui components render correctly on both platforms
- [ ] Check that hot reload works properly

---

## Key Takeaways

1. **The issue was TypeScript module resolution, NOT Turborepo**
2. **Tamagui requires `"moduleResolution": "Bundler"`** for proper ESM re-export resolution
3. **Import from main `tamagui` package**, not individual `@tamagui/*` packages
4. **Consistency matters**: Use `@buttergolf/*` path aliases everywhere
5. **Modern ESM packages need modern module resolution strategies**

---

## Questions?

If you encounter similar issues in the future:

1. Check if the package uses ESM (`"type": "module"`)
2. Check if it has re-exports (package → sub-package → export)
3. Try changing `moduleResolution` to `"Bundler"`
4. Ensure you're importing from the main package, not sub-packages
5. Add `skipLibCheck: true` if needed to bypass third-party type issues

---

**Last Updated**: $(date)  
**Status**: ✅ All type checks passing
