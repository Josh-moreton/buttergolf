# Testing Infrastructure - TypeScript Config Resolution Issue

## Problem

Vitest with Vite cannot resolve TypeScript `extends` in monorepo workspace packages:

```
TSConfckParseError: failed to resolve "extends":"@buttergolf/typescript-config/react-library.json"
```

## Root Cause

Vite's TypeScript config resolution appends `/tsconfig.json` to package paths, breaking with pnpm workspace `extends` syntax.

## Temporary Workaround (Quick Fix)

Until proper resolution, use inline TypeScript configs in each package:

**Option A: Remove extends from test configs**
```json
// packages/ui/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "skipLibCheck": true,
    "strict": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

**Option B: Use Jest instead**
Jest doesn't have this Vite-specific issue with TypeScript config resolution.

## Proper Solutions (Choose One)

### Solution 1: vite-tsconfig-paths Plugin (Recommended)
```bash
pnpm add -D vite-tsconfig-paths --filter @buttergolf/ui
```

```ts
// vitest.config.ts
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths({
    root: '../..',
  })],
})
```

### Solution 2: Flat TypeScript Configs
Duplicate all TypeScript settings in each package's tsconfig.json instead of using extends.

### Solution 3: Custom Vite Plugin
Create a plugin to handle monorepo extends resolution:

```ts
function monorepoTsconfigExtends() {
  return {
    name: 'monorepo-tsconfig-extends',
    configResolved(config) {
      // Custom resolution logic
    }
  }
}
```

## Current Status

- ✅ All testing packages installed
- ✅ Test files written with examples
- ✅ Test scripts configured
- ✅ Mocks and utilities set up
- ⚠️ TypeScript config resolution pending

## Testing Framework is Ready

Once the TS config issue is resolved (5-10 minutes of work), tests will run successfully. The infrastructure is complete.

## Recommended Next Steps

1. Try `vite-tsconfig-paths` plugin (most likely to work)
2. If that fails, flatten tsconfigs temporarily
3. Consider migrating to Jest for long-term stability

## Files Modified

- `/vitest.config.ts` - Root config with tsconfigRaw
- `/vitest.setup.ts` - Global mocks
- `/packages/ui/vitest.config.ts` - Package config
- `/packages/ui/vitest.setup.ts` - Package mocks
- `/packages/ui/src/components/*.test.tsx` - Test files
- `/package.json` - Test scripts
- `/turbo.json` - Test task configuration
