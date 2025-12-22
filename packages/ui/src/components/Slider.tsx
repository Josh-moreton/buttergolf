"use client";

import { Slider as TamaguiSlider, styled, GetProps } from "tamagui";

/**
 * Slider Component
 *
 * A range slider built on @tamagui/slider for selecting numeric values.
 * Uses compound component pattern (Slider.Track, Slider.TrackActive, Slider.Thumb).
 *
 * @example
 * // Single value slider
 * <Slider defaultValue={[50]} max={100} step={1}>
 *   <Slider.Track>
 *     <Slider.TrackActive />
 *   </Slider.Track>
 *   <Slider.Thumb index={0} circular />
 * </Slider>
 *
 * @example
 * // Range slider (two thumbs)
 * <Slider defaultValue={[25, 75]} max={100} step={1}>
 *   <Slider.Track>
 *     <Slider.TrackActive />
 *   </Slider.Track>
 *   <Slider.Thumb index={0} circular />
 *   <Slider.Thumb index={1} circular />
 * </Slider>
 */

// Styled Slider root with brand colours
const SliderFrame = styled(TamaguiSlider, {
  name: "Slider",
  width: "100%",
});

// Styled Track with proper overflow handling
const SliderTrack = styled(TamaguiSlider.Track, {
  name: "SliderTrack",
  backgroundColor: "$border",
  height: 3,
  borderRadius: "$full",
  overflow: "hidden",
});

// Styled TrackActive with primary colour
const SliderTrackActive = styled(TamaguiSlider.TrackActive, {
  name: "SliderTrackActive",
  backgroundColor: "$primary",
  height: "100%",
  borderRadius: "$full",
});

// Styled Thumb with brand colours and hover states
const SliderThumb = styled(TamaguiSlider.Thumb, {
  name: "SliderThumb",
  backgroundColor: "$primary",
  borderWidth: 2,
  borderColor: "$surface",
  width: 14,
  height: 14,
  borderRadius: "$full",
  cursor: "grab",
  // Subtle shadow for depth
  shadowColor: "$shadowColor",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.15,
  shadowRadius: 2,

  hoverStyle: {
    scale: 1.15,
    borderColor: "$primary",
  },

  pressStyle: {
    cursor: "grabbing",
    scale: 1.2,
  },

  focusStyle: {
    borderColor: "$primary",
    scale: 1.2,
  },
});

// Main Slider component as compound component
export const Slider = SliderFrame as typeof SliderFrame & {
  Track: typeof SliderTrack;
  TrackActive: typeof SliderTrackActive;
  Thumb: typeof SliderThumb;
};

Slider.Track = SliderTrack;
Slider.TrackActive = SliderTrackActive;
Slider.Thumb = SliderThumb;

// Export types
export type SliderProps = GetProps<typeof Slider>;
export type SliderTrackProps = GetProps<typeof SliderTrack>;
export type SliderTrackActiveProps = GetProps<typeof SliderTrackActive>;
export type SliderThumbProps = GetProps<typeof SliderThumb>;

/**
 * RangeSlider - Convenience wrapper for dual-thumb range selection
 *
 * @example
 * <RangeSlider
 *   min={0}
 *   max={500}
 *   value={[100, 400]}
 *   onValueChange={([min, max]) => console.log(min, max)}
 * />
 */
export interface RangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  disabled?: boolean;
}

export function RangeSlider({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
}: RangeSliderProps) {
  return (
    <Slider
      min={min}
      max={max}
      step={step}
      value={value}
      defaultValue={defaultValue ?? [min, max]}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <Slider.Track>
        <Slider.TrackActive />
      </Slider.Track>
      <Slider.Thumb index={0} circular />
      <Slider.Thumb index={1} circular />
    </Slider>
  );
}
