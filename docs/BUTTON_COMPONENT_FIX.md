# Button Component Fix - Custom YStack Implementation

## Issue Discovery (Nov 10, 2025)

### Problem
The Tamagui `Button` component from the `tamagui` package failed to render on React Native mobile apps. Buttons were completely invisible despite:
- Code changes being applied correctly
- Text updates working (proving file was loading)
- Multiple styling attempts with different approaches
- Clearing Metro bundler cache
- Adding missing dependencies (tamagui, react-native-reanimated)

### Root Cause
The Tamagui Button component has React Native compatibility issues. While the Button exists in the package (`typeof Button === 'object'`), it doesn't render properly on mobile platforms.

### Breakthrough
Testing with base Tamagui primitives revealed:
- ✅ `YStack` renders perfectly
- ✅ Hardcoded hex colors work
- ✅ Press handlers function correctly
- ❌ Tamagui `Button` component doesn't render
- ⚠️ Token variables ($primary, $textInverse) resolution unclear

## Solution

Created a custom Button component wrapping `YStack` with proper variants:

**Location**: `packages/ui/src/components/Button.tsx`

**Implementation**:
```tsx
export const Button = styled(YStack, {
  name: "Button",
  tag: "button",
  
  // Base styles
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 14,
  flexDirection: "row",
  gap: 8,
  cursor: "pointer",
  userSelect: "none",
  
  // Variants
  variants: {
    variant: {
      solid: {
        backgroundColor: "#E25F2F", // Butter Orange
        borderWidth: 0,
      },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: "#E25F2F",
      },
      ghost: {
        backgroundColor: "transparent",
        borderWidth: 0,
      },
    },
    size: {
      sm: {
        height: 40,
        paddingHorizontal: 16,
      },
      md: {
        height: 48,
        paddingHorizontal: 20,
      },
      lg: {
        height: 52,
        paddingHorizontal: 24,
      },
    },
  },
  
  // Interactive states
  pressStyle: {
    opacity: 0.8,
    scale: 0.98,
  },
  hoverStyle: {
    opacity: 0.9,
  },
  
  defaultVariants: {
    variant: "solid",
    size: "md",
  },
});
```

## Usage Pattern

### Correct Usage
```tsx
import { Button, Text } from '@buttergolf/ui'

// Primary button
<Button variant="solid" size="lg" onPress={handlePress}>
  <Text color="#FFFFFF" fontWeight="600">Sign Up</Text>
</Button>

// Outline button
<Button variant="outline" size="md" onPress={handlePress}>
  <Text color="#E25F2F" fontWeight="600">Learn More</Text>
</Button>

// Ghost button (minimal)
<Button variant="ghost" size="sm" onPress={handlePress}>
  <Text>Cancel</Text>
</Button>
```

### Key Differences from Tamagui Button

| Aspect | Old Tamagui Button | New Custom Button |
|--------|-------------------|-------------------|
| Base Component | `tamagui` Button | `YStack` primitive |
| Text Wrapping | Optional | **Required** - wrap in `<Text>` |
| Variants | `chromeless`, `outlined` | `solid`, `outline`, `ghost` |
| Sizes | Token-based (`$3`, `$4`) | Semantic (`sm`, `md`, `lg`) |
| Children | String or JSX | **Must be JSX** (Text component) |

## Files Updated

### Component Implementation
- `packages/ui/src/components/Button.tsx` - Custom YStack-based Button

### Screen/Component Usage
- `packages/app/src/features/onboarding/screen.tsx` - Sign up/sign in buttons
- `packages/app/src/features/rounds/screen.tsx` - Navigation button
- `packages/app/src/components/CategoryButton.tsx` - Category filter buttons
- `apps/web/src/app/listings/_components/FilterSidebar.tsx` - Clear all button
- `apps/web/src/app/listings/ListingsClient.tsx` - Clear filters button
- `apps/web/src/app/listings/_components/ProductsGrid.tsx` - View details button

### Documentation
- `.github/copilot-instructions.md` - Updated Button API reference

## Testing Verification

✅ **Mobile (React Native)**:
- Buttons render correctly with solid variant
- Buttons render correctly with outline variant
- Press handlers work
- Press animations (opacity + scale) work
- Full-width buttons work

✅ **Web (Next.js)**:
- Buttons maintain web compatibility
- Hover states work
- Press states work
- All variants render correctly

## Lessons Learned

1. **Tamagui Button has mobile compatibility issues** - Don't use the built-in Button on React Native
2. **YStack primitives are reliable** - Always test with base components first
3. **Hardcode colors for testing** - Token resolution can add complexity during debugging
4. **Metro cache is tricky** - Clear cache when dependencies or configs change
5. **Test incrementally** - Start with simplest implementation to isolate issues

## Future Considerations

1. **Token Variables**: May want to investigate why `$primary`, `$textInverse` tokens weren't resolving
2. **Other Tamagui Components**: May need to test other complex components (Dialog, Sheet, etc.) for similar issues
3. **Type Safety**: Consider adding stricter TypeScript types for children (require Text component)
4. **Accessibility**: Add proper accessibility props (accessibilityRole, accessibilityLabel)
5. **Loading State**: Add optional loading prop with spinner

## Related Issues

This issue was discovered while fixing the onboarding screen buttons on mobile. Related work:
- Expo updated to 54.0.23
- Added missing dependencies: tamagui, react-native-reanimated
- Removed extra header icons (wishlist, orders, settings)
- Fixed Clerk avatar white circle issue

## References

- Tamagui styled() API: https://tamagui.dev/docs/core/styled
- React Native Pressable: https://reactnative.dev/docs/pressable
- YStack primitive: https://tamagui.dev/ui/stacks
