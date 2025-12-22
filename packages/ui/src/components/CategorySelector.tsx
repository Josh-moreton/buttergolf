"use client";

import { useRef, useEffect, useCallback, useMemo, useState } from "react";
import { styled } from "tamagui";
import type { GetProps } from "tamagui";
import { Text } from "./Text";
import { Row } from "./Layout";

export interface Category {
  name: string;
  href: string;
}

interface CategoryItemRef {
  element: HTMLElement | null;
  width: number;
  left: number;
}

interface CategorySelectorProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange?: (href: string) => void;
  renderItem?: (category: Category, isActive: boolean, isHovered: boolean) => React.ReactNode;
}

// Animated underline indicator
const AnimatedUnderline = styled(Row, {
  name: "AnimatedUnderline",
  position: "absolute",
  bottom: 0,
  left: 0,
  height: 3,
  backgroundColor: "$primary",
  borderRadius: "$full",
  animation: "medium",
  pointerEvents: "none",
});

// Container for the category selector with relative positioning
const CategorySelectorContainer = styled(Row, {
  name: "CategorySelectorContainer",
  position: "relative",
  gap: "$6",
  alignItems: "center",
  justifyContent: "center",
  paddingBottom: "$3", // Space for underline
});

// Category text that can be hovered
const CategoryText = styled(Text, {
  name: "CategoryText",
  cursor: "pointer",
  position: "relative",
  whiteSpace: "nowrap",
  userSelect: "none",
  transition: "all 150ms ease-out",
  variants: {
    isActive: {
      true: {
        color: "$primary",
        fontWeight: "600",
      },
      false: {
        color: "$text",
        fontWeight: "400",
      },
    },
    isHovered: {
      true: {
        color: "$primary",
      },
      false: {},
    },
  },
});

// Wrapper div for category items that accepts click handlers
const CategoryItemWrapper = styled("div", {
  name: "CategoryItemWrapper",
  position: "relative",
  cursor: "pointer",
  userSelect: "none",
});

export function CategorySelector({
  categories,
  activeCategory,
  onCategoryChange,
  renderItem,
}: CategorySelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, CategoryItemRef>>({});
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  // Check if user prefers reduced motion
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Find active category index
  const activeIndex = categories.findIndex((cat) => cat.href === activeCategory);

  // Update underline position
  const updateUnderlinePosition = useCallback((index: number) => {
    if (!containerRef.current) return;

    const category = categories[index];
    if (!category) return;
    
    const ref = itemRefs.current[category.href];

    if (ref && ref.element) {
      setUnderlineStyle({
        left: ref.left,
        width: ref.width,
      });
    }
  }, [categories]);

  // Handle hover
  const handleHover = useCallback(
    (index: number) => {
      setHoveredIndex(index);
      updateUnderlinePosition(index);
    },
    [updateUnderlinePosition],
  );

  // Handle hover end - return to active state
  const handleHoverEnd = useCallback(() => {
    setHoveredIndex(null);
    if (activeIndex >= 0) {
      updateUnderlinePosition(activeIndex);
    }
  }, [activeIndex, updateUnderlinePosition]);

  // Initialize refs and set initial underline position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Collect all category items and their positions
    const items = container.querySelectorAll("[data-category-item]");
    const containerRect = container.getBoundingClientRect();

    items.forEach((item, index) => {
      const category = categories[index];
      if (category) {
        const rect = item.getBoundingClientRect();
        itemRefs.current[category.href] = {
          element: item as HTMLElement,
          width: rect.width,
          left: rect.left - containerRect.left,
        };
      }
    });

    // Set initial underline position to active category
    if (activeIndex >= 0) {
      updateUnderlinePosition(activeIndex);
    }
  }, [categories, activeIndex, updateUnderlinePosition]);

  // Update underline when active category changes
  useEffect(() => {
    if (hoveredIndex === null && activeIndex >= 0) {
      updateUnderlinePosition(activeIndex);
    }
  }, [activeIndex, hoveredIndex, updateUnderlinePosition]);

  return (
    <CategorySelectorContainer ref={containerRef}>
      {categories.map((category, index) => {
        const isActive = category.href === activeCategory;
        const isHovered = hoveredIndex === index;

        if (renderItem) {
          return (
            <div
              key={category.href}
              data-category-item
              style={{ position: "relative" }}
              onMouseEnter={() => handleHover(index)}
              onMouseLeave={handleHoverEnd}
              onClick={() => onCategoryChange?.(category.href)}
              role="button"
              tabIndex={0}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") {
                  onCategoryChange?.(category.href);
                }
              }}
            >
              {renderItem(category, isActive, isHovered)}
            </div>
          );
        }

        return (
          <div
            key={category.href}
            data-category-item
            style={{ position: "relative", cursor: "pointer" }}
            onMouseEnter={() => handleHover(index)}
            onMouseLeave={handleHoverEnd}
            onClick={() => onCategoryChange?.(category.href)}
            role="button"
            tabIndex={0}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                onCategoryChange?.(category.href);
              }
            }}
          >
            <Text
              whiteSpace="nowrap"
              userSelect="none"
              color={isActive ? "$primary" : "$text"}
              fontWeight={isActive ? "600" : "400"}
              hoverStyle={{
                color: "$primary",
              }}
            >
              {category.name}
            </Text>
          </div>
        );
      })}

      {/* Animated underline indicator */}
      {!prefersReducedMotion && (
        <AnimatedUnderline
          style={{
            transform: `translateX(${underlineStyle.left}px)`,
            width: underlineStyle.width,
            opacity: underlineStyle.width > 0 ? 1 : 0,
          } as React.CSSProperties}
        />
      )}
      
      {/* Static underline for reduced motion preference */}
      {prefersReducedMotion && (
        <Row
          position="absolute"
          bottom={0}
          left={underlineStyle.left}
          height={3}
          width={underlineStyle.width}
          backgroundColor="$primary"
          borderRadius="$full"
          pointerEvents="none"
        />
      )}
    </CategorySelectorContainer>
  );
}

export type CategorySelectorProps_Type = GetProps<typeof CategorySelector>;
