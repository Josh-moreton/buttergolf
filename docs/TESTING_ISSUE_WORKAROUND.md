# Testing Infrastructure - Setup Guide

## Status: ✅ RESOLVED

The testing infrastructure is fully configured and working. All 28 tests pass.

## Configuration Summary

### TypeScript Type Augmentation (Vitest v4 + jest-dom)

**Known Issue**: @testing-library/jest-dom v6 augments the `vitest` module's `Assertion` interface, but Vitest v4 re-exports `Assertion` from `@vitest/expect`. The augmentation doesn't apply automatically because the types come from different modules.

**Solution**: We extend `@vitest/expect`'s `Assertion` interface directly in `packages/ui/vitest.d.ts`:

```typescript
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'

declare module '@vitest/expect' {
  interface Assertion<T = any> extends TestingLibraryMatchers<typeof expect.stringContaining, T> {}
  interface AsymmetricMatchersContaining extends TestingLibraryMatchers<any, any> {}
}
```

### Separate TypeScript Configs for Tests

The main `tsconfig.json` excludes test files, while `tsconfig.test.json` handles test-specific types:

**tsconfig.json** (main - excludes tests):
```json
{
  "include": ["src"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.test.tsx"]
}
```

**tsconfig.test.json** (test-specific):
```json
{
  "compilerOptions": {
    "types": ["node", "vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src", "**/*.test.ts", "**/*.test.tsx", "vitest.setup.ts", "vitest.d.ts"]
}
```

### check-types Script

The UI package's check-types script runs both configs:

```json
{
  "scripts": {
    "check-types": "tsc --noEmit && tsc --noEmit -p tsconfig.test.json"
  }
}
```

## Testing Setup Files

### vitest.setup.ts

```typescript
import '@testing-library/jest-dom/vitest'

// Mock matchMedia for Tamagui
globalThis.window = globalThis.window || {}
Object.defineProperty(globalThis.window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
```

### vitest.config.ts

```typescript
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.test.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
  },
})
```

## Running Tests

```bash
# From packages/ui
pnpm test

# From monorepo root
pnpm test
```

## Known Limitations

### Tamagui `tag` Variant in jsdom

Tamagui's styled variant with `tag` prop doesn't actually change the rendered element in jsdom:

```tsx
const Heading = styled(Text, {
  tag: 'p',  // Default
  variants: {
    level: {
      1: { tag: 'h1' },  // Won't work in jsdom - still renders <p>
      2: { tag: 'h2' },
    }
  }
})
```

**Workaround**: Test by text content rather than role/tag:
```tsx
// ❌ Won't work in jsdom
screen.getByRole('heading', { level: 2 })

// ✅ Works correctly
screen.getByText('Heading Text')
```

## Related References

- https://github.com/testing-library/jest-dom/issues/546
- https://github.com/vitest-dev/vitest/discussions/8063
