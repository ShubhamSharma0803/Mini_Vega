import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useHabitsStore, Habit, HabitCategory } from '../../../store/habits-store'

// ─── constants ───────────────────────────────────────────────

const CATEGORY_COLORS: Record<HabitCategory, string> = {
  Health: '#6FCF97',
  Learning: '#56CCF2',
  Mindfulness: '#A18CD1',
  Productivity: '#F7971E',
}

const CATEGORY_ICONS: Record<HabitCategory, string> = {
  Health: '❤️',
  Learning: '📚',
  Mindfulness: '🧘',
  Productivity: '⚡',
}

// ─── main screen ─────────────────────────────────────────────

export default function HabitsConfirmationScreen() {
  const params = useLocalSearchParams()

  const habits: Habit[] = params.habits
    ? JSON.parse(params.habits as string)
    : []

  const { setHabits } = useHabitsStore()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    setHabits(habits)
    await AsyncStorage.setItem('habits_setup_completed', 'true')
    router.replace('/(tabs)/habits')
  }

  // group habits by category
  const grouped = habits.reduce<Record<string, Habit[]>>((acc, habit) => {
    const cat = habit.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(habit)
    return acc
  }, {})

  const categories = Object.keys(grouped) as HabitCategory[]

  const customCount = habits.filter((h) => h.isCustom).length
  const presetCount = habits.filter((h) => !h.isCustom).length

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* ── header ── */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.eyebrow}>STEP 3 OF 3</Text>
        <Text style={styles.title}>You're All Set 🎯</Text>
        <Text style={styles.subtitle}>
          Review your habit plan before starting.
        </Text>

        {/* ── summary strip ── */}
        <View style={styles.summaryStrip}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{habits.length}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{presetCount}</Text>
            <Text style={styles.summaryLabel}>Presets</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{customCount}</Text>
            <Text style={styles.summaryLabel}>Custom</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{categories.length}</Text>
            <Text style={styles.summaryLabel}>Categories</Text>
          </View>
        </View>

        {/* ── habits grouped by category ── */}
        {categories.map((cat) => {
          const color = CATEGORY_COLORS[cat]
          const habitsInCat = grouped[cat]

          return (
            <View key={cat} style={styles.categoryCard}>

              {/* category header */}
              <View style={[styles.categoryCardHeader, { borderBottomColor: color + '33' }]}>
                <View style={[styles.categoryPill, { backgroundColor: color + '22' }]}>
                  <Text style={styles.categoryPillIcon}>{CATEGORY_ICONS[cat]}</Text>
                  <Text style={[styles.categoryPillText, { color }]}>{cat}</Text>
                </View>
                <Text style={[styles.catCount, { color }]}>
                  {habitsInCat.length} habit{habitsInCat.length !== 1 ? 's' : ''}
                </Text>
              </View>

              {/* habits */}
              {habitsInCat.map((habit, i) => (
                <View
                  key={habit.id}
                  style={[
                    styles.habitRow,
                    i < habitsInCat.length - 1 && styles.habitRowBorder,
                  ]}
                >
                  <View style={[styles.habitIconBox, { backgroundColor: color + '22' }]}>
                    <Text style={styles.habitIcon}>{habit.icon}</Text>
                  </View>
                  <Text style={styles.habitName}>{habit.name}</Text>
                  {habit.isCustom && (
                    <View style={styles.customBadge}>
                      <Text style={styles.customBadgeText}>Custom</Text>
                    </View>
                  )}
                </View>
              ))}

            </View>
          )
        })}

        {/* ── confirm button — inside scroll ── */}
        <View style={styles.bottomAction}>
          <TouchableOpacity
            style={[styles.confirmButton, isLoading && { opacity: 0.7 }]}
            onPress={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.confirmButtonText}>Start Tracking 🔥</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.disclaimer}>
            You can always update your habits later from settings.
          </Text>
        </View>

        <View style={{ height: 100 }} />

      </ScrollView>
    </SafeAreaView>
  )
}

// ─── styles ──────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F1117' },
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 56 },

  // header
  backBtn: { marginBottom: 20 },
  backText: { color: '#6C63FF', fontSize: 15, fontWeight: '600' },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#6C63FF',
    marginBottom: 10,
  },
  title: { fontSize: 30, fontWeight: '800', color: '#FFFFFF', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6B7280', lineHeight: 21, marginBottom: 24 },

  // summary strip
  summaryStrip: {
    flexDirection: 'row',
    backgroundColor: '#1A1D2E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryNumber: { fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
  summaryLabel: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#2A2D40',
  },

  // category card
  categoryCard: {
    backgroundColor: '#1A1D2E',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  categoryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  categoryPillIcon: { fontSize: 12 },
  categoryPillText: { fontSize: 12, fontWeight: '700' },
  catCount: { fontSize: 12, fontWeight: '600' },

  // habit row
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  habitRowBorder: { borderBottomWidth: 1, borderBottomColor: '#2A2D40' },
  habitIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  habitIcon: { fontSize: 17 },
  habitName: { flex: 1, color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  customBadge: {
    backgroundColor: '#6C63FF22',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  customBadgeText: { color: '#6C63FF', fontSize: 11, fontWeight: '700' },

  // bottom action
  bottomAction: { marginTop: 8, gap: 12 },
  confirmButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  disclaimer: {
    color: '#4B5563',
    fontSize: 12,
    textAlign: 'center',
  },
})