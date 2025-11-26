"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Column, ScrollView, Text, Button, Heading } from "@buttergolf/ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSignUp } from "@clerk/clerk-expo";
import { AuthFormInput, AuthErrorDisplay } from "./components";
import { validateVerificationCode, mapClerkErrorToMessage } from "./utils";
import { Spinner } from "tamagui";

interface VerifyEmailScreenProps {
  email?: string;
  onSuccess?: () => void;
  onNavigateBack?: () => void;
}

/**
 * Email verification screen
 * User enters 6-digit code sent to their email
 * Includes resend code with countdown timer
 */
export function VerifyEmailScreen({
  email,
  onSuccess,
  onNavigateBack,
}: Readonly<VerifyEmailScreenProps>) {
  const insets = useSafeAreaInsets();
  const { signUp, setActive, isLoaded } = useSignUp();

  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [resendAttempts, setResendAttempts] = useState(0);

  // Handle countdown timer for resend button
  useEffect(() => {
    if (resendCountdown <= 0) return;

    const timer = setTimeout(() => {
      setResendCountdown(resendCountdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleCodeChange = useCallback((newCode: string) => {
    // Only allow numbers
    const sanitized = newCode.replace(/[^0-9]/g, "").slice(0, 6);
    setCode(sanitized);

    if (codeError) {
      setCodeError(null);
    }
  }, [codeError]);

  const handleVerify = useCallback(async () => {
    setError(null);

    // Validate code format
    const codeValidationError = validateVerificationCode(code);
    if (codeValidationError) {
      setCodeError(codeValidationError);
      return;
    }

    if (!isLoaded || !signUp) {
      setError("Authentication service not ready. Please try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === "complete") {
        // User successfully verified
        await setActive({ session: result.createdSessionId });
        onSuccess?.();
      } else {
        setError("Verification incomplete. Please try again.");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : String(err);

      if (errorMessage.includes("verification_code_invalid")) {
        setCodeError(mapClerkErrorToMessage("verification_code_invalid"));
      } else if (errorMessage.includes("verification_code_expired")) {
        setError(mapClerkErrorToMessage("verification_code_expired"));
      } else {
        setError(
          errorMessage || "Verification failed. Please check your code and try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [code, isLoaded, signUp, setActive, onSuccess]);

  const handleResendCode = useCallback(async () => {
    setError(null);

    if (!isLoaded || !signUp) {
      setError("Authentication service not ready. Please try again.");
      return;
    }

    setIsResending(true);

    try {
      await signUp.prepareEmailAddressVerification();
      setResendCountdown(60);
      setResendAttempts((prev) => prev + 1);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : String(err);
      setError(errorMessage || "Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  }, [isLoaded, signUp]);

  return (
    <Column flex={1} backgroundColor="$background">
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 80,
          paddingHorizontal: 16,
          minHeight: "100%",
        }}
      >
        <Column gap="$6" flex={1}>
          {/* Header */}
          <Column gap="$2">
            <Heading level={1} size="$8" fontWeight="700" color="$text">
              Verify Email
            </Heading>
            <Text size="$5" color="$textSecondary">
              {email
                ? `We sent a code to ${email}`
                : "Enter the 6-digit code we sent to your email"}
            </Text>
          </Column>

          {/* Error Display */}
          {error && (
            <AuthErrorDisplay
              error={error}
              onDismiss={() => setError(null)}
            />
          )}

          {/* Verification Code Input */}
          <Column gap="$2">
            <AuthFormInput
              label="Verification Code"
              value={code}
              onChangeText={handleCodeChange}
              placeholder="000000"
              keyboardType="numeric"
              error={codeError}
              editable={!isSubmitting}
            />

            <Text size="$3" color="$textMuted">
              Check your email for a 6-digit code
            </Text>
          </Column>

          {/* Verify Button */}
          <Button
            size="$5"
            backgroundColor="$primary"
            color="$textInverse"
            borderRadius="$full"
            fontWeight="600"
            onPress={handleVerify}
            disabled={isSubmitting || code.length !== 6}
            opacity={isSubmitting || code.length !== 6 ? 0.7 : 1}
          >
            {isSubmitting ? (
              <Spinner size="small" color="$textInverse" />
            ) : (
              <Text>Verify Email</Text>
            )}
          </Button>

          {/* Resend Code */}
          <Column alignItems="center" gap="$3" marginTop="$6">
            <Text size="$4" color="$textSecondary">
              Didn't receive a code?
            </Text>

            <Button
              chromeless
              size="$5"
              onPress={handleResendCode}
              disabled={resendCountdown > 0 || isResending}
              opacity={resendCountdown > 0 || isResending ? 0.5 : 1}
            >
              {isResending ? (
                <Spinner size="small" color="$primary" />
              ) : resendCountdown > 0 ? (
                <Text color="$textMuted" fontWeight="600">
                  Resend in {resendCountdown}s
                </Text>
              ) : (
                <Text color="$primary" fontWeight="600">
                  Resend Code
                </Text>
              )}
            </Button>

            {resendAttempts > 0 && (
              <Text size="$3" color="$textMuted">
                Code resent {resendAttempts} time{resendAttempts > 1 ? "s" : ""}
              </Text>
            )}
          </Column>

          {/* Back Button */}
          <Button
            chromeless
            size="$5"
            onPress={onNavigateBack}
            disabled={isSubmitting}
            marginTop="$6"
          >
            <Text color="$primary" fontWeight="600">
              Back to Sign Up
            </Text>
          </Button>
        </Column>
      </ScrollView>
    </Column>
  );
}
