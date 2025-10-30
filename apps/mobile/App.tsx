import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Provider, HomeScreen, RoundsScreen } from '@buttergolf/app'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <Provider>
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
    </Provider>
  )
}
