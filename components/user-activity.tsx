import type React from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CreditCard, DollarSign, PiggyBank, Settings, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function UserActivity() {
  return (
    <div className="space-y-8">
      <ActivityItem
        icon={<DollarSign className="h-4 w-4" />}
        iconColor="bg-emerald-500"
        title="Income Recorded"
        description="You recorded a new income: Salary"
        time={new Date(2023, 6, 1)}
      />
      <ActivityItem
        icon={<CreditCard className="h-4 w-4" />}
        iconColor="bg-rose-500"
        title="Expense Recorded"
        description="You recorded a new expense: Rent"
        time={new Date(2023, 6, 1)}
      />
      <ActivityItem
        icon={<PiggyBank className="h-4 w-4" />}
        iconColor="bg-sky-500"
        title="Budget Item Added"
        description="You added a new budget item: Groceries"
        time={new Date(2023, 6, 2)}
      />
      <ActivityItem
        icon={<Settings className="h-4 w-4" />}
        iconColor="bg-amber-500"
        title="Settings Updated"
        description="You updated your notification preferences"
        time={new Date(2023, 6, 3)}
      />
      <ActivityItem
        icon={<User className="h-4 w-4" />}
        iconColor="bg-violet-500"
        title="Profile Updated"
        description="You updated your profile information"
        time={new Date(2023, 6, 5)}
      />
    </div>
  )
}

interface ActivityItemProps {
  icon: React.ReactNode
  iconColor: string
  title: string
  description: string
  time: Date
}

function ActivityItem({ icon, iconColor, title, description, time }: ActivityItemProps) {
  return (
    <div className="flex items-center">
      <Avatar className={`h-9 w-9 ${iconColor}`}>
        <AvatarFallback className="text-white">{icon}</AvatarFallback>
      </Avatar>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">{title}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <div className="ml-auto text-sm text-slate-500">{formatDistanceToNow(time, { addSuffix: true })}</div>
    </div>
  )
}
