import { create } from 'zustand'
// create → Zustand's function for making a global store
// same pattern as finance-store.ts

// ─── types ───────────────────────────────────────────────────

export type HabitCategory = 'Health' | 'Learning' | 'Mindfulness' | 'Productivity'
// union type → value must be exactly one of these four strings
// export → other files import this type directly, single source of truth

export type Habit = {
  id: string
  // unique identifier — used as key in lists and for toggling specific habits
  // we'll generate this with Date.now().toString() for custom habits
  // presets get fixed ids like 'preset-morning-run'

  name: string
  // display name e.g. "Morning Run"

  category: HabitCategory
  // must be one of the four categories — TypeScript enforces this

  icon: string
  // emoji string e.g. "🏃"
  // emojis work natively in React Native Text components

  completedDates: string[]
  // array of date strings in 'YYYY-MM-DD' format e.g. ["2025-06-13", "2025-06-14"]
  // we store dates not booleans → lets us track history, not just today

  streak: number
  // current consecutive day streak
  // computed and stored — avoids recomputing on every render

  isCustom: boolean
  // false → came from presets
  // true → user typed it themselves in custom screen
}

// ─── store shape ─────────────────────────────────────────────

type HabitsStore = {
  habits: Habit[]
  setHabits: (habits: Habit[]) => void
  toggleHabit: (id: string, date: string) => void
  updateStreak: (id: string) => void
}
// TypeScript type for the entire store
// every field and function is declared here before implementation

// ─── helpers ─────────────────────────────────────────────────

export const computeStreak = (completedDates: string[]): number => {
  // export → confirmation screen and dashboard can call this directly if needed

  if (completedDates.length === 0) return 0
  // no dates completed → streak is 0, exit early

  const sorted = [...completedDates].sort((a, b) => (a > b ? -1 : 1))
  // spread [...completedDates] → copy the array before sorting, never mutate original
  // sort descending → most recent date first
  // string comparison works for 'YYYY-MM-DD' format because dates sort lexicographically

  const today = new Date().toISOString().split('T')[0]
  // toISOString() → "2025-06-13T10:30:00.000Z"
  // .split('T')[0] → "2025-06-13"
  // gives us today's date in same format as completedDates

  if (sorted[0] !== today) return 0
  // if the most recent completion is not today, streak is broken → return 0

  let streak = 1
  // we confirmed today is done → start at 1

  for (let i = 1; i < sorted.length; i++) {
    const current = new Date(sorted[i - 1])
    const prev = new Date(sorted[i])
    // current → the more recent date (i-1)
    // prev → the date before it (i)

    const diffDays = (current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    // getTime() → milliseconds since epoch
    // difference / (ms per day) → number of days between the two dates

    if (diffDays === 1) {
      streak++
      // exactly 1 day apart → consecutive → extend streak
    } else {
      break
      // gap found → streak is broken, stop counting
    }
  }

  return streak
}

// ─── presets ─────────────────────────────────────────────────

export const PRESET_HABITS: Habit[] = [
  { id: 'preset-morning-run',      name: 'Morning Run',       category: 'Health',        icon: '🏃', completedDates: [], streak: 0, isCustom: false },
  { id: 'preset-drink-water',      name: 'Drink Water',       category: 'Health',        icon: '💧', completedDates: [], streak: 0, isCustom: false },
  { id: 'preset-read',             name: 'Read 30 mins',      category: 'Learning',      icon: '📖', completedDates: [], streak: 0, isCustom: false },
  { id: 'preset-dsa',              name: 'Practice DSA',      category: 'Learning',      icon: '💻', completedDates: [], streak: 0, isCustom: false },
  { id: 'preset-meditate',         name: 'Meditate',          category: 'Mindfulness',   icon: '🧘', completedDates: [], streak: 0, isCustom: false },
  { id: 'preset-journal',          name: 'Gratitude Journal', category: 'Mindfulness',   icon: '📝', completedDates: [], streak: 0, isCustom: false },
  { id: 'preset-plan-day',         name: 'Plan My Day',       category: 'Productivity',  icon: '📋', completedDates: [], streak: 0, isCustom: false },
  { id: 'preset-no-phone-morning', name: 'No Phone Morning',  category: 'Productivity',  icon: '📵', completedDates: [], streak: 0, isCustom: false },
]
// fixed ids → 'preset-' prefix makes it easy to identify vs custom habits
// completedDates starts empty → user hasn't done anything yet
// streak starts at 0 → computed as user checks off days

// ─── store ───────────────────────────────────────────────────

export const useHabitsStore = create<HabitsStore>((set, get) => ({
// create<HabitsStore> → tell Zustand the shape of this store
// (set, get) → set updates state, get reads current state inside functions

  habits: [],
  // starts empty → populated during setup flow when user picks habits

  setHabits: (habits) => set({ habits }),
  // replaces entire habits array
  // called once at the end of setup flow with the user's selected habits

  toggleHabit: (id, date) => {
    const { habits } = get()
    // get() → read current state from inside the store
    // we need the current habits array to find and update the right one

    const updated = habits.map((h) => {
      if (h.id !== id) return h
      // not the habit we're toggling → return unchanged

      const alreadyDone = h.completedDates.includes(date)
      // includes → check if this date is already in the array

      const newDates = alreadyDone
        ? h.completedDates.filter((d) => d !== date)
        : [...h.completedDates, date]
      // alreadyDone → remove the date (un-check)
      // not done → add the date (check)
      // filter and spread both return new arrays → never mutate original

      const newStreak = computeStreak(newDates)
      // recompute streak immediately after toggling

      return { ...h, completedDates: newDates, streak: newStreak }
      // spread → copy all existing habit fields
      // override only completedDates and streak with new values
    })

    set({ habits: updated })
    // push updated array into Zustand → all components using this store re-render
  },

  updateStreak: (id) => {
    const { habits } = get()
    const updated = habits.map((h) =>
      h.id === id ? { ...h, streak: computeStreak(h.completedDates) } : h
    )
    set({ habits: updated })
  },
  // recalculates streak for one habit without toggling
  // useful for recalculating at midnight when a day rolls over
}))