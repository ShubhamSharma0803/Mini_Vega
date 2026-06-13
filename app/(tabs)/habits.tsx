import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useHabitsStore, Habit, HabitCategory } from '../../store/habits-store'

// ─── constants ───────────────────────────────────────────────

const CATEGORY_COLORS: Record<HabitCategory, string> = {
  Health: '#6FCF97',
  Learning: '#56CCF2',
  Mindfulness: '#A18CD1',
  Productivity: '#F7971E',
}

const today = new Date().toISOString().split('T')[0]
// 'YYYY-MM-DD' — computed once at module level, same format as completedDates

// ─── sub-components ──────────────────────────────────────────

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>
}

function TodayCard({
  habits,
  onToggle,
}: {
  habits: Habit[]
  onToggle: (id: string) => void
}) {
  const doneCount = habits.filter((h) => h.completedDates.includes(today)).length
  const allDone = doneCount === habits.length

  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <SectionTitle title="Today" />
        <View style={[
          styles.progressBadge,
          allDone && { backgroundColor: '#6FCF9733' },
        ]}>
          <Text style={[styles.progressBadgeText, allDone && { color: '#6FCF97' }]}>
            {doneCount}/{habits.length}
          </Text>
        </View>
      </View>

      {/* overall progress bar */}
      <View style={styles.overallTrack}>
        <View
          style={[
            styles.overallFill,
            {
              width: habits.length > 0 ? `${(doneCount / habits.length) * 100}%` : '0%',
              backgroundColor: allDone ? '#6FCF97' : '#6C63FF',
            },
          ]}
        />
      </View>

      {habits.map((h, i) => {
        const done = h.completedDates.includes(today)
        const color = CATEGORY_COLORS[h.category]
        return (
          <TouchableOpacity
            key={h.id}
            style={[
              styles.habitRow,
              i < habits.length - 1 && styles.habitRowBorder,
              done && { opacity: 0.7 },
            ]}
            onPress={() => onToggle(h.id)}
            activeOpacity={0.75}
          >
            <View style={[styles.habitIconBox, { backgroundColor: color + '22' }]}>
              <Text style={styles.habitIconText}>{h.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.habitName, done && styles.habitNameDone]}>
                {h.name}
              </Text>
              <Text style={[styles.habitCategory, { color }]}>{h.category}</Text>
            </View>
            {h.streak > 0 && (
              <View style={styles.streakPill}>
                <Text style={styles.streakPillText}>🔥 {h.streak}</Text>
              </View>
            )}
            <View style={[
              styles.checkbox,
              done && { backgroundColor: color, borderColor: color },
            ]}>
              {done && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>
        )
      })}

      {allDone && habits.length > 0 && (
        <View style={styles.allDoneBanner}>
          <Text style={styles.allDoneText}>🎉 All habits done for today!</Text>
        </View>
      )}
    </View>
  )
}

function StreakBoard({ habits }: { habits: Habit[] }) {
  const sorted = [...habits].sort((a, b) => b.streak - a.streak)
  const top = sorted.slice(0, 5)
  const hasAnyStreak = habits.some((h) => h.streak > 0)

  return (
    <View style={styles.card}>
      <SectionTitle title="Streaks" />

      {!hasAnyStreak ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>🔥</Text>
          <Text style={styles.emptyStateText}>Complete habits today to start your streaks</Text>
        </View>
      ) : (
        top.map((h, i) => {
          const color = CATEGORY_COLORS[h.category]
          const isTop = i === 0
          return (
            <View
              key={h.id}
              style={[
                styles.streakRow,
                i < top.length - 1 && styles.habitRowBorder,
                isTop && styles.streakRowTop,
              ]}
            >
              <Text style={[styles.streakRank, isTop && { color: '#F7971E' }]}>
                #{i + 1}
              </Text>
              <Text style={styles.streakRowIcon}>{h.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.habitName}>{h.name}</Text>
                <Text style={[styles.habitCategory, { color }]}>{h.category}</Text>
              </View>
              <View style={styles.streakBadge}>
                <Text style={styles.streakCount}>{h.streak}</Text>
                <Text style={styles.streakLabel}>day{h.streak !== 1 ? 's' : ''}</Text>
              </View>
            </View>
          )
        })
      )}
    </View>
  )
}

function CategorySummary({ habits }: { habits: Habit[] }) {
  const categories: HabitCategory[] = ['Health', 'Learning', 'Mindfulness', 'Productivity']

  return (
    <View style={styles.card}>
      <SectionTitle title="By Category" />
      <View style={styles.categoryGrid}>
        {categories.map((cat) => {
          const catHabits = habits.filter((h) => h.category === cat)
          if (catHabits.length === 0) return null
          const doneToday = catHabits.filter((h) => h.completedDates.includes(today)).length
          const color = CATEGORY_COLORS[cat]
          const allDone = doneToday === catHabits.length

          return (
            <View
              key={cat}
              style={[
                styles.categoryCell,
                { borderColor: allDone ? color + '66' : color + '33' },
              ]}
            >
              <Text style={[styles.categoryCellCount, { color }]}>
                {doneToday}/{catHabits.length}
              </Text>
              <Text style={styles.categoryCellName}>{cat}</Text>
              <View style={styles.categoryMiniTrack}>
                <View
                  style={[
                    styles.categoryMiniFill,
                    {
                      width: catHabits.length > 0
                        ? `${(doneToday / catHabits.length) * 100}%`
                        : '0%',
                      backgroundColor: color,
                    },
                  ]}
                />
              </View>
              {allDone && <Text style={styles.categoryCellDone}>✓ Done</Text>}
            </View>
          )
        })}
      </View>
    </View>
  )
}

// ─── main screen ─────────────────────────────────────────────

export default function HabitsScreen() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [setupComplete, setSetupComplete] = useState<boolean>(false)

  const { habits, toggleHabit } = useHabitsStore()

  const checkHabitsSetup = async () => {
    const value = await AsyncStorage.getItem('habits_setup_completed')

    console.log('=== HABITS DEBUG ===')
    console.log('AsyncStorage value:', value)
    console.log('habits in store:', habits)

    if (value === 'true') {
      setSetupComplete(true)
      console.log('→ showing dashboard')
    } else {
      console.log('→ redirecting to pick')
      router.replace('/(tabs)/habits-setup/pick')
    }

    setIsLoading(false)
  }

  const resetSetup = async () => {
    await AsyncStorage.removeItem('habits_setup_completed')
    router.replace('/(tabs)/habits-setup/pick')
  }

  useEffect(() => {
    checkHabitsSetup()
  }, [])

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    )
  }

  if (!setupComplete) return null

  const doneCount = habits.filter((h) => h.completedDates.includes(today)).length

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* ── header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Habits</Text>
            <Text style={styles.headerSub}>
              {doneCount === habits.length && habits.length > 0
                ? 'All done today 🎉'
                : `${doneCount} of ${habits.length} done today`}
            </Text>
          </View>
          {/* DEV ONLY */}
          <TouchableOpacity style={styles.resetButton} onPress={resetSetup}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* ── sections ── */}
        <TodayCard habits={habits} onToggle={(id) => toggleHabit(id, today)} />
        <StreakBoard habits={habits} />
        <CategorySummary habits={habits} />

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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F1117' },

  // header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerTitle: { fontSize: 30, fontWeight: '800', color: '#FFFFFF' },
  headerSub: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  resetButton: {
    borderWidth: 1,
    borderColor: '#ff0000',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  resetButtonText: { color: '#ff0000', fontSize: 13, fontWeight: '500' },

  // generic card
  card: {
    backgroundColor: '#1A1D2E',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },

  // progress badge
  progressBadge: {
    backgroundColor: '#2A2D40',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  progressBadgeText: { color: '#6B7280', fontSize: 13, fontWeight: '700' },

  // overall progress bar
  overallTrack: {
    height: 4,
    backgroundColor: '#2A2D40',
    borderRadius: 2,
    marginBottom: 16,
  },
  overallFill: { height: 4, borderRadius: 2 },

  // habit rows
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  habitRowBorder: { borderBottomWidth: 1, borderBottomColor: '#2A2D40' },
  habitIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitIconText: { fontSize: 20 },
  habitName: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  habitNameDone: { textDecorationLine: 'line-through', color: '#6B7280' },
  habitCategory: { fontSize: 12, marginTop: 2 },

  // streak pill (inline)
  streakPill: {
    backgroundColor: '#F7971E22',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  streakPillText: { color: '#F7971E', fontSize: 12, fontWeight: '700' },

  // checkbox
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#2A2D40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },

  // all done banner
  allDoneBanner: {
    backgroundColor: '#6FCF9718',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  allDoneText: { color: '#6FCF97', fontSize: 14, fontWeight: '600' },

  // streak board
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 10,
  },
  streakRowTop: { backgroundColor: '#F7971E08', borderRadius: 12, paddingHorizontal: 8 },
  streakRank: { color: '#6B7280', fontSize: 13, fontWeight: '800', width: 26 },
  streakRowIcon: { fontSize: 20 },
  streakBadge: { alignItems: 'center', minWidth: 36 },
  streakCount: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  streakLabel: { color: '#6B7280', fontSize: 11 },

  // empty state
  emptyState: { alignItems: 'center', paddingVertical: 16, gap: 8 },
  emptyStateIcon: { fontSize: 32 },
  emptyStateText: { color: '#6B7280', fontSize: 14, textAlign: 'center', lineHeight: 20 },

  // category grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCell: {
    width: '47%',
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 14,
    gap: 4,
  },
  categoryCellCount: { fontSize: 24, fontWeight: '800' },
  categoryCellName: { color: '#6B7280', fontSize: 12, fontWeight: '500' },
  categoryMiniTrack: {
    height: 4,
    backgroundColor: '#2A2D40',
    borderRadius: 2,
    marginTop: 6,
  },
  categoryMiniFill: { height: 4, borderRadius: 2 },
  categoryCellDone: { color: '#6FCF97', fontSize: 11, fontWeight: '700', marginTop: 2 },
})