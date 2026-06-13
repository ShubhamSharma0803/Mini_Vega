import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function ConfirmationScreen() {

  const completeSetup = async () => {
    await AsyncStorage.setItem('finance_setup_completed', 'true')
    // save to AsyncStorage so finance.tsx knows setup is done
    // next time user opens Finance tab → goes straight to dashboard
  }

  useEffect(() => {
    completeSetup()
    // runs once when confirmation screen loads
    // saves the flag before user even taps the button
  }, [])

  const handleGoToDashboard = () => {
    router.replace('/(tabs)/finance')
    // replace → user cannot press back and return to confirmation
  }

  return (
    <View style={styles.container}>

      <Text style={styles.emoji}>✦</Text>

      <Text style={styles.title}>You're all set!</Text>

      <Text style={styles.subtitle}>
        Your financial profile is ready. Let's take a look at your dashboard.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleGoToDashboard}>
        <Text style={styles.buttonText}>Go to Dashboard</Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.5,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
  button: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    paddingHorizontal: 48,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
})