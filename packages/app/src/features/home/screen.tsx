'use client'

import { Link } from 'solito/link'
import { StyleSheet, Text, View } from 'react-native'

export function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, styles.titleText]}>
        ButterGolf ⛳
      </Text>
      <Text style={styles.tagline}>
        Track your golf rounds with ease
      </Text>
      <Link href="/rounds">
  <Text style={styles.link}>
          View Rounds
        </Text>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  title: {
    marginBottom: 16,
  },
  titleText: {
    fontSize: 28,
    fontWeight: '600',
  },
  tagline: {
    textAlign: 'center',
    marginBottom: 24,
  },
  link: {
    color: '#1d4ed8',
    fontWeight: '600',
  },
})
