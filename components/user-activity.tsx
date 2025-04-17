"use client"

import { useEffect, useState } from "react"
import { CreditCard, DollarSign } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fetchIncomes } from "@/actions/income"
import { fetchExpenses } from "@/actions/expense"
import { formatCurrency } from "@/lib/utils"

type ActivityType = "income" | "expense"

interface Activity {
  id: string
  title: string
  amount: number
  description: string
  date: Date
  type: ActivityType
}

export function UserActivity() {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    async function loadActivities() {
      const [incomes, expenses] = await Promise.all([fetchIncomes(), fetchExpenses()])

      const incomeActivities: Activity[] = incomes.map((income: any) => ({
        id: income.id,
        title: "Income",
        amount: income.amount,
        description: income.source || "Income recorded",
        date: new Date(income.date),
        type: "income",
      }))

      const expenseActivities: Activity[] = expenses.map((expense: any) => ({
        id: expense.id,
        title: "Expense",
        amount: expense.amount,
        description: expense.category || "Expense recorded",
        date: new Date(expense.date),
        type: "expense",
      }))

      const merged = [...incomeActivities, ...expenseActivities].sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      )

      setActivities(merged.slice(0, 5)) // Limit to 5 most recent
    }

    loadActivities()
  }, [])

  return (
    <ul className="space-y-4">
      {activities.map((activity) => (
        <li key={activity.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`h-9 w-9 rounded-full flex items-center justify-center 
                ${activity.type === "income" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}
            >
              {activity.type === "income" ? (
                <DollarSign className="h-4 w-4" />
              ) : (
                <CreditCard className="h-4 w-4" />
              )}
            </div>
            <div className="text-sm">
              <p className="font-medium text-slate-700">{activity.description}</p>
              <p className="text-slate-500 text-xs">
                {formatDistanceToNow(activity.date, { addSuffix: true })}
              </p>
            </div>
          </div>
          <div
            className={`text-sm font-semibold 
              ${activity.type === "income" ? "text-emerald-600" : "text-rose-600"}`}
          >
            {activity.type === "income" ? "+" : "-"}{formatCurrency(activity.amount)}
          </div>
        </li>
      ))}
    </ul>
  )
}
