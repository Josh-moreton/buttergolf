"use client";

import React, { useState, useCallback } from "react";
import { Column, Row, ScrollView, Text, Button, Heading, Spinner } from "@buttergolf/ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSignIn } from "@clerk/clerk-expo";
import { AuthFormInput, AuthErrorDisplay } from "./components";
import {
  validateSignInForm,
  mapClerkErrorToMessage,
} from "./utils";
import { SignInFormData } from "./types";

interface SignInScreenProps {
  onSuccess?: () => void;
  onNavigateToSignUp?: () => void;
  onNavigateToForgotPassword?: () => void;
}

/**
 * Sign-in screen with email/password authentication
 * and OAuth provider options (Google, Apple)
 */
export function SignInScreen({
  onSuccess,
  onNavigateToSignUp,
  onNavigateToForgotPassword,
}: Readonly<SignInScreenProps>) {
  const insets = useSafeAreaInsets();
  const { signIn, setActive, isLoaded } = useSignIn();

  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleEmailChange = useCallback((email: string) => {
    setFormData((prev) => ({ ...prev, email }));
    // Clear email error when user starts typing
    if (fieldErrors.email) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.email;
        return next;
      });
    }
  }, [fieldErrors]);

  const handlePasswordChange = useCallback((password: string) => {
    setFormData((prev) => ({ ...prev, password }));
    // Clear password error when user starts typing
    if (fieldErrors.password) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.password;
        return next;
      });
    }
  }, [fieldErrors]);

  const handleSubmit = useCallback(async () => {
    setError(null);

    // Validate form
    const validation = validateSignInForm(formData.email, formData.password);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    if (!isLoaded || !signIn) {
      setError("Authentication service not ready. Please try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { createdSessionId } = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      });

      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        onSuccess?.();
      } else {
        setError("Failed to create session. Please try again.");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : String(err);

      // Check for Clerk-specific error codes
      if (errorMessage.includes("identifier_not_found")) {
        setError(mapClerkErrorToMessage("identifier_not_found"));
      } else if (errorMessage.includes("password_incorrect")) {
        setError(mapClerkErrorToMessage("password_incorrect"));
      } else {
        setError(
          errorMessage ||
          "Sign-in failed. Please check your credentials and try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isLoaded, signIn, setActive, onSuccess]);

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
              Sign In
            </Heading>
            <Text size="$5" color="$textSecondary">
              Welcome back to ButterGolf
            </Text>
          </Column>

          {/* Error Display */}
          {error && (
            <AuthErrorDisplay
              error={error}
              onDismiss={() => setError(null)}
            />
          )}

          {/* Email/Password Form */}
          <Column gap="$4">
            <AuthFormInput
              label="Email"
              value={formData.email}
              onChangeText={handleEmailChange}
              placeholder="your@email.com"
              keyboardType="email-address"
              error={fieldErrors.email}
              editable={!isSubmitting}
            />

            <AuthFormInput
              label="Password"
              value={formData.password}
              onChangeText={handlePasswordChange}
              placeholder="••••••••"
              secureTextEntry
              error={fieldErrors.password}
              editable={!isSubmitting}
            />

            {/* Forgot Password Link */}
            <Button
              chromeless
              size="$4"
              color="$primary"
              fontWeight="600"
              onPress={onNavigateToForgotPassword}
              disabled={isSubmitting}
              alignSelf="flex-start"
              paddingVertical={0}
              paddingHorizontal="$2"
            >
              Forgot password?
            </Button>
          </Column>

          {/* Sign In Button */}
          <Button
            size="$5"
            backgroundColor="$primary"
            color="$textInverse"
            borderRadius="$full"
            fontWeight="600"
            onPress={handleSubmit}
            disabled={isSubmitting || !isLoaded}
            opacity={isSubmitting ? 0.7 : 1}
          >
            {isSubmitting ? <Spinner size="sm" color="$textInverse" /> : "Sign In"}
          </Button>

          {/* Sign Up Link */}
          <Row alignItems="center" justifyContent="center" gap="$2" marginTop="$4">
            <Text size="$4" color="$textSecondary">
              {"Don't have an account?"}
            </Text>
            <Button
              chromeless
              size="$4"
              color="$primary"
              fontWeight="600"
              onPress={onNavigateToSignUp}
              disabled={isSubmitting}
              paddingVertical={0}
              paddingHorizontal="$2"
            >
              Sign Up
            </Button>
          </Row>
        </Column>
      </ScrollView>
    </Column>
  );
}
