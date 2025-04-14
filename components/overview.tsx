"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"
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
        balance: monthlyIncome - monthlyExpenses,
      })
    }

    return data
  }, [incomes, expenses])

  const formatCurrency = (value: number) => {
    return `UGX ${(value / 1000).toFixed(0)}K`
  }

  return (
    <div className="w-full h-[350px] p-4 rounded-lg">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
            tickFormatter={formatCurrency}
          />
          <Tooltip
            formatter={(value: number) => [`UGX ${value.toLocaleString()}`, undefined]}
            labelFormatter={(label) => `Month: ${label}`}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "0.375rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: "10px" }}
            formatter={(value) => <span className="text-sm font-medium">{value}</span>}
          />
          <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" barSize={30} />
          <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expenses" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
