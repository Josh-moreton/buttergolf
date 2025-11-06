# Copilot Instructions Correction - Variant API Documentation

**Date**: November 6, 2025  
**Issue**: PR #113 review comments flagged code using non-existent component APIs  
**Root Cause**: Copilot instructions documented aspirational APIs that were never implemented

## Executive Summary

The `.github/copilot-instructions.md` file contained incorrect documentation for Text and Layout component APIs. After exhaustive validation against the canonical Tamagui documentation and actual component source code, we corrected the instructions to reflect reality.

## Changes Made

### 1. Text Component Color API ❌→✅

**BEFORE (Incorrect)**:
```tsx
// Claimed Text had color variants:
<Text color="secondary">Secondary text</Text>
<Text color="muted">Muted text</Text>
<Text color="primary">Primary colored</Text>
```

**AFTER (Correct)**:
```tsx
// Text uses direct token references:
<Text color="$textSecondary">Secondary text</Text>
<Text color="$textMuted">Muted text</Text>
<Text color="$primary">Primary colored</Text>
```

**Reality Check**:
- Examined `packages/ui/src/components/Text.tsx` - NO color variants defined
- Only has variants for: `size`, `weight`, `align`, `truncate`
- Base color set to `"$text"` in base styles
- Canonical Tamagui docs show: `<Text color="$color">` pattern everywhere

### 2. Layout Component Alignment API ❌→✅

**BEFORE (Incorrect)**:
```tsx
// Claimed Row/Column had custom alignment variants:
<Row align="center" justify="between">
  <Text>Content</Text>
</Row>

<Column align="stretch" justify="center">
  <Text>Content</Text>
</Column>
```

**AFTER (Correct)**:
```tsx
// Row/Column use native React Native flexbox props:
<Row alignItems="center" justifyContent="space-between">
  <Text>Content</Text>
</Row>

<Column alignItems="stretch" justifyContent="center">
  <Text>Content</Text>
</Column>
```

**Reality Check**:
- Examined `packages/ui/src/components/Layout.tsx` - minimal shims with NO variants
- Row: `styled(TamaguiXStack, { name: "Row" })`
- Column: `styled(TamaguiYStack, { name: "Column" })`
- Canonical Tamagui docs show native props: `alignItems`, `justifyContent`

### 3. Added "Understanding Variants vs Direct Token Props" Section ✨

Added comprehensive new documentation section explaining:

#### Two Ways to Use Tamagui Tokens:

**1. Custom Variants** (for component-specific semantics):
- Use plain strings WITHOUT `$` prefix
- Example: `<Button size="lg">` where "lg" is a variant option
- Defined in `styled()` component definitions
- Use for: Button size/tone, Card variant, Input size

**2. Direct Token Props** (for layout & styling):
- Use token values WITH `$` prefix
- Example: `<Row gap="$md">` where "$md" is a direct token
- Use for: gap, padding, margin, colors, borderRadius
- Works on all Tamagui primitives (View, XStack, YStack, Text, etc.)

#### Critical Rules:

⚠️ **NEVER create variants for native props** (gap, padding, alignItems, justifyContent)
- Causes TypeScript intersection type errors
- These props already exist on base components

✅ **Use direct tokens for layout components**
- Row and Column are thin wrappers - use native props
- Example: `<Row gap="$md" alignItems="center">`

❌ **Don't create alignment variants**
- Row/Column DON'T have `align`/`justify` variants
- Use native `alignItems`/`justifyContent` props

### 4. Updated Component API Reference

**Text Component**:
```tsx
<Text
  size="xs | sm | md | lg | xl"     // Variant - exists ✅
  weight="normal | medium | semibold | bold"  // Variant - exists ✅
  align="left | center | right"     // Variant - exists ✅
  truncate={boolean}                // Variant - exists ✅
  color="$token"                    // Direct token - NO variant ❌
>
```

Added note: "Text does NOT have color variants. Always use direct token references."

**Heading Component**:
```tsx
<Heading
  level={1 | 2 | 3 | 4 | 5 | 6}     // Variant - exists ✅
  align="left | center | right"     // Variant - exists ✅
  color="$token"                    // Direct token - NO variant ❌
>
```

Added note: "Heading does NOT have color variants. Use direct token references."

**Row Component**:
```tsx
<Row
  gap="$xs | $sm | $md | $lg | $xl"  // Direct token (native prop)
  alignItems="flex-start | center | flex-end | stretch | baseline"  // Native prop
  justifyContent="flex-start | center | flex-end | space-between | space-around | space-evenly"  // Native prop
  flexWrap="wrap | nowrap"            // Native prop
  width="100%"                        // Native prop
>
```

Added note: "Row is a thin wrapper over XStack - use native React Native flexbox props, not custom variants."

**Column Component**:
```tsx
<Column
  gap="$xs | $sm | $md | $lg | $xl"  // Direct token (native prop)
  alignItems="flex-start | center | flex-end | stretch"  // Native prop
  justifyContent="flex-start | center | flex-end | space-between | space-around | space-evenly"  // Native prop
  width="100%"                        // Native prop
  height="100%"                       // Native prop
>
```

Added note: "Column is a thin wrapper over YStack - use native React Native flexbox props, not custom variants."

## Validation Process

### 1. Component Source Code Review
- ✅ `packages/ui/src/components/Text.tsx` - Confirmed NO color variants
- ✅ `packages/ui/src/components/Layout.tsx` - Confirmed NO align/justify variants
- ✅ Only variants that exist: size, weight, align, truncate (Text), level (Heading), size (Container)

### 2. Canonical Tamagui Documentation Search
- ✅ Searched 25,588-line `TAMAGUI_DOCUMENTATION.md` for variant patterns
- ✅ Pattern: `<Text color=` - Found 6 matches, ALL use `color="$color"` or `color="red"`
- ✅ Pattern: `Text.*variant|color variant` - 0 matches for color variants
- ✅ Pattern: `<XStack.*align=|<YStack.*align=` - 0 matches for alignment variants
- ✅ Tamagui's spread variants are for TOKEN MAPPING (size to fontSize/lineHeight), NOT semantic options

### 3. TypeScript Compilation
- ✅ Current PR code compiles without errors
- ✅ Uses correct APIs: `color="$textSecondary"`, `alignItems="center"`
- ✅ Type checking passes: `pnpm check-types` ✓

## Impact on PR #113

### PR Review Comments (12 total)
All 12 comments from Copilot coding agent were **based on incorrect instructions**:

**Comment Type**: "Use Text color="secondary" instead of color="$textSecondary""
- **Status**: ❌ INCORRECT - Text has NO color variants
- **Action**: Keep current code (`color="$textSecondary"`)
- **Count**: 5 instances

**Comment Type**: "Use Column align="center" instead of alignItems="center""
- **Status**: ❌ INCORRECT - Column has NO align variant
- **Action**: Keep current code (`alignItems="center"`)
- **Count**: 6 instances

**Comment Type**: "Consider using alignSelf variant"
- **Status**: ⚠️ SUBJECTIVE - Not necessarily wrong, but current code is fine
- **Count**: 1 instance

### Recommendation
✅ **Current PR code is 100% correct** - No changes needed to the implementation  
✅ **Merge PR as-is** - All type errors fixed, code follows proper Tamagui patterns  
✅ **Dismiss review comments** - They're based on outdated/incorrect documentation

## Files Modified

1. **`.github/copilot-instructions.md`**:
   - Line ~567: Updated "ALWAYS Use Component Variants" section
   - Line ~600: Updated "ALWAYS Use Layout Components" section  
   - Line ~627: Removed "Text Color Variants" section, replaced with "Using Colors in Text Components"
   - Line ~645: Added comprehensive "Understanding Variants vs Direct Token Props" section (~120 lines)
   - Line ~750: Updated Text API reference
   - Line ~760: Updated Heading API reference
   - Line ~770: Updated Row API reference
   - Line ~785: Updated Column API reference

## Lessons Learned

### For Future Component Development

1. **Always verify component source code** - Documentation can drift from implementation
2. **Check for actual variant definitions** - Don't assume variants exist based on naming patterns
3. **Understand Tamagui's variant system**:
   - Variants are for PREDEFINED OPTIONS, not all prop usage
   - Native props should use direct tokens (gap, padding, alignItems, etc.)
   - Spread variants map TOKEN CATEGORIES to multiple style props
4. **Validate against canonical docs** - Tamagui's official docs are source of truth

### For Documentation Maintenance

1. **Keep copilot-instructions.md in sync** with actual implementations
2. **Review instructions when adding new components** - Ensure documented APIs exist
3. **Add examples from actual codebase** - Verify examples compile
4. **Document both what EXISTS and what DOESN'T** - Prevent misuse

### For Code Reviews

1. **Question review comments that suggest non-existent APIs**
2. **Verify component source** before accepting variant suggestions
3. **Trust TypeScript** - If code compiles with strict mode, it's likely correct
4. **Consult canonical docs** when in doubt

## Verification Checklist

- [x] Examined Text component source - NO color variants found
- [x] Examined Layout component source - NO align/justify variants found
- [x] Searched Tamagui docs for Text color variants - 0 matches
- [x] Searched Tamagui docs for Stack alignment variants - 0 matches
- [x] Verified current PR code compiles - Type checking passes ✅
- [x] Updated Copilot instructions to match reality
- [x] Added comprehensive variant vs. direct token documentation
- [x] Updated all component API references
- [x] Documented lessons learned for future reference

## Conclusion

The Copilot instructions have been corrected to accurately reflect the actual Tamagui APIs and our component implementations. The current PR code is correct and should be merged without changes. All review comments suggesting the use of non-existent variants should be dismissed.

**Key Takeaway**: Always validate documentation against source code and canonical references. Aspirational documentation that doesn't match reality causes more harm than help.
