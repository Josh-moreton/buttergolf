import { StyleSheet, Text, View } from 'react-native'

export function RoundsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Your Rounds
      </Text>
      <Text style={styles.copy}>
        Round tracking coming soon! This will connect to your Prisma database.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  heading: {
    marginBottom: 16,
    fontSize: 24,
    fontWeight: '600',
  },
  copy: {
    lineHeight: 22,
    fontSize: 16,
  },
})
