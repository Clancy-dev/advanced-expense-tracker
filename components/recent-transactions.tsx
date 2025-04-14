"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CreditCard, DollarSign, Home, ShoppingBag, Briefcase, Laptop } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { formatCurrency } from "@/lib/utils"
import type { Income, Expense } from "@prisma/client"

interface RecentTransactionsProps {
  incomes: Income[]
  expenses: Expense[]
}

export function RecentTransactions({ incomes, expenses }: RecentTransactionsProps) {
  // Combine income and expenses, sort by date (newest first)
  const transactions = [
    ...incomes.map((item) => ({
      ...item,
      type: "income" as const,
    })),
    ...expenses.map((item) => ({
      ...item,
      type: "expense" as const,
    })),
  ]
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .slice(0, 5) // Get only the 5 most recent transactions

  // Map categories to icons
  const getCategoryIcon = (category: string, type: "income" | "expense") => {
    if (type === "income") {
      if (category === "Employment") return <Briefcase className="h-4 w-4" />
      if (category === "Freelance") return <Laptop className="h-4 w-4" />
      return <DollarSign className="h-4 w-4" />
    } else {
      if (category === "Housing") return <Home className="h-4 w-4" />
      if (category === "Food") return <ShoppingBag className="h-4 w-4" />
      if (category === "Utilities") return <CreditCard className="h-4 w-4" />
      return <CreditCard className="h-4 w-4" />
    }
  }

  // Map categories to icon colors
  const getCategoryColor = (type: "income" | "expense") => {
    return type === "income" ? "bg-emerald-500" : "bg-rose-500"
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-6 text-slate-500">
        No transactions yet. Add income or expenses to see them here.
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <Avatar className={`h-9 w-9 ${getCategoryColor(transaction.type)}`}>
            <AvatarFallback className="text-white">
              {getCategoryIcon(transaction.category, transaction.type)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{transaction.title}</p>
            <p className="text-sm text-slate-500">{transaction.category}</p>
            <p className="text-xs text-slate-500">
              {formatDistanceToNow(new Date(transaction.date), { addSuffix: true })} at{" "}
              {format(new Date(transaction.date), "h:mm a")}
            </p>
          </div>
          <div
            className={`ml-auto font-medium ${transaction.type === "income" ? "text-emerald-500" : "text-rose-500"}`}
          >
            {transaction.type === "income" ? "+" : "-"} {formatCurrency(transaction.amount)}
          </div>
        </div>
      ))}
    </div>
  )
}
