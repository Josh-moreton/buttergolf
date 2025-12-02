# Onboarding Feature

This feature provides the initial onboarding experience for new users of the Butter Golf mobile app.

## Component

### `OnboardingScreen`

A full-screen onboarding experience inspired by Vinted's clean design, featuring:

- **Auto-scrolling carousel** of golf equipment images
- **Skip button** (top-right) to bypass onboarding
- **Headline** with serif font introducing Butter Golf's value proposition
- **Two CTAs**: Primary "Sign up" and secondary "I already have an account"
- **About link** in the footer

## Usage

```tsx
import { OnboardingScreen } from "@buttergolf/app";

function MyComponent() {
  return (
    <OnboardingScreen
      onSkip={() => {
        /* Navigate to home */
      }}
      onSignUp={() => {
        /* Navigate to sign up */
      }}
      onSignIn={() => {
        /* Navigate to sign in */
      }}
      onAbout={() => {
        /* Navigate to about page */
      }}
    />
  );
}
```

## Props

| Prop       | Type         | Required | Description                               |
| ---------- | ------------ | -------- | ----------------------------------------- |
| `onSkip`   | `() => void` | No       | Called when the Skip button is pressed    |
| `onSignUp` | `() => void` | No       | Called when the Sign Up button is pressed |
| `onSignIn` | `() => void` | No       | Called when the Sign In button is pressed |
| `onAbout`  | `() => void` | No       | Called when the About link is pressed     |

## Animation

The carousel uses `react-native-reanimated` for smooth performance:

- **Duration**: ~18-20 seconds per full loop
- **Direction**: Right to left (continuous scroll)
- **Loop**: Seamless infinite loop
- **Accessibility**: Respects reduce motion system settings

## Customization

### Colors

Colors are defined as Tamagui tokens in `packages/config/src/tamagui.config.ts`:

```typescript
{
  green500: '#13a063',  // Primary button color
  green700: '#0b6b3f',  // Button pressed state
  bg: '#fbfbf9',        // Background
  text: '#0f1720',      // Text color
  muted: '#6b7280',     // Secondary text
}
```

### Images

Currently uses colored placeholder cards. See `/docs/ONBOARDING_SCREEN.md` for instructions on adding real images.

### Text

All copy is in `screen.tsx` and can be easily modified:

```tsx
// Headline (line ~138)
From old clubs to new rounds — buy, sell, and play smarter.

// Primary CTA (line ~156)
Sign up to Butter Golf

// Secondary CTA (line ~171)
I already have an account

// Footer (line ~180)
About Butter Golf: Our platform
```

## Accessibility

- All interactive elements have `accessibilityLabel`
- Buttons have `accessibilityRole="button"`
- Carousel images have descriptive labels
- Animation pauses if reduce motion is enabled
- Safe area insets respected for notched devices

## Dependencies

- `react-native-reanimated`: Animation engine
- `react-native-safe-area-context`: Safe area handling
- `tamagui`: UI components and theming

## Related

- Main documentation: `/docs/ONBOARDING_SCREEN.md`
- Mobile app: `/apps/mobile/App.tsx`
- Tamagui config: `/packages/config/src/tamagui.config.ts`
