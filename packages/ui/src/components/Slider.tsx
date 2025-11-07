"use client";

import { styled, GetProps, Stack } from "tamagui";
import { useState, useRef, useEffect } from "react";

const SliderContainer = styled(Stack, {
  name: "SliderContainer",
  tag: "div" as any,
  width: "100%",
  paddingVertical: "$3",
  position: "relative",
});

const SliderTrack = styled(Stack, {
  name: "SliderTrack",
  tag: "div" as any,
  height: 4,
  backgroundColor: "$border",
  borderRadius: "$full",
  position: "relative",
  cursor: "pointer",
});

const SliderRange = styled(Stack, {
  name: "SliderRange",
  tag: "div" as any,
  position: "absolute",
  height: "100%",
  backgroundColor: "$primary",
  borderRadius: "$full",
});

const SliderThumb = styled(Stack, {
  name: "SliderThumb",
  tag: "div" as any,
  width: 20,
  height: 20,
  borderRadius: "$full",
  backgroundColor: "$primary",
  position: "absolute",
  top: "50%",
  transform: "translate(-50%, -50%)",
  cursor: "grab",
  borderWidth: 2,
  borderColor: "$surface",
  zIndex: 2,

  hoverStyle: {
    scale: 1.1,
  },

  pressStyle: {
    cursor: "grabbing",
    scale: 1.15,
  },

  focusStyle: {
    borderColor: "$primary",
    scale: 1.15,
  },
});

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number[];
  defaultValue?: number[];
  onChange?: (value: number[]) => void;
  disabled?: boolean;
}

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  defaultValue = [min, max],
  onChange,
  disabled = false,
}: SliderProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeThumb, setActiveThumb] = useState<number | null>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const [minValue, maxValue] = value;

  const getPercentage = (val: number) => {
    return ((val - min) / (max - min)) * 100;
  };

  const getValueFromPosition = (clientX: number) => {
    if (!trackRef.current) return min;

    const rect = trackRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawValue = min + percentage * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.max(min, Math.min(max, steppedValue));
  };

  const updateValue = (thumbIndex: number, newValue: number) => {
    let newValues = [...value];

    if (thumbIndex === 0) {
      newValues[0] = Math.min(newValue, newValues[1] ?? max);
    } else {
      newValues[1] = Math.max(newValue, newValues[0] ?? min);
    }

    if (!isControlled) {
      setUncontrolledValue(newValues);
    }

    onChange?.(newValues);
  };

  const handleMouseDown = (thumbIndex: number) => (e: any) => {
    if (disabled) return;
    e.preventDefault();
    setActiveThumb(thumbIndex);
  };

  useEffect(() => {
    if (activeThumb === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newValue = getValueFromPosition(e.clientX);
      updateValue(activeThumb, newValue);
    };

    const handleMouseUp = () => {
      setActiveThumb(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [activeThumb, disabled]);

  const handleTrackClick = (e: any) => {
    if (disabled || activeThumb !== null) return;

    const newValue = getValueFromPosition(e.clientX);
    const distToMin = Math.abs(newValue - (minValue ?? min));
    const distToMax = Math.abs(newValue - (maxValue ?? max));

    const thumbIndex = distToMin < distToMax ? 0 : 1;
    updateValue(thumbIndex, newValue);
  };

  const minPercentage = getPercentage(minValue ?? min);
  const maxPercentage = getPercentage(maxValue ?? max);

  return (
    <SliderContainer>
      <SliderTrack ref={trackRef} onPress={handleTrackClick}>
        <SliderRange
          style={{
            left: `${minPercentage}%`,
            width: `${maxPercentage - minPercentage}%`,
          }}
        />
        <SliderThumb
          style={{ left: `${minPercentage}%` }}
          onMouseDown={handleMouseDown(0)}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={minValue}
          tabIndex={disabled ? -1 : 0}
        />
        <SliderThumb
          style={{ left: `${maxPercentage}%` }}
          onMouseDown={handleMouseDown(1)}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={maxValue}
          tabIndex={disabled ? -1 : 0}
        />
      </SliderTrack>
    </SliderContainer>
  );
}

export type SliderProps_2 = GetProps<typeof Slider>;
