import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { fetchBudgetItems } from "@/actions/budget"
import { fetchExpenses } from "@/actions/expense"
import { fetchIncomes } from "@/actions/income"
import { formatCurrency } from "@/lib/utils"

export default async function BudgetPage() {
  const [budgetItems, expenses, incomes] = await Promise.all([fetchBudgetItems(), fetchExpenses(), fetchIncomes()])

  // Separate budget items by category
  const mostImportantItems = budgetItems.filter((item) => item.category === "Most Important")
  const lessImportantItems = budgetItems.filter((item) => item.category === "Less Important")

  // Calculate totals
  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0)
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0)
  const totalBudget = budgetItems.reduce((sum, item) => sum + item.cost, 0)
  const balance = totalIncome - totalExpenses
  const budgetUsedPercentage = totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 100) : 0

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budget</h1>
          <p className="text-slate-500">Manage your budget items and track your spending.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/budget/new">
            <Plus className="mr-2 h-4 w-4" /> Add Budget Item
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="most-important" className="space-y-4">
        <TabsList>
          <TabsTrigger value="most-important">Most Important</TabsTrigger>
          <TabsTrigger value="less-important">Less Important</TabsTrigger>
        </TabsList>
        <TabsContent value="most-important" className="space-y-4">
          {mostImportantItems.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              No important budget items yet. Add some to get started.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mostImportantItems.map((item) => (
                <BudgetCard
                  key={item.id}
                  title={item.title}
                  cost={formatCurrency(item.cost)}
                  progress={Math.min(100, Math.round((balance / item.cost) * 100))}
                  attainable={balance >= item.cost}
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="less-important" className="space-y-4">
          {lessImportantItems.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              No less important budget items yet. Add some to get started.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lessImportantItems.map((item) => (
                <BudgetCard
                  key={item.id}
                  title={item.title}
                  cost={formatCurrency(item.cost)}
                  progress={Math.min(100, Math.round((balance / item.cost) * 100))}
                  attainable={balance >= item.cost}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Budget Summary</CardTitle>
          <CardDescription>Your overall budget status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Total Budget</span>
              <span>{formatCurrency(totalBudget)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Spent</span>
              <span>{formatCurrency(totalExpenses)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Remaining</span>
              <span className="text-emerald-600 font-medium">{formatCurrency(balance)}</span>
            </div>
            <Progress value={budgetUsedPercentage} className="h-2" />
            <p className="text-sm text-slate-500">You've used {budgetUsedPercentage}% of your total budget</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface BudgetCardProps {
  title: string
  cost: string
  progress: number
  attainable: boolean
}

function BudgetCard({ title, cost, progress, attainable }: BudgetCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{cost}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className={`text-sm ${attainable ? "text-emerald-600" : "text-rose-500"}`}>
            {attainable ? "Attainable with current funds" : "Not attainable with current funds"}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
