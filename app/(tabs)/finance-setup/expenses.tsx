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

type RecurringExpense = {
  name: string
  amount: string
  date: string
  category: string
}

export default function ExpensesSetupScreen() {

  const [expenses, setExpenses] = useState<RecurringExpense[]>([
    { name: '', amount: '', date: '', category: '' }
  ])

  const addExpense = () => {
    setExpenses([...expenses, { name: '', amount: '', date: '', category: '' }])
  }

  const updateExpense = (index: number, field: keyof RecurringExpense, value: string) => {
    setExpenses(
      expenses.map((expense, i) =>
        i === index ? { ...expense, [field]: value } : expense
      )
    )
  }

  const handleNext = () => {
    router.push('/(tabs)/finance-setup/confirmation')
  }

  const renderExpense = ({ item, index }: { item: RecurringExpense, index: number }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Recurring Expense {index + 1}</Text>
      <TextInput
        style={styles.input}
        placeholder="Expense name (e.g. Rent, Netflix)"
        value={item.name}
        onChangeText={(value) => updateExpense(index, 'name', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount (e.g. 15000)"
        value={item.amount}
        onChangeText={(value) => updateExpense(index, 'amount', value)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Date charged (e.g. 5 for 5th of month)"
        value={item.date}
        onChangeText={(value) => updateExpense(index, 'date', value)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Category (e.g. Housing, Entertainment)"
        value={item.category}
        onChangeText={(value) => updateExpense(index, 'category', value)}
      />
    </View>
  )

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >

      <Text style={styles.title}>Recurring Expenses</Text>
      <Text style={styles.subtitle}>Add expenses that repeat every month</Text>

      <FlatList
        data={expenses}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderExpense}
        contentContainerStyle={styles.list}
        style={styles.flatList}
      />

      {/* buttons live outside FlatList so they always stay visible */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.addButton} onPress={addExpense}>
          <Text style={styles.addButtonText}>+ Add Another Expense</Text>
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