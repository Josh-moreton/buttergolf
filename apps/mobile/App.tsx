import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Provider, HomeScreen, RoundsScreen } from '@buttergolf/app'
import { OnboardingScreen } from '@buttergolf/app/src/features/onboarding'
import { View as RNView, Text as RNText, Pressable as RNPressable, Platform } from 'react-native'
// eslint-disable-next-line deprecation/deprecation
import { ClerkProvider, SignedIn, SignedOut, useOAuth, useAuth } from '@clerk/clerk-expo'
import * as SecureStore from 'expo-secure-store'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Button, Text } from '@buttergolf/ui'
// Platform imported above with RN components

const Stack = createNativeStackNavigator()

function SignOutButton() {
  const { signOut } = useAuth()
  return (
    <Button
      size="$2"
      chromeless
      onPress={() => signOut()}
      paddingHorizontal="$3"
    >
      <Text>Sign Out</Text>
    </Button>
  )
}

const HeaderRightComponent = () => <SignOutButton />

export default function App() {
  const FORCE_MINIMAL = false // back to normal app rendering
  const tokenCache = {
    async getToken(key: string) {
      try {
        return await SecureStore.getItemAsync(key)
      } catch {
        return null
      }
    },
    async saveToken(key: string, value: string) {
      try {
        await SecureStore.setItemAsync(key, value)
      } catch {
        // ignore
      }
    },
  }

  if (FORCE_MINIMAL) {
    return (
      <RNView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fbfbf9' }}>
        <RNText style={{ fontSize: 20, marginBottom: 12 }}>Minimal RN screen</RNText>
        <RNPressable onPress={() => {}} style={{ paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#13a063', borderRadius: 8 }}>
          <RNText style={{ color: 'white', fontWeight: '600' }}>Tap</RNText>
        </RNPressable>
      </RNView>
    )
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
            <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{ 
                    title: 'ButterGolf',
                    headerRight: HeaderRightComponent,
                  }}
                />
                <Stack.Screen
                  name="Rounds"
                  component={RoundsScreen}
                  options={{ title: 'Your Rounds' }}
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
  )
}

function OnboardingFlow() {
  // eslint-disable-next-line deprecation/deprecation
  const { startOAuthFlow: startGoogle } = useOAuth({ strategy: 'oauth_google' })
  // eslint-disable-next-line deprecation/deprecation
  const { startOAuthFlow: startApple } = useOAuth({ strategy: 'oauth_apple' })

  const handleOAuth = async (provider: 'google' | 'apple') => {
    const start = provider === 'google' ? startGoogle : startApple
    const { createdSessionId, setActive, signIn, signUp } = await start()

    if (createdSessionId) {
      await setActive?.({ session: createdSessionId })
    } else {
      // Handle MFA or additional steps if required
      console.warn('Additional steps required', { signIn, signUp })
    }
  }

  return (
    <OnboardingScreen
      onSkip={() => handleOAuth('google')}
      onSignUp={() => handleOAuth('google')}
      onSignIn={() => {
        if (Platform.OS === 'ios') {
          handleOAuth('apple')
        } else {
          handleOAuth('google')
        }
      }}
      onAbout={() => {
        // In a real app, this would navigate to an about page
        console.log('Navigate to about page')
      }}
    />
  )
}
