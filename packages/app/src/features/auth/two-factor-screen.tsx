"use client";

import React, { useState, useCallback, useRef } from "react";
import { Column, Row, ScrollView, Text, Button, Heading, Spinner } from "@buttergolf/ui";
import { ArrowLeft, ShieldCheck, Smartphone } from "@tamagui/lucide-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSignIn } from "@clerk/clerk-expo";
import { TextInput } from "react-native";
import { AuthErrorDisplay } from "./components";
import { mapClerkErrorToMessage } from "./utils";

interface TwoFactorScreenProps {
  onSuccess?: () => void;
  onNavigateBack?: () => void;
}

/**
 * Two-factor authentication screen
 * User enters 6-digit TOTP code from their authenticator app
 */
export function TwoFactorScreen({
  onSuccess,
  onNavigateBack,
}: Readonly<TwoFactorScreenProps>) {
  const insets = useSafeAreaInsets();
  const { signIn, setActive, isLoaded } = useSignIn();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for each input to handle focus
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleDigitChange = useCallback((index: number, value: string) => {
    // Only allow single digit
    const digit = value.replace(/[^0-9]/g, "").slice(-1);

    setCode(prev => {
      const newCode = [...prev];
      newCode[index] = digit;
      return newCode;
    });

    // Auto-advance to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Clear error when typing
    if (error) {
      setError(null);
    }
  }, [error]);

  const handleKeyPress = useCallback((index: number, key: string) => {
    // Handle backspace - go to previous input
    if (key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [code]);

  const handlePaste = useCallback((pastedText: string) => {
    const digits = pastedText.replace(/[^0-9]/g, "").slice(0, 6).split("");
    if (digits.length > 0) {
      const newCode = ["", "", "", "", "", ""];
      digits.forEach((digit, i) => {
        newCode[i] = digit;
      });
      setCode(newCode);
      // Focus the next empty input or last input
      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  }, []);

  const fullCode = code.join("");

  const handleVerify = useCallback(async () => {
    setError(null);

    if (fullCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    if (!isLoaded || !signIn) {
      setError("Authentication service not ready. Please try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("[TwoFactor] Attempting verification");
      const result = await signIn.attemptSecondFactor({
        strategy: "totp",
        code: fullCode,
      });
      console.log("[TwoFactor] Status:", result.status);

      if (result.status === "complete") {
        console.log("[TwoFactor] Session created:", result.createdSessionId);
        await setActive({ session: result.createdSessionId });
        onSuccess?.();
      } else {
        console.log("[TwoFactor] Unhandled status:", result.status);
        setError("Verification incomplete. Please try again.");
      }
    } catch (err) {
      console.error("[TwoFactor] Error:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);

      if (errorMessage.includes("verification_code_invalid") ||
          errorMessage.includes("incorrect_code")) {
        setError(mapClerkErrorToMessage("verification_code_invalid"));
      } else if (errorMessage.includes("verification_code_expired")) {
        setError(mapClerkErrorToMessage("verification_code_expired"));
      } else {
        setError(errorMessage || "Verification failed. Please try again.");
      }

      // Clear code on error
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  }, [fullCode, isLoaded, signIn, setActive, onSuccess]);

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
          {/* Back Button */}
          {onNavigateBack && (
            <Button
              chromeless
              size="$4"
              icon={<ArrowLeft size={20} />}
              color="$text"
              alignSelf="flex-start"
              onPress={onNavigateBack}
              paddingHorizontal={0}
            />
          )}

          {/* Security Icon */}
          <Column alignItems="center" paddingVertical="$4">
            <Column
              backgroundColor="$primaryLight"
              padding="$5"
              borderRadius="$full"
            >
              <ShieldCheck size={48} color="$primary" />
            </Column>
          </Column>

          {/* Header */}
          <Column gap="$2" alignItems="center">
            <Heading level={1} size="$8" fontWeight="700" color="$text" textAlign="center">
              Two-Factor Authentication
            </Heading>
            <Text size="$5" color="$textSecondary" textAlign="center">
              Enter the 6-digit code from your authenticator app
            </Text>
          </Column>

          {/* Error Display */}
          {error && (
            <AuthErrorDisplay
              error={error}
              onDismiss={() => setError(null)}
            />
          )}

          {/* Code Input Grid */}
          <Column gap="$4" alignItems="center">
            <Row gap="$2" justifyContent="center">
              {code.map((digit, index) => (
                <Column
                  key={index}
                  width={48}
                  height={56}
                  borderRadius="$4"
                  borderWidth={2}
                  borderColor={digit ? "$primary" : "$border"}
                  backgroundColor={digit ? "$primaryLight" : "$surface"}
                  alignItems="center"
                  justifyContent="center"
                  opacity={isSubmitting ? 0.6 : 1}
                >
                  <TextInput
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    value={digit}
                    onChangeText={(text) => handleDigitChange(index, text)}
                    onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                    keyboardType="number-pad"
                    maxLength={1}
                    editable={!isSubmitting}
                    selectTextOnFocus
                    style={{
                      fontSize: 24,
                      fontWeight: "700",
                      textAlign: "center",
                      width: "100%",
                      height: "100%",
                      color: "#323232",
                    }}
                    onFocus={() => {
                      // Select existing text on focus
                    }}
                    // Handle paste on first input
                    onChange={(e) => {
                      const text = e.nativeEvent.text;
                      if (text.length > 1 && index === 0) {
                        handlePaste(text);
                      }
                    }}
                  />
                </Column>
              ))}
            </Row>

            {/* Authenticator App Hint */}
            <Row gap="$2" alignItems="center" opacity={0.7}>
              <Smartphone size={16} color="$textSecondary" />
              <Text size="$3" color="$textSecondary">
                Open your authenticator app to view your code
              </Text>
            </Row>
          </Column>

          {/* Verify Button */}
          <Button
            size="$5"
            backgroundColor="$primary"
            color="$textInverse"
            borderRadius="$full"
            fontWeight="600"
            onPress={handleVerify}
            disabled={isSubmitting || fullCode.length !== 6}
            opacity={isSubmitting || fullCode.length !== 6 ? 0.7 : 1}
          >
            {isSubmitting ? <Spinner size="sm" color="$textInverse" /> : "Verify Code"}
          </Button>

          {/* Help Text */}
          <Column alignItems="center" gap="$3" marginTop="$4">
            <Text size="$4" color="$textSecondary" textAlign="center">
              {"Can't access your authenticator?"}
            </Text>
            <Text size="$3" color="$textMuted" textAlign="center" paddingHorizontal="$4">
              Contact support if you've lost access to your two-factor authentication device
            </Text>
          </Column>
        </Column>
      </ScrollView>
    </Column>
  );
}
