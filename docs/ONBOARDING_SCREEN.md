# Onboarding Screen Documentation

## Overview

The onboarding screen introduces users to Butter Golf with a clean, Vinted-inspired design featuring an auto-scrolling carousel of golf equipment.

## Location

- Component: `packages/app/src/features/onboarding/screen.tsx`
- Usage: `apps/mobile/App.tsx` (shown in SignedOut state)

## Features

### 1. Auto-Scrolling Carousel
- **Implementation**: Uses `react-native-reanimated` for smooth, native-thread animations
- **Duration**: ~18-20 seconds per full loop
- **Loop**: Seamless infinite loop by duplicating the image array
- **Accessibility**: Respects reduce motion settings (pauses animation if enabled)

### 2. Layout Components
- **Skip Button**: Top-right corner, navigates user past onboarding
- **Carousel**: Center section with 6 cards visible
- **Headline**: Large serif font with Butter Golf messaging
- **CTAs**: Two buttons (Sign up / Sign in) with brand styling
- **Footer**: "About Butter Golf" link

### 3. Brand Colors (Tamagui Tokens)
Defined in `packages/config/src/tamagui.config.ts`:

```typescript
{
  green700: '#0b6b3f',  // Dark green for hover/pressed states
  green500: '#13a063',  // Primary green for buttons
  amber400: '#f2b705',  // Accent color
  bg: '#fbfbf9',        // Off-white background
  cardBg: '#ffffff',    // Card background
  text: '#0f1720',      // Primary text color
  muted: '#6b7280',     // Secondary text color
}
```

## Using Real Images

Currently, the carousel uses colored placeholders. To use real images:

### Step 1: Add Image Assets

Place your images in `apps/mobile/assets/carousel/`:

```
apps/mobile/assets/carousel/
  ├── club.jpg
  ├── ball.jpg
  ├── bag.jpg
  ├── feet.jpg
  ├── scooter.jpg
  └── accessory.jpg
```

### Step 2: Update the Component

In `packages/app/src/features/onboarding/screen.tsx`, replace the placeholder array with:

```typescript
import { Image } from 'tamagui'

const images = [
  { id: 'club', source: require('../../../assets/carousel/club.jpg'), label: 'Golf Club' },
  { id: 'ball', source: require('../../../assets/carousel/ball.jpg'), label: 'Golf Ball' },
  { id: 'bag', source: require('../../../assets/carousel/bag.jpg'), label: 'Golf Bag' },
  { id: 'feet', source: require('../../../assets/carousel/feet.jpg'), label: 'Golf Shoes' },
  { id: 'scooter', source: require('../../../assets/carousel/scooter.jpg'), label: 'Golf Cart' },
  { id: 'accessory', source: require('../../../assets/carousel/accessory.jpg'), label: 'Accessory' },
]
```

Then replace the View component in the carousel with:

```typescript
<Image
  key={`${item.id}-${index}`}
  source={item.source}
  width={CARD_WIDTH}
  height={CARD_HEIGHT}
  borderRadius="$4"
  shadowColor="$shadowColor"
  shadowRadius={8}
  shadowOffset={{ width: 0, height: 4 }}
  accessible
  accessibilityLabel={item.label}
  resizeMode="cover"
/>
```

### Step 3: Optimize Images

For best performance:
- **Format**: JPEG for photos, PNG for graphics
- **Dimensions**: ~400-500px width (3:4 aspect ratio)
- **File size**: Keep under 200KB each
- **Optimization**: Use tools like ImageOptim or Squoosh

### Step 4: Preload (Optional)

To prevent flicker on first load, use `expo-asset`:

```typescript
import { Asset } from 'expo-asset'

useEffect(() => {
  const preloadImages = async () => {
    await Asset.loadAsync([
      require('../../../assets/carousel/club.jpg'),
      require('../../../assets/carousel/ball.jpg'),
      // ... rest of images
    ])
  }
  preloadImages()
}, [])
```

## Customization

### Animation Speed

Adjust the duration in the `useEffect` hook:

```typescript
const duration = Math.max(18000, Math.floor(singleWidth * 24))
// Change 18000 to desired milliseconds (e.g., 12000 for faster)
```

### Card Dimensions

Modify the constants at the top:

```typescript
const CARD_WIDTH = Math.round(SCREEN_W * 0.28)  // 28% of screen width
const CARD_HEIGHT = Math.round(CARD_WIDTH * 1.33) // 3:4 aspect ratio
const GAP = 12 // Space between cards
```

### Copy/Text

All text is hardcoded in the component for easy modification:
- Headline: Line 138-140
- Sign Up CTA: Line 156
- Sign In CTA: Line 171
- About link: Line 180

## Navigation Handlers

The component accepts these optional props:

```typescript
interface OnboardingScreenProps {
  onSkip?: () => void      // Called when Skip button is pressed
  onSignUp?: () => void    // Called when Sign Up button is pressed
  onSignIn?: () => void    // Called when Sign In button is pressed
  onAbout?: () => void     // Called when About link is pressed
}
```

Current implementation in `apps/mobile/App.tsx`:
- **Skip**: Shows authentication flow
- **Sign Up**: Triggers Google OAuth
- **Sign In**: Triggers Apple OAuth (iOS) or Google (Android)
- **About**: Logs to console (placeholder for future navigation)

## Testing

### Type Check
```bash
pnpm check-types --filter=mobile
```

### Run on Simulator
```bash
pnpm dev:mobile
```

Then press:
- `i` for iOS simulator
- `a` for Android emulator

## Accessibility

The component includes:
- ✅ `accessibilityLabel` on all interactive elements
- ✅ `accessibilityRole="button"` for pressable elements
- ✅ Reduce motion support (pauses carousel animation)
- ✅ Safe area insets for notched devices

## Performance

The animation runs on the native UI thread thanks to `react-native-reanimated`, ensuring:
- 60 FPS even on lower-end devices
- No JavaScript thread blocking
- Smooth scrolling during other app activities

## Dependencies

- `react-native-reanimated@^3.19.3`: Animation engine
- `react-native-safe-area-context@^5.6.2`: Safe area handling
- `@buttergolf/ui`: Tamagui component library
- `@clerk/clerk-expo`: Authentication

## Known Limitations

1. **Images**: Currently uses colored placeholders instead of real images
2. **Routes**: Navigation handlers are simplified (no actual routing to /home, /about, etc.)
3. **Linting**: ESLint expo config needs to be installed separately

## Future Enhancements

- [ ] Add actual routing with expo-router or React Navigation
- [ ] Add page indicators below carousel
- [ ] Add gesture-based carousel swiping
- [ ] Add fade-in animations for text elements
- [ ] Add loading states for images
- [ ] Support for video carousel items
- [ ] A/B testing different carousel speeds
- [ ] Analytics tracking for button interactions
