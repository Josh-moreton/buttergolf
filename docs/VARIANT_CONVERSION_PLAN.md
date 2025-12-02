# Variant Conversion Plan

## Overview

This document outlines the comprehensive plan to convert all raw Tamagui props to variant-based props in our styled components (`Row`, `Column`, `Text` from `@buttergolf/ui`). This conversion is required because PR #71 introduced styled wrapper components that only accept variant props, while existing code uses raw Tamagui props.

**Root Cause**: Styled components using `styled(XStack, { variants: {...} })` pattern restrict props to only the defined variants, rejecting raw props like `fontSize={14}` or `justifyContent="center"`.

**Solution**: Systematically rewrite all component usage to use semantic variants instead of raw props.

---

## Raw Prop → Variant Mapping

### Text Component Variants

#### Size Variants (fontSize → size)

```tsx
// Variant mappings (defined in packages/ui/src/components/Text.tsx)
size="xs" → fontSize: '$2'  (12px equivalent)
size="sm" → fontSize: '$3'  (14px equivalent)
size="md" → fontSize: '$4'  (16px equivalent) [default]
size="lg" → fontSize: '$5'  (20px equivalent)
size="xl" → fontSize: '$6'  (24px equivalent)
```

**Conversion Table**:
| Raw Prop | Variant Equivalent | Notes |
|----------|-------------------|-------|
| `fontSize={10}` | `size="xs"` | Smallest variant, may need custom if smaller |
| `fontSize={12}` | `size="xs"` | Maps to $2 |
| `fontSize={13}` | `size="xs"` or `size="sm"` | Between xs and sm, choose closest |
| `fontSize={14}` | `size="sm"` | Common body text |
| `fontSize={15}` | `size="sm"` or `size="md"` | Between sm and md |
| `fontSize={16}` | `size="md"` | Default size |
| `fontSize={18}` | `size="lg"` | Slightly smaller than lg |
| `fontSize={20}` | `size="lg"` | Maps to $5 |
| `fontSize={22}` | `size="xl"` | Slightly smaller than xl |
| `fontSize={24}` | `size="xl"` | Maps to $6 |
| `fontSize={28}` | Custom style needed | Larger than any variant |
| `fontSize={64}` | Custom style needed | Much larger than any variant |

#### Weight Variants (fontWeight → weight)

```tsx
weight="normal"   → fontWeight: '400'
weight="medium"   → fontWeight: '500'
weight="semibold" → fontWeight: '600'
weight="bold"     → fontWeight: '700'
```

**Conversion Table**:
| Raw Prop | Variant Equivalent |
|----------|-------------------|
| `fontWeight="400"` | `weight="normal"` |
| `fontWeight="500"` | `weight="medium"` |
| `fontWeight="600"` | `weight="semibold"` |
| `fontWeight="700"` | `weight="bold"` |
| `fontWeight="800"` | `weight="bold"` + custom style |

#### Color Variants (color → color variant)

```tsx
color="default"   → color: '$text'
color="secondary" → color: '$textSecondary'
color="tertiary"  → color: '$textTertiary'
color="muted"     → color: '$textMuted'
color="inverse"   → color: '$textInverse'
color="primary"   → color: '$primary'
color="error"     → color: '$error'
color="success"   → color: '$success'
color="warning"   → color: '$warning'
```

**Conversion Table**:
| Raw Prop | Variant Equivalent |
|----------|-------------------|
| `color="$text"` | `color="default"` |
| `color="$textSecondary"` | `color="secondary"` |
| `color="$textMuted"` | `color="muted"` |
| `color="$textInverse"` | `color="inverse"` |
| `color="$primary"` | `color="primary"` |
| `color="$info"` | `color="primary"` (closest match) |
| `color="$error"` | `color="error"` |

#### Align Variants

```tsx
align="left"   → textAlign: 'left'
align="center" → textAlign: 'center'
align="right"  → textAlign: 'right'
```

### Layout Component Variants (Row, Column)

#### Gap Variants (gap → gap variant)

```tsx
gap="xs" → gap: '$xs'  (4px)
gap="sm" → gap: '$sm'  (8px)
gap="md" → gap: '$md'  (16px)
gap="lg" → gap: '$lg'  (24px)
gap="xl" → gap: '$xl'  (32px)
```

**Conversion Table**:
| Raw Prop | Variant Equivalent |
|----------|-------------------|
| `gap="$2"` | `gap="xs"` |
| `gap="$3"` | `gap="sm"` |
| `gap="$4"` | `gap="md"` |
| `gap="$5"` | `gap="lg"` |
| `gap="$6"` | `gap="xl"` |

#### Align Variants (alignItems → align)

```tsx
align="start"    → alignItems: 'flex-start'
align="center"   → alignItems: 'center'
align="end"      → alignItems: 'flex-end'
align="stretch"  → alignItems: 'stretch'
align="baseline" → alignItems: 'baseline' (Row only)
```

**Conversion Table**:
| Raw Prop | Variant Equivalent |
|----------|-------------------|
| `alignItems="flex-start"` | `align="start"` |
| `alignItems="center"` | `align="center"` |
| `alignItems="flex-end"` | `align="end"` |
| `alignItems="stretch"` | `align="stretch"` |
| `alignItems="baseline"` | `align="baseline"` |

#### Justify Variants (justifyContent → justify)

```tsx
justify="start"   → justifyContent: 'flex-start'
justify="center"  → justifyContent: 'center'
justify="end"     → justifyContent: 'flex-end'
justify="between" → justifyContent: 'space-between'
justify="around"  → justifyContent: 'space-around'
justify="evenly"  → justifyContent: 'space-evenly'
```

**Conversion Table**:
| Raw Prop | Variant Equivalent |
|----------|-------------------|
| `justifyContent="flex-start"` | `justify="start"` |
| `justifyContent="center"` | `justify="center"` |
| `justifyContent="flex-end"` | `justify="end"` |
| `justifyContent="space-between"` | `justify="between"` |
| `justifyContent="space-around"` | `justify="around"` |
| `justifyContent="space-evenly"` | `justify="evenly"` |

#### Other Variants

```tsx
wrap={true}      → flexWrap: 'wrap'
fullWidth={true} → width: '100%'
fullHeight={true} → height: '100%' (Column only)
```

---

## Files Requiring Conversion

### Priority 1: Header Components (Critical - User Facing)

#### 1. `apps/web/src/app/_components/header/MarketplaceHeader.tsx`

**Status**: 🔴 Critical - 15+ raw prop usages
**Impact**: High - Main navigation header, always visible

**Raw Props Found**:

- `fontSize={14}` - Used multiple times
- `fontSize={20}` - Logo/title text
- `fontSize={12}` - Small text
- `fontSize={10}` - Very small text
- `gap="$3"` - Multiple instances
- `justifyContent="center"` - Layout positioning
- `alignItems="center"` - Layout positioning
- `color="$textInverse"` - Text colors

**Conversion Checklist**:

- [ ] Replace all `fontSize={14}` with `size="sm"`
- [ ] Replace all `fontSize={20}` with `size="lg"`
- [ ] Replace all `fontSize={12}` with `size="xs"`
- [ ] Replace all `fontSize={10}` with `size="xs"` or custom style
- [ ] Replace `gap="$3"` with `gap="sm"`
- [ ] Replace `justifyContent="center"` with `justify="center"`
- [ ] Replace `alignItems="center"` with `align="center"`
- [ ] Replace `color="$textInverse"` with `color="inverse"`
- [ ] Remove any `fontWeight` props, use `weight` variant instead
- [ ] Test header renders correctly
- [ ] Verify Beta badge positioning

**Estimated Changes**: ~15-20 replacements

---

#### 2. `apps/web/src/app/_components/header/DesktopMenu.tsx`

**Status**: 🔴 Critical - 6 raw prop usages with type casts
**Impact**: High - Navigation menu

**Raw Props Found**:

- `fontSize={14}` - Used 3 times
- `{...{ gap: "xl" as any }}` - Type cast workaround
- Other layout props with type casts

**Conversion Checklist**:

- [ ] Replace all `fontSize={14}` with `size="sm"`
- [ ] Replace `{...{ gap: "xl" as any }}` with `gap="xl"`
- [ ] Remove all `as any` type casts
- [ ] Verify menu items render correctly
- [ ] Test hover states work

**Estimated Changes**: ~6-8 replacements

---

### Priority 2: Marketplace Sections

#### 3. `apps/web/src/app/_components/marketplace/HeroSectionNew.tsx`

**Status**: 🟡 High Priority - 10+ raw props with type casts
**Impact**: Medium-High - Hero section, first visual

**Raw Props Found**:

- `fontSize={64}` - Large hero text (no variant equivalent)
- `fontSize={28}` - Subheading
- `fontSize={22}` - Price text
- `fontSize={18}` - Card titles
- `fontSize={16}` - Multiple instances
- `fontSize={15}` - Description text
- `fontSize={13}` - Small text
- `fontSize={10}` - Very small labels
- `fontWeight="700"`, `fontWeight="600"`, `fontWeight="800"` - Multiple weights
- `{...{ color: "$info" as any }}` - Type cast for colors
- `{...{ color: "$text" as any }}` - Type cast for colors
- `{...{ color: "$textSecondary" as any }}` - Type cast for colors
- `{...{ color: "$textMuted" as any }}` - Type cast for colors

**Conversion Checklist**:

- [ ] Replace `fontSize={64}` with custom style (too large for variants)
- [ ] Replace `fontSize={28}` with custom style or `size="xl"` + custom
- [ ] Replace `fontSize={22}` with `size="xl"` (closest match)
- [ ] Replace `fontSize={18}` with `size="lg"`
- [ ] Replace `fontSize={16}` with `size="md"`
- [ ] Replace `fontSize={15}` with `size="sm"` or `size="md"`
- [ ] Replace `fontSize={13}` with `size="xs"` or `size="sm"`
- [ ] Replace `fontSize={10}` with `size="xs"` or custom style
- [ ] Replace `fontWeight="700"` with `weight="bold"`
- [ ] Replace `fontWeight="600"` with `weight="semibold"`
- [ ] Replace `fontWeight="800"` with `weight="bold"` + custom style
- [ ] Replace `{...{ color: "$info" as any }}` with `color="primary"` (closest match)
- [ ] Replace `{...{ color: "$text" as any }}` with `color="default"`
- [ ] Replace `{...{ color: "$textSecondary" as any }}` with `color="secondary"`
- [ ] Replace `{...{ color: "$textMuted" as any }}` with `color="muted"`
- [ ] Remove all `as any` type casts
- [ ] Test hero section renders correctly
- [ ] Verify large text sizes look appropriate

**Estimated Changes**: ~15-20 replacements

**Special Note**: Large font sizes (64px, 28px) exceed variant maximums. Options:

1. Use `size="xl"` + inline `fontSize` override for specific values
2. Create custom styled component for hero text
3. Use raw Tamagui `Text` from `tamagui` import for these specific instances

---

#### 4. `apps/web/src/app/_components/marketplace/CategoriesSection.tsx`

**Status**: 🟢 Needs Verification
**Impact**: Medium - Category grid

**Action**:

- [ ] Read file and check for raw props
- [ ] Convert if needed
- [ ] Test category grid renders correctly

---

#### 5. `apps/web/src/app/_components/marketplace/RecentlyListedSection.tsx`

**Status**: 🟢 Needs Verification
**Impact**: Medium - Product listings

**Action**:

- [ ] Read file and check for raw props
- [ ] Convert if needed
- [ ] Test product cards render correctly

---

#### 6. `apps/web/src/app/_components/marketplace/NewsletterSection.tsx`

**Status**: 🟢 Needs Verification
**Impact**: Low - Newsletter signup

**Action**:

- [ ] Read file and check for raw props
- [ ] Convert if needed

---

#### 7. `apps/web/src/app/_components/marketplace/FooterSection.tsx`

**Status**: 🟢 Needs Verification
**Impact**: Low - Footer

**Action**:

- [ ] Read file and check for raw props
- [ ] Convert if needed

---

### Priority 3: Other Components

#### 8. `apps/web/src/app/_components/MarketplaceHomeClient.tsx`

**Status**: 🟢 Low Priority - Likely already correct
**Impact**: Low - Wrapper component

**Action**:

- [ ] Verify imports and prop usage
- [ ] Confirm no type errors

---

#### 9. `apps/web/src/app/_components/AppPromoBanner.tsx`

**Status**: ⚪ Skip - Not part of this task
**Impact**: None - Uses inline styles, not Row/Column/Text

**Reason**: This file uses plain `div` and `style` props from PR #72 (mobile UX improvements). It doesn't use our styled components, so it's not affected by this conversion.

---

## Edge Cases & Solutions

### 1. Font Sizes Larger Than Variants

**Problem**: `fontSize={64}`, `fontSize={28}` exceed variant maximum of `size="xl"` ($6 = 24px)

**Solutions** (choose one per use case):

- **Option A**: Use closest variant + inline override
  ```tsx
  <Text size="xl" fontSize={64}>
    Hero Text
  </Text>
  ```
- **Option B**: Import raw Text for these specific instances

  ```tsx
  import { Text as TamaguiText } from "tamagui";

  <TamaguiText fontSize={64} fontWeight="700">
    Hero Text
  </TamaguiText>;
  ```

- **Option C**: Create custom hero text component
  ```tsx
  // packages/ui/src/components/HeroText.tsx
  export const HeroText = styled(TamaguiText, {
    fontSize: "$8", // or custom token
    fontWeight: "700",
    // ...
  });
  ```

**Recommendation**: Option A for simplicity, Option C for long-term design system

---

### 2. Font Weights Not in Variants

**Problem**: `fontWeight="800"` exceeds variant maximum of `weight="bold"` (700)

**Solution**: Use closest variant + inline override

```tsx
<Text weight="bold" fontWeight="800">
  Extra Bold Text
</Text>
```

---

### 3. Token Colors Not in Variants

**Problem**: `color="$info"` not in Text color variants

**Mapping**:

- `$info` → `color="primary"` (closest semantic match)
- If needed, can add inline: `<Text color="primary" color="$info">` (inline overrides variant)

---

### 4. Media Query Props

**Problem**: `$md={{ fontSize: 24 }}` - responsive font sizes

**Solution**: Variants work with media queries

```tsx
// Before
<Text fontSize={16} $md={{ fontSize: 24 }}>

// After
<Text size="md" $md={{ size: "xl" }}>
```

Or use inline for custom values:

```tsx
<Text size="md" $md={{ fontSize: 28 }}>
```

---

### 5. Type Casts with `as any`

**Problem**: `{...{ color: "$info" as any }}` indicates props not accepted by typed component

**Solution**: Remove spread operator and type cast, use proper variant

```tsx
// Before
<Text {...{ color: "$info" as any }}>

// After
<Text color="primary">  // or inline: color="$info"
```

---

## Props That Should Remain Raw

Some props are **not covered by variants** and should remain as-is:

- `position` - absolute, relative, etc.
- `width`, `height` - specific sizing
- `padding`, `margin` - specific spacing (when not using variants)
- `backgroundColor` - background colors
- `borderRadius` - border styling
- `opacity` - transparency
- `zIndex` - stacking order
- `transform` - transformations
- Media query overrides for non-variant props

These props work on both styled and raw components.

---

## Conversion Process (Step-by-Step)

### For Each File:

1. **Read Current File**

   ```bash
   # Review current implementation
   cat apps/web/src/app/_components/header/MarketplaceHeader.tsx
   ```

2. **Identify Raw Props**
   - Look for `fontSize={number}`
   - Look for `fontWeight="number"`
   - Look for `justifyContent=`, `alignItems=`
   - Look for `gap="$number"`
   - Look for `color="$token"`
   - Look for type casts `as any`

3. **Map to Variants**
   - Use conversion tables above
   - Note edge cases (fonts > xl, weights > bold)

4. **Apply Conversions**
   - Replace string by string with sufficient context
   - Use `replace_string_in_file` tool
   - Include 3+ lines of context before/after

5. **Check Type Errors**

   ```bash
   pnpm check-types
   ```

6. **Test Visually**

   ```bash
   pnpm dev:web
   # Navigate to component and verify rendering
   ```

7. **Move to Next File**
   - Mark current file as complete in checklist
   - Proceed to next priority file

---

## Testing Strategy

### After Each File Conversion:

1. **Type Check**

   ```bash
   pnpm check-types --filter web
   ```

   - ✅ Should have 0 errors for converted file
   - 🔴 If errors remain, review mappings

2. **Visual Test**

   ```bash
   pnpm dev:web
   ```

   - Navigate to component in browser
   - Compare to original/working screenshot
   - Check responsive behavior

3. **Commit**
   ```bash
   git add apps/web/src/app/_components/[file]
   git commit -m "fix: convert [component] to use variant props"
   ```

### After All Conversions:

1. **Full Type Check**

   ```bash
   pnpm check-types
   ```

   - ✅ Should have 0 errors across workspace

2. **Build Test**

   ```bash
   pnpm build:web
   ```

   - ✅ Should build successfully

3. **Visual Regression**
   - Navigate through all marketplace pages
   - Compare to original working version (commit 1d78f6e)
   - Verify no layout breakage

4. **Responsive Test**
   - Test mobile, tablet, desktop breakpoints
   - Verify media queries work with variants

---

## Success Criteria

- [ ] **Zero TypeScript errors** in all converted files
- [ ] **No type casts** (`as any`) remain in component props
- [ ] **All components use variants** for layout (gap, align, justify) and typography (size, weight, color)
- [ ] **Layout renders correctly** - matches original working version
- [ ] **No visual regressions** - header, hero, cards all display properly
- [ ] **Responsive behavior works** - media queries function with variants
- [ ] **Design system enforced** - all styled components follow variant patterns
- [ ] **Build succeeds** - `pnpm build:web` completes without errors

---

## Implementation Order

Execute in this order to minimize risk and get quick wins:

1. ✅ **Create this plan document** (current step)
2. 🔴 **MarketplaceHeader.tsx** - Most critical, user-facing
3. 🔴 **DesktopMenu.tsx** - Critical navigation
4. 🟡 **HeroSectionNew.tsx** - High impact, complex edge cases
5. 🟢 **CategoriesSection.tsx** - Verify and convert if needed
6. 🟢 **RecentlyListedSection.tsx** - Verify and convert if needed
7. 🟢 **NewsletterSection.tsx** - Verify and convert if needed
8. 🟢 **FooterSection.tsx** - Verify and convert if needed
9. 🟢 **MarketplaceHomeClient.tsx** - Final verification
10. ✅ **Full testing and validation**

---

## Rollback Plan

If conversions cause issues:

1. **Per-file rollback**:

   ```bash
   git checkout HEAD -- apps/web/src/app/_components/[file]
   ```

2. **Full rollback**:

   ```bash
   git checkout HEAD -- apps/web/src/app/_components/
   ```

3. **Nuclear option** (revert to working commit):
   ```bash
   git checkout 1d78f6e -- apps/web/src/app/_components/
   ```

---

## Future Improvements

After this conversion is complete, consider:

1. **Add ESLint rule** to prevent raw prop usage on styled components
2. **Extend variants** if common patterns emerge (e.g., size="2xl" for hero text)
3. **Create specialized components** for edge cases (HeroText, DisplayText)
4. **Document variant usage** in component guide
5. **Add Storybook stories** showing all variant combinations
6. **Create migration script** to automatically convert raw props to variants in future

---

## Notes

- **Commit Strategy**: Commit after each file to make rollback easier
- **Testing Priority**: Focus on visual correctness over micro-optimizations
- **Edge Case Handling**: When in doubt, use closest variant + inline override
- **Type Safety**: Prefer typed variants over type casts
- **Design System**: This conversion enforces our design system - that's the goal

---

## Estimated Time

- **Planning**: ✅ Complete
- **MarketplaceHeader**: ~30 minutes
- **DesktopMenu**: ~15 minutes
- **HeroSectionNew**: ~45 minutes (edge cases)
- **Other sections**: ~15 minutes each (4 files = ~1 hour)
- **Testing & validation**: ~30 minutes

**Total**: ~3-4 hours for complete conversion

---

## Contact & Questions

If you encounter:

- Props that don't map to variants
- Layout behavior that breaks
- Type errors that persist

Review this document, check the variant definitions in:

- `packages/ui/src/components/Layout.tsx`
- `packages/ui/src/components/Text.tsx`

And consider the edge case solutions above.
