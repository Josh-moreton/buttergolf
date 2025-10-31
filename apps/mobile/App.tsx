import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Provider, HomeScreen, RoundsScreen, OnboardingScreen } from '@buttergolf/app'
// eslint-disable-next-line deprecation/deprecation
import { ClerkProvider, SignedIn, SignedOut, useOAuth } from '@clerk/clerk-expo'
import * as SecureStore from 'expo-secure-store'
import { YStack } from '@buttergolf/ui'
import { Platform } from 'react-native'
import { useState } from 'react'

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
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup')
  
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

  if (showAuth) {
    // Show authentication options after user clicks CTA
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" gap="$4" padding="$6" backgroundColor="$bg">
        <OnboardingScreen
          onSkip={() => setShowAuth(false)}
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
      </YStack>
    )
  }

  return (
    <OnboardingScreen
      onSkip={() => {
        // Skip goes directly to auth
        setShowAuth(true)
      }}
      onSignUp={() => {
        setAuthMode('signup')
        setShowAuth(true)
      }}
      onSignIn={() => {
        setAuthMode('signin')
        setShowAuth(true)
      }}
      onAbout={() => {
        // In a real app, this would navigate to an about page
        console.log('Navigate to about page')
      }}
    />
  )
}
