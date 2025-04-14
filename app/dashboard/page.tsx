import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDown, ArrowUp, DollarSign, PiggyBank, TrendingUp, FileText } from "lucide-react"
import { Overview } from "@/components/overview"
import { RecentTransactions } from "@/components/recent-transactions"
import { fetchIncomes } from "@/actions/income"
import { fetchExpenses } from "@/actions/expense"
import { fetchBudgetItems } from "@/actions/budget"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const [incomes, expenses, budgetItems] = await Promise.all([fetchIncomes(), fetchExpenses(), fetchBudgetItems()])

  // Calculate totals
  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0)
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0)
  const balance = totalIncome - totalExpenses

  // Calculate budget usage
  const totalBudget = budgetItems.reduce((sum, item) => sum + item.cost, 0)
  const budgetUsedPercentage = totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 100) : 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Welcome to your financial overview.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/dashboard/income/new">
              <ArrowUp className="mr-2 h-4 w-4" /> Add Income
            </Link>
          </Button>
          <Button asChild size="sm" className="bg-rose-600 hover:bg-rose-700">
            <Link href="/dashboard/expenses/new">
              <ArrowDown className="mr-2 h-4 w-4" /> Add Expense
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-50 data-[state=active]:to-blue-50 data-[state=active]:text-purple-700"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-50 data-[state=active]:to-blue-50 data-[state=active]:text-purple-700"
          >
            Analytics
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-400 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className={cn("text-2xl font-bold", balance >= 0 ? "text-emerald-600" : "text-rose-600")}>
                  {formatCurrency(balance)}
                </div>
                <p className="text-xs text-slate-500 mt-1">Current balance</p>
                <div className="mt-3 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", balance >= 0 ? "bg-emerald-500" : "bg-rose-500")}
                    style={{ width: `${Math.min(100, (Math.abs(balance) / (totalIncome || 1)) * 100)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Income</CardTitle>
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-green-400 flex items-center justify-center">
                  <ArrowUp className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totalIncome)}</div>
                <p className="text-xs text-slate-500 mt-1">Total income</p>
                <div className="mt-3 flex items-center text-xs">
                  <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />
                  <span className="text-emerald-500 font-medium">{incomes.length}</span>
                  <span className="text-slate-400 ml-1">income transactions</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-rose-500 to-pink-400 flex items-center justify-center">
                  <ArrowDown className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-rose-600">{formatCurrency(totalExpenses)}</div>
                <p className="text-xs text-slate-500 mt-1">Total expenses</p>
                <div className="mt-3 flex items-center text-xs">
                  <TrendingUp className="h-3 w-3 text-rose-500 mr-1" />
                  <span className="text-rose-500 font-medium">{expenses.length}</span>
                  <span className="text-slate-400 ml-1">expense transactions</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Budget Used</CardTitle>
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 flex items-center justify-center">
                  <PiggyBank className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{budgetUsedPercentage}%</div>
                <p className="text-xs text-slate-500 mt-1">Of total budget</p>
                <div className="mt-3 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      budgetUsedPercentage < 70
                        ? "bg-emerald-500"
                        : budgetUsedPercentage < 90
                          ? "bg-amber-500"
                          : "bg-rose-500",
                    )}
                    style={{ width: `${budgetUsedPercentage}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 border-0 shadow-md bg-white">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Your financial activity for the past 30 days.</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview incomes={incomes} expenses={expenses} />
              </CardContent>
            </Card>
            <Card className="col-span-3 border-0 shadow-md bg-white">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your most recent financial activities.</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentTransactions incomes={incomes} expenses={expenses} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-6">
          <Card className="border-0 shadow-md bg-white">
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Detailed analysis of your financial data.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] flex items-center justify-center border rounded-md bg-gradient-to-r from-purple-50 to-blue-50">
                <div className="text-center">
                  <p className="text-slate-500 mb-3">Analytics charts will appear here</p>
                  <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Link href="/docs">
                      <FileText className="mr-2 h-4 w-4" /> View Reports
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper function for class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
