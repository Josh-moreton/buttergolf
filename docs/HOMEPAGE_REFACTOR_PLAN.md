# 🏠 Homepage Refactor - "Pure Butter" Design Implementation

## Overview

Refactor the web homepage to match the provided mockup design, incorporating the new "Pure Butter" brand identity with butter orange header, improved layout, and enhanced visual hierarchy.

**Reference:** Screenshot showing Butter Golf homepage with orange header, carousel hero, and category grid

---

## 📸 Mockup Analysis

### Key Elements from Screenshot:

1. **Header Bar**: Solid orange/butter background, single streamlined header
2. **Logo**: "Butter Golf" logo with script font on left side
3. **Navigation**: HOME, FEATURES, ABOUT US, CONTACT US centered
4. **Search**: Search bar positioned on right side (not left)
5. **Hero Banner**: Full-width carousel with large images (~50vh)
   - Shows "SUMMER GOLF SALE" with golf clubs
   - Carousel dots for navigation
   - "SEE THE RANGE" CTA button
   - Cream/beige background
6. **Category Grid**: 4-column grid below hero
   - CLUBS ON SALE
   - BAGS ON SALE
   - SHOES ON SALE
   - CLOTHING ON SALE
   - Large product images with orange labels

---

## 🎯 Current State Analysis

### Issues to Address:

1. **Header Complexity**:
   - Currently 3 separate layers: TrustBar (60px) + Main Header + Nav Bar
   - Total height: ~180px (too much vertical space)
   - Logo is text-only "ButterGolf"
   - Search bar on left side (desktop)

2. **Hero Section**:
   - Static background image only
   - Text overlay with "Welcome to ButterGolf"
   - No carousel functionality
   - Takes 70vh (too much for mobile)

3. **Category Display**:
   - Hidden in collapsed navigation menu
   - Horizontal scroll on mobile
   - Small button-based layout
   - Not prominent enough

4. **Branding**:
   - Green theme (#13a063) not butter orange
   - No logo image (text only)
   - Missing playful "Pure Butter" personality

---

## 🛠️ Implementation Plan

### Phase 1: New Unified Header Component

**Create:** `apps/web/src/app/_components/header/ButterHeader.tsx`

**Features:**

- Single header bar with butter orange background (#FDBA40 or similar)
- Logo image on left (use `logo-orange.png` or `logo-white.png`)
- Center navigation: HOME | FEATURES | ABOUT US | CONTACT US
- Search bar on right side
- User/cart icons on far right
- Height: ~80-100px total (vs current 180px)
- Sticky on scroll

**Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│ [Logo]  HOME  FEATURES  ABOUT  CONTACT    [Search] [🔍] [❤️][🛒][👤] │
└─────────────────────────────────────────────────────────────┘
```

**Tasks:**

- [ ] Create new `ButterHeader.tsx` component
- [ ] Add logo image loading from `packages/assets/images/logo-*.png`
- [ ] Implement center navigation links
- [ ] Move search bar to right side
- [ ] Remove TrustBar (or make dismissible)
- [ ] Update `layout.tsx` to use new header

### Phase 2: Hero Carousel Component

**Create:** `apps/web/src/app/_components/marketplace/HeroCarousel.tsx`

**Features:**

- Full-width carousel container
- Height: 50vh (min: 400px, max: 600px)
- 3-5 slides with images + text overlays
- Autoplay with 5s interval
- Dot navigation indicators
- Slide transition animations
- Touch/swipe support on mobile

**Slide Content Structure:**

```tsx
interface HeroSlide {
  id: string;
  imageUrl: string;
  title: string; // e.g., "SUMMER GOLF"
  subtitle: string; // e.g., "SALE"
  description?: string; // e.g., "DON'T MISS OUT!"
  ctaText: string; // e.g., "SEE THE RANGE"
  ctaLink: string; // e.g., "/products?category=sale"
  backgroundColor: string; // e.g., "#FEFAD6" (cream)
}
```

**Sample Slides:**

1. **Sale Slide**: Clubs on cream background, "SUMMER GOLF SALE"
2. **New Arrivals**: Latest products, "JUST LANDED"
3. **Featured Brand**: Partner brands, "SHOP CALLAWAY"
4. **Membership**: Benefits, "JOIN THE CLUB"

**Tasks:**

- [ ] Install carousel library (embla-carousel-react or swiper)
- [ ] Create `HeroCarousel.tsx` with slide data
- [ ] Add carousel controls (arrows + dots)
- [ ] Implement autoplay functionality
- [ ] Add touch/swipe gestures
- [ ] Ensure responsive sizing (50vh, adjust for mobile)

### Phase 3: Category Grid Section

**Create:** `apps/web/src/app/_components/marketplace/CategoryGrid.tsx`

**Features:**

- 4-column grid on desktop (2 columns on tablet, 1 on mobile)
- Large square images (300x300px min)
- Bold category labels with colored backgrounds
- Hover effects (scale, shadow)
- Direct links to category pages

**Categories:**

```tsx
interface CategoryCard {
  id: string;
  name: string; // e.g., "CLUBS ON SALE"
  imageUrl: string; // Large product image
  backgroundColor: string; // Orange label background
  link: string; // e.g., "/products?category=clubs&sale=true"
}
```

**Grid Layout:**

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│   CLUBS      │    BAGS      │   SHOES      │  CLOTHING    │
│ [Image]      │  [Image]     │  [Image]     │  [Image]     │
│  ON SALE     │  ON SALE     │  ON SALE     │  ON SALE     │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**Tasks:**

- [ ] Create `CategoryGrid.tsx` component
- [ ] Use golf club images from `packages/assets/images/clubs-*.jpg`
- [ ] Add additional category images (bags, shoes, clothing)
- [ ] Implement grid layout with CSS Grid
- [ ] Add hover animations (scale 1.02, shadow)
- [ ] Add orange labels with "ON SALE" text
- [ ] Link to filtered product pages

### Phase 4: Page Layout Updates

**Modify:** `apps/web/src/app/_components/MarketplaceHomeClient.tsx`

**New Structure:**

```tsx
<Column>
  {/* No marginTop needed - header is fixed */}
  <HeroCarousel /> {/* 50vh carousel */}
  <CategoryGrid /> {/* Below hero, full width */}
  <RecentlyListedSection /> {/* Keep existing */}
  <NewsletterSection /> {/* Keep existing */}
  <FooterSection /> {/* Keep existing */}
</Column>
```

**Tasks:**

- [ ] Remove `marginTop={180}` (new header is shorter + fixed)
- [ ] Replace `<HeroSectionNew />` with `<HeroCarousel />`
- [ ] Add `<CategoryGrid />` after hero
- [ ] Update spacing between sections
- [ ] Test scroll behavior with fixed header

### Phase 5: Layout.tsx Updates

**Modify:** `apps/web/src/app/layout.tsx`

**Changes:**

```tsx
// Remove TrustBar (or make dismissible)
// Replace MarketplaceHeader with ButterHeader

return (
  <html lang="en" suppressHydrationWarning className="light">
    <body>
      <NextTamaguiProvider>
        <ServiceWorkerRegistration />
        {/* <TrustBar /> - Remove or make dismissible */}
        <ButterHeader /> {/* New simplified header */}
        <AppPromoBanner />
        {children}
      </NextTamaguiProvider>
    </body>
  </html>
);
```

**Tasks:**

- [ ] Import new `ButterHeader` component
- [ ] Remove or conditionally render `TrustBar`
- [ ] Test sticky header behavior
- [ ] Ensure z-index layering works (header > banner > content)

---

## 🎨 Design Specifications

### Header

- **Background**: `$primary` (#FDBA40 - butter orange)
- **Height**: 80px
- **Logo**:
  - Image: `/packages/assets/images/logo-white.png` (on orange background)
  - Height: 50px
  - Position: Left, 20px padding
- **Navigation**:
  - Font: Gotham Medium (500)
  - Size: 14px
  - Color: White or Navy
  - Spacing: 32px between items
  - Hover: Underline or background change
- **Search Bar**:
  - Background: White with 50% opacity
  - Border radius: 20px (pill shape)
  - Width: 250px
  - Placeholder: "Search..."
- **Icons**:
  - Size: 24px
  - Color: White
  - Hover: 80% opacity

### Hero Carousel

- **Height**: 50vh (min: 400px, max: 600px)
- **Background**: Cream (#FEFAD6) or per-slide background
- **Text Overlay**:
  - Title: Gotham Bold, 72px (48px mobile)
  - Subtitle: Gotham Black, 96px (64px mobile)
  - Color: Orange (#E25F2F)
  - Description: Gotham Book, 24px, Navy
- **CTA Button**:
  - Background: Orange (#E25F2F)
  - Text: White, Gotham Bold, 16px
  - Padding: 16px 48px
  - Border radius: 10px
  - Hover: Darken 10%
- **Dots**:
  - Size: 12px
  - Color: Gray (inactive), Orange (#E25F2F) (active)
  - Position: Bottom center, 24px margin

### Category Grid

- **Container**: Max-width 1440px, centered
- **Grid**: 4 columns (gap: 24px)
- **Card**:
  - Aspect ratio: 1:1 (square)
  - Border radius: 12px
  - Shadow: rgba(0,0,0,0.08)
  - Hover: scale(1.02), shadow rgba(0,0,0,0.16)
- **Image**:
  - Object-fit: cover
  - Full card size
- **Label**:
  - Position: Bottom, full width
  - Background: Orange (#E25F2F)
  - Text: White, Gotham Bold, 18px
  - Padding: 16px
  - Text align: Center

---

## 📦 Dependencies

### New Libraries Needed:

```bash
# Carousel library (choose one)
pnpm add embla-carousel-react --filter web
# OR
pnpm add swiper --filter web

# Image optimization (if not already installed)
pnpm add next/image --filter web
```

### Asset Requirements:

- [ ] Logo files: `logo-white.png` and `logo-orange.png` (already exist)
- [ ] Hero slide images (3-5 images):
  - Golf clubs on sale
  - Golf bags/accessories
  - Shoes/clothing
  - Featured brands
  - Membership/benefits
- [ ] Category images (4 images):
  - Clubs (use existing `clubs-*.jpg`)
  - Bags (need new image)
  - Shoes (need new image)
  - Clothing (need new image)

---

## 🚀 Implementation Order

### Day 1: Header & Structure

1. Create `ButterHeader.tsx` with orange background
2. Add logo image loading
3. Implement center navigation
4. Move search to right
5. Update `layout.tsx` to use new header
6. Remove `TrustBar` (or make dismissible)

### Day 2: Hero Carousel

1. Install carousel library (embla-carousel-react recommended)
2. Create `HeroCarousel.tsx` component
3. Add sample slides with existing images
4. Implement autoplay and navigation
5. Add responsive sizing and mobile optimization
6. Test touch gestures on mobile

### Day 3: Category Grid

1. Create `CategoryGrid.tsx` component
2. Add category data with images
3. Implement 4-column CSS Grid
4. Add hover animations
5. Style orange labels
6. Link to category pages

### Day 4: Integration & Polish

1. Update `MarketplaceHomeClient.tsx` layout
2. Replace old hero with carousel
3. Add category grid below carousel
4. Adjust spacing and responsive breakpoints
5. Test all breakpoints (mobile, tablet, desktop)
6. Fix any z-index or overflow issues

### Day 5: Testing & Refinement

1. Cross-browser testing (Chrome, Safari, Firefox)
2. Mobile device testing (iOS, Android)
3. Performance audit (Lighthouse)
4. Accessibility audit (keyboard nav, ARIA labels)
5. Visual regression testing
6. Fix any bugs or polish UI

---

## ✅ Acceptance Criteria

### Header

- [x] Single header bar with butter orange background
- [x] Logo image visible and properly sized
- [x] Navigation links centered and functional
- [x] Search bar on right side
- [x] User/cart/wishlist icons on far right
- [x] Sticky behavior on scroll
- [x] Height reduced from 180px to ~80px
- [x] Responsive on mobile (hamburger menu if needed)

### Hero Carousel

- [x] Full-width carousel with 50vh height
- [x] 3-5 slides with autoplay (5s interval)
- [x] Dot navigation indicators
- [x] Touch/swipe support on mobile
- [x] CTA buttons link to correct pages
- [x] Smooth transitions between slides
- [x] Responsive text sizing
- [x] Accessibility (pause on hover, keyboard nav)

### Category Grid

- [x] 4-column grid on desktop
- [x] 2-column on tablet, 1-column on mobile
- [x] Large images with orange labels
- [x] Hover effects (scale, shadow)
- [x] Links to filtered category pages
- [x] Responsive and accessible
- [x] Fast load times (optimized images)

### Overall

- [x] Page loads in < 3 seconds
- [x] No layout shift (CLS < 0.1)
- [x] Lighthouse score > 90
- [x] WCAG AA accessibility
- [x] Works on Chrome, Safari, Firefox
- [x] Works on iOS and Android
- [x] Matches mockup design closely

---

## 🎨 Component Structure

```
apps/web/src/app/
├── layout.tsx                                    # Updated to use ButterHeader
├── page.tsx                                      # Unchanged (server component)
└── _components/
    ├── MarketplaceHomeClient.tsx                 # Updated layout structure
    ├── header/
    │   ├── ButterHeader.tsx                      # NEW - Unified header
    │   ├── MobileMenu.tsx                        # NEW - Mobile nav drawer
    │   └── SearchBar.tsx                         # NEW - Reusable search
    └── marketplace/
        ├── HeroCarousel.tsx                      # NEW - Main carousel
        ├── CategoryGrid.tsx                      # NEW - Category cards
        ├── RecentlyListedSection.tsx             # Existing (keep)
        ├── NewsletterSection.tsx                 # Existing (keep)
        └── FooterSection.tsx                     # Existing (keep)
```

---

## 📏 Responsive Breakpoints

```typescript
const breakpoints = {
  mobile: "0px", // < 768px - Single column, hamburger menu
  tablet: "768px", // 768-1024px - 2 column grid, simplified nav
  desktop: "1024px", // 1024-1440px - 4 column grid, full nav
  wide: "1440px", // > 1440px - Max-width container
};
```

### Mobile (< 768px)

- Hamburger menu for navigation
- Search bar full width below header
- Hero carousel: 40vh height
- Category grid: 1 column
- Text sizes reduced 30%

### Tablet (768-1024px)

- Condensed navigation (icons + text)
- Search bar inline with header
- Hero carousel: 45vh height
- Category grid: 2 columns
- Text sizes reduced 15%

### Desktop (1024px+)

- Full navigation with all links
- Search bar on right side
- Hero carousel: 50vh height
- Category grid: 4 columns
- Full text sizes

---

## 🔍 SEO & Performance

### Image Optimization

- Use Next.js `<Image>` component for all images
- Lazy load below-fold images
- Serve WebP with JPEG fallback
- Responsive srcset for different screen sizes

### Carousel Performance

- Preload first slide only
- Lazy load subsequent slides
- Use CSS transform for smooth animations
- Debounce resize events

### Accessibility

- Keyboard navigation for carousel (arrow keys)
- ARIA labels for all interactive elements
- Focus management (trap focus in mobile menu)
- Skip to main content link

---

## 📊 Metrics to Track

### Performance

- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.8s

### User Engagement

- Carousel interaction rate
- Category click-through rate
- Search usage rate
- Mobile vs desktop bounce rate

---

## 🚨 Potential Issues & Solutions

### Issue 1: Carousel Library Choice

**Problem**: Different libraries have different APIs
**Solution**: Start with embla-carousel-react (lightweight, TypeScript-first)

### Issue 2: Image Assets Missing

**Problem**: Need high-quality images for hero and categories
**Solution**:

- Use existing club images from assets
- Generate placeholder images with similar golf equipment
- Or use free stock photos from Unsplash

### Issue 3: Header Sticky Behavior

**Problem**: Fixed header can cause jump on scroll
**Solution**:

- Use transform instead of position change
- Add smooth transition
- Test on iOS Safari (notoriously buggy)

### Issue 4: Mobile Menu Complexity

**Problem**: Current desktop nav won't fit on mobile
**Solution**:

- Implement slide-out drawer menu
- Use hamburger icon
- Keep search and user actions visible

---

## 🎯 Priority Order

### Must Have (MVP)

1. ✅ Butter orange header with logo
2. ✅ Search bar on right side
3. ✅ Basic hero carousel (3 slides)
4. ✅ Category grid (4 categories)
5. ✅ Mobile responsive layout

### Should Have

1. Carousel autoplay
2. Touch/swipe gestures
3. Hover animations on categories
4. Mobile menu drawer
5. Sticky header with shadow

### Nice to Have

1. Carousel parallax effects
2. Category card flip animations
3. Search autocomplete
4. Wishlist quick-add from category cards
5. Loading skeletons

---

## 📝 File Checklist

### New Files to Create

- [ ] `apps/web/src/app/_components/header/ButterHeader.tsx`
- [ ] `apps/web/src/app/_components/header/MobileMenu.tsx`
- [ ] `apps/web/src/app/_components/header/SearchBar.tsx`
- [ ] `apps/web/src/app/_components/marketplace/HeroCarousel.tsx`
- [ ] `apps/web/src/app/_components/marketplace/CategoryGrid.tsx`

### Files to Modify

- [ ] `apps/web/src/app/layout.tsx`
- [ ] `apps/web/src/app/_components/MarketplaceHomeClient.tsx`

### Files to Remove/Archive

- [ ] `apps/web/src/app/_components/marketplace/HeroSectionNew.tsx` (replace with carousel)
- [ ] `apps/web/src/app/_components/marketplace/TrustBar.tsx` (remove or make dismissible)
- [ ] `apps/web/src/app/_components/header/MarketplaceHeader.tsx` (replace with ButterHeader)

---

## 🎬 Next Steps

1. **Review this plan** with team/stakeholders
2. **Gather assets**: Logo, hero images, category images
3. **Set up branch**: `git checkout -b feat/homepage-refactor`
4. **Day 1 work**: Start with header refactor
5. **Daily standups**: Share progress and blockers
6. **Deploy preview**: Use Vercel preview for stakeholder review
7. **Iterate**: Gather feedback and refine
8. **Merge**: Once approved and tested

**Estimated Effort:** 5 days (1 day per phase)
**Priority:** High (brand identity + UX improvement)
**Dependencies:** Logo files, hero images, carousel library

---

Would you like me to start implementing any phase now? I recommend starting with **Phase 1 (Header)** as it's the foundation for everything else.
