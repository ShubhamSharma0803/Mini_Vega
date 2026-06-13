import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { router } from 'expo-router'

type IncomeSource = {
  name: string
  amount: string
  date: string
}

export default function IncomeSetupScreen() {

  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([
    { name: '', amount: '', date: '' }
  ])

  const addSource = () => {
    setIncomeSources([...incomeSources, { name: '', amount: '', date: '' }])
  }

  const updateSource = (index: number, field: keyof IncomeSource, value: string) => {
    setIncomeSources(
      incomeSources.map((source, i) =>
        i === index ? { ...source, [field]: value } : source
      )
    )
  }

  const handleNext = () => {
    router.push('/(tabs)/finance-setup/expenses')
  }

  const renderSource = ({ item, index }: { item: IncomeSource, index: number }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Income Source {index + 1}</Text>
      <TextInput
        style={styles.input}
        placeholder="Source name (e.g. Salary, Freelance)"
        value={item.name}
        onChangeText={(value) => updateSource(index, 'name', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount (e.g. 50000)"
        value={item.amount}
        onChangeText={(value) => updateSource(index, 'amount', value)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Date received (e.g. 1 for 1st of month)"
        value={item.date}
        onChangeText={(value) => updateSource(index, 'date', value)}
        keyboardType="numeric"
      />
    </View>
  )

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >

      <Text style={styles.title}>Income Sources</Text>
      <Text style={styles.subtitle}>Add all your monthly income sources</Text>

      <FlatList
        data={incomeSources}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderSource}
        contentContainerStyle={styles.list}
        style={styles.flatList}
      />

      {/* buttons live outside FlatList so they always stay visible */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.addButton} onPress={addSource}>
          <Text style={styles.addButtonText}>+ Add Another Source</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.5,
    marginBottom: 24,
  },
  flatList: {
    flex: 1,
    // flex:1 → FlatList takes all available space between header and buttons
  },
  list: {
    gap: 16,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  bottomContainer: {
    paddingBottom: 100,
    // 100 → clears the tab bar height completely
    gap: 12,
    paddingTop: 8,
  },
  addButton: {
    borderWidth: 1,
    borderColor: '#000000',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
})