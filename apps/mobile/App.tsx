import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider, HomeScreen, RoundsScreen, routes } from "@buttergolf/app";
import type { ProductCardData } from "@buttergolf/app";
import { OnboardingScreen } from "@buttergolf/app/src/features/onboarding";
import { LoggedOutHomeScreen } from "@buttergolf/app/src/features/home";
import {
  View as RNView,
  Text as RNText,
  Pressable as RNPressable,
  Platform,
} from "react-native";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  useOAuth,
  useAuth,
} from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Button, Text } from "@buttergolf/ui";
import { useState } from "react";
// Platform imported above with RN components

const Stack = createNativeStackNavigator();

// Solito linking configuration - connects Solito routes to React Navigation
const linking = {
  prefixes: ["buttergolf://", "https://buttergolf.com", "exp://"],
  config: {
    screens: {
      Home: {
        path: routes.home,
        exact: true,
      },
      Rounds: {
        path: routes.rounds.slice(1), // Remove leading '/' for React Navigation
        exact: true,
      },
      // Add more routes here as you create them
      // RoundDetail: routes.roundDetail.replace('[id]', ':id'),
    },
  },
};

function SignOutButton() {
  const { signOut } = useAuth();
  return (
    <Button
      size="$2"
      chromeless
      onPress={() => signOut()}
      paddingHorizontal="$3"
    >
      <Text>Sign Out</Text>
    </Button>
  );
}

const HeaderRightComponent = () => <SignOutButton />;

// Function to fetch products from API
async function fetchProducts(): Promise<ProductCardData[]> {
  try {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
    const response = await fetch(`${apiUrl}/api/products/recent`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export default function App() {
  const FORCE_MINIMAL = false; // back to normal app rendering
  const tokenCache = {
    async getToken(key: string) {
      try {
        return await SecureStore.getItemAsync(key);
      } catch {
        return null;
      }
    },
    async saveToken(key: string, value: string) {
      try {
        await SecureStore.setItemAsync(key, value);
      } catch {
        // ignore
      }
    },
  };

  if (FORCE_MINIMAL) {
    return (
      <RNView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fbfbf9",
        }}
      >
        <RNText style={{ fontSize: 20, marginBottom: 12 }}>
          Minimal RN screen
        </RNText>
        <RNPressable
          onPress={() => {}}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 10,
            backgroundColor: "#13a063",
            borderRadius: 8,
          }}
        >
          <RNText style={{ color: "white", fontWeight: "600" }}>Tap</RNText>
        </RNPressable>
      </RNView>
    );
  }

  return (
    <SafeAreaProvider>
      <ClerkProvider
        tokenCache={tokenCache}
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      >
        {/* Wrap app content in Tamagui Provider so SignedOut onboarding can use UI components */}
        <Provider>
          <SignedIn>
            <NavigationContainer linking={linking}>
              <Stack.Navigator>
                <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{
                    title: "ButterGolf",
                    headerRight: HeaderRightComponent,
                  }}
                />
                <Stack.Screen
                  name="Rounds"
                  component={RoundsScreen}
                  options={{ title: "Your Rounds" }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </SignedIn>
          <SignedOut>
            {/* Render the designed onboarding screen (animations currently disabled for stability) */}
            <OnboardingFlow />
          </SignedOut>
        </Provider>
      </ClerkProvider>
    </SafeAreaProvider>
  );
}

function OnboardingFlow() {
  const [showLoggedOutHome, setShowLoggedOutHome] = useState(false);
  const { startOAuthFlow: startGoogle } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: startApple } = useOAuth({ strategy: "oauth_apple" });

  const handleOAuth = async (provider: "google" | "apple") => {
    const start = provider === "google" ? startGoogle : startApple;
    const { createdSessionId, setActive, signIn, signUp } = await start();

    if (createdSessionId) {
      await setActive?.({ session: createdSessionId });
    } else {
      // Handle MFA or additional steps if required
      console.warn("Additional steps required", { signIn, signUp });
    }
  };

  if (showLoggedOutHome) {
    return (
      <LoggedOutHomeScreen
        onFetchProducts={fetchProducts}
        onProductPress={(id) => {
          // TODO: Navigate to product detail screen
          console.log("Navigate to product:", id);
        }}
        onSignIn={() => {
          if (Platform.OS === "ios") {
            handleOAuth("apple");
          } else {
            handleOAuth("google");
          }
        }}
      />
    );
  }

  return (
    <OnboardingScreen
      onSkip={() => setShowLoggedOutHome(true)}
      onSignUp={() => handleOAuth("google")}
      onSignIn={() => {
        if (Platform.OS === "ios") {
          handleOAuth("apple");
        } else {
          handleOAuth("google");
        }
      }}
      onAbout={() => {
        // In a real app, this would navigate to an about page
        console.log("Navigate to about page");
      }}
    />
  );
}
