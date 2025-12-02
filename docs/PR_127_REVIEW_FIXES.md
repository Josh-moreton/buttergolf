# PR #127 Review Fixes - Category Duplication Resolution

## Overview

Addressed all review comments for PR #127 "fixing splash screen", with primary focus on eliminating the maintenance risk of duplicated category constants.

## Critical Issue Resolved: Category Duplication

### Problem

Categories were duplicated in two locations:

- `packages/db/src/constants/categories.ts` (original)
- `packages/app/src/constants/categories.ts` (duplicate for mobile)

This created a **maintenance nightmare** where:

- Updates had to be manually synced between two files
- Risk of data inconsistency between web and mobile
- Violated DRY (Don't Repeat Yourself) principle

### Solution: Dedicated Constants Package

Created a new **`@buttergolf/constants`** package that:

- ✅ Contains zero dependencies (including no Prisma)
- ✅ Safe to import in React Native without bundler issues
- ✅ Single source of truth for domain constants
- ✅ Properly versioned and reusable across all platforms

### Architecture

```
packages/
├── constants/          # NEW - Shared constants (Prisma-free)
│   ├── src/
│   │   ├── categories.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── db/                 # Re-exports from constants
│   └── src/
│       └── index.ts    # export * from '@buttergolf/constants'
│
└── app/                # Uses constants directly
    └── src/
        └── components/ # import { CATEGORIES } from '@buttergolf/constants'
```

### Changes Made

1. **Created `@buttergolf/constants` package**
   - Pure TypeScript package with zero dependencies
   - Contains `CategoryDefinition` interface and `CATEGORIES` array
   - Includes helper functions: `getCategoryBySlug`, `getCategoryByName`, `getCategorySlugs`, `getCategoryNames`, `isValidCategorySlug`

2. **Updated `@buttergolf/db`**
   - Added dependency: `"@buttergolf/constants": "workspace:*"`
   - Changed export from local file to re-export: `export * from '@buttergolf/constants'`
   - Maintains backward compatibility - existing imports still work

3. **Updated `@buttergolf/app`**
   - Added dependency: `"@buttergolf/constants": "workspace:*"`
   - Updated imports in:
     - `packages/app/src/components/CategoriesSection.tsx`
     - `packages/app/src/features/home/logged-out-screen.tsx`
   - Removed duplicate file: `packages/app/src/constants/categories.ts`

4. **Verified mobile build**
   - Expo Metro bundler successfully resolves `@buttergolf/constants`
   - No Prisma bundling issues
   - Categories render correctly on mobile

## Additional Lint Issues Fixed

### 1. Deprecated `resizeMode` Prop

**File**: `packages/app/src/features/onboarding/screen.tsx`

- **Issue**: `resizeMode` prop deprecated on Tamagui Image component
- **Fix**: Replaced with `style={{ objectFit: "cover" }}`
- **Instances**: 2 (both animation rows)

### 2. Nested Ternary Operations

**Files**:

- `packages/app/src/features/home/logged-out-screen.tsx`
- `packages/app/src/features/products/list-screen.tsx`

**Issue**: Complex nested ternaries reduced code readability

**Before**:

```tsx
{
  loading ? (
    <LoadingView />
  ) : products.length === 0 ? (
    <EmptyView />
  ) : (
    <ProductsView />
  );
}
```

**After**:

```tsx
{
  loading && <LoadingView />;
}
{
  !loading && products.length === 0 && <EmptyView />;
}
{
  !loading && products.length > 0 && <ProductsView />;
}
```

### 3. Redundant Conditional

**File**: `packages/app/src/features/home/logged-out-screen.tsx`

- **Issue**: Category "All" button had identical background for both true/false conditions
- **Fix**: Simplified to single `backgroundColor="$background"` value

### 4. Array Index as Key

**File**: `packages/app/src/features/products/detail-screen.tsx`

- **Issue**: Using array index as React key in map
- **Fix**: Changed from `key={index}` to `key={image.url}` (stable identifier)

### 5. Readonly Props Typing

**File**: `packages/app/src/features/products/list-screen.tsx`

- **Issue**: Component props not marked as readonly
- **Fix**: Changed `{ product: ProductCardData }` to `Readonly<{ product: ProductCardData }>`

## Verification

All changes verified:

- ✅ TypeScript compilation passes (no errors)
- ✅ ESLint passes (all lint issues resolved)
- ✅ Mobile build succeeds with Expo Metro
- ✅ Web build succeeds (Vercel deployment)
- ✅ Categories import correctly on both platforms
- ✅ No duplicate code remaining

## Migration Guide for Future Changes

### Adding a New Category

1. Edit **ONE file only**: `packages/constants/src/categories.ts`
2. Add your category to the `CATEGORIES` array
3. Run `pnpm db:seed` to update the database
4. The category automatically appears everywhere (web, mobile, API)

### Benefits of This Architecture

- **Single Source of Truth**: Categories defined once, used everywhere
- **Type Safety**: TypeScript enforces schema across platforms
- **Zero Maintenance Overhead**: No manual syncing required
- **Platform Agnostic**: Works in Node.js, browser, and React Native
- **Dependency Free**: No risk of pulling server code into mobile

## Files Changed

### New Files

- `packages/constants/package.json`
- `packages/constants/tsconfig.json`
- `packages/constants/src/categories.ts`
- `packages/constants/src/index.ts`

### Modified Files

- `packages/db/package.json` (added constants dependency)
- `packages/db/src/index.ts` (re-export from constants)
- `packages/app/package.json` (added constants dependency)
- `packages/app/src/components/CategoriesSection.tsx` (import from constants)
- `packages/app/src/features/home/logged-out-screen.tsx` (import from constants, fix lint issues)
- `packages/app/src/features/products/list-screen.tsx` (fix nested ternary, readonly props)
- `packages/app/src/features/products/detail-screen.tsx` (fix array index key)
- `packages/app/src/features/onboarding/screen.tsx` (fix deprecated resizeMode)

### Deleted Files

- `packages/app/src/constants/categories.ts` (duplicate removed)

## Conclusion

The category duplication issue has been completely resolved with a proper architectural solution. The new `@buttergolf/constants` package provides a clean, maintainable way to share domain constants across all platforms without introducing dependency issues or maintenance overhead.

All lint issues have also been addressed, bringing the codebase up to quality standards.
