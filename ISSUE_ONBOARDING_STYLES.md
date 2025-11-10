# 🐛 Onboarding Screen: Styles Not Applying to Buttons and Background

## Summary
The onboarding screen (`packages/app/src/features/onboarding/screen.tsx`) shows text content correctly and images animate, but **Button components and YStack background colors do not render**. Text changes are reflected immediately, but style props (`backgroundColor`, `color`, etc.) on Tamagui components have no visual effect.

## Environment
- **Platform**: React Native (Expo ~54.0.23) on iOS Simulator (iPhone 17 Pro, iOS 26.0)
- **Tamagui Version**: 1.135.7
- **React Native**: 0.81.5
- **React**: 19.1.0
- **React Native Reanimated**: 4.1.1
- **Metro Bundler**: Cache cleared multiple times

## Current Behavior

### What Works ✅
- Text components render and update correctly
- Text content changes reflect immediately
- Image carousel animates smoothly
- Layout structure (YStack, spacing) appears correct
- "About Butter Golf" link is visible and styled

### What Doesn't Work ❌
- **YStack `backgroundColor="$primary"`** - Should be butter orange (#E25F2F), renders as WHITE
- **Button components** - Completely invisible (not just unstyled)
- **Button `backgroundColor` prop** - No effect (tried `$primary`, hex codes, theme tokens)
- **Button `color` prop** - No effect
- **Button `borderColor` and `borderWidth`** - No effect

## Expected Behavior
Based on the code in `screen.tsx`:

1. **Background**: Entire screen should have butter orange background (`$primary` = #E25F2F)
2. **Primary Button**: White background with orange text, visible below "Buy, sell, and play smarter"
3. **Secondary Button**: Light butter background with orange border and text

## Code Investigation

### Component File
```tsx
// packages/app/src/features/onboarding/screen.tsx

// YStack with backgroundColor - NOT RENDERING
<YStack
  flex={1}
  backgroundColor="$primary" // Should be orange, renders WHITE
  paddingTop={insets.top}
  paddingBottom={insets.bottom}
>
  {/* Content renders fine */}
  
  {/* Buttons - COMPLETELY INVISIBLE */}
  <Button
    size="$5"
    backgroundColor="$primary"     // No effect
    color="$textInverse"           // No effect
    borderRadius="$lg"             // No effect
    fontWeight="600"               // No effect
    fontSize={17}                  // No effect
    height={52}                    // No effect
    onPress={onSignUp}
  >
    Sign up to Butter Golf
  </Button>
</YStack>
```

### Button Component Definition
```tsx
// packages/ui/src/components/Button.tsx
export { Button } from "tamagui";
export type { ButtonProps } from "tamagui";
```

**Issue**: Button is a pure re-export from Tamagui with NO custom styling or variants.

### Theme Configuration
```typescript
// packages/config/src/tamagui.config.ts
const customTokens = createTokens({
  color: {
    primary: brandColors.butter400,  // #E25F2F in Display P3
    primaryLight: brandColors.butter100,
    white: '#ffffff',
    textInverse: brandColors.white,
    // ... etc
  }
})

const lightTheme = {
  background: '$background',    // References token
  primary: '$primary',          // References token
  // ... etc
}
```

### Provider Setup
```tsx
// packages/app/src/provider/Provider.tsx
export function Provider({ defaultTheme, ...rest }: ProviderProps) {
  const colorScheme = useColorScheme();
  const theme = defaultTheme ?? (colorScheme === "dark" ? "dark" : "light");

  return (
    <TamaguiProvider
      config={config as any}  // ⚠️ Type cast here
      defaultTheme={theme}
      {...(rest as TamaguiProviderProps)}
    />
  );
}
```

```tsx
// apps/mobile/App.tsx
<Provider>
  <SignedOut>
    <OnboardingFlow />  {/* Renders OnboardingScreen */}
  </SignedOut>
</Provider>
```

### Dependencies Installed
```json
// apps/mobile/package.json
"dependencies": {
  "@buttergolf/app": "workspace:*",
  "@buttergolf/config": "workspace:*",
  "@buttergolf/ui": "workspace:*",
  "tamagui": "catalog:",
  "@tamagui/animations-react-native": "catalog:",
  "react-native-reanimated": "~4.1.1"
}
```

## Troubleshooting Attempted

### ✅ Verified
- [x] Dependencies installed correctly (`pnpm install`)
- [x] Tamagui packages present in mobile app `package.json`
- [x] Metro cache cleared (`expo start --clear`)
- [x] TypeScript compilation passes (no errors)
- [x] Text components work (proving Tamagui IS loading)
- [x] Provider wraps the entire app
- [x] Config imports correctly from `@buttergolf/config`

### ❌ Still Broken After
- [x] Clearing Metro cache
- [x] Restarting dev server multiple times
- [x] Adding missing Tamagui dependencies
- [x] Updating react-native-reanimated to correct version
- [x] Changing from theme tokens to hardcoded hex colors
- [x] Wrapping button text in explicit `<Text>` component
- [x] Changing button props multiple times (backgroundColor, color, etc.)

## Hypothesis

### Possible Root Causes

1. **Tamagui Button Requires Special Props**
   - Pure Tamagui Button (no custom styling) may not support `backgroundColor` prop directly
   - May need to use `theme` prop or wrap in `Theme` component
   - May need to use `styled()` to create custom button variant

2. **Display P3 Color Space Issue**
   - Config uses `color(display-p3 ...)` format for brand colors
   - React Native may not support Display P3 color space
   - Metro bundler may not be processing these colors correctly

3. **Metro Bundler Caching/Transform Issue**
   - Tamagui babel plugin may not be transforming style props
   - Styles may be compiled at build time and not updating
   - Component may be using cached version without styles

4. **Theme Resolution Failing**
   - `$primary` token may not be resolving to actual color
   - Theme context may not be reaching nested components
   - `config as any` type cast may be hiding type mismatches

5. **Button Re-export Problem**
   - Pure re-export from Tamagui may not work in React Native
   - May need custom `styled(Button)` wrapper with explicit props
   - Button props may need to be explicitly typed/allowed

## Proposed Solutions

### Solution 1: Create Custom Styled Button (Recommended)
```tsx
// packages/ui/src/components/Button.tsx
import { styled, GetProps } from 'tamagui'
import { Button as TamaguiButton } from 'tamagui'

export const Button = styled(TamaguiButton, {
  name: 'Button',
  
  // Allow backgroundColor and other style props
  backgroundColor: '$surface',
  color: '$text',
  borderRadius: '$md',
  
  variants: {
    tone: {
      primary: {
        backgroundColor: '$primary',
        color: '$textInverse',
      },
      secondary: {
        backgroundColor: '$primaryLight',
        color: '$primary',
        borderColor: '$primary',
        borderWidth: 2,
      },
    },
    size: {
      sm: { height: 32, paddingHorizontal: '$3' },
      md: { height: 40, paddingHorizontal: '$4' },
      lg: { height: 52, paddingHorizontal: '$5' },
    },
  } as const,
  
  defaultVariants: {
    tone: 'primary',
    size: 'md',
  },
})

export type ButtonProps = GetProps<typeof Button>
```

### Solution 2: Convert Display P3 Colors to RGB/Hex
```typescript
// packages/config/src/tamagui.config.ts
const brandColors = {
  butter400: '#E25F2F',  // Instead of color(display-p3 ...)
  // ... etc
}
```

### Solution 3: Use Theme Component Wrapper
```tsx
<Theme name="light">
  <Button theme="orange">Sign up to Butter Golf</Button>
</Theme>
```

### Solution 4: Use Native Button Instead of Tamagui
```tsx
import { Pressable, Text } from 'react-native'

<Pressable
  style={{
    backgroundColor: '#E25F2F',
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  }}
  onPress={onSignUp}
>
  <Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '600' }}>
    Sign up to Butter Golf
  </Text>
</Pressable>
```

## Reproduction Steps

1. Start mobile dev server: `pnpm dev:mobile`
2. Open app in iOS simulator
3. Navigate to onboarding screen (SignedOut state)
4. Observe:
   - Background is white (should be orange)
   - Buttons are invisible (should be visible with styling)
   - Text "Buy, sell, and play smarter" IS visible
   - "About Butter Golf" link IS visible

## Additional Context

### Similar Working Components
- Text components work perfectly with `color`, `fontSize`, etc.
- Image components render correctly
- YStack layout (gap, padding) works
- Only `backgroundColor` and Button styling fails

### Config Verification
```bash
# TypeScript compilation passes
pnpm check-types  # ✅ No errors

# Dependencies present
grep -A 5 '"dependencies"' apps/mobile/package.json
# Shows tamagui, @buttergolf/ui, @buttergolf/config, etc.
```

## Questions for Investigation

1. Does Tamagui's base Button component support `backgroundColor` prop in React Native?
2. Are Display P3 colors supported by React Native's style engine?
3. Is the Tamagui babel plugin correctly transforming style props?
4. Do we need to use `styled()` wrapper for proper prop support?
5. Is there a theme provider or context issue preventing style resolution?

## Priority
**High** - Onboarding screen is first user experience and completely broken visually.

## Labels
- `bug`
- `tamagui`
- `react-native`
- `styling`
- `mobile`
- `onboarding`

---

**Note**: This issue affects ONLY the onboarding screen. Other screens with Tamagui components may have the same underlying issue but haven't been tested yet.
