"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { useMemo } from "react"
import { startOfMonth, endOfMonth, format, subMonths, isWithinInterval } from "date-fns"
import type { Income, Expense } from "@prisma/client"

interface OverviewProps {
  incomes: Income[]
  expenses: Expense[]
}

export function Overview({ incomes, expenses }: OverviewProps) {
  // Generate data for the last 6 months
  const chartData = useMemo(() => {
    const data = []
    const today = new Date()

    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(today, i)
      const monthStart = startOfMonth(monthDate)
      const monthEnd = endOfMonth(monthDate)
      const monthName = format(monthDate, "MMM")

      // Filter income and expenses for this month
      const monthlyIncome = incomes
        .filter((item) => {
          const date = new Date(item.date)
          return isWithinInterval(date, { start: monthStart, end: monthEnd })
        })
        .reduce((sum, item) => sum + item.amount, 0)

      const monthlyExpenses = expenses
        .filter((item) => {
          const date = new Date(item.date)
          return isWithinInterval(date, { start: monthStart, end: monthEnd })
        })
        .reduce((sum, item) => sum + item.amount, 0)

      data.push({
        name: monthName,
        income: monthlyIncome,
        expenses: monthlyExpenses,
      })
    }

    return data
  }, [incomes, expenses])

  const formatCurrency = (value: number) => {
    return `UGX ${(value / 1000).toFixed(0)}K`
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatCurrency} />
        <Tooltip
          formatter={(value: number) => [`UGX ${value.toLocaleString()}`, undefined]}
          labelFormatter={(label) => `Month: ${label}`}
        />
        <Bar dataKey="income" fill="#4ade80" radius={[4, 4, 0, 0]} name="Income" />
        <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expenses" />
      </BarChart>
    </ResponsiveContainer>
  )
}
