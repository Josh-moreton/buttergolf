# Tamagui Design System Summary

This document summarizes the existing Tamagui-based design system used in ButterGolf, serving as a reference for replicating it in the new Tailwind-based web UI package.

## Color Palette

### Brand Colors (Primary)

| Token Name | Hex | Usage |
|------------|-----|-------|
| `spicedClementine` | `#F45314` | Primary brand color (vibrant orange) |
| `spicedClementineHover` | `#D9450F` | Primary hover state |
| `spicedClementinePress` | `#BF3A0D` | Primary press state |

### Brand Colors (Secondary)

| Token Name | Hex | Usage |
|------------|-----|-------|
| `vanillaCream` | `#FFFAD2` | Light backgrounds, primary light |
| `lemonHaze` | `#EDECC3` | Subtle accent |
| `burntOlive` | `#3E3B2C` | Dark accent, secondary |
| `burntOliveHover` | `#33302A` | Secondary hover |
| `burntOlivePress` | `#272521` | Secondary press |

### Neutral Colors

| Token Name | Hex | Usage |
|------------|-----|-------|
| `pureWhite` | `#FFFFFF` | Base white, backgrounds |
| `cloudMist` | `#EDEDED` | Borders, dividers |
| `cloudMistHover` | `#E0E0E0` | Border hover |
| `slateSmoke` | `#545454` | Secondary text |
| `ironstone` | `#323232` | Primary text |
| `ironstoneHover` | `#2A2A2A` | Text hover |
| `gray100` | `#F5F5F5` | Very light gray |
| `gray200` | `#E5E5E5` | Light gray |
| `gray700` | `#707070` | Medium gray |
| `gray900` | `#1A1A1A` | Very dark gray |

### Semantic Colors

| Category | Token | Hex | Usage |
|----------|-------|-----|-------|
| **Success** | `successBase` | `#02aaa4` | Success state |
| | `successLight` | `#e6fffc` | Success background |
| | `successDark` | `#017d7a` | Success dark |
| **Error** | `errorBase` | `#dc2626` | Error state |
| | `errorLight` | `#fee2e2` | Error background |
| | `errorDark` | `#b91c1c` | Error dark |
| **Warning** | `warningBase` | `#F45314` | Warning (uses primary) |
| | `warningLight` | `#FFF4ED` | Warning background |
| | `warningDark` | `#BF3A0D` | Warning dark |
| **Info** | `infoBase` | `#3c50e0` | Info state |
| | `infoLight` | `#eff6ff` | Info background |
| | `infoDark` | `#1d4ed8` | Info dark |

### Semantic Token Aliases

| Token | Maps To | Usage |
|-------|---------|-------|
| `$primary` | spicedClementine | Primary actions |
| `$secondary` | burntOlive | Secondary elements |
| `$background` | pureWhite | Main background |
| `$surface` | pureWhite | Card/surface background |
| `$text` | ironstone | Primary text |
| `$textSecondary` | slateSmoke | Secondary text |
| `$textMuted` | cloudMist | Muted/placeholder text |
| `$textInverse` | pureWhite | Text on dark backgrounds |
| `$border` | cloudMist | Default borders |
| `$fieldBorder` | ironstone | Form input borders |

---

## Typography

### Font Family

- **Primary Font**: Urbanist
- **Fallback Stack**: `-apple-system, system-ui, BlinkMacSystemFont, sans-serif`

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Regular | 400 | Body text |
| Medium | 500 | Labels, emphasis |
| SemiBold | 600 | Subheadings |
| Bold | 700 | Headings, CTAs |
| ExtraBold | 800 | Display text |
| Black | 900 | Hero text |

### Body Font Sizes (Numeric Tokens)

| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `$1` | 11px | 15px | Extra small |
| `$2` | 12px | 16px | Small captions |
| `$3` | 13px | 18px | Labels |
| `$4` | 14px | 20px | Body default |
| `$5` | 15px | 22px | Body large |
| `$6` | 16px | 24px | Lead text |
| `$7` | 18px | 26px | Large body |
| `$8` | 20px | 28px | Intro text |

### Heading Font Sizes

| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `$5` | 20px | 24px | H6 |
| `$6` | 24px | 28px | H5 |
| `$7` | 28px | 32px | H4 |
| `$8` | 32px | 38px | H3 |
| `$9` | 40px | 46px | H2 |
| `$10` | 48px | 54px | H1 |

---

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `$xs` | 4px | Tight spacing |
| `$sm` | 8px | Small spacing |
| `$md` | 16px | Default spacing |
| `$lg` | 24px | Large spacing |
| `$xl` | 32px | Extra large |
| `$2xl` | 48px | Section spacing |
| `$3xl` | 64px | Page spacing |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `$xs` | 3px | Subtle rounding |
| `$sm` | 6px | Small elements |
| `$md` | 10px | Default rounding |
| `$lg` | 14px | Cards |
| `$xl` | 18px | Large containers |
| `$2xl` | 26px | Extra large |
| `$full` | 9999px | Pills, avatars |

---

## Component Sizes

### Button Sizes

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| `sm` | 32px | $2.5 | $3 (13px) |
| `md` | 40px | $3 | $4 (14px) |
| `lg` | 48px | $4 | $5 (15px) |

### Input Sizes

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| `sm` | 32px | $2.5 | $3 (13px) |
| `md` | 40px | $3 | $4 (14px) |
| `lg` | 48px | $4 | $5 (15px) |

### Badge Sizes

| Size | Min Height | Min Width | Padding |
|------|------------|-----------|---------|
| `sm` | 20px | 20px | $2 / $1 |
| `md` | 24px | 24px | $2.5 / $1.5 |
| `lg` | 28px | 28px | $3 / $2 |

---

## Core Components

### Button
- **Styling**: Uses standard Tamagui Button
- **Default border radius**: 24px (pill style)
- **Common variants**: primary (orange bg), secondary (olive bg), ghost (transparent), outline

### Text
- **Base**: Tamagui Paragraph styled with default color `$text`
- **Variants**: `weight` (normal, medium, semibold, bold), `align` (left, center, right), `truncate`

### Heading
- **Levels**: 1-6 mapping to font sizes $10 down to $5
- **Default weight**: 700 (bold)

### Card
- **Variants**: `elevated` (with shadow), `outlined` (border), `filled`, `ghost`
- **Default padding**: `$md`
- **Border radius**: `$lg` (14px)
- **Compound components**: Card.Header, Card.Body, Card.Footer

### Input
- **Size variants**: sm, md, lg
- **Border radius**: 24px (pill style)
- **State variants**: `error`, `success`, `fullWidth`
- **Border colors**: Uses `$fieldBorder` (ironstone) by default

### Badge
- **Color variants**: primary, secondary, success, error, warning, info, neutral, outline
- **Size variants**: sm, md, lg
- **Border radius**: Full (pill)

### Layout
- **Row**: Horizontal layout (XStack wrapper)
- **Column**: Vertical layout (YStack wrapper)
- **Container**: Max-width wrapper with size variants (sm, md, lg, xl, 2xl, full)
- **Spacer**: Flexible space component

---

## Media Queries (Breakpoints)

| Name | Value | Description |
|------|-------|-------------|
| `xs` | max-width: 660px | Mobile |
| `sm` | max-width: 800px | Small tablet |
| `md` | max-width: 1020px | Tablet |
| `lg` | max-width: 1280px | Small desktop |
| `xl` | max-width: 1420px | Desktop |
| `xxl` | max-width: 1600px | Large desktop |
| `gtXs` | min-width: 661px | Above mobile |
| `gtSm` | min-width: 801px | Above small tablet |
| `gtMd` | min-width: 1021px | Above tablet |
| `gtLg` | min-width: 1281px | Above small desktop |

---

## Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `dropdown` | 1000 | Dropdowns |
| `sticky` | 1020 | Sticky elements |
| `fixed` | 1030 | Fixed elements |
| `modalBackdrop` | 1040 | Modal backdrop |
| `modal` | 1050 | Modal content |
| `popover` | 1060 | Popovers |
| `tooltip` | 1070 | Tooltips |
