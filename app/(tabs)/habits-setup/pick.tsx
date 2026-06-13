import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native'
import { router } from 'expo-router'
import { PRESET_HABITS, HabitCategory } from '../../../store/habits-store'

// ─── constants ───────────────────────────────────────────────

const CATEGORIES: HabitCategory[] = ['Health', 'Learning', 'Mindfulness', 'Productivity']

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

export default function PickHabitsScreen() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    )
  }

  const handleNext = () => {
    if (selectedIds.length === 0) return
    router.push({
      pathname: '/(tabs)/habits-setup/custom',
      params: { selectedIds: JSON.stringify(selectedIds) },
    })
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* ── header ── */}
        <View style={styles.headerBlock}>
          <Text style={styles.eyebrow}>STEP 1 OF 3</Text>
          <Text style={styles.title}>Pick Your Habits</Text>
          <Text style={styles.subtitle}>
            Choose what you want to build. You can add your own habits next.
          </Text>
        </View>

        {/* ── categories ── */}
        {CATEGORIES.map((cat) => {
          const color = CATEGORY_COLORS[cat]
          const habitsInCategory = PRESET_HABITS.filter((h) => h.category === cat)
          const selectedInCat = habitsInCategory.filter((h) => selectedIds.includes(h.id)).length

          return (
            <View key={cat} style={styles.categoryBlock}>

              {/* category header */}
              <View style={styles.categoryHeader}>
                <View style={[styles.categoryPill, { backgroundColor: color + '22' }]}>
                  <Text style={styles.categoryPillIcon}>{CATEGORY_ICONS[cat]}</Text>
                  <Text style={[styles.categoryPillText, { color }]}>{cat}</Text>
                </View>
                {selectedInCat > 0 && (
                  <View style={[styles.selectedBadge, { backgroundColor: color }]}>
                    <Text style={styles.selectedBadgeText}>{selectedInCat}</Text>
                  </View>
                )}
              </View>

              {/* habit cards */}
              <View style={styles.habitList}>
                {habitsInCategory.map((habit) => {
                  const selected = selectedIds.includes(habit.id)
                  return (
                    <TouchableOpacity
                      key={habit.id}
                      style={[
                        styles.habitCard,
                        selected && {
                          borderColor: color,
                          backgroundColor: color + '11',
                        },
                      ]}
                      onPress={() => toggleSelect(habit.id)}
                      activeOpacity={0.75}
                    >
                      <View style={[styles.habitIconBox, { backgroundColor: color + '22' }]}>
                        <Text style={styles.habitIcon}>{habit.icon}</Text>
                      </View>
                      <Text style={styles.habitName}>{habit.name}</Text>
                      <View style={[
                        styles.selectCircle,
                        selected && { backgroundColor: color, borderColor: color },
                      ]}>
                        {selected && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </View>

            </View>
          )
        })}

        {/* ── bottom action — inside scroll so tab bar never covers it ── */}
        <View style={styles.bottomAction}>
          <View style={styles.countRow}>
            <Text style={styles.countText}>
              {selectedIds.length === 0
                ? 'Select at least one habit'
                : `${selectedIds.length} habit${selectedIds.length !== 1 ? 's' : ''} selected`}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.nextButton,
              selectedIds.length === 0 && styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={selectedIds.length === 0}
          >
            <Text style={styles.nextButtonText}>Next  →</Text>
          </TouchableOpacity>
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
  headerBlock: { marginBottom: 32 },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#6C63FF',
    marginBottom: 10,
  },
  title: { fontSize: 30, fontWeight: '800', color: '#FFFFFF', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6B7280', lineHeight: 21 },

  // category block
  categoryBlock: { marginBottom: 28 },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  categoryPillIcon: { fontSize: 13 },
  categoryPillText: { fontSize: 13, fontWeight: '700' },
  selectedBadge: {
    marginLeft: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },

  // habit list
  habitList: { gap: 10 },
  habitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1D2E',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  habitIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  habitIcon: { fontSize: 20 },
  habitName: { flex: 1, color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  selectCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#2A2D40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },

  // bottom action
  bottomAction: {
    marginTop: 8,
    gap: 12,
  },
  countRow: { alignItems: 'center' },
  countText: { color: '#6B7280', fontSize: 13 },
  nextButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonDisabled: { opacity: 0.35 },
  nextButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
})