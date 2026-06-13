import { create } from 'zustand'
// create → Zustand's function for creating a global store

type IncomeSource = {
  name: string
  amount: string
  date: string
}
// same type we defined in income.tsx
// moved here so the store owns the type definition

type RecurringExpense = {
  name: string
  amount: string
  date: string
  category: string
}
// same type we defined in expenses.tsx

type FinanceStore = {
  incomeSources: IncomeSource[]
  // holds the array of income sources the user adds

  recurringExpenses: RecurringExpense[]
  // holds the array of recurring expenses the user adds

  setIncomeSources: (sources: IncomeSource[]) => void
  // action → receives a new array and replaces incomeSources
  // void → this function returns nothing

  setRecurringExpenses: (expenses: RecurringExpense[]) => void
  // action → receives a new array and replaces recurringExpenses
}

export const useFinanceStore = create<FinanceStore>((set) => ({

  incomeSources: [],
  // starts as empty array — no sources yet

  recurringExpenses: [],
  // starts as empty array — no expenses yet

  setIncomeSources: (sources) => set({ incomeSources: sources }),
  // set() → Zustand's way of updating state
  // replaces incomeSources with the new array passed in

  setRecurringExpenses: (expenses) => set({ recurringExpenses: expenses }),
  // same pattern — replaces recurringExpenses with new array

}))

export type { IncomeSource, RecurringExpense }
// export types so income.tsx and expenses.tsx can import them
// instead of defining the same type in multiple files