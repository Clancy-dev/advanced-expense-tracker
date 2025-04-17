import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, ArrowDownRight, TrendingDown } from "lucide-react"
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

  // Sort categories by amount (highest first)
  const sortedCategories = Object.entries(expensesByCategory).sort(([, a], [, b]) => b - a)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:ml-0 md:ml-0 sm:ml-0 ml-12 font-bold tracking-tight bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent">
            Expenses
          </h1>
          <p className="text-slate-500 mt-1">Track and manage your expenses.</p>
        </div>
        <Button asChild className="bg-rose-600 hover:bg-rose-700">
          <Link href="/dashboard/expenses/new">
            <Plus className="mr-2 h-4 w-4" /> Add Expense
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 shadow-md bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <TrendingDown className="h-5 w-5 text-rose-500 mr-2" />
              Expense Summary
            </CardTitle>
            <CardDescription>Your expense breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg">
                <span className="font-medium text-rose-700">Total Expenses</span>
                <span className="text-xl font-bold text-rose-600">{formatCurrency(totalExpenses)}</span>
              </div>

              {sortedCategories.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-slate-500">By Category</h3>
                  {sortedCategories.map(([category, amount]) => {
                    const percentage = Math.round((amount / totalExpenses) * 100)
                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{category}</span>
                          <span>
                            {formatCurrency(amount)} <span className="text-xs text-slate-400">({percentage}%)</span>
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-500 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500">No expenses recorded yet.</div>
              )}

              <div className="pt-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full border-rose-200 text-rose-700 hover:bg-rose-50"
                >
                  <Link href="/docs">
                    <ArrowDownRight className="mr-2 h-4 w-4" /> View Expense Report
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Expense History</CardTitle>
            <CardDescription>Your expense entries</CardDescription>
          </CardHeader>
          <CardContent>
            <ExpensesList expenses={expenses} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
