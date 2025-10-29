# Monorepo Setup Guide - ButterGolf

## Overview

This monorepo uses:

- **Turborepo** for build orchestration
- **pnpm** for package management
- **Next.js** for the web app
- **Expo** for the mobile app (iOS/Android)

## Key Configuration Files

### 1. Metro Config (`apps/ios/metro.config.js`)

This is the most critical file for Expo in a monorepo. It tells Metro (React Native's bundler) how to find and resolve modules across the workspace.

**Key features:**

- `watchFolders`: Tells Metro to watch the entire workspace
- `nodeModulesPaths`: Defines where to look for dependencies
- `disableHierarchicalLookup`: Ensures consistent module resolution

### 2. Package Manager (`pnpm-workspace.yaml`)

Defines which directories contain packages:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### 3. Turborepo Config (`turbo.json`)

Defines how tasks are run and cached:

- Build outputs for both Next.js and Expo
- Task dependencies
- Persistent dev servers

## Common Issues & Solutions

### Issue 1: Module not found in Expo app

**Problem:** Expo can't find a shared package like `@repo/ui`

**Solution:**

1. Ensure the package is listed in `apps/ios/package.json` dependencies
2. Run `pnpm install` from the root
3. Clear Metro cache: `cd apps/ios && pnpm start --clear`

### Issue 2: Different React versions

**Problem:** Version conflicts between web and mobile apps

**Solution:**

- Check React versions in both `apps/web/package.json` and `apps/ios/package.json`
- Expo has specific React version requirements - use the version recommended by your Expo SDK
- The `@repo/ui` package uses peer dependencies to avoid version conflicts

### Issue 3: TypeScript errors in shared packages

**Problem:** TypeScript can't find types from shared packages

**Solution:**

1. Ensure all packages have proper `exports` in their `package.json`
2. Check that TypeScript config extends from `@repo/typescript-config`
3. Run `pnpm check-types` to see all errors

### Issue 4: Metro bundler cache issues

**Problem:** Changes in shared packages not reflected in Expo app

**Solution:**

```sh
cd apps/ios
rm -rf node_modules/.cache
pnpm start --clear
```

### Issue 5: Build failing in Turborepo

**Problem:** `pnpm build` fails

**Solution:**

1. Check which package is failing: `pnpm turbo build --force`
2. Build that package individually: `pnpm turbo build --filter=<package-name>`
3. Check the build outputs in `turbo.json` are correct

## Development Workflow

### Starting Fresh

```sh
# From root directory
pnpm install
pnpm dev
```

### Working on Specific Apps

```sh
# Web only
pnpm dev:web

# Mobile only
pnpm dev:ios
```

### Adding a New Shared Package

1. Create the package in `packages/` directory
2. Add it to the workspace: it's automatically included via `pnpm-workspace.yaml`
3. Add it as a dependency using workspace protocol:

   ```json
   {
     "dependencies": {
       "@repo/your-package": "workspace:*"
     }
   }
   ```

4. Run `pnpm install` from root

### Sharing Code Between Web and Mobile

**DO:**

- Use platform-agnostic logic packages
- Use React (not React Native or Next.js specific) components in shared packages
- Mark platform-specific dependencies as optional peer dependencies

**DON'T:**

- Import Next.js-specific features (like `next/link`) in shared packages
- Import React Native components in web-only code
- Use DOM APIs (like `window`, `document`) in shared packages meant for mobile

## Testing the Setup

### Verify Everything Works

```sh
# 1. Install dependencies
pnpm install

# 2. Type check all packages
pnpm check-types

# 3. Lint all packages
pnpm lint

# 4. Try building (Next.js will build, Expo doesn't need pre-build for dev)
pnpm build
```

### Test Expo Metro Config

```sh
cd apps/ios
pnpm start
# Press 'i' for iOS simulator
# Press 'a' for Android emulator
# Scan QR code for Expo Go on device
```

## Resources

- [Expo Monorepo Guide](https://docs.expo.dev/guides/monorepos/)
- [Turborepo Docs](https://turborepo.com/docs)
- [pnpm Workspace](https://pnpm.io/workspaces)
- [Metro Configuration](https://facebook.github.io/metro/docs/configuration)

## Helpful Commands

```sh
# Clear all node_modules and reinstall
pnpm clean-install  # (you need to add this script)

# Clear Turborepo cache
pnpm turbo run build --force

# Clear Metro cache
cd apps/ios && pnpm start --clear

# Run single package
pnpm --filter=web dev

# See what turbo would run
pnpm turbo run build --dry-run
```
