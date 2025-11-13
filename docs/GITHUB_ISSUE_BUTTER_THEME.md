# 🧈 Implement "Pure Butter" Brand Identity

## Overview
Migrate ButterGolf from the current golf-course green theme to the "Pure Butter" brand identity (Concept 2) - a tongue-in-cheek, heritage butter aesthetic with warm butter orange, cream, and navy colors, plus Urbanist typography.

**Reference:** Brand identity presentation, Concept 2 "Pure Butter" (pages 15-24)

---

## 📋 Checklist

### 1. Typography System (Gotham Font Family)
- [ ] Add Gotham font files to `packages/assets/fonts/Gotham/` (8 weights)
  - Thin (200), Extra Light (300), Light (300), Book (400), Medium (500), Bold (700), Black (800), Ultra (900)
- [ ] Configure web font loading in `apps/web/src/app/layout.tsx` (next/font/local)
- [ ] Configure mobile font loading in `apps/mobile/app.json` (expo-font)
- [ ] Update Tamagui config `packages/config/src/tamagui.config.ts`:
  ```typescript
  fonts: {
    heading: { family: 'Gotham', weight: '700', size: 28 },
    body: { family: 'Gotham', weight: '400', size: 16 },
    caption: { family: 'Gotham', weight: '300', size: 14 },
  }
  ```
- [ ] **Alternative:** If no Gotham license, use Montserrat (Google Fonts) as substitute

### 2. Color Palette Migration
- [ ] Update `packages/config/src/tamagui.config.ts` with new color scales:
  ```typescript
  // Primary: Butter Orange (replaces green)
  butter50: '#FFF9ED',
  butter100: '#FFF3D6',
  butter200: '#FFECBD',
  butter300: '#FFE38A',
  butter400: '#E25F2F',  // Primary brand color
  butter500: '#F4AD2D',
  butter600: '#E89B1A',
  butter700: '#C47A00',  // For text on light bg
  butter800: '#995F00',
  butter900: '#6B4400',

  // Secondary: Navy (replaces amber)
  navy50: '#E8EDF3',
  navy100: '#C7D3E0',
  navy200: '#95AABF',
  navy300: '#6482A0',
  navy400: '#3B5673',
  navy500: '#1A2E44',  // Secondary brand color
  navy600: '#0F1F30',
  navy700: '#0A1520',
  navy800: '#050B10',
  navy900: '#020508',

  // Backgrounds: Cream
  background: '#FEFAD6',  // Cream (was #fbfbf9)
  surface: '#FFFFFF',     // White

  // Text: Charcoal
  text: '#1E1E1E',        // Warmer charcoal
  textSecondary: '#4A4A4A',

  // Accent: Butter Yellow
  accent: '#FFE38A',
  ```

- [ ] Update semantic token mappings:
  ```typescript
  primary: '$butter400',
  primaryDark: '$butter700',
  primaryHover: '$butter500',
  primaryPress: '$butter700',
  secondary: '$navy500',
  background: '#FEFAD6',
  ```

- [ ] Replace hardcoded colors in:
  - [ ] `apps/web/src/app/layout.tsx` (meta themeColor: `#E25F2F`)
  - [ ] `apps/web/src/app/sell/page.tsx` (borderColor: `$primary`)
  - [ ] `apps/web/src/app/_components/SellerOnboarding.tsx` (colorPrimary: `$primary`)
  - [ ] `apps/web/src/app/_components/AppPromoBanner.tsx` (backgroundColor x2: `$primary`)

### 3. Design Token Adjustments
- [ ] Update `packages/config/src/tamagui.config.ts`:
  ```typescript
  // Border Radius: Softer, more playful
  radius: {
    xs: 3,      // was 2
    sm: 6,      // was 4
    md: 10,     // was 8
    lg: 14,     // was 12
    xl: 18,     // was 16
    '2xl': 26,  // was 24
    full: 9999,
  }

  // Shadows: Softer, vintage feel
  shadowColor: 'rgba(0, 0, 0, 0.08)',       // was 0.1
  shadowColorHover: 'rgba(0, 0, 0, 0.12)',  // was 0.15
  shadowColorPress: 'rgba(0, 0, 0, 0.16)',  // was 0.2
  shadowColorFocus: 'rgba(253, 186, 64, 0.25)', // butter tint
  ```

### 4. Brand Assets
- [ ] Extract logos from PDF page 17:
  - [ ] Stacked "Butter Golf" logo
  - [ ] Inline "Butter Golf" logo
  - [ ] "GOLF" butter-label typography
- [ ] Create asset directory:
  ```
  packages/assets/
    ├── fonts/Gotham/
    └── logo/
        ├── butter-golf-logo-stacked.svg
        ├── butter-golf-logo-inline.svg
        ├── butter-golf-logo-stacked@2x.png
        ├── butter-golf-logo-inline@2x.png
        └── butter-golf-icon.svg
  ```
- [ ] Update app icons:
  - [ ] `apps/mobile/assets/icon.png` (1024x1024)
  - [ ] `apps/mobile/assets/adaptive-icon.png` (1024x1024)
  - [ ] `apps/web/public/favicon.ico` (32x32)
  - [ ] `apps/web/public/apple-touch-icon.png` (180x180)

### 5. Component Updates
- [ ] Audit UI components in `packages/ui/src/components/`:
  - [ ] Button - verify theme usage with new primary
  - [ ] Card - update shadows to softer values
  - [ ] Input - update focus states (butter orange glow)
  - [ ] Badge - verify color variants work with new palette
- [ ] Ensure all components use semantic tokens (no hardcoded colors)

### 6. Documentation
- [ ] Update `.github/copilot-instructions.md`:
  - Color palette section with new hex values
  - Typography section with Gotham weights
  - Design token updates (radius, shadows)
- [ ] Update `packages/ui/README.md` with new theme examples
- [ ] Create/update `docs/DESIGN_SYSTEM_SUMMARY.md` with comprehensive theme docs

### 7. Testing
- [ ] Visual testing:
  - [ ] Web dev server (`pnpm dev:web`) - check all pages
  - [ ] iOS simulator (`pnpm dev:mobile`) - check all screens
  - [ ] Android emulator - check all screens
  - [ ] Dark mode compatibility (navy becomes dominant)
- [ ] Build validation:
  - [ ] `pnpm check-types` passes
  - [ ] `pnpm build:web` succeeds
  - [ ] `pnpm build:mobile` succeeds
- [ ] Accessibility:
  - [ ] Contrast ratios meet WCAG AA (4.5:1 for normal text)
  - [ ] Test with browser DevTools contrast checker

---

## 🎨 New Brand Colors

| Role          | Color Name    | Hex       | Usage                        |
|---------------|---------------|-----------|------------------------------|
| `primary`     | Butter Orange | `#E25F2F` | Dominant brand tone, CTAs    |
| `primaryDark` | Deep Gold     | `#C47A00` | Text on light backgrounds    |
| `background`  | Cream         | `#FEFAD6` | Site/app background          |
| `surface`     | White         | `#FFFFFF` | Cards, modals                |
| `text`        | Charcoal      | `#1E1E1E` | Body text                    |
| `secondary`   | Navy          | `#1A2E44` | Headings, accents            |
| `accent`      | Butter Yellow | `#FFE38A` | Hover states, CTA highlights |

---

## 📐 Design Principles

- **Rounded shapes** - borderRadius: 10-14px (softer than current 8-12px)
- **Soft shadows** - rgba(0,0,0,0.08) for vintage feel
- **Playful typography** - Slightly oversize headings, compressed line height
- **Vintage warmth** - Cream backgrounds + butter yellows + modern navy contrast

---

## ⚠️ Breaking Changes

**Token Renames:**
- `$green500` → `$butter400` (semantic `$primary` still works ✅)
- `$amber400` → not used (replaced by `$navy500`)
- `$offWhite` → `#FEFAD6` (cream)

**Backward Compatibility:**
- All semantic tokens (`$primary`, `$secondary`, `$background`, etc.) remain stable ✅
- Component APIs unchanged ✅

---

## 🚀 Rollout Plan

1. Create feature branch: `feat/pure-butter-theme`
2. Implement checklist items 1-4 (foundation)
3. Test locally on web + mobile
4. Implement items 5-6 (components + docs)
5. Complete item 7 (testing + fixes)
6. Open PR with before/after screenshots
7. Merge to main

---

## 📦 Estimated Effort

- Typography: 2-3h
- Colors: 3-4h
- Tokens: 1-2h
- Assets: 2-3h (depends on logo extraction)
- Components: 2-3h
- Docs: 1-2h
- Testing: 2-3h

**Total:** 13-20 hours

---

## 📚 Resources

- **Font License:** Gotham commercial license OR use Montserrat (free)
- **Brand PDF:** "Pure Butter" concept (pages 15-24)
- **Logo Extraction:** Page 17 (stacked + inline variants)
- **Accessibility Tool:** [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## 🎯 Acceptance Criteria

- ✅ Gotham (or Montserrat) loaded on web + mobile
- ✅ Primary color changed from green to butter orange
- ✅ Background changed from off-white to cream
- ✅ Secondary changed from amber to navy
- ✅ All hardcoded colors replaced with semantic tokens
- ✅ Border radius softened (10-14px)
- ✅ Shadows softened (0.08 opacity)
- ✅ Logo assets added and app icons updated
- ✅ All UI components use new theme correctly
- ✅ TypeScript builds without errors
- ✅ WCAG AA contrast ratios maintained
- ✅ Documentation updated

---

## 📸 Deliverables

- [ ] Before/after screenshots (home, products, mobile)
- [ ] Contrast ratio audit report
- [ ] Updated Storybook/component demos (if applicable)
- [ ] Migration guide for contributors

---

**Priority:** Medium-High (branding)
**Type:** Feature
**Labels:** design-system, branding, theme, cross-platform
