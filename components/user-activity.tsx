"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { formatCurrency } from "@/lib/utils"
import { deleteIncome } from "@/actions/income"
import { deleteExpense } from "@/actions/expense"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"

interface Props {
  incomes: { id: string; title: string; amount: number; createdAt: Date }[]
  expenses: { id: string; title: string; amount: number; createdAt: Date }[]
}

export function UserActivity({ incomes, expenses }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const allActivities = [
    ...incomes.map((i) => ({ ...i, type: "income" as const })),
    ...expenses.map((e) => ({ ...e, type: "expense" as const })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const handleDelete = (id: string, type: "income" | "expense") => {
    const confirmDelete = confirm("Are you sure you want to delete this?")
    if (!confirmDelete) return

    startTransition(async () => {
      const res = type === "income" ? await deleteIncome(id) : await deleteExpense(id)
      if (res.success) {
        toast.success("Deleted successfully")
        router.refresh()
      } else {
        toast.error(res.error || "Something went wrong")
      }
    })
  }

  return (
    <div className="space-y-4">
      {allActivities.length === 0 && (
        <p className="text-sm text-slate-500">No recent activity found.</p>
      )}

      {allActivities.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center border p-3 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow"
        >
          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`font-semibold text-sm ${
                item.type === "income" ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {item.type === "income" ? "+" : "-"}
              {formatCurrency(item.amount)}
            </span>
            <Link
              href={`/dashboard/${item.type === "income" ? "income" : "expenses"}/${item.id}/edit`}
            >
              <Button size="icon" variant="ghost" className="text-slate-500 hover:text-blue-600">
                <Pencil className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleDelete(item.id, item.type)}
              className="text-slate-500 hover:text-rose-600"
              disabled={isPending}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
