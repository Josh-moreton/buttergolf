# Onboarding Screen Visual Layout

## Screen Structure

```
┌─────────────────────────────────────────┐
│                               [Skip]  ◄─┤ Skip button (top-right)
│                                         │
│                                         │
│            ┌───┐ ┌───┐ ┌───┐           │
│         ◄──┤ 1 ├─┤ 2 ├─┤ 3 ├──►        │ Auto-scrolling carousel
│            └───┘ └───┘ └───┘           │ (6 cards, infinite loop)
│             ┌───┐ ┌───┐ ┌───┐          │ ~18-20 second duration
│          ◄──┤ 4 ├─┤ 5 ├─┤ 6 ├──►       │
│             └───┘ └───┘ └───┘          │
│                                         │
│                                         │
│      From old clubs to new rounds —     │ Headline
│     buy, sell, and play smarter.       │ (Large serif font)
│                                         │
│                                         │
│    ┌─────────────────────────────┐     │
│    │  Sign up to Butter Golf     │     │ Primary CTA
│    └─────────────────────────────┘     │ (Green filled button)
│                                         │
│    ┌─────────────────────────────┐     │
│    │ I already have an account   │     │ Secondary CTA
│    └─────────────────────────────┘     │ (Outline button)
│                                         │
│    About Butter Golf: Our platform     │ Footer link
└─────────────────────────────────────────┘
```

## Color Scheme

### Background
- **Main**: `#fbfbf9` (Soft off-white)

### Text
- **Headline**: `#0f1720` (Dark charcoal)
- **Buttons**: White (primary) / `#0f1720` (secondary)
- **Footer**: `#6b7280` (Muted gray)

### Buttons
- **Primary (Sign up)**:
  - Background: `#13a063` (Butter Golf green)
  - Pressed: `#0b6b3f` (Darker green)
  - Text: White
  
- **Secondary (Sign in)**:
  - Background: Transparent
  - Border: `#0f1720` (2px)
  - Text: `#0f1720`

### Carousel Cards (Placeholders)
- Club: `#2c3e50` (Dark blue-gray)
- Ball: `#ecf0f1` (Light gray)
- Bag: `#34495e` (Medium gray)
- Feet: `#95a5a6` (Gray)
- Scooter: `#7f8c8d` (Blue-gray)
- Accessory: `#bdc3c7` (Light silver)

## Dimensions

### Carousel Cards
- **Width**: 28% of screen width
- **Height**: Card width × 1.33 (3:4 aspect ratio)
- **Gap**: 12px between cards
- **Corner Radius**: 14-16px
- **Shadow**: 8px radius, offset (0, 4)

### Typography
- **Headline**: Font size 8 (Tamagui scale), serif family
- **Buttons**: Font size 5 (Tamagui scale), 600 weight
- **Footer**: Font size 4 (Tamagui scale)

### Spacing
- **Skip button**: Top-right with safe area padding
- **Content padding**: Horizontal 24px ($6)
- **Element gaps**: 24px between major sections ($6)
- **Button gap**: 12px between CTAs ($3)

## Animation

### Carousel Movement
```
Frame 1:  [1][2][3][4][5][6] | [1][2][3][4][5][6]
          ^
          Current position

Frame N:  [1][2][3][4][5][6] | [1][2][3][4][5][6]
                                 ^
                                 Scrolling right-to-left

Reset:    [1][2][3][4][5][6] | [1][2][3][4][5][6]
          ^
          Seamlessly jump back to start
```

- **Direction**: Right to left (→)
- **Speed**: Linear easing
- **Duration**: ~18-20 seconds per cycle
- **Loop**: Infinite (withRepeat -1)
- **Thread**: Native UI thread (Reanimated)

## Interactions

### Skip Button
- **Action**: Navigate to home/auth
- **Visual**: Text only, top-right
- **Feedback**: Subtle press effect

### Sign Up Button
- **Action**: Trigger OAuth sign-up flow
- **Visual**: Solid green, white text
- **Feedback**: Darker green on press, slight scale (0.98)

### Sign In Button
- **Action**: Trigger OAuth sign-in flow
- **Visual**: Transparent with border, dark text
- **Feedback**: Slight background tint on press, scale (0.98)

### About Link
- **Action**: Navigate to about page
- **Visual**: Gray text, underlined (implicitly)
- **Feedback**: Press state

## Accessibility Features

### Labels
- Skip: "Skip onboarding"
- Sign up: "Sign up to Butter Golf"
- Sign in: "I already have an account"
- About: "About Butter Golf: Our platform"
- Cards: Individual labels (e.g., "Golf Club", "Golf Ball")

### Roles
- All buttons: `accessibilityRole="button"`

### Motion
- Carousel animation pauses if reduce motion is enabled
- All other elements remain static

### Safe Areas
- Respects device notches and home indicators
- Dynamic padding based on device

## Responsive Behavior

### Portrait (Primary)
- Carousel takes center stage
- Content stacks vertically
- Buttons fill width (max 400px)

### Landscape (Limited support)
- Layout may need adjustment
- Consider disabling or adapting carousel

### Different Screen Sizes

#### Small phones (320-375px width)
- Carousel cards: ~90-105px wide
- Text scales down naturally
- Still shows ~3-4 cards visible

#### Large phones (390-430px width)
- Carousel cards: ~110-120px wide
- More comfortable spacing
- Shows ~4-5 cards visible

#### Tablets
- May want to adjust card sizing
- Consider max-width constraints
- Center content on wide screens

## States

### Initial Load
1. Safe area calculated
2. Reduce motion checked
3. Carousel animation starts (or paused if reduce motion)
4. All elements visible immediately

### Skip Pressed
- Callback invoked
- Navigate away from onboarding
- User won't see screen again (until sign out)

### Sign Up Pressed
- Callback invoked
- Show OAuth provider selection
- User proceeds to sign-up flow

### Sign In Pressed
- Callback invoked
- Show OAuth provider selection
- User proceeds to sign-in flow

### About Pressed
- Callback invoked
- Navigate to about page
- Can return to onboarding

## Performance

### Animation
- Runs on native thread (Reanimated)
- 60 FPS on most devices
- No jank during carousel scroll

### Images (Future)
- Should preload to prevent flicker
- Use optimized sizes (~200KB each)
- Consider progressive loading

### Memory
- Minimal footprint
- Only renders visible + buffer cards
- No unnecessary re-renders

## Browser/Web Compatibility

This component is designed for **React Native (Expo)** only. For web:
- Consider separate web-optimized version
- Use CSS animations instead of Reanimated
- Different image loading strategy
- Adjust touch interactions for mouse

## Platform Differences

### iOS
- Native serif font: Georgia
- Apple Sign In available
- Smooth momentum scrolling

### Android
- Generic serif font
- Google Sign In only
- Consistent with iOS behavior

## Testing Considerations

### Manual Testing
1. Animation smoothness at 60 FPS
2. Reduce motion setting respected
3. All buttons respond to taps
4. Safe areas correct on notched devices
5. Text readable at all sizes

### Visual Regression
- Screenshot on various devices
- Compare carousel positioning
- Verify color accuracy
- Check typography rendering

### Accessibility Testing
1. VoiceOver (iOS) / TalkBack (Android)
2. Reduce motion toggle
3. Dynamic type/font scaling
4. Color contrast ratios

### Performance Testing
- FPS counter during animation
- Memory usage over time
- Time to interactive
- Animation smoothness under load
