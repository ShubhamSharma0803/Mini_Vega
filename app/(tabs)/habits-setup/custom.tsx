import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { PRESET_HABITS, HabitCategory, Habit } from '../../../store/habits-store'

// ─── constants ───────────────────────────────────────────────

const CATEGORY_COLORS: Record<HabitCategory, string> = {
  Health: '#6FCF97',
  Learning: '#56CCF2',
  Mindfulness: '#A18CD1',
  Productivity: '#F7971E',
}

const CATEGORIES: HabitCategory[] = ['Health', 'Learning', 'Mindfulness', 'Productivity']

const ICON_OPTIONS = ['⚡', '🎯', '🔥', '💪', '🧠', '✍️', '🎵', '🌿', '💡', '🏋️', '🚴', '🌅']

// ─── main screen ─────────────────────────────────────────────

export default function CustomHabitsScreen() {
  const params = useLocalSearchParams()

  const selectedIds: string[] = params.selectedIds
    ? JSON.parse(params.selectedIds as string)
    : []

  const [habitName, setHabitName] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory>('Health')
  const [selectedIcon, setSelectedIcon] = useState<string>('⚡')
  const [customHabits, setCustomHabits] = useState<Habit[]>([])
  const [error, setError] = useState<string>('')

  const addHabit = () => {
    if (habitName.trim() === '') {
      setError('Please enter a habit name')
      return
    }
    if (habitName.trim().length < 3) {
      setError('Name must be at least 3 characters')
      return
    }

    const newHabit: Habit = {
      id: `custom-${Date.now()}`,
      name: habitName.trim(),
      category: selectedCategory,
      icon: selectedIcon,
      completedDates: [],
      streak: 0,
      isCustom: true,
    }

    setCustomHabits((prev) => [...prev, newHabit])
    setHabitName('')
    setSelectedIcon('⚡')
    setError('')
  }

  const removeCustomHabit = (id: string) => {
    setCustomHabits((prev) => prev.filter((h) => h.id !== id))
  }

  const handleNext = () => {
    const presetHabits = PRESET_HABITS.filter((h) => selectedIds.includes(h.id))
    const allHabits = [...presetHabits, ...customHabits]
    router.push({
      pathname: '/(tabs)/habits-setup/confirmation',
      params: { habits: JSON.stringify(allHabits) },
    })
  }

  const totalCount = selectedIds.length + customHabits.length

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.screen}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* ── header ── */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.eyebrow}>STEP 2 OF 3</Text>
          <Text style={styles.title}>Custom Habits</Text>
          <Text style={styles.subtitle}>
            Add your own habits below, or skip ahead if your presets cover it.
          </Text>

          {/* ── form card ── */}
          <View style={styles.formCard}>

            {/* icon picker */}
            <Text style={styles.fieldLabel}>Icon</Text>
            <View style={styles.iconGrid}>
              {ICON_OPTIONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconCell,
                    selectedIcon === icon && styles.iconCellSelected,
                  ]}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <Text style={styles.iconEmoji}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* name input */}
            <Text style={styles.fieldLabel}>Habit Name</Text>
            <TextInput
              style={[styles.input, error !== '' && styles.inputError]}
              placeholder="e.g. Evening Walk"
              placeholderTextColor="#4B5563"
              value={habitName}
              onChangeText={(text) => {
                setHabitName(text)
                setError('')
              }}
              maxLength={40}
            />
            {error !== '' && <Text style={styles.errorText}>{error}</Text>}

            {/* category chips */}
            <Text style={styles.fieldLabel}>Category</Text>
            <View style={styles.categoryRow}>
              {CATEGORIES.map((cat) => {
                const color = CATEGORY_COLORS[cat]
                const active = selectedCategory === cat
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      active && { backgroundColor: color, borderColor: color },
                    ]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text style={[styles.categoryChipText, active && { color: '#FFFFFF' }]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>

            {/* add button */}
            <TouchableOpacity style={styles.addButton} onPress={addHabit}>
              <Text style={styles.addButtonText}>+ Add Habit</Text>
            </TouchableOpacity>

          </View>

          {/* ── added habits ── */}
          {customHabits.length > 0 && (
            <View style={styles.addedSection}>
              <Text style={styles.addedSectionTitle}>
                Added ({customHabits.length})
              </Text>
              {customHabits.map((h) => {
                const color = CATEGORY_COLORS[h.category]
                return (
                  <View key={h.id} style={styles.addedRow}>
                    <View style={[styles.addedIconBox, { backgroundColor: color + '22' }]}>
                      <Text style={styles.addedIconText}>{h.icon}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.addedName}>{h.name}</Text>
                      <Text style={[styles.addedCat, { color }]}>{h.category}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => removeCustomHabit(h.id)}
                      style={styles.removeBtn}
                    >
                      <Text style={styles.removeBtnText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )
              })}
            </View>
          )}

          {/* ── bottom action — inside scroll ── */}
          <View style={styles.bottomAction}>
            <Text style={styles.totalCount}>
              {totalCount} habit{totalCount !== 1 ? 's' : ''} total
            </Text>
            <TouchableOpacity
              style={[
                styles.nextButton,
                totalCount === 0 && styles.nextButtonDisabled,
              ]}
              onPress={handleNext}
              disabled={totalCount === 0}
            >
              <Text style={styles.nextButtonText}>
                {customHabits.length === 0 ? 'Skip  →' : 'Next  →'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />

        </ScrollView>
      </KeyboardAvoidingView>
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

  // form card
  formCard: {
    backgroundColor: '#1A1D2E',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  fieldLabel: {
    color: '#C0C0D0',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 4,
  },

  // icon grid
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  iconCell: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#0F1117',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  iconCellSelected: {
    borderColor: '#6C63FF',
    backgroundColor: '#6C63FF18',
  },
  iconEmoji: { fontSize: 22 },

  // input
  input: {
    backgroundColor: '#0F1117',
    borderRadius: 12,
    padding: 14,
    color: '#FFFFFF',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2A2D40',
    marginBottom: 6,
  },
  inputError: { borderColor: '#FF6584' },
  errorText: { color: '#FF6584', fontSize: 12, marginBottom: 12 },

  // category chips
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#2A2D40',
    backgroundColor: '#0F1117',
  },
  categoryChipText: { color: '#6B7280', fontSize: 13, fontWeight: '600' },

  // add button
  addButton: {
    backgroundColor: '#6C63FF18',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#6C63FF',
    marginTop: 4,
  },
  addButtonText: { color: '#6C63FF', fontSize: 15, fontWeight: '700' },

  // added habits list
  addedSection: { marginBottom: 20 },
  addedSectionTitle: {
    color: '#C0C0D0',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  addedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1D2E',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
  },
  addedIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addedIconText: { fontSize: 18 },
  addedName: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  addedCat: { fontSize: 12, marginTop: 2 },
  removeBtn: { padding: 6 },
  removeBtnText: { color: '#FF6584', fontSize: 16, fontWeight: '700' },

  // bottom action
  bottomAction: { gap: 10, marginTop: 4 },
  totalCount: { color: '#6B7280', fontSize: 13, textAlign: 'center' },
  nextButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonDisabled: { opacity: 0.35 },
  nextButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
})