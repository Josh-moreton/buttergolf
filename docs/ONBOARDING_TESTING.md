# Testing the Onboarding Screen

## Quick Start

### Prerequisites

- Node.js 18+ installed
- pnpm 10.20.0+ installed
- iOS Simulator (Mac) or Android Emulator
- Expo Go app (optional, for device testing)

### Setup

1. **Install dependencies**:

```bash
cd /path/to/buttergolf
pnpm install
```

2. **Set up environment variables**:

```bash
# Copy example env file
cp .env.example .env

# Add your Clerk publishable key
echo "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here" >> apps/mobile/.env
```

3. **Start the development server**:

```bash
pnpm dev:mobile
```

4. **Launch on device**:

- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app for physical device

## Manual Testing Checklist

### Visual Tests

- [ ] **Layout**
  - [ ] Safe area insets applied (no content under notch)
  - [ ] Skip button visible in top-right
  - [ ] Carousel cards centered on screen
  - [ ] Headline text readable and centered
  - [ ] Both buttons visible and properly styled
  - [ ] Footer text visible at bottom

- [ ] **Colors**
  - [ ] Background is soft off-white (#fbfbf9)
  - [ ] Primary button is green (#13a063)
  - [ ] Secondary button has dark border (#0f1720)
  - [ ] Text is dark charcoal (#0f1720)
  - [ ] Footer text is muted gray (#6b7280)
  - [ ] Carousel cards show different colors

- [ ] **Typography**
  - [ ] Headline uses serif font (Georgia on iOS)
  - [ ] Headline is large and prominent
  - [ ] Button text is clear and readable
  - [ ] Footer text is smaller than buttons

### Animation Tests

- [ ] **Carousel Movement**
  - [ ] Carousel starts scrolling automatically
  - [ ] Movement is smooth (60 FPS)
  - [ ] Direction is right-to-left
  - [ ] Speed is gentle (~18-20 seconds)
  - [ ] Loop is seamless (no jump/stutter)
  - [ ] Animation continues during interactions

- [ ] **Reduce Motion**
  - [ ] Open device Settings → Accessibility → Motion
  - [ ] Enable "Reduce Motion"
  - [ ] Return to app
  - [ ] Carousel should be paused/static

### Interaction Tests

- [ ] **Skip Button**
  - [ ] Tappable area is adequate
  - [ ] Visual feedback on press
  - [ ] Triggers OAuth flow (as currently configured)
  - [ ] No console errors

- [ ] **Sign Up Button**
  - [ ] Button responds to touch
  - [ ] Green background darkens on press
  - [ ] Slight scale animation (0.98)
  - [ ] Triggers Google OAuth
  - [ ] Button recovers after release

- [ ] **Sign In Button**
  - [ ] Button responds to touch
  - [ ] Subtle background change on press
  - [ ] Slight scale animation (0.98)
  - [ ] Triggers Apple (iOS) or Google (Android) OAuth
  - [ ] Button recovers after release

- [ ] **About Link**
  - [ ] Text is tappable
  - [ ] Visual feedback on press
  - [ ] Logs to console (placeholder)
  - [ ] No crashes

### Accessibility Tests

- [ ] **VoiceOver (iOS)**
  - [ ] Enable: Settings → Accessibility → VoiceOver
  - [ ] Skip button reads "Skip onboarding"
  - [ ] Carousel cards read labels (e.g., "Golf Club")
  - [ ] Buttons read correct text
  - [ ] Footer reads "About Butter Golf: Our platform"
  - [ ] All elements are focusable

- [ ] **TalkBack (Android)**
  - [ ] Enable: Settings → Accessibility → TalkBack
  - [ ] Same checks as VoiceOver
  - [ ] Swipe gestures work correctly

- [ ] **Dynamic Type**
  - [ ] Increase text size: Settings → Display → Text Size
  - [ ] Text remains readable
  - [ ] Layout doesn't break
  - [ ] Buttons don't overflow

### Device Tests

- [ ] **iPhone SE (Small Screen)**
  - [ ] All content visible
  - [ ] Cards sized appropriately
  - [ ] No horizontal scrolling
  - [ ] Buttons don't overflow

- [ ] **iPhone 15 Pro (Notched)**
  - [ ] Content respects notch
  - [ ] Safe area padding correct
  - [ ] Home indicator not obscured

- [ ] **iPhone 15 Pro Max (Large)**
  - [ ] Layout looks balanced
  - [ ] Cards not too large
  - [ ] Text doesn't look lost

- [ ] **iPad (Tablet)**
  - [ ] Layout adapts well
  - [ ] Carousel doesn't look stretched
  - [ ] Buttons have reasonable max-width

- [ ] **Android Phone (Various)**
  - [ ] Same tests as iPhone
  - [ ] Navigation bar considered
  - [ ] No Android-specific issues

### Performance Tests

- [ ] **FPS**
  - [ ] Enable dev menu: Shake device or `Cmd+D`
  - [ ] Show Performance Monitor
  - [ ] Carousel animation stays at 60 FPS
  - [ ] No drops during button presses

- [ ] **Memory**
  - [ ] Use Xcode Instruments (iOS) or Android Profiler
  - [ ] Memory usage stays stable
  - [ ] No memory leaks over time
  - [ ] Carousel doesn't accumulate memory

- [ ] **CPU**
  - [ ] CPU usage is minimal during animation
  - [ ] No spikes during interactions
  - [ ] Animation doesn't drain battery quickly

### Edge Cases

- [ ] **Orientation Change**
  - [ ] Rotate device to landscape
  - [ ] Layout adjusts (or gracefully handles)
  - [ ] Carousel continues working
  - [ ] No crashes

- [ ] **App Backgrounding**
  - [ ] Swipe up to home screen
  - [ ] Wait 5 seconds
  - [ ] Return to app
  - [ ] Animation resumes correctly

- [ ] **Network Changes**
  - [ ] Toggle airplane mode
  - [ ] Onboarding still works (no network needed)
  - [ ] OAuth will fail gracefully when attempted

- [ ] **Rapid Interactions**
  - [ ] Tap buttons rapidly
  - [ ] No double-fires
  - [ ] No crashes
  - [ ] UI remains responsive

## Automated Testing

### Type Checking

```bash
pnpm check-types --filter=mobile
```

Expected: ✅ No errors

### Component Tests (If Added)

```bash
pnpm test --filter=mobile
```

Sample test structure:

```typescript
import { render, fireEvent } from '@testing-library/react-native'
import { OnboardingScreen } from '@buttergolf/app'

describe('OnboardingScreen', () => {
  it('renders all elements', () => {
    const { getByText } = render(<OnboardingScreen />)
    expect(getByText('Skip')).toBeTruthy()
    expect(getByText(/From old clubs/)).toBeTruthy()
    expect(getByText('Sign up to Butter Golf')).toBeTruthy()
  })

  it('calls onSkip when skip button pressed', () => {
    const onSkip = jest.fn()
    const { getByText } = render(<OnboardingScreen onSkip={onSkip} />)
    fireEvent.press(getByText('Skip'))
    expect(onSkip).toHaveBeenCalledTimes(1)
  })

  it('calls onSignUp when sign up button pressed', () => {
    const onSignUp = jest.fn()
    const { getByText } = render(<OnboardingScreen onSignUp={onSignUp} />)
    fireEvent.press(getByText('Sign up to Butter Golf'))
    expect(onSignUp).toHaveBeenCalledTimes(1)
  })
})
```

## Screenshot Testing

### iOS Screenshots

```bash
# Run simulator
open -a Simulator

# Select device (e.g., iPhone 15 Pro)
# Launch app via Expo
# Take screenshots: Cmd+S
```

Capture:

1. Initial view (carousel at start)
2. Carousel mid-scroll
3. Skip button pressed state
4. Sign up button pressed state
5. Sign in button pressed state

### Android Screenshots

```bash
# Run emulator
emulator -avd Pixel_7_Pro_API_34

# Launch app via Expo
# Take screenshots: Toolbar camera icon
```

## Common Issues & Solutions

### Carousel Not Animating

- **Check**: Reduce motion is disabled
- **Check**: Animation started in useEffect
- **Check**: Reanimated plugin in babel.config.js
- **Solution**: Clear Metro cache: `expo start --clear`

### Type Errors

- **Check**: Dependencies installed correctly
- **Check**: Tamagui config exports properly
- **Solution**: Run `pnpm install` and `pnpm db:generate`

### Safe Area Not Working

- **Check**: useSafeAreaInsets imported
- **Check**: Provider wraps component
- **Solution**: Ensure react-native-safe-area-context installed

### Button Press Not Working

- **Check**: Callbacks passed to component
- **Check**: No z-index issues blocking touches
- **Solution**: Add console.log to verify callbacks

### OAuth Fails

- **Check**: EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY set
- **Check**: Clerk dashboard configured
- **Solution**: Verify environment variables loaded

## Reporting Issues

When filing a bug report, include:

1. **Device**: iPhone 15 Pro / Pixel 7 Pro / etc.
2. **OS Version**: iOS 17.1 / Android 14 / etc.
3. **Expo Version**: Output of `expo --version`
4. **Steps to Reproduce**: Clear sequence of actions
5. **Expected vs Actual**: What should happen vs what happens
6. **Screenshots**: Visual evidence of issue
7. **Console Logs**: Any errors in terminal
8. **Video**: Screen recording if animation-related

## Performance Benchmarks

Expected performance metrics:

- **FPS**: 60 during carousel animation
- **Memory**: ~100MB for entire app
- **CPU**: <10% during animation
- **Load Time**: <500ms to first render
- **Animation Start**: <100ms after component mount

## Conclusion

This comprehensive testing checklist ensures the onboarding screen works perfectly across all devices, accessibility settings, and edge cases. Complete each section before considering the feature production-ready.

For questions or issues, refer to:

- `/docs/ONBOARDING_SCREEN.md` - Implementation guide
- `/docs/ONBOARDING_SCREEN_VISUAL.md` - Visual reference
- `/packages/app/src/features/onboarding/README.md` - Component docs
