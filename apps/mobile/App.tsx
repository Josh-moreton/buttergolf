import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Provider,
  RoundsScreen,
  ProductsScreen,
  ProductDetailScreen,
  routes,
} from "@buttergolf/app";
import type { ProductCardData, Product } from "@buttergolf/app";
import { OnboardingScreen } from "@buttergolf/app/src/features/onboarding";
import { LoggedOutHomeScreen } from "@buttergolf/app/src/features/home";
import { CategoryListScreen } from "@buttergolf/app/src/features/categories";
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
import { useFonts } from "expo-font";
import {
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
  Urbanist_800ExtraBold,
  Urbanist_900Black,
} from "@expo-google-fonts/urbanist";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// Keep splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

// Define navigation param types
type RootStackParamList = {
  ProductDetail: { id?: string };
  Category: { slug?: string };
  [key: string]: undefined | Record<string, string | undefined>;
};

type RouteParams<T extends keyof RootStackParamList> = {
  params?: RootStackParamList[T];
};

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
      Products: {
        path: routes.products.slice(1), // 'products'
        exact: true,
      },
      ProductDetail: {
        path: "products/:id", // 'products/:id' for dynamic routing
      },
      Category: {
        path: "category/:slug", // 'category/:slug' for category pages
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
    // Get API URL from environment variable
    // In production, this should be set to your deployed domain (e.g., "https://buttergolf.com")
    // In development:
    //   - iOS Simulator: use "http://localhost:3000"
    //   - Android Emulator: use "http://10.0.2.2:3000"
    //   - Physical Device: use "http://YOUR_COMPUTER_IP:3000"
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    if (!apiUrl) {
      throw new Error(
        "EXPO_PUBLIC_API_URL environment variable is not set. " +
        "Please create apps/mobile/.env file with: EXPO_PUBLIC_API_URL=http://localhost:3000"
      );
    }

    console.log("Fetching products from:", apiUrl);
    const response = await fetch(`${apiUrl}/api/products/recent`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

// Function to fetch products by category
async function fetchProductsByCategory(categorySlug: string): Promise<ProductCardData[]> {
  try {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    if (!apiUrl) {
      throw new Error(
        "EXPO_PUBLIC_API_URL environment variable is not set. " +
        "Please create apps/mobile/.env file with: EXPO_PUBLIC_API_URL=http://localhost:3000"
      );
    }

    console.log("Fetching products for category:", categorySlug, "from:", apiUrl);
    const response = await fetch(`${apiUrl}/api/products?category=${categorySlug}`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch category products:", error);
    return [];
  }
}

// Function to fetch a single product by ID
async function fetchProduct(id: string): Promise<Product | null> {
  try {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    if (!apiUrl) {
      throw new Error(
        "EXPO_PUBLIC_API_URL environment variable is not set. " +
        "Please create apps/mobile/.env file with: EXPO_PUBLIC_API_URL=http://localhost:3000"
      );
    }

    console.log("Fetching product:", id, "from:", apiUrl);
    const response = await fetch(`${apiUrl}/api/products/${id}`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch product ${id}: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

export default function App() {
  const FORCE_MINIMAL = false; // back to normal app rendering

  // Load Urbanist font weights for React Native using expo-google-fonts
  const [fontsLoaded] = useFonts({
    "Urbanist-Regular": Urbanist_400Regular,
    "Urbanist-Medium": Urbanist_500Medium,
    "Urbanist-SemiBold": Urbanist_600SemiBold,
    "Urbanist-Bold": Urbanist_700Bold,
    "Urbanist-ExtraBold": Urbanist_800ExtraBold,
    "Urbanist-Black": Urbanist_900Black,
  });

  useEffect(() => {
    async function hideSplash() {
      if (fontsLoaded) {
        // small timeout ensures logo renders at least one frame
        await new Promise((r) => setTimeout(r, 50));
        await SplashScreen.hideAsync();
      }
    }
    hideSplash();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

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
          onPress={() => { }}
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
                <Stack.Screen name="Home" options={{ title: "ButterGolf", headerRight: HeaderRightComponent }}>
                  {() => <ProductsScreen onFetchProducts={fetchProducts} />}
                </Stack.Screen>
                <Stack.Screen
                  name="Rounds"
                  component={RoundsScreen}
                  options={{ title: "Your Rounds" }}
                />
                <Stack.Screen name="Products" options={{ title: "Products" }}>
                  {() => <ProductsScreen onFetchProducts={fetchProducts} />}
                </Stack.Screen>
                <Stack.Screen
                  name="ProductDetail"
                  options={{ title: "Product Details" }}
                >
                  {({ route }: { route: RouteParams<"ProductDetail"> }) => (
                    <ProductDetailScreen
                      productId={route.params?.id || ""}
                      onFetchProduct={fetchProduct}
                    />
                  )}
                </Stack.Screen>
                <Stack.Screen
                  name="Category"
                  options={({ route }: { route: RouteParams<"Category"> }) => {
                    const slug = route.params?.slug;
                    return {
                      title: slug
                        ? slug.charAt(0).toUpperCase() + slug.slice(1)
                        : "Category",
                      headerShown: false, // CategoryListScreen has its own header
                    };
                  }}
                >
                  {({ route, navigation }: { route: RouteParams<"Category">; navigation: any }) => {
                    const slug = route.params?.slug;
                    return (
                    <CategoryListScreen
                      categorySlug={slug || ""}
                      categoryName={
                        slug
                          ? slug.charAt(0).toUpperCase() + slug.slice(1)
                          : "Category"
                      }
                      onFetchProducts={fetchProductsByCategory}
                      onBack={() => navigation.goBack()}
                      onFilter={() => console.log("Filter pressed")}
                    />
                    );
                  }}
                </Stack.Screen>
              </Stack.Navigator>
            </NavigationContainer>
          </SignedIn>
          <SignedOut>
            {/* Render the designed onboarding screen (animations currently disabled for stability) */}
            <NavigationContainer linking={linking}>
              <OnboardingFlow />
            </NavigationContainer>
          </SignedOut>
        </Provider>
      </ClerkProvider>
    </SafeAreaProvider>
  );
}

function OnboardingFlow() {
  const [showLoggedOutHome, setShowLoggedOutHome] = useState<boolean>(false);
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

  const Stack = createNativeStackNavigator();

  if (showLoggedOutHome) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoggedOutHome">
          {() => <LoggedOutHomeScreen onFetchProducts={fetchProducts} />}
        </Stack.Screen>
        <Stack.Screen
          name="Category"
          options={({ route }: { route: RouteParams<"Category"> }) => {
            const slug = (route.params as { slug?: string })?.slug;
            return {
              title: slug
                ? slug.charAt(0).toUpperCase() + slug.slice(1)
                : "Category",
              headerShown: false,
            };
          }}
        >
          {({ route, navigation }) => {
            const slug = (route.params as { slug?: string })?.slug;
            return (
            <CategoryListScreen
              categorySlug={slug || ""}
              categoryName={
                slug
                  ? slug.charAt(0).toUpperCase() + slug.slice(1)
                  : "Category"
              }
              onFetchProducts={fetchProductsByCategory}
              onBack={() => navigation.goBack()}
              onFilter={() => console.log("Filter pressed")}
            />
            );
          }}
        </Stack.Screen>
      </Stack.Navigator>
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
    />
  );
}
