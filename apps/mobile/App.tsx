import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View } from 'react-native'
import { TamaguiProvider, config, Button, Text } from '@buttergolf/ui'

export default function App() {
  return (
    <TamaguiProvider config={config}>
      <View style={styles.container}>
        <Text>Hello from mobile (Tamagui)</Text>
        <Button onPress={() => console.log('pressed')}>Press me</Button>
        <StatusBar style="auto" />
      </View>
    </TamaguiProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
})
