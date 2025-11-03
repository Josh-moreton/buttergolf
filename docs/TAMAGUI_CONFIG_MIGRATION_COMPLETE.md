# Tamagui Config Migration - Complete

## Overview

Successfully migrated all Tamagui configuration imports from `@buttergolf/ui` to the dedicated `@buttergolf/config` package to establish a single source of truth and prevent duplicate Tamagui instances.

## Changes Made

### 1. Code Migrations

**Files Updated:**
- `packages/app/src/provider/Provider.tsx` - Updated to import config from `@buttergolf/config`
- `packages/app/src/provider/NextTamaguiProvider.tsx` - Updated to import config from `@buttergolf/config`

**Before:**
```tsx
import { config } from "@buttergolf/ui";
```

**After:**
```tsx
import { config } from "@buttergolf/config";
```

### 2. Deprecation Notice

Added comprehensive deprecation warning to `packages/ui/tamagui.config.ts`:
- JSDoc comments marking the export as deprecated
- Console warning in development mode
- Clear migration instructions

### 3. Documentation Updates

**Updated Files:**
- `packages/ui/README.md` - Updated examples to show correct import pattern
- `.github/copilot-instructions.md` - Updated all code examples to use `@buttergolf/config`

### 4. ESLint Rule

Added `no-restricted-imports` rule to `packages/eslint-config/base.js`:
- Prevents importing `config` from `@buttergolf/ui`
- Prevents deep path imports like `@buttergolf/ui/tamagui.config`
- Provides helpful error messages with migration instructions

### 5. CI Check

Created `.github/workflows/check-tamagui-config-imports.yml`:
- Runs on all PRs and pushes to main/develop
- Scans for deprecated import patterns
- Fails the build if deprecated imports are found
- Provides clear error messages

## Verification

### Build Status
✅ Web build passes: `pnpm --filter web build`

### ESLint Verification
The ESLint rule successfully catches deprecated imports:
```bash
# Test shows the rule working:
# warning  'config' import from '@buttergolf/ui' is restricted. 
# Import Tamagui config from '@buttergolf/config' instead
```

### No Deprecated Imports Remain
Verified that no imports of config from `@buttergolf/ui` exist in the codebase (excluding the deprecation shim itself).

## Configuration Verification

### Next.js (Web)
- ✅ `apps/web/next.config.js` - Already configured with correct config path
- ✅ `transpilePackages` includes `@buttergolf/config`
- ✅ Build succeeds without errors

### Expo (Mobile)
- ✅ `apps/mobile/babel.config.js` - Already configured with correct config path
- ✅ Module resolution points to `packages/config/src`

### TypeScript
- ✅ `tsconfig.base.json` - Path mapping via `@buttergolf/*` wildcard covers `@buttergolf/config`

## Correct Import Pattern

### ✅ Correct Usage

```tsx
import { config } from "@buttergolf/config";
import { TamaguiProvider } from "tamagui";

function App() {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      {children}
    </TamaguiProvider>
  );
}
```

### ❌ Deprecated Usage (Will Fail ESLint and CI)

```tsx
// Don't do this - deprecated and will fail checks
import { config } from "@buttergolf/ui";

// Don't do this - deprecated and will fail checks
import { config } from "@buttergolf/ui/tamagui.config";
```

## Future Work

### Planned Removal
The re-export shim at `packages/ui/tamagui.config.ts` should be removed in a future release after:
1. One release cycle has passed
2. All downstream consumers have been verified to use the new import
3. No deprecation warnings are being triggered

Create a follow-up issue to track the removal of the shim.

## Benefits

1. **Single Source of Truth**: All config imports now point to `packages/config/src/tamagui.config.ts`
2. **No Duplicate Instances**: Prevents multiple Tamagui instances which can cause runtime errors
3. **Clear Boundaries**: UI components no longer host configuration
4. **Automated Enforcement**: ESLint + CI checks prevent regressions
5. **Developer Guidance**: Deprecation warnings guide developers to the correct pattern

## Related Documentation

- Source of truth: `packages/config/src/tamagui.config.ts`
- Package config: `packages/config/package.json`
- UI package README: `packages/ui/README.md`
- Copilot instructions: `.github/copilot-instructions.md`
