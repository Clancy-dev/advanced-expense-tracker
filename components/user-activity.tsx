"use client"

import { useEffect, useState, useTransition } from "react"
import { CreditCard, DollarSign, Edit2, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fetchIncomes } from "@/actions/income"
import { fetchExpenses } from "@/actions/expense"
import { deleteActivity } from "@/actions/activity"
import { formatCurrency } from "@/lib/utils"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type ActivityType = "income" | "expense"

interface Activity {
  id: string
  title: string
  amount: number
  description: string
  date: Date
  type: ActivityType
}

const ITEMS_PER_PAGE = 5

export function UserActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

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

      setActivities(merged)
    }

    loadActivities()
  }, [])

  const handleDelete = (id: string, type: ActivityType) => {
    startTransition(async () => {
      await deleteActivity(id, type)
      toast.success(`${type === "income" ? "Income" : "Expense"} deleted successfully`)
      router.refresh()
    })
  }

  const totalPages = Math.ceil(activities.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentActivities = activities.slice(startIndex, endIndex)

  return (
    <>
      <ul className="space-y-4">
        {currentActivities.map((activity) => (
          <li
            key={activity.id}
            className="flex items-center justify-between gap-2 hover:bg-slate-50 p-2 rounded-md transition-all"
          >
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

            <div className="flex items-center gap-3">
              <span
                className={`text-sm font-semibold 
                ${activity.type === "income" ? "text-emerald-600" : "text-rose-600"}`}
              >
                {activity.type === "income" ? "+" : "-"}
                {formatCurrency(activity.amount)}
              </span>

              <Link
                href={`/dashboard/${activity.type === "income" ? "income" : "expenses"}/${activity.id}/edit`}
                className="text-blue-500 hover:text-blue-600"
              >
                <Edit2 className="h-4 w-4" />
              </Link>
              <button
                onClick={() => handleDelete(activity.id, activity.type)}
                disabled={isPending}
                className="text-rose-500 hover:text-rose-600 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <Pagination className="pt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                }}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={i + 1 === currentPage}
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentPage(i + 1)
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  )
}
