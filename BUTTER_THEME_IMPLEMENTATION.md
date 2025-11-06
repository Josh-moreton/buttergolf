# 🧈 "Pure Butter" Brand Identity Implementation Plan

## Overview
Migrate ButterGolf from the current golf-course green theme to the "Pure Butter" brand identity (Concept 2) - a tongue-in-cheek, heritage butter aesthetic applied to golf branding.

## Current State Analysis

### Typography
- ❌ Using Tamagui default fonts (Inter)
- ✅ Font token system in place, ready for customization

### Color Palette
- ❌ Primary: Golf green (#13a063)
- ❌ Secondary: Amber/gold (#f2b705) - partially aligned
- ❌ Background: Off-white (#fbfbf9) - close but needs cream tone
- ⚠️ Hardcoded colors in 4 web components

### Design System
- ✅ Border radius tokens exist ($md: 8px, $lg: 12px)
- ⚠️ Need softer shadows for vintage feel
- ❌ Missing rounded, playful feel (8-12px → consider 10-14px)

### Brand Assets
- ❌ No logo files in repository
- ❌ No brand asset directory structure

## Implementation Plan

### Phase 1: Typography System (Gotham Font Family)

**Files to modify:**
- `packages/config/src/tamagui.config.ts`
- `apps/web/src/app/layout.tsx` (font loading)
- `apps/mobile/app.json` (font loading)

**Tasks:**
1. Add Gotham font files to `packages/assets/fonts/`
2. Configure font loading for web (next/font/local)
3. Configure font loading for mobile (expo-font)
4. Update Tamagui config with 8 Gotham weights:
   - Thin (200)
   - Extra Light (300)
   - Light (300)
   - Book (400) - body default
   - Medium (500)
   - Bold (700) - heading default
   - Black (800)
   - Ultra (900)

### Phase 2: Color Palette Migration

**Files to modify:**
- `packages/config/src/tamagui.config.ts` (main theme config)
- `apps/web/src/app/layout.tsx` (meta theme color)
- `apps/web/src/app/sell/page.tsx` (hardcoded #13a063)
- `apps/web/src/app/_components/SellerOnboarding.tsx` (hardcoded #13a063)
- `apps/web/src/app/_components/AppPromoBanner.tsx` (hardcoded #13a063 x2)

**New Color Tokens:**

```typescript
// Primary: Butter Orange (replaces green500)
primary: '#E25F2F'          // Butter orange (was #13a063)
primaryDark: '#C4481F'      // Darker orange for text
primaryHover: '#F06B3F'     // Lighter on hover
primaryPress: '#B8401A'     // Darker on press
primaryLight: '#FEEEE8'     // Very light orange

// Background: Cream (replaces offWhite)
background: '#FEFAD6'       // Cream (was #fbfbf9)
backgroundHover: '#FEF7CC'  // Slightly darker cream

// Secondary: Navy (replaces amber as accent)
secondary: '#1A2E44'        // Navy for headings/accents
secondaryLight: '#2C4A66'   // Lighter navy
secondaryHover: '#0F1F30'   // Darker navy

// Accent: Light Cream (for hover/CTA)
accent: '#FFF9E6'           // Lighter cream
accentHover: '#FEFAD6'      // Transitions to background

// Surface: White (keep)
surface: '#FFFFFF'

// Text: Charcoal (update from gray900)
text: '#1E1E1E'             // Warmer charcoal
textSecondary: '#4A4A4A'    // Medium gray
textTertiary: '#757575'     // Light gray

// Keep success/error/warning/info as-is (they're semantic)
```

**10-Shade Scale Updates:**

```typescript
// Butter orange scale (replaces green)
butter50: '#FEF5F0'
butter100: '#FEEEE8'
butter200: '#FDD9CC'
butter300: '#FCB89A'
butter400: '#E25F2F'  // Primary brand color
butter500: '#D94F1F'
butter600: '#C4481F'  // Primary dark
butter700: '#9A3918'
butter800: '#6F2B12'
butter900: '#4A1C0B'

// Navy scale (replaces amber)
navy50: '#E8EDF3'
navy100: '#C7D3E0'
navy200: '#95AABF'
navy300: '#6482A0'
navy400: '#3B5673'
navy500: '#1A2E44'  // Secondary
navy600: '#0F1F30'
navy700: '#0A1520'
navy800: '#050B10'
navy900: '#020508'

// Cream scale (for backgrounds)
cream50: '#FFFFFF'
cream100: '#FFFEF5'
cream200: '#FEFAD6'  // Background
cream300: '#FEF7CC'
cream400: '#FEF3B8'
cream500: '#FEEF9F'
cream600: '#E6D68E'
cream700: '#CCBC7C'
cream800: '#B3A36B'
cream900: '#998959'
```

### Phase 3: Design Token Adjustments

**Files to modify:**
- `packages/config/src/tamagui.config.ts`

**Updates:**

```typescript
// Border Radius: Softer, more playful
radius: {
  xs: 3,      // was 2
  sm: 6,      // was 4
  md: 10,     // was 8
  lg: 14,     // was 12
  xl: 18,     // was 16
  '2xl': 26,  // was 24
  full: 9999, // unchanged
}

// Shadows: Softer, vintage feel
shadowColor: 'rgba(0, 0, 0, 0.08)',       // was 0.1
shadowColorHover: 'rgba(0, 0, 0, 0.12)',  // was 0.15
shadowColorPress: 'rgba(0, 0, 0, 0.16)',  // was 0.2
shadowColorFocus: 'rgba(226, 95, 47, 0.25)', // butter orange tint

// Typography scale: Slightly oversize
fontSize: {
  xs: 13,    // was 12
  sm: 15,    // was 14
  md: 17,    // was 16
  lg: 20,    // was 18
  xl: 24,    // was 20
  '2xl': 32, // was 24
  '3xl': 40, // was 32
}

// Line height: Compressed for playful feel
lineHeight: {
  xs: 1.3,   // tighter
  sm: 1.4,
  md: 1.45,
  lg: 1.5,
  xl: 1.5,
}
```

### Phase 4: Brand Assets

**Directory structure to create:**
```
packages/assets/
  ├── fonts/
  │   └── Gotham/
  │       ├── Gotham-Thin.otf
  │       ├── Gotham-ExtraLight.otf
  │       ├── Gotham-Light.otf
  │       ├── Gotham-Book.otf
  │       ├── Gotham-Medium.otf
  │       ├── Gotham-Bold.otf
  │       ├── Gotham-Black.otf
  │       └── Gotham-Ultra.otf
  └── logo/
      ├── butter-golf-logo-stacked.svg
      ├── butter-golf-logo-inline.svg
      ├── butter-golf-logo-stacked.png (2x, 3x)
      ├── butter-golf-logo-inline.png (2x, 3x)
      └── butter-golf-icon.svg (app icon)
```

**Tasks:**
1. Extract logos from PDF page 17
2. Vectorize if needed (SVG preferred)
3. Generate PNG variants at multiple resolutions
4. Update app icons:
   - `apps/mobile/assets/icon.png`
   - `apps/mobile/assets/adaptive-icon.png`
   - `apps/web/public/favicon.ico`
   - `apps/web/public/apple-touch-icon.png`

### Phase 5: Component Library Updates

**Files to audit and update:**
- `packages/ui/src/components/Button.tsx` - verify theme usage
- `packages/ui/src/components/Card.tsx` - update shadows
- `packages/ui/src/components/Badge.tsx` - verify colors
- `packages/ui/src/components/Input.tsx` - update focus states

**Focus changes:**
- Replace `$primary` (green) with new butter orange
- Ensure all components use semantic tokens (not hardcoded)
- Update focus states to use butter orange glow
- Soften shadows throughout

### Phase 6: Documentation Updates

**Files to modify:**
- `.github/copilot-instructions.md` - update color palette documentation
- `packages/ui/README.md` - update component examples with new theme
- `docs/DESIGN_SYSTEM_SUMMARY.md` - comprehensive theme documentation

### Phase 7: Testing & Validation

**Cross-platform testing:**
- [ ] Web dev server visual check
- [ ] Mobile iOS simulator visual check
- [ ] Mobile Android emulator visual check
- [ ] Dark mode compatibility (navy becomes dominant)
- [ ] Accessibility contrast ratios (WCAG AA)
- [ ] Component library Storybook/demo pages

**Build validation:**
- [ ] `pnpm check-types` passes
- [ ] `pnpm build:web` succeeds
- [ ] `pnpm build:mobile` succeeds
- [ ] No console warnings about theme tokens

## Acceptance Criteria

### Typography
- [x] Gotham font loaded on web (8 weights)
- [x] Gotham font loaded on mobile (8 weights)
- [x] Heading components use Gotham Bold (700)
- [x] Body text uses Gotham Book (400)
- [x] Font weights properly mapped in Tamagui config

### Color Palette
- [x] Primary changed from green to butter orange (#E25F2F)
- [x] Background changed from off-white to cream (#FEFAD6)
- [x] Secondary changed from amber to navy (#1A2E44)
- [x] All hardcoded color values replaced with tokens
- [x] 10-shade scales created for butter, navy, cream
- [x] Dark mode theme updated appropriately

### Design Tokens
- [x] Border radius increased (8→10, 12→14)
- [x] Shadows softened (0.1→0.08 opacity)
- [x] Typography scale slightly increased
- [x] Line height compressed for playful feel

### Brand Assets
- [x] Logo SVG variants added (stacked, inline)
- [x] Logo PNG variants added (2x, 3x)
- [x] App icons updated (iOS, Android, web)
- [x] Favicon updated
- [x] Asset directory structure created

### Component Updates
- [x] All UI components use semantic tokens
- [x] Focus states use butter orange glow
- [x] Shadows are softer throughout
- [x] No TypeScript errors
- [x] Visual regression testing passed

### Documentation
- [x] Copilot instructions updated
- [x] Component library README updated
- [x] Design system docs updated with new palette
- [x] Migration guide created for contributors

## Migration Strategy

### Breaking Changes
⚠️ **Theme tokens are being renamed:**
- `$green500` → `$butter400` (though semantic `$primary` still works)
- `$amber400` → not used (replaced by navy)
- `$offWhite` → `$cream200`

### Backward Compatibility
✅ **Semantic tokens remain stable:**
- `$primary` - works with new butter orange
- `$secondary` - works with new navy
- `$background` - works with new cream
- `$text`, `$border`, etc. - all semantic tokens work

### Rollout Plan
1. Create feature branch: `feat/pure-butter-theme`
2. Implement Phase 1-4 (foundation)
3. Test locally on web and mobile
4. Implement Phase 5 (component updates)
5. Implement Phase 6 (documentation)
6. Phase 7 testing & fixes
7. PR review with screenshots
8. Merge to main

## Estimated Effort

- **Phase 1 (Typography):** 2-3 hours
- **Phase 2 (Colors):** 3-4 hours
- **Phase 3 (Tokens):** 1-2 hours
- **Phase 4 (Assets):** 2-3 hours (depends on logo extraction)
- **Phase 5 (Components):** 2-3 hours
- **Phase 6 (Docs):** 1-2 hours
- **Phase 7 (Testing):** 2-3 hours

**Total:** ~13-20 hours

## Resources Needed

1. **Gotham font files** - License required or substitute with similar font (Montserrat/Poppins)
2. **PDF access** - Brand identity presentation (pages 15-24)
3. **Logo extraction** - Page 17 specifically
4. **Design review** - Confirm hex values match brand guidelines
5. **Accessibility audit** - Post-implementation contrast check

## Notes

- If Gotham license is unavailable, consider **Montserrat** (Google Fonts) as a close substitute with similar geometric, modern feel
- Ensure all color changes maintain WCAG AA contrast ratios (4.5:1 for normal text)
- Test on actual devices, not just simulators (font rendering differs)
- Consider creating a "before/after" visual comparison doc for stakeholders
- Update any marketing materials/screenshots post-deployment

## Related Documents

- Brand identity presentation: "Pure Butter" concept (pages 15-24)
- Current theme: `packages/config/src/tamagui.config.ts`
- Design system docs: `docs/DESIGN_SYSTEM_SUMMARY.md`
- Copilot instructions: `.github/copilot-instructions.md`
