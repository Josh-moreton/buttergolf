# ✅ Monorepo Setup Complete

Your ButterGolf monorepo is now properly configured for Next.js (web) and Expo (mobile).

## What's Been Set Up

### ✅ Project Structure

```
buttergolf/
├── apps/
│   ├── web/           # Next.js website
│   └── mobile/        # Expo app (iOS/Android)
└── packages/
    ├── ui/            # Shared React components
    ├── eslint-config/ # Shared ESLint rules
    └── typescript-config/ # Shared TypeScript configs
```

### ✅ Key Configurations

1. **Metro Config** (`apps/mobile/metro.config.js`)
   - Enables monorepo workspace watching
   - Resolves modules correctly across packages
   - Integrates with Turborepo cache

2. **Babel Config** (`apps/mobile/babel.config.js`)
   - Standard Expo preset

3. **TypeScript Config** (`apps/mobile/tsconfig.json`)

- Path mappings for `@my-scope/ui`
- Proper Expo type support

4. **Package Dependencies**

- `@my-scope/ui` added to both apps
- Workspace protocol (`workspace:*`) used

5. **Turborepo** (`turbo.json`)
   - Handles both Next.js and Expo outputs
   - Proper caching configured

## 🚀 Quick Start

### Install Dependencies (if not already done)

```sh
pnpm install
```

### Run Both Apps

```sh
pnpm dev
```

### Run Individual Apps

```sh
# Web only (http://localhost:3000)
pnpm dev:web

# Mobile only (scan QR or use simulator)
pnpm dev:mobile
```

## 📱 Testing the Mobile App

After running `pnpm dev:mobile`, you'll see a QR code. Then:

- **iOS Simulator**: Press `i`
- **Android Emulator**: Press `a`
- **Physical Device**: Scan QR code with Expo Go app
  - iOS: Download from App Store
  - Android: Download from Play Store

## 🎨 Using Shared UI Components

The `@my-scope/ui` package is already linked to both apps!

### Current Components

The existing components (`Button`, `Card`, `Code`) use web-specific DOM elements. For React Native compatibility, you'll need to either:

1. **Create platform-specific versions** using file extensions:

   ```
   button.tsx      # Default (web)
   button.native.tsx  # React Native
   ```

2. **Use cross-platform UI libraries**:
   - **Tamagui** - Universal UI kit
   - **NativeWind** - Tailwind CSS for React Native
   - **React Native for Web** - Already included

### Example: Create a Simple Cross-Platform Component

Create `packages/ui/src/text.tsx`:

```tsx
import React from 'react';

interface TextProps {
  children: React.ReactNode;
}

// This would need platform-specific implementation
// For now, this is a placeholder
export function Text({ children }: TextProps) {
  return <span>{children}</span>;
}
```

Then use it in both apps:

```tsx
import { Text } from '@my-scope/ui';
```

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Run all apps in development |
| `pnpm dev:web` | Run web app only |
| `pnpm dev:mobile` | Run mobile app only |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all packages |
| `pnpm check-types` | Type check all packages |
| `pnpm clean-install` | Clean & reinstall all dependencies |

## 🐛 Troubleshooting

### Module not found in mobile app

```sh
cd apps/mobile
pnpm start --clear
```

### TypeScript errors

```sh
pnpm check-types
```

### Complete fresh start

```sh
pnpm clean-install
```

## 📚 Next Steps

### 1. Update Mobile App UI

The default Expo app in `apps/mobile/App.tsx` is a basic template. Customize it:

```tsx
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Welcome to ButterGolf! ⛳</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

### 2. Choose a Cross-Platform UI Strategy

For truly shared components between web and mobile:

**Option A: Tamagui (Recommended)**

```sh
pnpm add tamagui @tamagui/core
```

- Best for new projects
- Works on web, iOS, and Android
- Great performance

**Option B: NativeWind**

```sh
pnpm add nativewind tailwindcss
```

- Tailwind CSS for React Native
- Familiar API if you know Tailwind

**Option C: Platform-Specific Components**

- Keep web and mobile components separate
- Share logic, not UI

### 3. Set Up Navigation (Mobile)

For navigation in Expo:

```sh
cd apps/mobile
pnpm add expo-router
```

Then follow the [Expo Router docs](https://docs.expo.dev/router/introduction/).

### 4. Share Business Logic

Create packages in `packages/` for:

- API clients
- State management
- Utilities
- Types/interfaces

Example:

```sh
mkdir -p packages/api/src
```

## 📖 Documentation

- `README.md` - Main project readme
- `MONOREPO_SETUP.md` - Detailed setup guide & troubleshooting
- [Expo Monorepo Guide](https://docs.expo.dev/guides/monorepos/)
- [Turborepo Docs](https://turbo.build/repo/docs)

## ✅ Verified Working

- ✅ Dependencies installed
- ✅ TypeScript compilation
- ✅ Turborepo tasks
- ✅ Workspace package linking
- ✅ Metro bundler configuration

---

**You're all set! Start building your golf app! 🏌️‍♂️⛳**

Need help? Check `MONOREPO_SETUP.md` for detailed troubleshooting.
