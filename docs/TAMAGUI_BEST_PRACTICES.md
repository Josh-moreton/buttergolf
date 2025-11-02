# Tamagui Best Practices for ButterGolf

**Last Updated**: November 2, 2025  
**Status**: Living Document

This guide documents best practices for using Tamagui in the ButterGolf monorepo to ensure consistency, scalability, and maintainability across web and mobile platforms.

---

## Table of Contents

1. [Theme Tokens](#theme-tokens)
2. [Component Creation](#component-creation)
3. [Styling Patterns](#styling-patterns)
4. [Common Pitfalls](#common-pitfalls)
5. [Examples](#examples)
6. [Migration Guide](#migration-guide)

---

## Theme Tokens

### Overview

Always use theme tokens instead of hardcoded values. Tokens ensure consistency, enable theming (light/dark mode), and improve maintainability.

### Available Color Tokens

The following color tokens are defined in `packages/config/src/tamagui.config.ts`:

#### Brand Colors
```tsx
$green700     // #0b6b3f - Dark green (primary dark)
$green500     // #13a063 - Primary green (main brand)
$amber400     // #f2b705 - Accent amber
```

#### Background Colors
```tsx
$bg           // #fbfbf9 - Main background
$bgGray       // #F7F7F7 - Gray background for sections
$bgCard       // #F6F7FB - Card background
$cardBg       // #ffffff - White card background
```

#### Text Colors
```tsx
$text         // #0f1720 - Primary text
$textDark     // #1C274C - Dark text for emphasis
$muted        // #6b7280 - Muted/secondary text
```

#### Accent Colors
```tsx
$blue         // #3C50E0 - Primary blue accent
$blueLight    // #93C5FD - Light blue for hover states
$teal         // #02AAA4 - Teal accent
$red          // #DC2626 - Red for alerts/badges
```

#### Neutral Colors
```tsx
$gray100      // #dfe6e9 - Very light gray
$gray300      // #b2bec3 - Light gray
$gray400      // #D1D5DB - Medium-light gray
$gray500      // #636e72 - Medium gray
$gray700      // #2d3436 - Dark gray
```

#### Utility Colors
```tsx
$accentBlue   // #74b9ff - Blue utility
$accentPurple // #a29bfe - Purple utility
```

### Spacing Tokens

Use Tamagui's built-in spacing tokens:

```tsx
$1   // 4px
$2   // 8px
$3   // 12px
$4   // 16px
$5   // 20px
$6   // 24px
$7   // 28px
$8   // 32px
$9   // 36px
$10  // 40px
$11  // 44px
$12  // 48px
// ... continues through $20
```

### Size Tokens

For width, height, and other size properties:

```tsx
$0   // 0
$1   // 24px
$2   // 28px
$3   // 32px
$4   // 36px
$5   // 40px
// ... and more
```

### Font Size Tokens

Use semantic font size tokens:

```tsx
$1   // 11px
$2   // 12px
$3   // 13px
$4   // 14px
$5   // 16px
$6   // 18px
$7   // 20px
$8   // 23px
$9   // 26px
$10  // 32px
// ... and more
```

---

## Component Creation

### When to Create a Component

Create a shared component in `packages/ui/src/components/` when:

1. The component is used in multiple places
2. It has specific styling or behavior patterns
3. It needs consistent props across the app
4. It represents a design system primitive

### Component Structure

```tsx
// packages/ui/src/components/MyComponent.tsx
import { styled, YStack } from 'tamagui'

export const MyComponent = styled(YStack, {
  name: 'MyComponent', // Required for compiler optimization
  backgroundColor: '$background',
  padding: '$4',
  borderRadius: '$4',
  
  variants: {
    size: {
      small: {
        padding: '$3',
        fontSize: '$3',
      },
      medium: {
        padding: '$4',
        fontSize: '$4',
      },
      large: {
        padding: '$5',
        fontSize: '$5',
      },
    },
    
    variant: {
      default: {
        backgroundColor: '$background',
      },
      primary: {
        backgroundColor: '$green500',
      },
      secondary: {
        backgroundColor: '$blue',
      },
    },
  } as const,
  
  defaultVariants: {
    size: 'medium',
    variant: 'default',
  },
})

export type MyComponentProps = React.ComponentProps<typeof MyComponent>
```

### Component Export Pattern

Always export both the component and its props type:

```tsx
// packages/ui/src/index.ts
export { MyComponent } from './components/MyComponent'
export type { MyComponentProps } from './components/MyComponent'
```

---

## Styling Patterns

### ✅ DO: Use Theme Tokens

```tsx
// Good
<YStack backgroundColor="$bg" padding="$4">
  <Text color="$text" fontSize="$5">Hello</Text>
</YStack>

// Good - with hover states
<Button
  backgroundColor="$green500"
  hoverStyle={{ backgroundColor: '$green700' }}
  pressStyle={{ scale: 0.97 }}
>
  Click me
</Button>
```

### ❌ DON'T: Use Hardcoded Values

```tsx
// Bad
<YStack backgroundColor="#fbfbf9" padding={16}>
  <Text color="#0f1720" fontSize={16}>Hello</Text>
</YStack>

// Bad
<Button
  backgroundColor="#13a063"
  hoverStyle={{ backgroundColor: "#0b6b3f" }}
>
  Click me
</Button>
```

### Responsive Design

Use media query props for responsive layouts:

```tsx
<YStack
  width="100%"
  $sm={{ width: '100%' }}      // Small screens
  $md={{ width: '50%' }}        // Medium screens
  $lg={{ width: '33.33%' }}     // Large screens
  $xl={{ width: '25%' }}        // Extra large screens
>
  <Text>Responsive content</Text>
</YStack>
```

### Pseudo States

Use pseudo-state props for interactive elements:

```tsx
<Button
  backgroundColor="$blue"
  hoverStyle={{
    backgroundColor: '$blueLight',
    scale: 1.02,
  }}
  pressStyle={{
    scale: 0.98,
    opacity: 0.8,
  }}
  focusStyle={{
    borderColor: '$blue',
    borderWidth: 2,
  }}
>
  Interactive Button
</Button>
```

### Group Styling

For complex hover interactions:

```tsx
<YStack group="card" hoverStyle={{ scale: 1.02 }}>
  <Text $group-card-hover={{ color: '$blue' }}>
    This text changes when card is hovered
  </Text>
</YStack>
```

---

## Common Pitfalls

### 1. Mixing Styles Systems

❌ **Don't** mix Tamagui with inline React Native styles:

```tsx
// Bad
<YStack style={{ backgroundColor: '#fbfbf9' }}>
  <Text>Content</Text>
</YStack>
```

✅ **Do** use Tamagui props consistently:

```tsx
// Good
<YStack backgroundColor="$bg">
  <Text>Content</Text>
</YStack>
```

### 2. Not Using Semantic Tokens

❌ **Don't** use random colors:

```tsx
// Bad
<Text color="#1C274C">Header</Text>
```

✅ **Do** use semantic token names:

```tsx
// Good
<Text color="$textDark">Header</Text>
```

### 3. Forgetting the `name` Prop

When creating styled components, always include the `name` prop:

```tsx
// Required for compiler optimization
export const Card = styled(YStack, {
  name: 'Card', // ← Don't forget this!
  // ... rest of styles
})
```

### 4. Hardcoded Breakpoints

❌ **Don't** use hardcoded media queries:

```tsx
// Bad
const isSmall = width < 768
```

✅ **Do** use Tamagui's media queries:

```tsx
// Good
const media = useMedia()
if (media.sm) {
  // Small screen logic
}
```

### 5. Not Leveraging Variants

❌ **Don't** use conditional styling:

```tsx
// Bad
<Button backgroundColor={isPrimary ? '#13a063' : '#3C50E0'}>
  Click
</Button>
```

✅ **Do** create variants:

```tsx
// Good - define once
const StyledButton = styled(Button, {
  variants: {
    variant: {
      primary: { backgroundColor: '$green500' },
      secondary: { backgroundColor: '$blue' },
    },
  },
})

// Use everywhere
<StyledButton variant="primary">Click</StyledButton>
```

---

## Examples

### Example 1: Creating a Card Component

```tsx
// packages/ui/src/components/ProductCard.tsx
import { styled, YStack, XStack, Image, Text } from 'tamagui'

export const ProductCard = styled(YStack, {
  name: 'ProductCard',
  backgroundColor: '$cardBg',
  borderRadius: '$4',
  padding: '$4',
  gap: '$3',
  
  shadowColor: '$shadowColor',
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  
  hoverStyle: {
    scale: 1.02,
    shadowRadius: 12,
  },
  
  pressStyle: {
    scale: 0.98,
  },
  
  variants: {
    elevated: {
      true: {
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 4 },
      },
    },
  } as const,
})
```

### Example 2: Using the Card

```tsx
import { ProductCard, Image, Text, XStack } from '@buttergolf/ui'

function ProductList() {
  return (
    <ProductCard elevated>
      <Image
        source={{ uri: imageUrl }}
        width="100%"
        height={200}
        borderRadius="$4"
      />
      <Text fontSize="$5" fontWeight="600" color="$text">
        Product Title
      </Text>
      <XStack justifyContent="space-between">
        <Text fontSize="$6" fontWeight="700" color="$textDark">
          $99.99
        </Text>
        <Text fontSize="$3" color="$muted">
          Excellent condition
        </Text>
      </XStack>
    </ProductCard>
  )
}
```

### Example 3: Responsive Layout

```tsx
import { XStack, YStack, Text } from '@buttergolf/ui'

function HeroSection() {
  return (
    <XStack
      padding="$6"
      gap="$6"
      $sm={{ flexDirection: 'column' }}
      $lg={{ flexDirection: 'row' }}
    >
      <YStack flex={1} gap="$4">
        <Text fontSize="$10" fontWeight="800">
          Buy & sell golf clubs
        </Text>
        <Text color="$muted" fontSize="$5">
          Find great deals or list your gear
        </Text>
      </YStack>
      
      <YStack flex={1}>
        {/* Image or content */}
      </YStack>
    </XStack>
  )
}
```

---

## Migration Guide

### How to Migrate Hardcoded Colors

1. **Identify the color in the code**
   ```tsx
   // Before
   <Text color="#1C274C">Header</Text>
   ```

2. **Find or add the semantic token**
   Check `packages/config/src/tamagui.config.ts` for the appropriate token:
   - `#1C274C` → `$textDark`

3. **Replace with token**
   ```tsx
   // After
   <Text color="$textDark">Header</Text>
   ```

### How to Migrate Hardcoded Spacing

1. **Identify the hardcoded value**
   ```tsx
   // Before
   <YStack padding={16} margin={24}>
   ```

2. **Convert to token**
   - 16px → `$4`
   - 24px → `$6`

3. **Replace with token**
   ```tsx
   // After
   <YStack padding="$4" margin="$6">
   ```

### Adding New Tokens

If you need a color or size that doesn't exist:

1. **Add to config** (`packages/config/src/tamagui.config.ts`):
   ```tsx
   const butterGolfColors = {
     // ... existing colors
     newBrand: '#123456', // Add your color
   }
   ```

2. **Document it** (add to this file's token list)

3. **Use it consistently** across the app

---

## Quick Reference

### Most Common Patterns

```tsx
// Background
backgroundColor="$bg"
backgroundColor="$cardBg"

// Text
color="$text"
color="$textDark"
color="$muted"

// Spacing
padding="$4"      // 16px
margin="$6"       // 24px
gap="$3"          // 12px

// Border Radius
borderRadius="$4" // 8px
borderRadius="$6" // 12px

// Font Size
fontSize="$4"     // 14px
fontSize="$5"     // 16px
fontSize="$6"     // 18px

// Hover/Press
hoverStyle={{ backgroundColor: '$green700', scale: 1.02 }}
pressStyle={{ scale: 0.98, opacity: 0.8 }}
```

---

## Getting Help

- Review the [Tamagui documentation](https://tamagui.dev)
- Check existing components in `packages/ui/src/components/`
- Look at the full config in `packages/config/src/tamagui.config.ts`
- Run the audit script: `node scripts/audit-tamagui-usage.js`

---

## Contributing

When adding new components or styles:

1. ✅ Use theme tokens exclusively
2. ✅ Create variants for reusable patterns
3. ✅ Export types alongside components
4. ✅ Test on both web and mobile
5. ✅ Document new patterns in this file

---

**Questions or Suggestions?**  
Open an issue or PR to improve this guide!
