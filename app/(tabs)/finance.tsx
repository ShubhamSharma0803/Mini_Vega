import React, { useEffect, useState } from 'react'
// React core — gives us useEffect and useState hooks

import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
// ScrollView → dashboard content is taller than the screen, needs to scroll

import { router } from 'expo-router'
// router → lets us navigate between screens programmatically

import AsyncStorage from '@react-native-async-storage/async-storage'
// AsyncStorage → persistent key-value storage that survives app restarts

import { useFinanceStore } from '../../store/finance-store'
// useFinanceStore → pulls incomeSources and recurringExpenses from Zustand
// no prop drilling — data is globally available the moment setup saves it

// ─── helpers ─────────────────────────────────────────────────────────────────

const toNum = (s: string): number => parseFloat(s) || 0
// parseFloat converts string → number
// || 0 → fallback if string is empty or not a valid number, avoids NaN

const CATEGORY_COLORS: Record<string, string> = {
  Housing: '#6C63FF',
  Food: '#FF6584',
  Transport: '#43C6AC',
  Health: '#F7971E',
  Entertainment: '#A18CD1',
  Education: '#56CCF2',
  Other: '#6FCF97',
}
// Record<string, string> → TypeScript type for an object where every key and value is a string
// used to assign a unique color to each expense category

// ─── sub-components ──────────────────────────────────────────────────────────

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>
}
// small reusable component so every card header looks identical
// { title: string } → inline TypeScript type for the props

function BudgetCard({
  totalIncome,
  totalExpenses,
}: {
  totalIncome: number
  totalExpenses: number
}) {
  const net = totalIncome - totalExpenses
  // net → how much money is left after all expenses
  // positive = surplus, negative = deficit

  const spentPct = totalIncome > 0 ? Math.min(totalExpenses / totalIncome, 1) : 0
  // spentPct → fraction of income that is spent, capped at 1 (100%)
  // Math.min prevents the bar from visually overflowing if expenses > income
  // guard: if totalIncome is 0, avoid division by zero → default to 0

  return (
    <View style={styles.budgetCard}>
      <Text style={styles.budgetLabel}>Monthly Overview</Text>

      <Text style={[styles.netAmount, { color: net >= 0 ? '#6FCF97' : '#FF6584' }]}>
        {net >= 0 ? '+' : ''}₹{net.toLocaleString('en-IN')}
      </Text>
      {/* toLocaleString('en-IN') → formats number with Indian comma style e.g. 1,00,000 */}
      {/* net >= 0 ? '+' : '' → adds explicit + sign for surplus, minus is implicit */}

      <Text style={styles.netLabel}>{net >= 0 ? 'Surplus' : 'Deficit'} this month</Text>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${spentPct * 100}%` }]} />
      </View>
      {/* progress bar → white fill that grows based on how much of income is spent */}
      {/* width is a percentage string like '67%' — React Native accepts this */}

      <View style={styles.budgetRow}>
        <View>
          <Text style={styles.budgetMeta}>Income</Text>
          <Text style={styles.budgetValue}>₹{totalIncome.toLocaleString('en-IN')}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.budgetMeta}>Expenses</Text>
          <Text style={[styles.budgetValue, { color: '#FF6584' }]}>
            ₹{totalExpenses.toLocaleString('en-IN')}
          </Text>
        </View>
      </View>
    </View>
  )
}

function CategoryBreakdown({
  expenses,
}: {
  expenses: { name: string; amount: string; category: string }[]
}) {
  const grouped: Record<string, number> = {}
  expenses.forEach((e) => {
    const cat = e.category || 'Other'
    grouped[cat] = (grouped[cat] || 0) + toNum(e.amount)
  })
  // grouped → accumulates total amount per category
  // grouped[cat] || 0 → if this category hasn't appeared yet, start from 0
  // then add current expense amount to it

  const total = Object.values(grouped).reduce((sum, amt) => sum + amt, 0)
  // total → sum of all expense amounts, used to calculate each category's percentage

  const entries = Object.entries(grouped).sort((a, b) => b[1] - a[1])
  // Object.entries → converts { Housing: 5000 } to [['Housing', 5000]]
  // .sort((a, b) => b[1] - a[1]) → sort descending by amount, biggest category first

  if (entries.length === 0) return null
  // if no expenses were entered, don't render this card at all

  return (
    <View style={styles.card}>
      <SectionTitle title="Spending by Category" />
      {entries.map(([cat, amt]) => {
        const pct = total > 0 ? (amt / total) * 100 : 0
        // pct → what percentage of total expenses does this category represent
        const color = CATEGORY_COLORS[cat] ?? '#6C63FF'
        // ?? → nullish coalescing: use CATEGORY_COLORS value if it exists, else fallback purple

        return (
          <View key={cat} style={styles.catRow}>
            <View style={styles.catLabelRow}>
              <View style={[styles.catDot, { backgroundColor: color }]} />
              <Text style={styles.catName}>{cat}</Text>
              <Text style={styles.catAmt}>₹{amt.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.catTrack}>
              <View style={[styles.catFill, { width: `${pct}%`, backgroundColor: color }]} />
            </View>
          </View>
        )
      })}
    </View>
  )
}

function IncomeList({
  sources,
}: {
  sources: { name: string; amount: string; date: string }[]
}) {
  if (sources.length === 0) return null

  return (
    <View style={styles.card}>
      <SectionTitle title="Income Sources" />
      {sources.map((s, i) => (
        <View
          key={i}
          style={[styles.listRow, i < sources.length - 1 && styles.listRowBorder]}
        >
          {/* listRowBorder only applied between rows, not after the last one */}
          <View style={styles.listIconIncome}>
            <Text style={styles.listIconText}>💰</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.listName}>{s.name}</Text>
            <Text style={styles.listSub}>On {s.date || 'monthly'}</Text>
          </View>
          <Text style={styles.listAmountIncome}>+₹{toNum(s.amount).toLocaleString('en-IN')}</Text>
        </View>
      ))}
    </View>
  )
}

function ExpenseList({
  expenses,
}: {
  expenses: { name: string; amount: string; date: string; category: string }[]
}) {
  if (expenses.length === 0) return null

  return (
    <View style={styles.card}>
      <SectionTitle title="Recurring Expenses" />
      {expenses.map((e, i) => {
        const color = CATEGORY_COLORS[e.category] ?? '#6C63FF'
        return (
          <View
            key={i}
            style={[styles.listRow, i < expenses.length - 1 && styles.listRowBorder]}
          >
            <View style={[styles.listIconExpense, { backgroundColor: color + '22' }]}>
              {/* color + '22' → appends hex alpha 22 (≈13% opacity) for a tinted background */}
              <View style={[styles.catDot, { backgroundColor: color }]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.listName}>{e.name}</Text>
              <Text style={styles.listSub}>{e.category} · Due {e.date || 'monthly'}</Text>
            </View>
            <Text style={styles.listAmountExpense}>
              -₹{toNum(e.amount).toLocaleString('en-IN')}
            </Text>
          </View>
        )
      })}
    </View>
  )
}

// ─── main screen ─────────────────────────────────────────────────────────────

export default function FinanceScreen() {

  const [isLoading, setIsLoading] = useState<boolean>(true)
  // isLoading → true while AsyncStorage check is running
  // starts as true because the check begins the moment the screen opens

  const [setupComplete, setSetupComplete] = useState<boolean>(false)
  // setupComplete → stores the result of the AsyncStorage check
  // false by default — we assume setup is not done until proven otherwise

  const { incomeSources, recurringExpenses } = useFinanceStore()
  console.log('Store:', { incomeSources, recurringExpenses })
  // destructure directly from Zustand store
  // these update reactively — if store changes, component re-renders automatically

  const checkFinanceSetup = async () => {
    const value = await AsyncStorage.getItem('finance_setup_completed')
    
    

    if (value === 'true') {
      setSetupComplete(true)
      
    } else {
      
      router.replace('/(tabs)/finance-setup/income')
    }

    setIsLoading(false)
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

  if (!setupComplete) return null
  // if setup isn't done, router.replace is already running
  // return null prevents a flash of the dashboard before redirect completes

  // ── derived data ──────────────────────────────────────────
  const totalIncome = incomeSources.reduce((sum, s) => sum + toNum(s.amount), 0)
  const totalExpenses = recurringExpenses.reduce((sum, e) => sum + toNum(e.amount), 0)
  // reduce → walks through the array and accumulates a single value
  // starts at 0, adds each item's amount on every iteration

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ScrollView → lets the dashboard scroll when content is taller than screen */}
      {/* contentContainerStyle → applies padding/layout to the inner scrollable content */}
      {/* showsVerticalScrollIndicator={false} → hides the scroll bar on the right edge */}

      {/* ── header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Finance</Text>

        {/* DEV ONLY — remove this button before shipping to users */}
        <TouchableOpacity style={styles.resetButton} onPress={resetSetup}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* ── sections ── */}
      <BudgetCard totalIncome={totalIncome} totalExpenses={totalExpenses} />
      <CategoryBreakdown expenses={recurringExpenses} />
      <IncomeList sources={incomeSources} />
      <ExpenseList expenses={recurringExpenses} />

      <View style={{ height: 100 }} />
      {/* bottom spacer → prevents the last card from hiding behind the tab bar */}

    </ScrollView>
  )
}

// ─── styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

  screen: { flex: 1, backgroundColor: '#0F1117' },
  // backgroundColor matches the dark theme used across Mini Vega

  content: { paddingHorizontal: 20, paddingTop: 60 },
  // paddingTop: 60 → clears the status bar area at the top

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  // reused for both the loading spinner and the empty state

  // ── header ──
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#FFFFFF' },
  resetButton: {
    borderWidth: 1,
    borderColor: '#ff0000',
    borderRadius: 12,
    padding: 8,
    paddingHorizontal: 16,
  },
  // kept same red border style as your original reset button
  resetButtonText: { color: '#ff0000', fontSize: 13, fontWeight: '500' },

  // ── budget card ──
  budgetCard: {
    backgroundColor: '#6C63FF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
  },
  budgetLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '500', marginBottom: 8 },
  netAmount: { fontSize: 38, fontWeight: '800' },
  netLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 16 },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 3,
    marginBottom: 16,
  },
  progressFill: { height: 6, backgroundColor: '#FFFFFF', borderRadius: 3 },
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between' },
  budgetMeta: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  budgetValue: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginTop: 2 },

  // ── generic card ──
  card: {
    backgroundColor: '#1A1D2E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 16 },

  // ── category breakdown ──
  catRow: { marginBottom: 12 },
  catLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  catDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  catName: { flex: 1, color: '#C0C0D0', fontSize: 14 },
  catAmt: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  catTrack: { height: 4, backgroundColor: '#2A2D40', borderRadius: 2 },
  catFill: { height: 4, borderRadius: 2 },

  // ── list rows ──
  listRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  listRowBorder: { borderBottomWidth: 1, borderBottomColor: '#2A2D40' },
  listIconIncome: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1E2A3A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listIconExpense: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listIconText: { fontSize: 18 },
  listName: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  listSub: { color: '#6B7280', fontSize: 12, marginTop: 2 },
  listAmountIncome: { color: '#6FCF97', fontSize: 15, fontWeight: '700' },
  listAmountExpense: { color: '#FF6584', fontSize: 15, fontWeight: '700' },

})