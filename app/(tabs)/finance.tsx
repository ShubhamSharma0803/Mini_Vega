import React, { useEffect, useState } from 'react'
// React core — gives us useEffect and useState hooks

import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native'
// TouchableOpacity → added for the dev reset button

import { router } from 'expo-router'
// router → lets us navigate between screens programmatically

import AsyncStorage from '@react-native-async-storage/async-storage'
// AsyncStorage → persistent key-value storage that survives app restarts

export default function FinanceScreen() {

  const [isLoading, setIsLoading] = useState<boolean>(true)
  // isLoading → true while AsyncStorage check is running
  // starts as true because the check begins the moment the screen opens

  const [setupComplete, setSetupComplete] = useState<boolean>(false)
  // setupComplete → stores the result of the AsyncStorage check
  // false by default — we assume setup is not done until proven otherwise

  const checkFinanceSetup = async () => {
    // async → because AsyncStorage.getItem is a slow operation
    // we must wait for it to finish before continuing

    const value = await AsyncStorage.getItem('finance_setup_completed')
    // await → pause here until AsyncStorage responds, then continue
    // value will be the string 'true' or null if key doesn't exist yet

    if (value === 'true') {
      // comparing with string 'true' not boolean true
      // AsyncStorage only stores strings
      setSetupComplete(true)
      // setup is done → update state so the dashboard renders
    } else {
      router.replace('/(tabs)/finance-setup/income')
      // setup not done → redirect to first setup screen
      // router.replace → replaces current screen in navigation history
      // user cannot press back and return to this loading screen
    }

    setIsLoading(false)
    // placed outside if/else → always runs whether setup was done or not
    // turns off the spinner now that we have our answer
  }

  const resetSetup = async () => {
    await AsyncStorage.removeItem('finance_setup_completed')
    // removeItem → deletes the key from AsyncStorage completely
    // next time checkFinanceSetup runs, value will be null
    router.replace('/(tabs)/finance-setup/income')
    // send user back to the beginning of Finance setup
  }

  useEffect(() => {
    checkFinanceSetup()
    // useEffect with [] → runs checkFinanceSetup once
    // triggers after the component renders for the first time
    // [] means no dependencies — never re-runs after that
  }, [])

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        {/* shown while AsyncStorage check is in progress */}
      </View>
    )
  }

  return (
    <View style={styles.center}>

      <Text style={styles.title}>Finance Dashboard</Text>
      <Text style={styles.subtitle}>Your financial overview will appear here</Text>

      {/* DEV ONLY — remove this button before shipping to users */}
      <TouchableOpacity style={styles.resetButton} onPress={resetSetup}>
        <Text style={styles.resetButtonText}>Reset Finance Setup (Dev Only)</Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.5,
    marginBottom: 48,
  },
  resetButton: {
    borderWidth: 1,
    borderColor: '#ff0000',
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 24,
  },
  resetButtonText: {
    color: '#ff0000',
    fontSize: 14,
    fontWeight: '500',
  },
})