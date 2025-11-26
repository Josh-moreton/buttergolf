"use client";

import React from "react";
import { Row, View } from "@buttergolf/ui";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: Readonly<StepIndicatorProps>) {
  return (
    <Row
      paddingHorizontal="$4"
      paddingVertical="$3"
      gap="$2"
      justifyContent="center"
    >
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNumber = i + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <View
            key={stepNumber}
            flex={1}
            height={4}
            borderRadius="$full"
            backgroundColor={
              isActive || isCompleted ? "$primary" : "$cloudMist"
            }
            opacity={isActive ? 1 : isCompleted ? 0.7 : 0.3}
          />
        );
      })}
    </Row>
  );
}
