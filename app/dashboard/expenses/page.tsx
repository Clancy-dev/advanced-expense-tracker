import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { ExpensesList } from "@/components/expenses-list"
import { fetchExpenses } from "@/actions/expense"
import { formatCurrency } from "@/lib/utils"

export default async function ExpensesPage() {
  const expenses = await fetchExpenses()

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0)

  // Group expenses by category
  const expensesByCategory = expenses.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-slate-500">Track and manage your expenses.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/expenses/new">
            <Plus className="mr-2 h-4 w-4" /> Add Expense
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Summary</CardTitle>
          <CardDescription>Your expense breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Total Expenses</span>
              <span>{formatCurrency(totalExpenses)}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(expensesByCategory).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(expensesByCategory).map(([category, amount]) => (
                    <div key={category} className="flex justify-between text-sm">
                      <span>{category}</span>
                      <span>{formatCurrency(amount)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">No expenses recorded yet.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Expense History</CardTitle>
          <CardDescription>Your expense entries</CardDescription>
        </CardHeader>
        <CardContent>
          <ExpensesList expenses={expenses} />
        </CardContent>
      </Card>
    </div>
  )
}
