/**
 * Native Animation Configuration (React Native Animated-based)
 *
 * This file is automatically selected by Metro bundler for native builds (iOS/Android).
 * For web builds, bundlers will use animations.ts instead.
 *
 * React Native Animated uses spring physics with damping, mass, and stiffness.
 * This provides smooth, natural-feeling animations on mobile devices.
 */
import { createAnimations } from "@tamagui/animations-react-native";

export const animations = createAnimations({
  // Fast: Quick response, snappy feel
  fast: {
    type: "spring",
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },

  // Medium: Default, balanced animation
  medium: {
    type: "spring",
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },

  // Slow: Smooth, deliberate motion
  slow: {
    type: "spring",
    damping: 20,
    stiffness: 60,
  },

  // Bouncy: Playful spring effect
  bouncy: {
    type: "spring",
    damping: 9,
    mass: 0.9,
    stiffness: 150,
  },

  // Lazy: Slow reveal, gentle motion
  lazy: {
    type: "spring",
    damping: 18,
    stiffness: 50,
  },

  // Quick: Very snappy, minimal delay
  quick: {
    type: "spring",
    damping: 20,
    mass: 1,
    stiffness: 300,
  },
});
