import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Provider, HomeScreen, RoundsScreen } from '@buttergolf/app'
import { OnboardingScreen } from '@buttergolf/app/src/features/onboarding'
// eslint-disable-next-line deprecation/deprecation
import { ClerkProvider, SignedIn, SignedOut, useOAuth } from '@clerk/clerk-expo'
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

const Stack = createNativeStackNavigator()

export default function App() {
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

  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <Provider>
        <SignedIn>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'ButterGolf' }}
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
          <OnboardingFlow />
        </SignedOut>
      </Provider>
    </ClerkProvider>
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
