import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Provider,
  RoundsScreen,
  ProductsScreen,
  ProductDetailScreen,
  SellScreen,
  routes,
  SignInScreen,
  SignUpScreen,
  VerifyEmailScreen,
  ForgotPasswordScreen,
  ResetPasswordScreen,
} from "@buttergolf/app";
import type { ProductCardData, Product, Category, Brand, Model, SellFormData } from "@buttergolf/app";
import { OnboardingScreen } from "@buttergolf/app/src/features/onboarding";
import { LoggedOutHomeScreen } from "@buttergolf/app/src/features/home";
import { CategoryListScreen } from "@buttergolf/app/src/features/categories";
import {
  View as RNView,
  Text as RNText,
  Pressable as RNPressable,
} from "react-native";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
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
      Sell: {
        path: routes.sell.slice(1), // 'sell'
      },
      SignIn: {
        path: routes.signIn.slice(1), // 'sign-in'
      },
      SignUp: {
        path: routes.signUp.slice(1), // 'sign-up'
      },
      VerifyEmail: {
        path: routes.verifyEmail.slice(1), // 'verify-email'
      },
      ForgotPassword: {
        path: routes.forgotPassword.slice(1), // 'forgot-password'
      },
      ResetPassword: {
        path: routes.resetPassword.slice(1), // 'reset-password'
      },
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

// Function to fetch categories for sell flow
async function fetchCategories(): Promise<Category[]> {
  try {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    if (!apiUrl) return [];

    const response = await fetch(`${apiUrl}/api/categories`, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

// Function to search brands
async function searchBrands(query: string): Promise<Brand[]> {
  try {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    if (!apiUrl || !query) return [];

    const response = await fetch(`${apiUrl}/api/brands?query=${encodeURIComponent(query)}`, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Failed to search brands:", error);
    return [];
  }
}

// Function to search models for a brand
async function searchModels(brandId: string, query: string): Promise<Model[]> {
  try {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    if (!apiUrl || !brandId) return [];

    const params = new URLSearchParams({ brandId });
    if (query) params.append("query", query);

    const response = await fetch(`${apiUrl}/api/models?${params.toString()}`, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Failed to search models:", error);
    return [];
  }
}

// Function to submit a listing
async function submitListing(data: SellFormData): Promise<{ id: string }> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!apiUrl) throw new Error("API URL not configured");

  const response = await fetch(`${apiUrl}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      title: data.title,
      description: data.description,
      price: parseFloat(data.price),
      categoryId: data.categoryId,
      brandId: data.brandId,
      modelId: data.modelId || undefined,
      condition: data.condition,
      images: data.images.map((img) => img.uri),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to create listing");
  }

  return await response.json();
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

  // Debug: Verify Clerk publishable key is loaded
  const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  console.log('[Clerk] Publishable key:', clerkPublishableKey ? 'LOADED' : 'MISSING');

  if (!clerkPublishableKey) {
    console.error('[Clerk] EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is not set. Check apps/mobile/.env file and restart Expo with --clear flag.');
  }

  return (
    <SafeAreaProvider>
      <ClerkProvider
        tokenCache={tokenCache}
        publishableKey={clerkPublishableKey}
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
                      onSellPress={() => navigation.navigate("Sell")}
                    />
                    );
                  }}
                </Stack.Screen>
                <Stack.Screen
                  name="Sell"
                  options={{
                    headerShown: false, // SellScreen has its own header
                    presentation: "modal",
                  }}
                >
                  {({ navigation }: { navigation: any }) => (
                    <SellScreen
                      isAuthenticated={true}
                      onFetchCategories={fetchCategories}
                      onSearchBrands={searchBrands}
                      onSearchModels={searchModels}
                      onSubmitListing={submitListing}
                      onClose={() => navigation.goBack()}
                      onSuccess={(productId) => {
                        navigation.navigate("ProductDetail", { id: productId });
                      }}
                    />
                  )}
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
  const [flowState, setFlowState] = useState<
    "onboarding" | "signIn" | "signUp" | "verifyEmail" | "forgotPassword" | "resetPassword" | "loggedOutHome"
  >("onboarding");
  const [resetPasswordEmail, setResetPasswordEmail] = useState<string>("");
  const [signUpEmail, setSignUpEmail] = useState<string>("");

  const Stack = createNativeStackNavigator();

  if (flowState === "loggedOutHome") {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoggedOutHome">
          {({ navigation }: { navigation: any }) => (
            <LoggedOutHomeScreen
              onFetchProducts={fetchProducts}
              onSellPress={() => navigation.navigate("Sell")}
            />
          )}
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
              onSellPress={() => navigation.navigate("Sell")}
            />
            );
          }}
        </Stack.Screen>
        <Stack.Screen
          name="Sell"
          options={{
            headerShown: false,
            presentation: "modal",
          }}
        >
          {({ navigation }: { navigation: any }) => (
            <SellScreen
              isAuthenticated={false}
              onRequireAuth={() => {
                // Close modal and navigate to sign in
                navigation.goBack();
                setFlowState("signIn");
              }}
              onClose={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }

  if (flowState === "signIn") {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignIn">
          {() => (
            <SignInScreen
              onSuccess={() => {
                // Auth successful, ClerkProvider handles session
              }}
              onNavigateToSignUp={() => setFlowState("signUp")}
              onNavigateToForgotPassword={() => setFlowState("forgotPassword")}
              onNavigateBack={() => setFlowState("onboarding")}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }

  if (flowState === "signUp") {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignUp">
          {() => (
            <SignUpScreen
              onSuccess={(email) => {
                setSignUpEmail(email);
                setFlowState("verifyEmail");
              }}
              onNavigateToSignIn={() => setFlowState("signIn")}
              onNavigateBack={() => setFlowState("onboarding")}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }

  if (flowState === "verifyEmail") {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="VerifyEmail">
          {() => (
            <VerifyEmailScreen
              email={signUpEmail}
              onSuccess={() => {
                // Auth successful, ClerkProvider handles session
              }}
              onNavigateBack={() => setFlowState("signUp")}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }

  if (flowState === "forgotPassword") {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ForgotPassword">
          {() => (
            <ForgotPasswordScreen
              onSuccess={(email) => {
                setResetPasswordEmail(email);
                setFlowState("resetPassword");
              }}
              onNavigateBack={() => setFlowState("signIn")}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }

  if (flowState === "resetPassword") {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ResetPassword">
          {() => (
            <ResetPasswordScreen
              email={resetPasswordEmail}
              onSuccess={() => setFlowState("signIn")}
              onNavigateBack={() => setFlowState("forgotPassword")}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }

  // Default: Onboarding screen
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding">
        {() => (
          <OnboardingScreen
            onSkip={() => setFlowState("loggedOutHome")}
            onSignUp={() => setFlowState("signUp")}
            onSignIn={() => setFlowState("signIn")}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
