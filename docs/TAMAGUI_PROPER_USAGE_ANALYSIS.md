# Tamagui Proper Usage Analysis

**Date**: 2025-01-24  
**Branch**: copilot/convert-raw-props-to-variants  
**Status**: 🚨 CRITICAL - TypeScript Configuration Issue Identified

## Executive Summary

After reviewing the official Tamagui documentation (25,588 lines), I've identified that **our entire approach was wrong**. The `{...{ as any }}` workarounds are NOT needed and are "custom nonsense" that the user correctly rejected.

### Key Findings

1. ✅ **Styled components accept ALL base props** - Our Row/Column SHOULD accept fontSize, backgroundColor, etc.
2. ✅ **Variants are ADDITIONAL props** - They don't replace base props, they augment them
3. ❌ **NO workarounds needed** - The `{...{ as any }}` pattern is completely unnecessary
4. 🚨 **TypeScript config issue** - The real problem is type resolution returning `never` for children

## Official Tamagui Documentation Quotes

### On styled() Props

> **From `docs/TAMAGUI_DOCUMENTATION.md` line 19012:**
>
> "You can pass any prop that is supported by the component you are wrapping in styled."

**This means:**

```tsx
// ✅ CORRECT - All of these are valid:
<Row fontSize={14} backgroundColor="$surface" padding="$4">
  <Text>This works!</Text>
</Row>

<Row gap="md" align="center" marginTop="$4">
  <Text color="muted">Variants + raw props</Text>
</Row>

// ❌ WRONG - NO workarounds needed:
<Row {...{ gap: "md" as any }}>  // This is custom nonsense!
  <Text>Don't do this</Text>
</Row>
```

### On Variants

> **From `docs/TAMAGUI_DOCUMENTATION.md` lines 19019-19078:**
>
> Variants provide "a nice balance between simplicity and power" and work **alongside** base props, not as replacements.

**Example from docs:**

```tsx
export const Circle = styled(View, {
  borderRadius: 100_000_000,

  variants: {
    centered: {
      true: {
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    size: {
      '...size': (size, { tokens }) => {
        return {
          width: tokens.size[size] ?? size,
          height: tokens.size[size] ?? size,
        }
      },
    },
  } as const,
})

// Usage: variants AND base props together
<Circle centered size="$lg" backgroundColor="$blue10" padding="$4" />
```

## The Real Problem: TypeScript Type Resolution

### Current Errors

When we try to use our components, we get:

```typescript
// Error: Type 'string' is not assignable to type '"unset" | Omit<never, "unset">'
<Text>Hello World</Text>

// Error: 'Text' components don't accept text as child elements
<Button>Click me</Button>

// Error: Type 'number' is not assignable to type '"unset" | Omit<never, "unset">'
<Text numberOfLines={2}>Text</Text>
```

### Root Cause

The `GetProps` type is somehow resolving to `never` for children and many props. This suggests:

1. **TypeScript version mismatch** - We're using TS 5.9.3, but may need different version
2. **Tamagui version compatibility** - We're using 1.135.7 from catalog
3. **Configuration issue** - Missing compiler options or module resolution settings
4. **Type definition conflicts** - Multiple @types packages or React version conflicts

### Evidence

From error messages:

```typescript
// The type system is breaking down:
type 'children' is '"unset" | Omit<never, "unset">'
//                                    ^^^^^ This should NOT be 'never'

// This means GetProps<typeof Text> is not working correctly
```

## What We Should Be Able To Do

### Correct Pattern 1: Raw Props Only

```tsx
// No variants, just use base XStack/YStack props
<Row
  flexDirection="row"
  alignItems="center"
  justifyContent="space-between"
  gap="$4"
  padding="$4"
  backgroundColor="$surface"
>
  <Text fontSize={14} fontWeight="500" color="$text">
    Hello World
  </Text>
</Row>
```

### Correct Pattern 2: Variants Only

```tsx
// Use our semantic variants
<Row align="center" justify="between" gap="md">
  <Text size="sm" weight="medium" color="default">
    Hello World
  </Text>
</Row>
```

### Correct Pattern 3: Mixed (Most Common)

```tsx
// Variants for common patterns + raw props for specific needs
<Row
  align="center"
  justify="between"
  gap="md"
  paddingHorizontal="$6"
  backgroundColor="$surface"
  marginTop="$4"
>
  <Text
    size="lg"
    color="primary"
    fontSize={18} // Override variant size
    letterSpacing={-0.5} // Additional customization
  >
    Hello World
  </Text>
</Row>
```

### Correct Pattern 4: Media Queries

```tsx
// Media queries should work with ANY prop
<Column
  gap="md"
  padding="$4"
  $gtMd={{
    gap: "$lg",
    padding: "$6",
    flexDirection: "row",
    alignItems: "stretch",
  }}
>
  <Text size="md" $gtMd={{ size: "lg" }}>
    Responsive text
  </Text>
</Column>
```

**Note**: Currently getting type errors like:

```
Type '{ flexDirection: "row"; alignItems: "stretch"; }' is not assignable...
Type '{ size: "lg" }' is not assignable...
```

This confirms the type system is broken, not our usage.

## What's Broken vs What Should Work

### ❌ Currently Broken

1. **Children types** - Can't pass string children to Text/Button
2. **Number props** - Can't pass numbers like `numberOfLines={2}` or `fontSize={18}`
3. **Media query variants** - Can't use `$gtMd={{ size: "lg" }}`
4. **Media query raw props** - Can't use `$gtMd={{ flexDirection: "row" }}`
5. **Animation props** - Can't use `hoverStyle={{ scale: 1.05 }}`
6. **Event handlers** - Can't use `onPress={() => ...}` on styled components
7. **Children arrays** - Can't use `.map()` to render children

### ✅ Should Work (Per Tamagui Docs)

ALL of the above should work! The documentation shows examples of:

- String children in Text components
- Number props everywhere
- Media queries with variants AND raw props
- Animation/interaction props (hoverStyle, pressStyle, focusStyle)
- Event handlers on all components
- Arrays of children

## Investigation Next Steps

### 1. Check React/TypeScript Versions

```bash
# Current versions
"react": "19.2.0"
"typescript": "5.9.3"
"tamagui": "catalog:tamagui" # 1.135.7

# Check if there's a known compatibility issue
```

### 2. Check TypeScript Configuration

```jsonc
// apps/web/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "strict": false, // ⚠️ This might be masking errors
    // ... other options
  },
}
```

Need to check:

- `moduleResolution` strategy
- `skipLibCheck` setting
- Path mappings
- Type roots

### 3. Check Tamagui Catalog Version

```jsonc
// package.json at root
{
  "pnpm": {
    "catalog": {
      "tamagui": "1.135.7",
    },
  },
}
```

Potential issues:

- This version may have type bugs
- React 19.2.0 might be too new
- May need to use `@tamagui/core` directly

### 4. Check for Type Definition Conflicts

```bash
# Search for multiple React type definitions
find . -name "*.d.ts" -path "*/node_modules/@types/react/*"

# Check for conflicting Tamagui versions
pnpm why tamagui
pnpm why @tamagui/core
```

### 5. Try Type-Only Fix

Before changing code, try fixing types:

```tsx
// Option A: Use type assertion at usage site
<Text {...({} as any)}>Hello</Text>;

// Option B: Widen the type definition
import { GetProps as TamaguiGetProps } from "tamagui";

export type TextProps = TamaguiGetProps<typeof Text> & {
  children?: React.ReactNode;
  numberOfLines?: number;
};
```

### 6. Check Official Tamagui Starter

```bash
# Compare with official starter to see if same issue
git clone https://github.com/tamagui/starter-free.git
cd starter-free
pnpm install
# Check if their Text/Button components have same typing issues
```

## Recommended Actions

### Immediate (Today)

1. ❌ **STOP using `{...{ as any }}` pattern** - This is wrong
2. ✅ **Document all type errors** - Create exhaustive list
3. ✅ **Check official starter repo** - Compare type definitions
4. ✅ **Test with direct Tamagui components** - Bypass our styled wrappers

### Short-term (This Week)

1. **Fix TypeScript configuration** - Resolve type resolution issues
2. **Update dependencies** - May need different React/Tamagui versions
3. **Revert to base components** - If styled components too problematic
4. **Consider alternative approach** - Maybe don't use styled() at all

### Long-term (Next Sprint)

1. **Strict TypeScript mode** - Enable once types working
2. **Comprehensive component tests** - Ensure all patterns work
3. **ESLint rules** - Prevent future misuse
4. **Documentation** - Internal guide for Tamagui usage

## Potential Solutions

### Option 1: Fix Type Definitions

Add explicit type definitions to our components:

```tsx
import { GetProps, XStack, XStackProps } from "tamagui";
import { ReactNode } from "react";

export const Row = styled(XStack, {
  // ... variants
});

// Manually fix the type
export type RowProps = Omit<XStackProps, "children"> &
  GetProps<typeof Row> & {
    children?: ReactNode;
  };
```

### Option 2: Use Tamagui Components Directly

Don't create styled wrappers, just use XStack/YStack:

```tsx
// Before (styled wrapper):
import { Row, Column } from '@buttergolf/ui'
<Row align="center" gap="md">

// After (direct usage):
import { XStack } from 'tamagui'
<XStack alignItems="center" gap="$md">
```

**Pros:**

- No type issues
- More flexible
- Official Tamagui patterns

**Cons:**

- Lose semantic variant names
- More verbose props (alignItems vs align)
- Harder to enforce design system

### Option 3: Hybrid Approach

Use styled() only for truly custom components, base components for layouts:

```tsx
// Custom components with styled()
const Card = styled(View, {
  /* variants */
});
const Badge = styled(View, {
  /* variants */
});

// Base components for layouts
import { XStack, YStack } from "tamagui";

<YStack gap="$4">
  <XStack alignItems="center">
    <Card variant="elevated">
      <Badge tone="success">New</Badge>
    </Card>
  </XStack>
</YStack>;
```

### Option 4: Update Tamagui Version

Try latest version or a known-stable version:

```bash
# Check for latest stable
pnpm info tamagui versions

# Try specific version known to work with React 19
pnpm up tamagui@latest
```

## Questions for User

Before proceeding, need to answer:

1. **Priority**: Fix types or use workaround?
2. **Scope**: Fix all styled components or just critical ones?
3. **Approach**: Keep styled() or switch to raw Tamagui?
4. **Timeline**: Need working now or can take time to do it right?

## Conclusion

The good news: **We were using Tamagui correctly conceptually** (mixing variants and raw props is fine).

The bad news: **Our TypeScript configuration is broken**, causing the type system to resolve `never` for props that should work.

The `{...{ as any }}` workaround we used is NOT the solution - it's masking the real problem. We need to fix the root cause (TypeScript/Tamagui type resolution) rather than work around it.

### Next Immediate Step

Run diagnostics to identify exact cause of type resolution failure:

```bash
# 1. Check versions
pnpm list react react-dom typescript tamagui

# 2. Check type definitions
ls -la node_modules/@types/

# 3. Test with official starter
# Compare type definitions in starter-free vs our project

# 4. Try minimal reproduction
# Create simple test file with just Text component
```

Once we identify the root cause, we can apply the appropriate fix rather than working around symptoms.

---

## Appendix: Example Type Errors

### Error 1: Children Type

```typescript
// Source:
<Text>Hello</Text>

// Error:
'Text' components don't accept text as child elements.
Text in JSX has the type 'string', but the expected type
of 'children' is '"unset" | Omit<never, "unset">'.
```

**Analysis**: `Omit<never, "unset">` indicates type resolution failure. Should be `React.ReactNode`.

### Error 2: Number Props

```typescript
// Source:
<Text numberOfLines={2}>Text</Text>

// Error:
Type 'number' is not assignable to type
'"unset" | Omit<never, "unset">'.
```

**Analysis**: Same issue - `never` type breaking prop types.

### Error 3: Media Query Variants

```typescript
// Source:
<Column $gtMd={{ flexDirection: "row" }}>

// Error:
Type '{ flexDirection: "row"; }' is not assignable to type
'WithThemeValues<StackStyleBase & { [x: string]: Omit<never, "unset">; }> ...'
```

**Analysis**: Media query type expecting `never`, should accept all base props.

### Error 4: Animation Props

```typescript
// Source:
<Card hoverStyle={{ scale: 1.05 }}>

// Error:
Property 'scale' is incompatible with index signature.
Type 'number' is not assignable to type
'"unset" | Omit<never, "unset">'.
```

**Analysis**: `scale` is valid Tamagui animation prop, type system broken.

All errors have the same root cause: **Type resolution returning `never` instead of proper types**.
