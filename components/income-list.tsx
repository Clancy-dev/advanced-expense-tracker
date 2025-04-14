import type React from "react"
import type { Income } from "@prisma/client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Briefcase, DollarSign, Gift, Laptop } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow, format } from "date-fns"
import { formatCurrency } from "@/lib/utils"

interface IncomeListProps {
  incomes: Income[]
}

export function IncomeList({ incomes }: IncomeListProps) {
  // Sort income by date (newest first)
  const sortedIncome = [...incomes].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  if (sortedIncome.length === 0) {
    return <div className="text-center py-6 text-slate-500">No income recorded yet. Add income to see it here.</div>
  }

  return (
    <div className="space-y-6">
      {sortedIncome.map((item) => (
        <IncomeItem
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

interface IncomeItemProps {
  icon: React.ReactNode
  iconColor: string
  title: string
  amount: string
  category: string
  date: Date
  timestamp: string
}

function IncomeItem({ icon, iconColor, title, amount, category, date, timestamp }: IncomeItemProps) {
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
      <div className="font-medium text-emerald-500">+ {amount}</div>
    </div>
  )
}

// Helper functions to get icon and color based on category
function getCategoryIcon(category: string) {
  switch (category) {
    case "Employment":
      return <Briefcase className="h-4 w-4" />
    case "Freelance":
      return <Laptop className="h-4 w-4" />
    case "Gift":
      return <Gift className="h-4 w-4" />
    default:
      return <DollarSign className="h-4 w-4" />
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case "Employment":
      return "bg-emerald-500"
    case "Freelance":
      return "bg-sky-500"
    case "Gift":
      return "bg-violet-500"
    case "Investment":
      return "bg-amber-500"
    default:
      return "bg-slate-500"
  }
}
