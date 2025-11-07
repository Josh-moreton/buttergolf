"use client";

import { styled, GetProps } from "tamagui";
import { useState } from "react";

// Base checkbox input (hidden)
const HiddenCheckbox = styled("input", {
  name: "HiddenCheckbox",
  position: "absolute",
  opacity: 0,
  width: 0,
  height: 0,
});

// Visible checkbox box
const CheckboxBox = styled("div", {
  name: "CheckboxBox",
  width: 20,
  height: 20,
  borderWidth: 2,
  borderColor: "$border",
  borderRadius: "$xs",
  backgroundColor: "$surface",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.2s ease",

  hoverStyle: {
    borderColor: "$borderHover",
  },

  focusStyle: {
    borderColor: "$primary",
    borderWidth: 2,
  },

  variants: {
    checked: {
      true: {
        backgroundColor: "$primary",
        borderColor: "$primary",
      },
    },

    disabled: {
      true: {
        opacity: 0.5,
        cursor: "not-allowed",
      },
    },

    size: {
      sm: {
        width: 16,
        height: 16,
      },
      md: {
        width: 20,
        height: 20,
      },
      lg: {
        width: 24,
        height: 24,
      },
    },
  } as const,

  defaultVariants: {
    size: "md",
  },
});

// Checkmark icon
const Checkmark = styled("svg", {
  name: "Checkmark",
  width: 12,
  height: 12,
  fill: "none",
  stroke: "$textInverse",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",

  variants: {
    size: {
      sm: {
        width: 10,
        height: 10,
      },
      md: {
        width: 12,
        height: 12,
      },
      lg: {
        width: 14,
        height: 14,
      },
    },
  } as const,
});

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  id?: string;
  name?: string;
  value?: string;
}

export function Checkbox({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = "md",
  id,
  name,
  value,
}: CheckboxProps) {
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked);

  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : uncontrolledChecked;

  const handleChange = () => {
    if (disabled) return;

    const newChecked = !checked;

    if (!isControlled) {
      setUncontrolledChecked(newChecked);
    }

    onChange?.(newChecked);
  };

  return (
    <CheckboxBox
      checked={checked}
      disabled={disabled}
      size={size}
      onClick={handleChange}
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e: any) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handleChange();
        }
      }}
    >
      <HiddenCheckbox
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={() => {}}
        id={id}
        name={name}
        value={value}
        tabIndex={-1}
      />
      {checked && (
        <Checkmark size={size} viewBox="0 0 12 12">
          <polyline points="2,6 5,9 10,3" />
        </Checkmark>
      )}
    </CheckboxBox>
  );
}

export type CheckboxProps_2 = GetProps<typeof Checkbox>;
