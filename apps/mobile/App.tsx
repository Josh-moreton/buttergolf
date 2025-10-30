import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { TamaguiProvider, config } from '@buttergolf/ui'
import { HomeScreen, RoundsScreen } from '@buttergolf/app'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
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
    </TamaguiProvider>
  )
}
