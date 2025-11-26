"use client";

import React, { useState } from "react";
import { Column, Button, Text, Spinner, Row } from "@buttergolf/ui";
import { useOAuth } from "@clerk/clerk-expo";
import { Platform } from "react-native";
import { Apple } from "@tamagui/lucide-icons";

interface OAuthButtonsProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  isLoading?: boolean;
}

/**
 * OAuth authentication buttons for Google and Apple
 * Google available on all platforms
 * Apple available on iOS
 */
export function OAuthButtons({
  onSuccess,
  onError,
  isLoading = false,
}: Readonly<OAuthButtonsProps>) {
  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "apple" | null
  >(null);

  const { startOAuthFlow: startGoogle } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: startApple } = useOAuth({
    strategy: "oauth_apple",
  });

  const handleOAuth = async (provider: "google" | "apple") => {
    try {
      setLoadingProvider(provider);

      const start = provider === "google" ? startGoogle : startApple;
      const { createdSessionId, setActive, signIn, signUp } =
        await start();

      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });
        onSuccess?.();
      } else {
        // Handle MFA or other additional steps
        if (signIn || signUp) {
          onError?.(
            "Additional verification required. Please try again."
          );
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : "OAuth failed";
      onError?.(error);
    } finally {
      setLoadingProvider(null);
    }
  };

  const isLoadingGoogle = isLoading || loadingProvider === "google";
  const isLoadingApple = isLoading || loadingProvider === "apple";

  return (
    <Column gap="$3">
      <Button
        size="$5"
        backgroundColor="$surface"
        color="$text"
        borderWidth={1}
        borderColor="$border"
        borderRadius="$full"
        fontWeight="600"
        onPress={() => handleOAuth("google")}
        disabled={isLoading || isLoadingGoogle}
        opacity={isLoadingGoogle ? 0.6 : 1}
      >
        {isLoadingGoogle ? (
          <Spinner size="sm" color="$text" />
        ) : (
          <Text>Continue with Google</Text>
        )}
      </Button>

      {Platform.OS === "ios" && (
        <Button
          size="$5"
          backgroundColor="$text"
          color="$textInverse"
          borderRadius="$full"
          fontWeight="600"
          onPress={() => handleOAuth("apple")}
          disabled={isLoading || isLoadingApple}
          opacity={isLoadingApple ? 0.6 : 1}
        >
          {isLoadingApple ? (
            <Spinner size="sm" color="$textInverse" />
          ) : (
            <Row gap="$2" alignItems="center">
              <Apple size={20} />
              <Text>Continue with Apple</Text>
            </Row>
          )}
        </Button>
      )}
    </Column>
  );
}
