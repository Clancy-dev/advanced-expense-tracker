"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  type Income,
  type Expense,
  type BudgetItem,
  getIncomeList,
  getExpenseList,
  getBudgetItems,
  addIncome,
  addExpense,
  addBudgetItem,
} from "@/lib/local-storage"

interface FinanceContextType {
  income: Income[]
  expenses: Expense[]
  budgetItems: BudgetItem[]
  totalIncome: number
  totalExpenses: number
  balance: number
  addNewIncome: (income: Omit<Income, "id" | "createdAt">) => void
  addNewExpense: (expense: Omit<Expense, "id" | "createdAt">) => void
  addNewBudgetItem: (item: Omit<BudgetItem, "id" | "createdAt">) => void
  getFilteredIncome: (startDate: Date, endDate: Date) => Income[]
  getFilteredExpenses: (startDate: Date, endDate: Date) => Expense[]
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [income, setIncome] = useState<Income[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])

  // Calculate totals
  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0)
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0)
  const balance = totalIncome - totalExpenses

  // Load data from localStorage on initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIncome(getIncomeList())
      setExpenses(getExpenseList())
      setBudgetItems(getBudgetItems())
    }
  }, [])

  // Add new income
  const addNewIncome = (newIncome: Omit<Income, "id" | "createdAt">) => {
    const createdIncome = addIncome(newIncome)
    setIncome((prev) => [createdIncome, ...prev])
  }

  // Add new expense
  const addNewExpense = (newExpense: Omit<Expense, "id" | "createdAt">) => {
    const createdExpense = addExpense(newExpense)
    setExpenses((prev) => [createdExpense, ...prev])
  }

  // Add new budget item
  const addNewBudgetItem = (newItem: Omit<BudgetItem, "id" | "createdAt">) => {
    const createdItem = addBudgetItem(newItem)
    setBudgetItems((prev) => [createdItem, ...prev])
  }

  // Get filtered income by date range
  const getFilteredIncome = (startDate: Date, endDate: Date) => {
    return income.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate >= startDate && itemDate <= endDate
    })
  }

  // Get filtered expenses by date range
  const getFilteredExpenses = (startDate: Date, endDate: Date) => {
    return expenses.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate >= startDate && itemDate <= endDate
    })
  }

  return (
    <FinanceContext.Provider
      value={{
        income,
        expenses,
        budgetItems,
        totalIncome,
        totalExpenses,
        balance,
        addNewIncome,
        addNewExpense,
        addNewBudgetItem,
        getFilteredIncome,
        getFilteredExpenses,
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}

export function useFinance() {
  const context = useContext(FinanceContext)
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider")
  }
  return context
}
