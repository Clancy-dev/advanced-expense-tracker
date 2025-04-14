// This file contains utility functions for working with localStorage
// These will be replaced with database calls when moving to production

// Helper to safely parse JSON from localStorage
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue

  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error)
    return defaultValue
  }
}

// Helper to safely save JSON to localStorage
function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
  }
}

// Income related functions
export interface Income {
  id: string
  title: string
  amount: number
  category: string
  date: string
  description?: string
  createdAt: string
}

export function getIncomeList(): Income[] {
  return getFromStorage<Income[]>("income", [])
}

export function addIncome(income: Omit<Income, "id" | "createdAt">): Income {
  const newIncome: Income = {
    id: Date.now().toString(),
    ...income,
    createdAt: new Date().toISOString(),
  }

  const incomeList = getIncomeList()
  saveToStorage("income", [...incomeList, newIncome])

  return newIncome
}

// Expense related functions
export interface Expense {
  id: string
  title: string
  amount: number
  category: string
  date: string
  description?: string
  createdAt: string
}

export function getExpenseList(): Expense[] {
  return getFromStorage<Expense[]>("expenses", [])
}

export function addExpense(expense: Omit<Expense, "id" | "createdAt">): Expense {
  const newExpense: Expense = {
    id: Date.now().toString(),
    ...expense,
    createdAt: new Date().toISOString(),
  }

  const expenseList = getExpenseList()
  saveToStorage("expenses", [...expenseList, newExpense])

  return newExpense
}

// Budget related functions
export interface BudgetItem {
  id: string
  title: string
  cost: number
  category: "Most Important" | "Less Important"
  createdAt: string
}

export function getBudgetItems(): BudgetItem[] {
  return getFromStorage<BudgetItem[]>("budgetItems", [])
}

export function addBudgetItem(item: Omit<BudgetItem, "id" | "createdAt">): BudgetItem {
  const newItem: BudgetItem = {
    id: Date.now().toString(),
    ...item,
    createdAt: new Date().toISOString(),
  }

  const budgetItems = getBudgetItems()
  saveToStorage("budgetItems", [...budgetItems, newItem])

  return newItem
}

// Financial summary functions
export function getFinancialSummary() {
  const income = getIncomeList()
  const expenses = getExpenseList()
  const budgetItems = getBudgetItems()

  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0)
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0)
  const totalBudget = budgetItems.reduce((sum, item) => sum + item.cost, 0)

  const balance = totalIncome - totalExpenses
  const budgetUsedPercentage = (totalExpenses / totalBudget) * 100

  return {
    totalIncome,
    totalExpenses,
    totalBudget,
    balance,
    budgetUsedPercentage: isNaN(budgetUsedPercentage) ? 0 : budgetUsedPercentage,
  }
}
