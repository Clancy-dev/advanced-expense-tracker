"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/date-picker"
import { useFinance } from "@/context/finance-context"
import { format, subDays, subMonths, subYears, startOfDay, endOfDay } from "date-fns"
import { formatCurrency } from "@/lib/utils"
import { Printer } from "lucide-react"

export default function ReportsPage() {
  const { income, expenses, getFilteredIncome, getFilteredExpenses } = useFinance()
  const [reportType, setReportType] = useState<"income" | "expenses" | "combined">("combined")
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month" | "year" | "custom">("month")
  const [startDate, setStartDate] = useState<Date>(subMonths(new Date(), 1))
  const [endDate, setEndDate] = useState<Date>(new Date())

  // Calculate date range based on selected time range
  const calculateDateRange = () => {
    const today = new Date()

    switch (timeRange) {
      case "day":
        return { start: startOfDay(today), end: endOfDay(today) }
      case "week":
        return { start: startOfDay(subDays(today, 7)), end: endOfDay(today) }
      case "month":
        return { start: startOfDay(subMonths(today, 1)), end: endOfDay(today) }
      case "year":
        return { start: startOfDay(subYears(today, 1)), end: endOfDay(today) }
      case "custom":
        return { start: startOfDay(startDate), end: endOfDay(endDate) }
      default:
        return { start: startOfDay(subMonths(today, 1)), end: endOfDay(today) }
    }
  }

  const { start, end } = calculateDateRange()

  // Get filtered data
  const filteredIncome = getFilteredIncome(start, end)
  const filteredExpenses = getFilteredExpenses(start, end)

  // Calculate totals
  const totalIncome = filteredIncome.reduce((sum, item) => sum + item.amount, 0)
  const totalExpenses = filteredExpenses.reduce((sum, item) => sum + item.amount, 0)
  const balance = totalIncome - totalExpenses

  // Group by category
  const incomeByCategory = filteredIncome.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const expensesByCategory = filteredExpenses.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount
      return acc
    },
    {} as Record<string, number>,
  )

  // Handle print
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Financial Reports</h1>
          <p className="text-slate-500">Generate and print reports of your financial activities</p>
        </div>
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" /> Print Report
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Report Settings</CardTitle>
          <CardDescription>Customize your financial report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={(value) => setReportType(value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income Only</SelectItem>
                  <SelectItem value="expenses">Expenses Only</SelectItem>
                  <SelectItem value="combined">Combined Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="year">Last 12 Months</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {timeRange === "custom" && (
              <div className="space-y-2 md:col-span-3 grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Start Date</label>
                  <DatePicker date={startDate} setDate={setStartDate} />
                </div>
                <div>
                  <label className="text-sm font-medium">End Date</label>
                  <DatePicker date={endDate} setDate={setEndDate} />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="print-section">
        <div className="text-center mb-8 print:block hidden">
          <h1 className="text-2xl font-bold">Financial Report</h1>
          <p>
            {format(start, "PPP")} - {format(end, "PPP")}
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>
              Financial summary for {format(start, "PPP")} - {format(end, "PPP")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-500">Total Income</h3>
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalIncome)}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-500">Total Expenses</h3>
                <p className="text-2xl font-bold text-rose-600">{formatCurrency(totalExpenses)}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-500">Net Balance</h3>
                <p className={`text-2xl font-bold ${balance >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {formatCurrency(balance)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>Combined list of income and expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[...filteredIncome, ...filteredExpenses]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((item) => {
                      const isIncome = "category" in item && filteredIncome.some((i) => i.id === item.id)
                      return (
                        <div key={item.id} className="flex justify-between items-center py-2 border-b">
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-slate-500">{format(new Date(item.date), "PPP p")}</p>
                            <p className="text-sm text-slate-500">{item.category}</p>
                          </div>
                          <p className={`font-medium ${isIncome ? "text-emerald-600" : "text-rose-600"}`}>
                            {isIncome ? "+" : "-"} {formatCurrency(item.amount)}
                          </p>
                        </div>
                      )
                    })}

                  {filteredIncome.length === 0 && filteredExpenses.length === 0 && (
                    <p className="text-center py-4 text-slate-500">No transactions found for this period.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="income" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Income Transactions</CardTitle>
                <CardDescription>All income for the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {filteredIncome
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b">
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-slate-500">{format(new Date(item.date), "PPP p")}</p>
                          <p className="text-sm text-slate-500">{item.category}</p>
                        </div>
                        <p className="font-medium text-emerald-600">+ {formatCurrency(item.amount)}</p>
                      </div>
                    ))}

                  {filteredIncome.length === 0 && (
                    <p className="text-center py-4 text-slate-500">No income found for this period.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Expense Transactions</CardTitle>
                <CardDescription>All expenses for the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {filteredExpenses
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b">
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-slate-500">{format(new Date(item.date), "PPP p")}</p>
                          <p className="text-sm text-slate-500">{item.category}</p>
                        </div>
                        <p className="font-medium text-rose-600">- {formatCurrency(item.amount)}</p>
                      </div>
                    ))}

                  {filteredExpenses.length === 0 && (
                    <p className="text-center py-4 text-slate-500">No expenses found for this period.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>Income and expenses by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <h3 className="font-medium mb-4">Income by Category</h3>
                    {Object.keys(incomeByCategory).length > 0 ? (
                      <div className="space-y-2">
                        {Object.entries(incomeByCategory).map(([category, amount]) => (
                          <div key={category} className="flex justify-between items-center">
                            <span>{category}</span>
                            <span className="font-medium">{formatCurrency(amount)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500">No income data available.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Expenses by Category</h3>
                    {Object.keys(expensesByCategory).length > 0 ? (
                      <div className="space-y-2">
                        {Object.entries(expensesByCategory).map(([category, amount]) => (
                          <div key={category} className="flex justify-between items-center">
                            <span>{category}</span>
                            <span className="font-medium">{formatCurrency(amount)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500">No expense data available.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
