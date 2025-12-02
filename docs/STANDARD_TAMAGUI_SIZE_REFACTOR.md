# Standard Tamagui Size System - Refactor Complete

## Executive Summary

Successfully refactored the entire codebase to use **standard Tamagui patterns** for the size system. All typography components now use `size="$n"` (numeric tokens) instead of the non-standard `fontSize="$n"` pattern.

**Status**: ✅ Complete
**Date**: November 18, 2025
**Type Checking**: ✅ All passing
**Files Changed**: 100+ files across apps and packages

---

## What Changed

### Before (Non-Standard Approach)

```tsx
// Typography - using fontSize (WRONG)
<Text fontSize="$4">Body text</Text>
<Text fontSize="$3" color="$textMuted">Small text</Text>
<Heading level={2}>Title</Heading>

// UI Components - using size variants (correct)
<Button size="md">Click me</Button>
<Input size="lg" />
```

### After (Standard Tamagui Approach)

```tsx
// Typography - using size (CORRECT ✅)
<Text size="$4">Body text</Text>
<Text size="$3" color="$textMuted">Small text</Text>
<Heading level={2}>Title</Heading>

// UI Components - using size variants (still correct ✅)
<Button size="md">Click me</Button>
<Input size="lg" />
```

---

## Technical Implementation

### 1. Text Component Refactor

**File**: `packages/ui/src/components/Text.tsx`

**Key Change**: Use `Paragraph` as base instead of `Text` to get built-in `size` variant support:

```tsx
// BEFORE (custom approach)
export const Text = styled(TamaguiText, {
  fontSize: "$5", // Manual default
  // No size variant support
});

// AFTER (standard Tamagui)
export const Text = styled(TamaguiParagraph, {
  name: "Text",
  color: "$text",
  fontFamily: "$body",
  // Inherits size variant from Paragraph - supports size="$1" through size="$16"
  variants: {
    weight: {
      /* custom weight variants */
    },
    align: {
      /* custom align variants */
    },
    truncate: {
      /* custom truncate variant */
    },
  },
});
```

**Why Paragraph?**

- Tamagui's `Paragraph` component has the `size` variant system built-in
- Maps `size="$n"` to `tokens.size[n]` for fontSize and lineHeight
- Standard pattern recommended by Tamagui documentation

### 2. Heading Component Refactor

**File**: `packages/ui/src/components/Text.tsx`

**Key Change**: Use `Paragraph` as base and set `fontSize` in variants, allowing size override:

```tsx
// BEFORE
const HeadingBase = styled(TamaguiText, {
  /* config */
});

export const Heading = styled(HeadingBase, {
  variants: {
    level: {
      1: { tag: "h1", size: "$10" }, // Used size in variant
    },
  },
});

// AFTER (allows size override)
export const Heading = styled(TamaguiParagraph, {
  variants: {
    level: {
      1: { tag: "h1", fontSize: "$10" }, // Use fontSize in variant
      // Now caller can override with size="$9" if needed
    },
  },
});
```

### 3. Label Component Update

**File**: `packages/ui/src/components/Text.tsx`

```tsx
// BEFORE
export const Label = styled(TamaguiLabel, {
  fontSize: "$3", // Manual fontSize
});

// AFTER
export const Label = styled(TamaguiLabel, {
  size: "$3", // Standard size prop
});
```

### 4. Automated Codebase Migration

Used Perl to replace all `fontSize="$n"` with `size="$n"` across the codebase:

```bash
find apps/web apps/mobile packages/app packages/ui -type f \
  \( -name "*.tsx" -o -name "*.ts" \) \
  -not -path "*/node_modules/*" \
  -exec perl -i -pe 's/fontSize="(\$\d+)"/size="$1"/g' {} \;
```

**Result**:

- 100+ files updated automatically
- All Text components now use `size="$n"`
- No manual file-by-file changes needed

### 5. Fixed Duplicate size Props

Found and fixed instances where both component size variant AND typography size were used:

```tsx
// BEFORE (ERROR - duplicate size)
<Button size="lg" size="$5">Click</Button>

// AFTER (FIXED)
<Button size="lg">Click</Button>
// The Button's lg variant already sets appropriate font size internally
```

---

## Configuration Updates

### Tamagui Config Documentation

**File**: `packages/config/src/tamagui.config.ts`

Updated documentation header to reflect standard approach:

```typescript
/**
 * 1. TYPOGRAPHY SIZE TOKENS (Numeric: $1 - $16) - THE STANDARD TAMAGUI WAY
 *    - Used with: size="$n" prop on Text, Paragraph, Heading, Label
 *    - Example: <Text size="$4">Body text</Text>
 *    - The size prop automatically handles fontSize AND lineHeight from tokens
 *    - fontSize prop is for rare overrides only, not standard usage
 *
 * 2. COMPONENT SIZE VARIANTS (Named: sm | md | lg)
 *    - Used for: Geometric sizing (height, padding) of UI components
 *    - Example: <Button size="md">Click me</Button>
 *    - Internally, these variants use tokens.size for fontSize where appropriate
 */
```

**Key Points**:

- ✅ Clarified that `size="$n"` is the STANDARD way for typography
- ✅ Explained `fontSize` is for overrides only
- ✅ Maintained distinction between typography tokens and component variants

---

## Documentation Updates

### 1. Component Documentation

**Files Updated**:

- `packages/ui/src/components/Text.tsx` - Header comments
- `packages/config/src/tamagui.config.ts` - Top-level documentation

**Key Message**:

```tsx
/**
 * For TEXT COMPONENTS (Text, Heading, Paragraph, Label):
 *    - Use numeric tokens: size="$1" through size="$16" (standard Tamagui way)
 *    - These control fontSize and lineHeight from the font scale
 *    - Example: <Text size="$4">Body text</Text>
 *    - fontSize prop is for rare overrides only
 */
```

### 2. Copilot Instructions (To Be Updated)

**File**: `.github/copilot-instructions.md`

**Required Changes** (for next phase):

- Replace all guidance saying "use fontSize on Text"
- Update to say "use size on Text"
- Keep component size variant guidance unchanged
- Update examples to show `size="$n"` pattern

---

## Token Reference

### Font Size Tokens (via size prop)

| Token  | Body Font | Heading Font | Use Case                  |
| ------ | --------- | ------------ | ------------------------- |
| `$1`   | 11px      | 12px         | Legal text, tiny labels   |
| `$2`   | 12px      | 14px         | Captions, metadata        |
| `$3`   | 13px      | 16px         | Small labels, helper text |
| `$4`   | 14px      | 18px         | Body small                |
| `$5`   | **15px**  | **20px**     | **Default body/heading**  |
| `$6`   | 16px      | 24px         | Large body text           |
| `$7`   | 18px      | 28px         | Subheadings               |
| `$8`   | 20px      | 32px         | Large subheadings         |
| `$9`   | 22px      | 40px         | Small headings            |
| `$10`  | 24px      | 48px         | Medium headings           |
| `$11`  | 28px      | 56px         | Large headings            |
| `$12`  | 32px      | 64px         | XL headings               |
| `$13+` | 40px+     | 72px+        | Hero/display text         |

### Component Size Variants

| Component | `sm`       | `md`       | `lg`       |
| --------- | ---------- | ---------- | ---------- |
| Button    | 32px h     | 40px h     | 48px h     |
| Input     | 32px h     | 40px h     | 48px h     |
| Badge     | 20px min-h | 24px min-h | 28px min-h |
| Spinner   | 16px       | 20px       | 24px       |

---

## Usage Patterns

### Typography (Standard Tamagui)

```tsx
// ✅ CORRECT - Use size with numeric tokens
<Text size="$4">Regular body text (14px)</Text>
<Text size="$5">Larger body text (15px)</Text>
<Text size="$3" color="$textMuted">Small text</Text>

// Headings with level (default size) or explicit size override
<Heading level={1}>Page Title (uses $10 = 48px)</Heading>
<Heading level={2} size="$12">Custom size title</Heading>

// Labels
<Label size="$3">Form label (13px)</Label>

// ❌ WRONG - Don't use fontSize for normal cases
<Text fontSize="$4">Don't do this</Text>
<Text fontSize={16}>Only for exceptional overrides</Text>
```

### UI Components (Component Variants)

```tsx
// ✅ CORRECT - Use named size variants
<Button size="md" tone="primary">Medium button</Button>
<Input size="lg" placeholder="Large input" />
<Badge size="sm" variant="success">Small badge</Badge>
<Spinner size="lg" />

// ❌ WRONG - Don't use numeric tokens on UI components
<Button size="$5">Error!</Button>
```

---

## Type Safety

### Before Refactor

```typescript
// Text component didn't expose size prop
<Text size="$4"> // ❌ TypeScript error
```

### After Refactor

```typescript
// Text component properly inherits size from Paragraph
<Text size="$4"> // ✅ TypeScript happy
<Text size="$1" | "$2" | ... "$16"> // Full autocomplete support
```

**TypeScript Benefits**:

- ✅ Full autocomplete for `size` prop on Text/Heading/Label
- ✅ Type checking ensures valid token values
- ✅ Inherits all Tamagui Paragraph props (color, textAlign, etc.)
- ✅ Better IDE support and developer experience

---

## Testing Results

### Type Checking

```bash
$ pnpm check-types

✅ @buttergolf/ui#check-types - PASSED
✅ @buttergolf/app#check-types - PASSED
✅ web#check-types - PASSED
✅ mobile#check-types - PASSED

Tasks: 4 successful, 4 total
Time: 11.899s
```

### Runtime Testing

- ✅ No console errors about missing size tokens
- ✅ All typography renders correctly
- ✅ Font sizes match design system
- ✅ Line heights are correct
- ✅ Component variants work as expected

---

## Files Changed

### Core Components

- ✅ `packages/ui/src/components/Text.tsx` - Refactored to use Paragraph base
- ✅ `packages/config/src/tamagui.config.ts` - Updated documentation

### Apps (Automated Changes)

- ✅ `apps/web/**/*.tsx` - 50+ files updated
- ✅ `apps/mobile/**/*.tsx` - 10+ files updated
- ✅ `packages/app/**/*.tsx` - 20+ files updated

### Documentation (To Be Updated)

- ⏳ `.github/copilot-instructions.md` - Needs update to reflect standard approach
- ⏳ `docs/TAMAGUI_SIZE_SYSTEM.md` - Needs update or removal
- ✅ `docs/STANDARD_TAMAGUI_SIZE_REFACTOR.md` - This file (new)

---

## Benefits of Standard Approach

### 1. Maintainability

- Aligns with official Tamagui documentation
- Easier for new developers familiar with Tamagui
- Can copy/paste examples from Tamagui docs without modification

### 2. Consistency

- Same pattern across web and mobile
- Predictable behavior
- Less cognitive load (one way to do things)

### 3. TypeScript Support

- Better autocomplete
- Proper type inference
- Catches errors at compile time

### 4. Future-Proof

- Compatible with Tamagui updates
- Can leverage new Tamagui features
- Community solutions work out of the box

---

## Next Steps

### Immediate

- [x] Refactor Text component to use Paragraph base
- [x] Automated replacement of fontSize with size
- [x] Fix type errors
- [x] Verify type checking passes
- [x] Create this documentation

### Short Term

- [ ] Update `.github/copilot-instructions.md`
- [ ] Review and update or archive `docs/TAMAGUI_SIZE_SYSTEM.md`
- [ ] Update component library README

### Long Term

- [ ] Add ESLint rule to prevent `fontSize="$n"` pattern
- [ ] Visual regression tests for typography scale
- [ ] Developer training/onboarding docs

---

## Migration Guide for Future Changes

If you need to add a new typography component:

### ✅ DO

```tsx
import { Paragraph } from "tamagui";

export const MyText = styled(Paragraph, {
  name: "MyText",
  // Your custom styles
  variants: {
    // Your custom variants
  },
});

// Usage
<MyText size="$4">Text</MyText>;
```

### ❌ DON'T

```tsx
export const MyText = styled(Text, {
  fontSize: "$5", // Don't set fontSize as default
  variants: {
    size: {
      /* custom size system */
    }, // Don't reinvent size
  },
});
```

---

## Common Pitfalls to Avoid

### 1. Mixing size contexts

```tsx
// ❌ WRONG
<Button size="$4">Button</Button>  // Button uses component variant, not tokens
<Text size="md">Text</Text>        // Text uses tokens, not named variants

// ✅ CORRECT
<Button size="md">Button</Button>  // Component variant
<Text size="$4">Text</Text>        // Token
```

### 2. Using fontSize instead of size

```tsx
// ❌ WRONG (old pattern)
<Text fontSize="$4">Text</Text>

// ✅ CORRECT (standard)
<Text size="$4">Text</Text>
```

### 3. Overriding heading size incorrectly

```tsx
// ❌ WRONG
<Heading level={2} fontSize="$12">Title</Heading>

// ✅ CORRECT
<Heading level={2} size="$12">Title</Heading>
```

---

## Resources

- **Tamagui Size Docs**: https://tamagui.dev/docs/core/configuration#size
- **Tamagui Text**: https://tamagui.dev/docs/components/text
- **Tamagui Paragraph**: https://tamagui.dev/docs/components/paragraph
- **This Project's Config**: `/packages/config/src/tamagui.config.ts`
- **Component Library**: `/packages/ui/src/components/`

---

## Conclusion

This refactor brings the project in line with **standard Tamagui patterns**, making it:

- ✅ Easier to maintain
- ✅ Better documented
- ✅ More predictable
- ✅ Compatible with Tamagui ecosystem

The `size="$n"` pattern is now the single source of truth for typography sizing, following Tamagui's design philosophy of unified, token-based design systems.

---

**Completed By**: GitHub Copilot
**Date**: November 18, 2025
**Status**: ✅ Production Ready
