# 🏠 Homepage Refactor - Match Mockup Design

## Overview
Refactor the web homepage to match the provided mockup design with butter orange header, hero carousel, and prominent category grid.

**Reference:** Butter Golf mockup screenshot (orange header, carousel hero, 4-category grid)

---

## 📋 Implementation Checklist

### 1. Unified Butter Header
**Create:** `apps/web/src/app/_components/header/ButterHeader.tsx`

- [ ] Single header bar with butter orange background (#E25F2F)
- [ ] Logo image on left (use `packages/assets/images/logo-orange.png`)
- [ ] Center navigation: HOME | FEATURES | ABOUT US | CONTACT US
- [ ] Search bar on right side (not left)
- [ ] User/wishlist/cart icons on far right
- [ ] Height: ~80px (reduce from current 180px)
- [ ] Sticky on scroll with shadow
- [ ] Mobile: Hamburger menu

**Layout:**
```
[Logo]  HOME  FEATURES  ABOUT  CONTACT    [Search 🔍]  [❤️][🛒][👤]
```

### 2. Hero Carousel Component
**Create:** `apps/web/src/app/_components/marketplace/HeroCarousel.tsx`

- [ ] Install carousel library: `pnpm add embla-carousel-react --filter web`
- [ ] Full-width carousel container
- [ ] Height: 50vh (min: 400px, max: 600px)
- [ ] 3-5 slides with:
  - Background image
  - Large text overlay (title + subtitle)
  - CTA button ("SEE THE RANGE")
  - Cream background (#FEFAD6)
- [ ] Autoplay (5s interval)
- [ ] Dot navigation indicators
- [ ] Touch/swipe support
- [ ] Keyboard navigation (arrow keys)

**Sample Slides:**
1. "SUMMER GOLF SALE" - Golf clubs image
2. "JUST LANDED" - New arrivals
3. "SHOP CALLAWAY" - Featured brands
4. "JOIN THE CLUB" - Membership benefits

### 3. Category Grid Component
**Create:** `apps/web/src/app/_components/marketplace/CategoryGrid.tsx`

- [ ] 4-column grid layout (CSS Grid)
- [ ] Categories:
  - CLUBS ON SALE
  - BAGS ON SALE
  - SHOES ON SALE
  - CLOTHING ON SALE
- [ ] Large square images (1:1 aspect ratio)
- [ ] Orange labels at bottom with white text
- [ ] Hover effects: scale(1.02) + shadow
- [ ] Links to filtered product pages
- [ ] Responsive: 2 cols tablet, 1 col mobile
- [ ] Use existing images from `packages/assets/images/clubs-*.jpg`
- [ ] Add/find images for bags, shoes, clothing

**Grid Layout:**
```
┌─────────┬─────────┬─────────┬─────────┐
│  CLUBS  │  BAGS   │  SHOES  │CLOTHING │
│ [Image] │ [Image] │ [Image] │ [Image] │
│ ON SALE │ ON SALE │ ON SALE │ ON SALE │
└─────────┴─────────┴─────────┴─────────┘
```

### 4. Update Page Layout
**Modify:** `apps/web/src/app/_components/MarketplaceHomeClient.tsx`

- [ ] Remove `marginTop={180}` (new header is shorter)
- [ ] Replace `<HeroSectionNew />` with `<HeroCarousel />`
- [ ] Add `<CategoryGrid />` after carousel
- [ ] Keep existing sections:
  - `<RecentlyListedSection />`
  - `<NewsletterSection />`
  - `<FooterSection />`

**New Structure:**
```tsx
<Column>
  <HeroCarousel />         {/* NEW - 50vh carousel */}
  <CategoryGrid />         {/* NEW - 4-col grid */}
  <RecentlyListedSection /> {/* Keep existing */}
  <NewsletterSection />     {/* Keep existing */}
  <FooterSection />         {/* Keep existing */}
</Column>
```

### 5. Update Layout Component
**Modify:** `apps/web/src/app/layout.tsx`

- [ ] Replace `<MarketplaceHeader />` with `<ButterHeader />`
- [ ] Remove `<TrustBar />` (or make dismissible)
- [ ] Update z-index layering
- [ ] Test sticky header behavior
- [ ] Update themeColor to butter orange: `#E25F2F`

---

## 🎨 Design Specifications

### Header
- **Background**: #E25F2F (butter orange)
- **Height**: 80px
- **Logo**: Height 50px, white version on orange (use `logo-white.png`)
- **Nav Links**: Gotham Medium, 14px, white text
- **Search**: White bg (50% opacity), pill shape (radius: 20px)
- **Icons**: 24px, white, hover opacity 80%

### Carousel
- **Height**: 50vh (400-600px range)
- **Text**: Gotham Bold 72px title, Gotham Black 96px subtitle
- **Colors**: Orange text (#E25F2F), cream bg (#FEFAD6)
- **CTA**: Orange button, white text, 16px 48px padding

### Category Grid
- **Container**: Max-width 1440px
- **Grid**: 4 columns, 24px gap
- **Cards**: Square (1:1), 12px radius, soft shadow
- **Labels**: Orange bg (#E25F2F), white text, 18px bold, centered

---

## 📦 Dependencies

```bash
# Carousel library
pnpm add embla-carousel-react --filter web

# Already installed (verify)
# - next/image (for optimization)
# - tamagui (for styling)
```

---

## 🚀 Implementation Order

### Day 1: Header
1. Create `ButterHeader.tsx` with orange background
2. Add logo image (white version)
3. Center navigation links
4. Move search bar to right
5. Add user/cart/wishlist icons
6. Update `layout.tsx`

### Day 2: Hero Carousel  
1. Install embla-carousel-react
2. Create `HeroCarousel.tsx`
3. Add 3 sample slides with existing images
4. Implement autoplay + dot navigation
5. Add touch gestures
6. Make responsive

### Day 3: Category Grid
1. Create `CategoryGrid.tsx`
2. Build 4-column CSS Grid
3. Style orange labels
4. Add hover animations
5. Link to category pages
6. Make responsive

### Day 4: Integration
1. Update `MarketplaceHomeClient.tsx`
2. Replace old hero with carousel
3. Add category grid
4. Test all breakpoints
5. Fix z-index/overflow issues

### Day 5: Polish
1. Cross-browser testing
2. Mobile device testing
3. Performance optimization
4. Accessibility audit
5. Visual regression check

---

## ✅ Acceptance Criteria

### Header
- [x] Single orange header bar (~80px)
- [x] Logo image visible on left
- [x] Navigation centered
- [x] Search on right side
- [x] Icons on far right
- [x] Sticky with shadow on scroll
- [x] Mobile hamburger menu

### Carousel
- [x] 50vh height, full width
- [x] 3+ slides with autoplay (5s)
- [x] Dot indicators
- [x] Touch/swipe support
- [x] Keyboard navigation
- [x] CTA buttons functional

### Category Grid
- [x] 4 columns desktop
- [x] 2 cols tablet, 1 col mobile
- [x] Orange labels on images
- [x] Hover effects working
- [x] Links to category pages
- [x] Fast image loading

### Performance
- [x] Page load < 3s
- [x] Lighthouse score > 90
- [x] CLS < 0.1
- [x] Works on Chrome/Safari/Firefox
- [x] Works on iOS/Android

---

## 🎯 Comparison: Before → After

### Header
**Before:**
- 3 layers (TrustBar + Header + Nav) = 180px
- Green theme (#13a063)
- Text logo only
- Search on left

**After:**
- Single layer = 80px
- Butter orange (#E25F2F)
- Image logo
- Search on right

### Hero
**Before:**
- Static background image
- Text overlay only
- 70vh height

**After:**
- Carousel with 3-5 slides
- Large text + CTA per slide
- 50vh height

### Categories
**Before:**
- Hidden in nav menu
- Small buttons
- Horizontal scroll

**After:**
- Prominent grid below hero
- Large images with labels
- 4-column layout

---

## 📸 Assets Needed

- [x] `logo-white.png` (exists in `packages/assets/images/`)
- [ ] Hero slide images (3-5 high-res):
  - Golf clubs on cream background
  - Golf bags/accessories
  - Shoes and clothing
  - Featured brands/products
- [ ] Category images (4 high-res):
  - [x] Clubs (use existing `clubs-*.jpg`)
  - [ ] Bags (find/create)
  - [ ] Shoes (find/create)
  - [ ] Clothing (find/create)

---

## 📁 Files to Create

- [ ] `apps/web/src/app/_components/header/ButterHeader.tsx`
- [ ] `apps/web/src/app/_components/header/MobileMenu.tsx` (optional)
- [ ] `apps/web/src/app/_components/marketplace/HeroCarousel.tsx`
- [ ] `apps/web/src/app/_components/marketplace/CategoryGrid.tsx`

## 📁 Files to Modify

- [ ] `apps/web/src/app/layout.tsx`
- [ ] `apps/web/src/app/_components/MarketplaceHomeClient.tsx`

## 📁 Files to Archive/Remove

- [ ] `apps/web/src/app/_components/marketplace/HeroSectionNew.tsx`
- [ ] `apps/web/src/app/_components/marketplace/TrustBar.tsx`
- [ ] `apps/web/src/app/_components/header/MarketplaceHeader.tsx`

---

## 🔗 Related Issues

- [ ] #[TBD] - "Pure Butter" theme implementation (colors + typography)
- [ ] #[TBD] - Mobile menu drawer component
- [ ] #[TBD] - Product category page redesign

---

**Estimated Effort:** 5 days  
**Priority:** High  
**Type:** Feature  
**Labels:** homepage, design, ux, carousel, header

---

**Ready to start?** Begin with Day 1 (Header) as it's the foundation for the rest of the refactor.
