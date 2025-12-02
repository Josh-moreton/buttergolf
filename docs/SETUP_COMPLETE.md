# Setup Complete! ✅

Your ButterGolf monorepo is now properly configured for Next.js (web) and Expo (iOS/Android).

## What Was Configured

### 1. Metro Configuration for Expo ✅

- Created `apps/mobile/metro.config.js` with monorepo-aware settings
- Configured workspace watching and module resolution
- Integrated with Turborepo cache

### 2. Babel Configuration ✅

- Created `apps/mobile/babel.config.js` for React Native

### 3. Package Updates ✅

Updated `@my-scope/ui` to support both React and React Native
Added `@my-scope/ui` to both web and mobile apps

- Created central exports file for UI package

- Updated `turbo.json` to handle Expo build outputs (`.expo/**`)
- Added support for `start` task
  You can now import from `@my-scope/ui` in both apps:
- Configured proper caching for both platforms

### 5. Root Package Scripts ✅

import { Button } from '@my-scope/ui';

- Added `dev:web` - run only web app
- Added `dev:ios` - run only mobile app
- Added `clean` and `clean-install` - clear caches and reinstall
  import { Button } from '@my-scope/ui';

### 6. Documentation ✅

- Updated main README.md with monorepo instructions
- Created MONOREPO_SETUP.md with detailed troubleshooting guide

## Quick Start

```sh
# Install dependencies (already done)
pnpm install

# Run both apps
pnpm dev

# Or run individually
pnpm dev:web   # Next.js on http://localhost:3000
pnpm dev:mobile   # Expo - scan QR code or press 'i' for iOS simulator
```

## Next Steps

### 1. Test the Web App

```sh
pnpm dev:web
```

Visit <http://localhost:3000>

### 2. Test the Mobile App

```sh
pnpm dev:ios
```

Then:

- Press `i` to open iOS simulator
- Press `a` to open Android emulator
- Scan QR code with Expo Go app on your device

### 3. Share UI Components

You can now import from `@repo/ui` in both apps:

**In web app (`apps/web/src/app/page.tsx`):**

```tsx
import { Button } from "@repo/ui";
```

**In mobile app (`apps/mobile/App.tsx`):**

```tsx
import { Button } from "@repo/ui";
```

Note: The current Button component uses DOM elements (`<button>`) which won't work in React Native. You'll need to create platform-specific versions or use a cross-platform UI library.

### 4. Consider Cross-Platform UI Libraries

For truly shared components, consider:

- **Tamagui** - React Native + Web UI library
- **NativeWind** - Tailwind for React Native
- **React Native Web** - Already included in Expo
- **Solito** - Navigation that works on both platforms

## Important Files Reference

| File                  | Purpose                                       |
| --------------------- | --------------------------------------------- |
| `metro.config.js`     | Metro bundler configuration for Expo monorepo |
| `pnpm-workspace.yaml` | Defines workspace packages                    |
| `turbo.json`          | Turborepo task configuration                  |
| `package.json`        | Root scripts and dependencies                 |

## Troubleshooting

If you encounter issues:

1. **Clear Metro cache:**

   ```sh
   cd apps/ios && pnpm start --clear
   ```

2. **Clear Turborepo cache:**

   ```sh
   pnpm turbo run build --force
   ```

3. **Reinstall everything:**

   ```sh
   pnpm clean-install
   ```

4. **Check the detailed guide:**
   Read `MONOREPO_SETUP.md` for common issues and solutions

## Resources

- [Expo Monorepo Guide](https://docs.expo.dev/guides/monorepos/)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)

---

**Happy coding! 🏌️‍♂️⛳**
