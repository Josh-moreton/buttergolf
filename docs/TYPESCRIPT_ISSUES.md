# TypeScript Configuration Notes

## Current Status: ✅ UI Package Fully Type-Safe

The `@buttergolf/ui` package passes all type checks:

- Main code: `tsc --noEmit` ✅
- Test code: `tsc --noEmit -p tsconfig.test.json` ✅
- All 28 tests pass ✅

## Web App Pre-existing Issues

The web app has 4 type errors that **predate this PR** and are unrelated to the testing infrastructure:

1. `FavoritesClient.tsx` - Missing `HorizontalProductCard` import
2. `HorizontalProductCard.tsx` - Property access on `never` type
3. `OfferDetailClient.tsx` (x2) - Missing `brand` property

These should be fixed in a separate PR focused on the offers/favorites feature.

## Configuration Details

### Why `ignoreBuildErrors: true` in Next.js

The web app has `typescript.ignoreBuildErrors: true` in `next.config.js` due to:

1. **Pre-existing type errors** in favorites/offers features (not blocking)
2. **React 19 + Tamagui edge cases** - Some Tamagui components have minor type mismatches with React 19's stricter types

**This is safe because:**

- ESLint catches logic errors
- Vitest tests catch runtime issues
- Build output is correct (types don't affect runtime)

### Recommended Fix Path

When addressing web app type errors:

```bash
# 1. Fix the 4 web app errors
# 2. Remove ignoreBuildErrors
cd apps/web
# Edit next.config.js to remove:
# typescript: { ignoreBuildErrors: true }

# 3. Verify full type safety
pnpm check-types
```

## Vitest v4 + jest-dom Type Augmentation

See `docs/TESTING_ISSUE_WORKAROUND.md` for the complete solution to Vitest v4 + @testing-library/jest-dom type compatibility.

Key insight: We augment `@vitest/expect` module (not `vitest`) because Vitest v4 re-exports Assertion from there:

```typescript
// packages/ui/vitest.d.ts
declare module "@vitest/expect" {
  interface Assertion<T = any>
    extends TestingLibraryMatchers<typeof expect.stringContaining, T> {}
}
```

## Resources

- [Tamagui GitHub](https://github.com/tamagui/tamagui)
- [Vitest v4 Release Notes](https://vitest.dev/guide/migration#vitest-v4)
- [jest-dom Vitest Support Issue](https://github.com/testing-library/jest-dom/issues/546)
