# Token Mapping: Tamagui to Tailwind

This document describes how design tokens from the Tamagui design system are mapped to Tailwind CSS custom properties and utilities in `@buttergolf/ui-web`.

## Overview

The mapping preserves visual consistency while adapting to Tailwind's utility-first approach. All tokens are defined in `/packages/ui-web/src/styles/tokens.css` using Tailwind v4's `@theme` directive.

---

## Color Tokens

### Brand Colors

| Tamagui Token | Tailwind CSS Variable | Tailwind Class | Hex Value |
|---------------|----------------------|----------------|-----------|
| `$spicedClementine` / `$primary` | `--color-primary` | `bg-primary`, `text-primary` | `#F45314` |
| `$spicedClementineHover` / `$primaryHover` | `--color-primary-hover` | `bg-primary-hover` | `#D9450F` |
| `$spicedClementinePress` / `$primaryPress` | `--color-primary-press` | `bg-primary-press` | `#BF3A0D` |
| `$vanillaCream` / `$primaryLight` | `--color-primary-light` | `bg-primary-light` | `#FFFAD2` |
| `$burntOlive` / `$secondary` | `--color-secondary` | `bg-secondary`, `text-secondary` | `#3E3B2C` |
| `$lemonHaze` / `$secondaryLight` | `--color-secondary-light` | `bg-secondary-light` | `#EDECC3` |

### Neutral Colors

| Tamagui Token | Tailwind CSS Variable | Tailwind Class | Hex Value |
|---------------|----------------------|----------------|-----------|
| `$pureWhite` | `--color-white` | `bg-white`, `text-white` | `#FFFFFF` |
| `$cloudMist` / `$border` | `--color-cloud` | `bg-cloud`, `border-cloud` | `#EDEDED` |
| `$slateSmoke` / `$textSecondary` | `--color-slate` | `text-slate` | `#545454` |
| `$ironstone` / `$text` | `--color-iron` | `text-iron` | `#323232` |

### Semantic Colors

| Tamagui Token | Tailwind CSS Variable | Tailwind Class | Hex Value |
|---------------|----------------------|----------------|-----------|
| `$success` | `--color-success` | `bg-success`, `text-success` | `#02aaa4` |
| `$successLight` | `--color-success-light` | `bg-success-light` | `#e6fffc` |
| `$error` | `--color-error` | `bg-error`, `text-error` | `#dc2626` |
| `$errorLight` | `--color-error-light` | `bg-error-light` | `#fee2e2` |
| `$warning` | `--color-warning` | `bg-warning`, `text-warning` | `#F45314` |
| `$warningLight` | `--color-warning-light` | `bg-warning-light` | `#FFF4ED` |
| `$info` | `--color-info` | `bg-info`, `text-info` | `#3c50e0` |
| `$infoLight` | `--color-info-light` | `bg-info-light` | `#eff6ff` |

### Semantic Aliases

| Tamagui Token | Tailwind CSS Variable | Usage |
|---------------|----------------------|-------|
| `$background` | `--color-background` | Main app background |
| `$surface` / `$card` | `--color-surface` | Card backgrounds |
| `$text` | `--color-text` | Primary text |
| `$textSecondary` | `--color-text-secondary` | Secondary text |
| `$textMuted` | `--color-text-muted` | Muted/placeholder |
| `$textInverse` | `--color-text-inverse` | Text on dark backgrounds |
| `$border` | `--color-border` | Default borders |
| `$fieldBorder` | `--color-field-border` | Form input borders |

---

## Typography

### Font Family

| Tamagui | Tailwind CSS Variable | Value |
|---------|----------------------|-------|
| `$body` / `$heading` | `--font-family-sans` | `Urbanist, -apple-system, system-ui, BlinkMacSystemFont, sans-serif` |

### Font Sizes

| Tamagui Token | Tailwind CSS Variable | Tailwind Class | Value |
|---------------|----------------------|----------------|-------|
| `$1` | `--font-size-xs` | `text-[11px]` | 11px |
| `$3` | `--font-size-sm` | `text-[13px]` | 13px |
| `$4` | `--font-size-base` | `text-[14px]` | 14px |
| `$5` | `--font-size-md` | `text-[15px]` | 15px |
| `$6` | `--font-size-lg` | `text-[16px]` | 16px |
| `$7` | `--font-size-xl` | `text-[18px]` | 18px |
| `$8` | `--font-size-2xl` | `text-[20px]` | 20px |

### Heading Sizes

| Tamagui Heading Level | Tailwind CSS Variable | Value |
|-----------------------|----------------------|-------|
| Level 6 ($5) | `--font-size-h6` | 20px |
| Level 5 ($6) | `--font-size-h5` | 24px |
| Level 4 ($7) | `--font-size-h4` | 28px |
| Level 3 ($8) | `--font-size-h3` | 32px |
| Level 2 ($9) | `--font-size-h2` | 40px |
| Level 1 ($10) | `--font-size-h1` | 48px |

---

## Spacing

| Tamagui Token | Tailwind CSS Variable | Tailwind Class | Value |
|---------------|----------------------|----------------|-------|
| `$xs` | `--spacing-xs` | `gap-1`, `p-1` | 4px |
| `$sm` | `--spacing-sm` | `gap-2`, `p-2` | 8px |
| `$md` | `--spacing-md` | `gap-4`, `p-4` | 16px |
| `$lg` | `--spacing-lg` | `gap-6`, `p-6` | 24px |
| `$xl` | `--spacing-xl` | `gap-8`, `p-8` | 32px |
| `$2xl` | `--spacing-2xl` | `gap-12`, `p-12` | 48px |
| `$3xl` | `--spacing-3xl` | `gap-16`, `p-16` | 64px |

---

## Border Radius

| Tamagui Token | Tailwind CSS Variable | Tailwind Class | Value |
|---------------|----------------------|----------------|-------|
| `$xs` | `--radius-xs` | `rounded-[3px]` | 3px |
| `$sm` | `--radius-sm` | `rounded-[6px]` | 6px |
| `$md` | `--radius-md` | `rounded-[10px]` | 10px |
| `$lg` | `--radius-lg` | `rounded-[14px]` | 14px |
| `$xl` | `--radius-xl` | `rounded-[18px]` | 18px |
| `$full` | `--radius-full` | `rounded-full` | 9999px |
| Button/Input default | `--radius-pill` | `rounded-[24px]` | 24px |

---

## Component Sizes

### Button Heights

| Tamagui Size | Tailwind CSS Variable | Value |
|--------------|----------------------|-------|
| `sm` ($buttonSm) | `--size-button-sm` | 32px |
| `md` ($buttonMd) | `--size-button-md` | 40px |
| `lg` ($buttonLg) | `--size-button-lg` | 48px |

### Input Heights

| Tamagui Size | Tailwind CSS Variable | Value |
|--------------|----------------------|-------|
| `sm` ($inputSm) | `--size-input-sm` | 32px |
| `md` ($inputMd) | `--size-input-md` | 40px |
| `lg` ($inputLg) | `--size-input-lg` | 48px |

---

## Approximations & Notes

### Exact Matches
- All color values are exact hex matches
- Font sizes are exact pixel values
- Spacing values are exact pixel values
- Border radius values are exact

### Approximations
- **Line heights**: Tailwind uses unitless line-height multipliers by default. We use explicit `leading-[Xpx]` values to match Tamagui's pixel-based line heights.
- **Font weights**: Tailwind's `font-normal` = 400, `font-medium` = 500, `font-semibold` = 600, `font-bold` = 700 (exact matches)

### Differences from Tamagui
- **Animations**: Tamagui uses spring-based animations. Tailwind uses CSS transitions. Components use simpler CSS transitions that feel similar but not identical.
- **Press/Active states**: Tamagui has rich pressStyle support. Tailwind components use `:active` pseudo-class which has similar but not identical behavior.
- **Responsive**: Tamagui uses `$gtMd` style breakpoints. Tailwind uses standard `md:` prefixes. Breakpoint values are mapped to match.
- **Platform-specific**: Tamagui handles React Native. ui-web is web-only, so some abstractions (like `XStack`/`YStack`) are simplified.

---

## Using Tokens in Custom Components

If you need to use design tokens in custom CSS or inline styles:

```css
/* In CSS */
.my-element {
  background-color: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
}
```

```tsx
// In Tailwind classes
<div className="bg-primary p-4 rounded-[14px]">
  Content
</div>
```

```tsx
// With inline styles (not recommended)
<div style={{ backgroundColor: 'var(--color-primary)' }}>
  Content
</div>
```
