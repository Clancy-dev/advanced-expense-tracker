import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, PiggyBank, CheckCircle, AlertCircle } from "lucide-react"
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
            Budget
          </h1>
          <p className="text-slate-500 mt-1">Manage your budget items and track your spending.</p>
        </div>
        <Button asChild className="bg-purple-600 hover:bg-purple-700">
          <Link href="/dashboard/budget/new">
            <Plus className="mr-2 h-4 w-4" /> Add Budget Item
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="most-important" className="space-y-6">
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger
            value="most-important"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-50 data-[state=active]:to-indigo-50 data-[state=active]:text-purple-700"
          >
            Most Important
          </TabsTrigger>
          <TabsTrigger
            value="less-important"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-50 data-[state=active]:to-indigo-50 data-[state=active]:text-purple-700"
          >
            Less Important
          </TabsTrigger>
        </TabsList>

        <TabsContent value="most-important" className="space-y-6">
          {mostImportantItems.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg shadow-md border-0">
              <PiggyBank className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 mb-2">No important budget items yet</p>
              <p className="text-sm text-slate-400 mb-4">Add some to get started</p>
              <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Link href="/dashboard/budget/new">
                  <Plus className="mr-2 h-4 w-4" /> Add Budget Item
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

        <TabsContent value="less-important" className="space-y-6">
          {lessImportantItems.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg shadow-md border-0">
              <PiggyBank className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 mb-2">No less important budget items yet</p>
              <p className="text-sm text-slate-400 mb-4">Add some to get started</p>
              <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Link href="/dashboard/budget/new">
                  <Plus className="mr-2 h-4 w-4" /> Add Budget Item
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

      <Card className="border-0 shadow-md bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <PiggyBank className="h-5 w-5 text-purple-500 mr-2" />
            Budget Summary
          </CardTitle>
          <CardDescription>Your overall budget status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
                <p className="text-sm font-medium text-purple-700 mb-1">Total Budget</p>
                <p className="text-xl font-bold text-purple-700">{formatCurrency(totalBudget)}</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg">
                <p className="text-sm font-medium text-rose-700 mb-1">Spent</p>
                <p className="text-xl font-bold text-rose-700">{formatCurrency(totalExpenses)}</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                <p className="text-sm font-medium text-emerald-700 mb-1">Remaining</p>
                <p className="text-xl font-bold text-emerald-700">{formatCurrency(balance)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Budget Usage</span>
                <span>{budgetUsedPercentage}%</span>
              </div>
              <Progress
                value={budgetUsedPercentage}
                className={`h-2 ${
                  budgetUsedPercentage < 70
                    ? "bg-emerald-500"
                    : budgetUsedPercentage < 90
                    ? "bg-amber-500"
                    : "bg-rose-500"
                }`}
              />
              <p className="text-sm text-slate-500 mt-1">You've used {budgetUsedPercentage}% of your total budget</p>
            </div>
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
    <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{cost}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress
              value={progress}
              className={`h-2 ${attainable ? "bg-emerald-500" : "bg-amber-500"}`}
            />
          </div>
          <div className={`flex items-center text-sm ${attainable ? "text-emerald-600" : "text-amber-500"}`}>
            {attainable ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Attainable with current funds
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 mr-2" />
                Not attainable with current funds
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
