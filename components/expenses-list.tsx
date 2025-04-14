import type React from "react"
import type { Expense } from "@prisma/client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Home, ShoppingBag, CreditCard, Car, Coffee } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow, format } from "date-fns"
import { formatCurrency } from "@/lib/utils"

interface ExpensesListProps {
  expenses: Expense[]
}

export function ExpensesList({ expenses }: ExpensesListProps) {
  // Sort expenses by date (newest first)
  const sortedExpenses = [...expenses].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  if (sortedExpenses.length === 0) {
    return (
      <div className="text-center py-6 text-slate-500">No expenses recorded yet. Add expenses to see them here.</div>
    )
  }

  return (
    <div className="space-y-6">
      {sortedExpenses.map((item) => (
        <ExpenseItem
          key={item.id}
          icon={getCategoryIcon(item.category)}
          iconColor={getCategoryColor(item.category)}
          title={item.title}
          amount={formatCurrency(item.amount)}
          category={item.category}
          date={new Date(item.date)}
          timestamp={format(new Date(item.date), "h:mm a")}
        />
      ))}
    </div>
  )
}

interface ExpenseItemProps {
  icon: React.ReactNode
  iconColor: string
  title: string
  amount: string
  category: string
  date: Date
  timestamp: string
}

function ExpenseItem({ icon, iconColor, title, amount, category, date, timestamp }: ExpenseItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Avatar className={`h-9 w-9 ${iconColor}`}>
          <AvatarFallback className="text-white">{icon}</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">{title}</p>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{category}</Badge>
            <p className="text-xs text-slate-500">
              {formatDistanceToNow(date, { addSuffix: true })} at {timestamp}
            </p>
          </div>
        </div>
      </div>
      <div className="font-medium text-rose-500">- {amount}</div>
    </div>
  )
}

// Helper functions to get icon and color based on category
function getCategoryIcon(category: string) {
  switch (category) {
    case "Housing":
      return <Home className="h-4 w-4" />
    case "Food":
      return <ShoppingBag className="h-4 w-4" />
    case "Utilities":
      return <CreditCard className="h-4 w-4" />
    case "Transportation":
      return <Car className="h-4 w-4" />
    case "Entertainment":
      return <Coffee className="h-4 w-4" />
    default:
      return <CreditCard className="h-4 w-4" />
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case "Housing":
      return "bg-rose-500"
    case "Food":
      return "bg-amber-500"
    case "Utilities":
      return "bg-sky-500"
    case "Transportation":
      return "bg-violet-500"
    case "Entertainment":
      return "bg-emerald-500"
    default:
      return "bg-slate-500"
  }
}
