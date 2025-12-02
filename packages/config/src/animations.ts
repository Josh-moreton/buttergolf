/**
 * Web Animation Configuration (CSS-based)
 *
 * This file is automatically selected by bundlers (Next.js/Webpack) for web builds.
 * For mobile builds, bundlers will prefer animations.native.ts.
 *
 * The Tamagui docs state:
 * "Animation drivers are designed to be swappable, so you can use lightweight CSS
 * animations or other web-focused animation libraries on the web, while using
 * larger but more advanced libraries like `reanimated` on native - all without
 * having to change a line outside of configuration."
 *
 * "Note the keys match between CSS and reanimated, so you can swap them out."
 *
 * CSS animations use timing functions and duration instead of spring physics.
 * These are tuned to feel similar to the spring configs on mobile.
 */
import { createAnimations } from "@tamagui/animations-css";

export const animations = createAnimations({
  // Fast: Quick response, snappy feel
  fast: "ease-out 150ms",

  // Medium: Default, balanced animation
  medium: "ease-in-out 300ms",

  // Slow: Smooth, deliberate motion
  slow: "ease-out 450ms",

  // Bouncy: Playful spring-like effect using cubic-bezier
  bouncy: "cubic-bezier(0.34, 1.56, 0.64, 1) 400ms",

  // Lazy: Slow reveal, gentle motion
  lazy: "ease-out 600ms",

  // Quick: Very snappy, minimal delay
  quick: "ease-out 100ms",
});
