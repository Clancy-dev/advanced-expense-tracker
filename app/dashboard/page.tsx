import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDown, ArrowUp, DollarSign, PiggyBank } from "lucide-react"
import { Overview } from "@/components/overview"
import { RecentTransactions } from "@/components/recent-transactions"
import { fetchIncomes } from "@/actions/income"
import { fetchExpenses } from "@/actions/expense"
import { fetchBudgetItems } from "@/actions/budget"
import { formatCurrency } from "@/lib/utils"

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
    <div className="flex flex-col gap-5">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-slate-500">Welcome to your financial overview.</p>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
                <p className="text-xs text-slate-500">Current balance</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Income</CardTitle>
                <ArrowUp className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
                <p className="text-xs text-slate-500">Total income</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                <ArrowDown className="h-4 w-4 text-rose-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
                <p className="text-xs text-slate-500">Total expenses</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Budget Used</CardTitle>
                <PiggyBank className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{budgetUsedPercentage}%</div>
                <p className="text-xs text-slate-500">Of total budget</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Your financial activity for the past 30 days.</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview incomes={incomes} expenses={expenses} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
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
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Detailed analysis of your financial data.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <p className="text-slate-500">Analytics charts will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
