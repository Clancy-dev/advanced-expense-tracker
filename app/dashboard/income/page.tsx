import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
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

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Income</h1>
          <p className="text-slate-500">Track and manage your income sources.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/income/new">
            <Plus className="mr-2 h-4 w-4" /> Add Income
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Income Summary</CardTitle>
          <CardDescription>Your income breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Total Income</span>
              <span>{formatCurrency(totalIncome)}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(incomeByCategory).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(incomeByCategory).map(([category, amount]) => (
                    <div key={category} className="flex justify-between text-sm">
                      <span>{category}</span>
                      <span>{formatCurrency(amount)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">No income recorded yet.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Income History</CardTitle>
          <CardDescription>Your income entries</CardDescription>
        </CardHeader>
        <CardContent>
          <IncomeList incomes={incomes} />
        </CardContent>
      </Card>
    </div>
  )
}
