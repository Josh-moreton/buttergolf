# Solito + Tamagui Setup - Complete Review & Fix Plan

## 🎯 Executive Summary

After analyzing the official Tamagui + Solito starter template, I've identified the key differences between the starter and our current setup. Our configuration is **fundamentally correct** for TypeScript and module resolution, but we have **structural issues** in how we've organized packages and components.

---

## ✅ What's Already Correct

### 1. TypeScript Module Resolution

- ✅ `packages/ui/tsconfig.json` uses `"moduleResolution": "Bundler"`
- ✅ All path aliases standardized to `@buttergolf/*`
- ✅ Type checking passes across all packages

### 2. Turborepo Configuration

- ✅ Task dependencies properly configured
- ✅ Build outputs defined correctly
- ✅ Vercel integration optimized

### 3. Core Tamagui Config

- ✅ Using v4 config from `@tamagui/config/v4`
- ✅ Proper module augmentation
- ✅ Config structure is sound

---

## ❌ Critical Issues Found

### Issue #1: Package Architecture is Wrong

**Current (Incorrect)**:

```
packages/
├── ui/          # Contains Tamagui components + config
├── app/         # Contains screens + Solito navigation
└── db/          # Database package
```

**Should Be (Like Starter)**:

```
packages/
├── config/      # Tamagui config ONLY
├── ui/          # Reusable UI components (styled with Tamagui)
├── app/         # Screens, providers, navigation logic
└── db/          # Database package
```

**Why This Matters**:

- Tamagui config should be in its own package so it can be imported separately
- UI package should export simple styled components
- UI package should re-export ALL of tamagui core (`export * from 'tamagui'`)
- App package contains the provider logic and screen implementations

---

### Issue #2: UI Package Exports Are Incomplete

**Current `packages/ui/src/index.ts`**:

```tsx
export { Button } from './components/Button'
export { Text } from './components/Text'
export { TamaguiProvider } from 'tamagui'
export { config } from '../tamagui.config'
```

**Should Be (Like Starter)**:

```tsx
export * from 'tamagui'              // ← Re-export ALL Tamagui
export * from '@tamagui/toast'       // ← Export additional packages
export { config } from '@buttergolf/config'  // ← Import from config package
export * from './MyCustomComponent'  // ← Only your custom components
```

**Why**: The UI package should provide a single import point for ALL Tamagui components, not just Button and Text.

---

### Issue #3: Provider Architecture

**Current**: Provider logic mixed into app layouts directly

**Should Be**:

- Create `packages/app/provider/index.tsx` with main `Provider` component
- Create `packages/app/provider/NextTamaguiProvider.tsx` for Next.js-specific logic
- Apps import from `app/provider` not directly from `@buttergolf/ui`

**Starter Pattern**:

```tsx
// packages/app/provider/index.tsx
import { TamaguiProvider, config } from '@my/ui'

export function Provider({ children, defaultTheme }) {
  const colorScheme = useColorScheme()
  const theme = defaultTheme || (colorScheme === 'dark' ? 'dark' : 'light')
  
  return (
    <TamaguiProvider config={config} defaultTheme={theme}>
      {children}
    </TamaguiProvider>
  )
}

// packages/app/provider/NextTamaguiProvider.tsx
export const NextTamaguiProvider = ({ children }) => {
  // Next.js-specific SSR logic
  return (
    <NextThemeProvider>
      <Provider>
        {children}
      </Provider>
    </NextThemeProvider>
  )
}
```

---

### Issue #4: Screens Not Using Tamagui Properly

**Current HomeScreen**:

```tsx
import { Link } from 'solito/link'
import { View, Text } from 'react-native'

export function HomeScreen() {
  return (
    <View>
      <Text>Welcome</Text>
      <Link href="/user/1">Go to user</Link>
    </View>
  )
}
```

**Should Be**:

```tsx
import { YStack, H1, Paragraph, Button } from '@buttergolf/ui'
import { useLink } from 'solito/navigation'  // ← Use navigation, not link

export function HomeScreen() {
  const linkProps = useLink({ href: '/user/1' })
  
  return (
    <YStack flex={1} justify="center" items="center" gap="$4" padding="$4">
      <H1>Welcome to ButterGolf</H1>
      <Paragraph>Track your golf rounds</Paragraph>
      <Button {...linkProps}>View Rounds</Button>
    </YStack>
  )
}
```

**Key Differences**:

- Use `useLink` hook, spread props onto Button
- Use Tamagui components (YStack, H1, Paragraph, Button)
- Use Tamagui tokens for spacing ($4, $8, etc.)

---

### Issue #5: Next.js Configuration

**Current `apps/web/next.config.js`**:

```javascript
const { withTamagui } = require('@tamagui/next-plugin')

module.exports = withTamagui({
  config: './tamagui.config.ts',  // ← Wrong path
  components: ['tamagui'],
  // ...
})
```

**Should Be**:

```javascript
const { withTamagui } = require('@tamagui/next-plugin')

module.exports = withTamagui({
  config: '../../packages/config/src/tamagui.config.ts',  // ← Correct path
  components: ['tamagui', '@buttergolf/ui'],  // ← Include UI package
  appDir: true,
  shouldExtract: (path) => {
    // Extract styles from app package
    if (path.includes(join('packages', 'app'))) {
      return true
    }
  },
  // ...
})
```

---

### Issue #6: Mobile App Missing React Navigation

**Current `apps/mobile/App.tsx`**:

- No navigation setup at all
- Just renders components directly

**Should Be**:

```tsx
import { Provider } from 'app/provider'
import { Stack } from 'expo-router'

export default function RootLayout() {
  return (
    <Provider>
      <Stack />
    </Provider>
  )
}
```

Expo Router handles navigation automatically with file-based routing.

---

## 🔧 Implementation Plan

### Phase 1: Restructure Packages (30 min)

1. **Create `packages/config` package**:

   ```bash
   mkdir -p packages/config/src
   ```

   - Move `packages/ui/tamagui.config.ts` → `packages/config/src/tamagui.config.ts`
   - Create `packages/config/src/index.ts` that exports the config
   - Create `packages/config/package.json`

2. **Update `packages/ui`**:
   - Update `package.json` to depend on `@buttergolf/config`
   - Change `src/index.ts` to re-export all of Tamagui
   - Remove individual component re-exports
   - Keep only custom components

3. **Update `packages/app`**:
   - Create `provider/` directory
   - Create `provider/index.tsx` with main Provider
   - Create `provider/NextTamaguiProvider.tsx` for web
   - Move screen components to use Tamagui components

### Phase 2: Fix Navigation (20 min)

1. **Update screens to use `useLink`**:

   ```tsx
   import { useLink } from 'solito/navigation'
   const linkProps = useLink({ href: '/path' })
   <Button {...linkProps}>Click</Button>
   ```

2. **Set up Expo Router in mobile app**:
   - Ensure `apps/mobile/app/_layout.tsx` exists
   - Wrap with Provider
   - Let Expo Router handle navigation

3. **Keep Next.js App Router** (already working):
   - Already using `apps/web/src/app` structure
   - Just need to import NextTamaguiProvider correctly

### Phase 3: Update Next.js Config (10 min)

1. Update `withTamagui` to point to `packages/config`
2. Add `@buttergolf/ui` to components array
3. Add `shouldExtract` for `packages/app`

### Phase 4: Clean Up Old Code (10 min)

1. Delete old template files:
   - `packages/ui/src/button.tsx` (old)
   - `packages/ui/src/card.tsx` (old)
   - `packages/ui/src/code.tsx` (old)

2. Remove duplicate Button/Text exports from `packages/app/src/index.ts`

### Phase 5: Test Everything (20 min)

1. Run `pnpm check-types` - should pass
2. Run `pnpm build` - should build
3. Test `pnpm dev:web` - should work
4. Test `pnpm dev:mobile` - should work

---

## 📦 Correct Package Structure

### `packages/config/package.json`

```json
{
  "name": "@buttergolf/config",
  "version": "0.0.1",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "dependencies": {
    "@tamagui/config": "^1.135.6",
    "@tamagui/font-inter": "^1.135.6",
    "@tamagui/animations-react-native": "^1.135.6",
    "@tamagui/themes": "^1.135.6",
    "tamagui": "^1.135.6"
  }
}
```

### `packages/config/src/tamagui.config.ts`

```tsx
import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from 'tamagui'

export const config = createTamagui({
  ...defaultConfig,
  settings: {
    ...defaultConfig.settings,
    onlyAllowShorthands: false // ← Important!
  }
})

export type AppConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}
```

### `packages/ui/src/index.ts`

```tsx
// Re-export ALL of Tamagui
export * from 'tamagui'

// Export config from config package
export { config } from '@buttergolf/config'

// Export your custom components
export * from './MyCustomComponent'
```

### `packages/app/provider/index.tsx`

```tsx
import { useColorScheme } from 'react-native'
import { TamaguiProvider, config } from '@buttergolf/ui'

export function Provider({ children, defaultTheme = 'light' }) {
  const colorScheme = useColorScheme()
  const theme = defaultTheme || (colorScheme === 'dark' ? 'dark' : 'light')

  return (
    <TamaguiProvider config={config} defaultTheme={theme}>
      {children}
    </TamaguiProvider>
  )
}
```

### `packages/app/features/home/screen.tsx`

```tsx
import { YStack, H1, Paragraph, Button } from '@buttergolf/ui'
import { useLink } from 'solito/navigation'

export function HomeScreen() {
  const linkProps = useLink({ href: '/rounds' })

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" gap="$4" padding="$4">
      <H1>Welcome to ButterGolf</H1>
      <Paragraph>Track your golf game</Paragraph>
      <Button {...linkProps}>View Rounds</Button>
    </YStack>
  )
}
```

---

## 🎨 Tamagui Component Usage Patterns

### Correct Prop Names (NO Shorthands by Default)

❌ **Don't use shorthands** (unless you enable them):

```tsx
<YStack p="$4" m="$2" bg="$background">
```

✅ **Use full names**:

```tsx
<YStack padding="$4" margin="$2" backgroundColor="$background">
```

### Layout Components

```tsx
import { YStack, XStack, ZStack } from '@buttergolf/ui'

// Vertical stack
<YStack gap="$4" padding="$4">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</YStack>

// Horizontal stack
<XStack gap="$2" alignItems="center">
  <Icon />
  <Text>Label</Text>
</XStack>

// Layered (absolute positioning)
<ZStack width={200} height={200}>
  <Image />
  <Text position="absolute" bottom="$2" left="$2">Caption</Text>
</ZStack>
```

### Typography

```tsx
import { H1, H2, H3, Paragraph, SizableText } from '@buttergolf/ui'

<H1>Main Heading</H1>
<H2>Subheading</H2>
<Paragraph>Body text</Paragraph>
<SizableText size="$6" color="$blue10">Custom text</SizableText>
```

### Sizing with Tokens

```tsx
<Button size="$4">Small</Button>
<Button size="$6">Medium</Button>
<Button size="$8">Large</Button>

<YStack padding="$2">    // 8px
<YStack padding="$4">    // 16px
<YStack padding="$6">    // 24px
```

### Responsive Design

```tsx
<YStack
  width="100%"
  $sm={{ width: 300 }}   // Small screens
  $md={{ width: 500 }}   // Medium screens
  $gtMd={{ width: 700 }} // Greater than medium
>
  <Text>Responsive content</Text>
</YStack>
```

### Themes

```tsx
import { Theme, useTheme } from '@buttergolf/ui'

// Themed section
<Theme name="dark">
  <YStack backgroundColor="$background">
    <Text color="$color">Dark theme</Text>
  </YStack>
</Theme>

// Access theme programmatically
const theme = useTheme()
<View style={{ backgroundColor: theme.background.val }} />
```

---

## 🚀 Next Steps

1. **Review this document** - Make sure you understand the differences
2. **Choose implementation approach**:
   - Option A: Let me implement all changes (fastest)
   - Option B: I guide you through each step (learning)
   - Option C: You implement, I review (most control)
3. **Test thoroughly** after changes
4. **Document patterns** in team guidelines

---

## 📚 Key Takeaways

1. **Separate config from UI** - Config should be its own package
2. **Re-export Tamagui wholesale** - Don't pick and choose components
3. **Use `useLink` hook** - Not `<Link>` component directly
4. **Provider pattern** - Centralize all provider logic in app package
5. **Full prop names** - Don't use shorthands unless explicitly enabled
6. **File-based routing** - Expo Router for mobile, App Router for web
7. **Import from UI package** - Never import from 'tamagui' directly in screens

---

## 🔗 References

- [Tamagui Starter Template](https://github.com/tamagui/starter-free) - Official reference
- [Solito Documentation](https://solito.dev) - Navigation patterns
- [Tamagui v4 Config](https://tamagui.dev/docs/core/config-v4) - Configuration guide
- [Expo Router](https://docs.expo.dev/router/introduction/) - Mobile navigation

---

**Status**: Ready to implement ✅  
**Estimated Time**: 1.5 hours total  
**Risk Level**: Low (can be done incrementally)
