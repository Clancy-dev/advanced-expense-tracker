import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, ArrowUpRight, TrendingUp } from "lucide-react"
import { IncomeList } from "@/components/income-list"
import { fetchIncomes } from "@/actions/income"
import { formatCurrency } from "@/lib/utils"

export default async function IncomePage() {
  const incomes = await fetchIncomes()

  // Calculate total income
  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0)

  // Group income by category
  const incomeByCategory = incomes.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount
      return acc
    },
    {} as Record<string, number>,
  )

  // Sort categories by amount (highest first)
  const sortedCategories = Object.entries(incomeByCategory).sort(([, a], [, b]) => b - a)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl  font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            Income
          </h1>
          <p className="text-slate-500 mt-1">Track and manage your income sources.</p>
        </div>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
          <Link href="/dashboard/income/new">
            <Plus className="mr-2 h-4 w-4" /> Add Income
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 shadow-md bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-5 w-5 text-emerald-500 mr-2" />
              Income Summary
            </CardTitle>
            <CardDescription>Your income breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                <span className="font-medium text-emerald-700">Total Income</span>
                <span className="text-xl font-bold text-emerald-600">{formatCurrency(totalIncome)}</span>
              </div>

              {sortedCategories.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-slate-500">By Category</h3>
                  {sortedCategories.map(([category, amount]) => {
                    const percentage = Math.round((amount / totalIncome) * 100)
                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{category}</span>
                          <span>
                            {formatCurrency(amount)} <span className="text-xs text-slate-400">({percentage}%)</span>
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500">No income recorded yet.</div>
              )}

              <div className="pt-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  <Link href="/docs">
                    <ArrowUpRight className="mr-2 h-4 w-4" /> View Income Report
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Income History</CardTitle>
            <CardDescription>Your income entries</CardDescription>
          </CardHeader>
          <CardContent>
            <IncomeList incomes={incomes} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
