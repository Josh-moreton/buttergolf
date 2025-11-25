# Testing Infrastructure Setup

**Status**: ✅ Framework Installed, ⚠️ Config Refinement Needed

## What's Been Completed

### 1. Testing Packages Installed ✅
- `vitest` v4.0.13 - Fast unit test framework
- `@testing-library/react` v16.3.0 - React component testing
- `@testing-library/react-native` v13.3.3 - React Native testing
- `@testing-library/jest-dom` v6.9.1 - DOM matchers
- `@vitest/ui` v4.0.13 - Visual test UI
- `happy-dom` / `jsdom` - DOM environment for tests

### 2. Configuration Files Created ✅
- `/vitest.config.ts` - Root configuration
- `/vitest.setup.ts` - Global test setup
- `/packages/ui/vitest.config.ts` - UI package config
- `/packages/ui/vitest.setup.ts` - UI-specific setup
- `/packages/ui/tsconfig.test.json` - Test-specific TypeScript config

### 3. Test Scripts Added ✅
**Root `package.json`:**
```json
"test": "turbo run test",
"test:ui": "vitest --ui",
"test:coverage": "vitest --coverage",
"test:watch": "vitest --watch"
```

**Package `package.json` (ui):**
```json
"test": "vitest run",
"test:watch": "vitest",
"test:ui": "vitest --ui",
"test:coverage": "vitest --coverage"
```

**`turbo.json`:**
```json
"test": {
  "dependsOn": ["^build"],
  "outputs": ["coverage/**"],
  "inputs": ["src/**/*.tsx", "src/**/*.ts", "**/*.test.tsx", "**/*.test.ts"]
}
```

### 4. Example Tests Written ✅
- `packages/ui/src/components/Text.test.tsx` - Text component tests
- `packages/ui/src/components/Badge.test.tsx` - Badge component tests
- `packages/ui/src/components/Button.test.tsx` - Button component tests

### 5. Test Utilities Configured ✅
- **matchMedia mock** - For responsive design testing
- **Clerk mock** - For authentication in tests
- **Next.js router mock** - For navigation testing
- **Tamagui Provider wrapper** - For component testing

## Current Issue

**Problem**: TypeScript config resolution in Vitest with monorepo `extends` paths

**Error**:
```
TSConfckParseError: failed to resolve "extends":"@buttergolf/typescript-config/react-library.json"
```

**Root Cause**: Vite's esbuild plugin tries to resolve `tsconfig.json` extends in pnpm monorepo workspace packages, but the resolution fails because it appends `/tsconfig.json` to the package path.

## Solutions to Try

### Option 1: Use tsconfigRaw (Recommended)
Override esbuild to use inline TS config instead of file resolution:

```ts
// vitest.config.ts
export default defineConfig({
  esbuild: {
    tsconfigRaw: {
      compilerOptions: {
        jsx: 'react-jsx',
        skipLibCheck: true,
        module: 'ESNext',
        moduleResolution: 'bundler',
      },
    },
  },
})
```

### Option 2: Flatten TypeScript Configs
Remove `extends` from package tsconfigs and inline all settings.

### Option 3: Use vite-tsconfig-paths Plugin
Install and configure:
```bash
pnpm add -D vite-tsconfig-paths
```

```ts
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
})
```

### Option 4: Separate Test Configs
Create `tsconfig.test.json` in each package without extends (already started).

## Test Examples

### Text Component Test
```tsx
describe('Text Component', () => {
  it('renders text content', () => {
    render(
      <TestWrapper>
        <Text>Hello World</Text>
      </TestWrapper>
    )
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('applies weight variants correctly', () => {
    render(
      <TestWrapper>
        <Text weight="bold">Bold Text</Text>
      </TestWrapper>
    )
    const textElement = screen.getByText('Bold Text')
    expect(textElement).toBeInTheDocument()
  })
})
```

### Badge Component Test
```tsx
describe('Badge Component', () => {
  it('renders badge with text content', () => {
    render(
      <TestWrapper>
        <Badge variant="success">
          <Text>Active</Text>
        </Badge>
      </TestWrapper>
    )
    expect(screen.getByText('Active')).toBeInTheDocument()
  })
})
```

### Button Component Test
```tsx
describe('Button Component', () => {
  it('handles click events', () => {
    const handleClick = vi.fn()
    render(
      <TestWrapper>
        <Button onPress={handleClick}>Click Me</Button>
      </TestWrapper>
    )

    const button = screen.getByText('Click Me')
    fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

## Running Tests

Once config issue is resolved:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage

# Run tests for specific package
pnpm --filter @buttergolf/ui test
```

## Next Steps

1. **Resolve TypeScript config issue** (try solutions above)
2. **Add more component tests** for remaining UI components
3. **Add integration tests** for complex user flows
4. **Set up coverage thresholds** in vitest.config.ts
5. **Add CI/CD integration** to run tests on every PR
6. **Add E2E tests** with Playwright for critical paths

## Coverage Goals

- **UI Components**: 80%+ coverage
- **Business Logic**: 90%+ coverage
- **Utilities**: 95%+ coverage
- **Integration Tests**: Critical user flows

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Tamagui Testing Guide](https://tamagui.dev/docs/intro/installation)
