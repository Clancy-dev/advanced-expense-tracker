"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { CalendarIcon, Clock } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { createExpense } from "@/actions/expense"
import { useState } from "react"

const expenseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.coerce.number().positive("Amount must be a positive number"),
  category: z.string().min(1, "Category is required"),
  date: z.string(),
  description: z.string().optional(),
})

export type ExpenseFormProps = z.infer<typeof expenseSchema>

export default function ExpenseForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ExpenseFormProps>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: "",
      amount: undefined,
      category: "",
      date: new Date().toISOString(),
      description: "",
    },
  })

  async function onSubmit(data: ExpenseFormProps) {
    try {
      setIsSubmitting(true)
      console.log("Submitting expense form with data:", data)

      const result = await createExpense(data)

      if (!result.success) {
        throw new Error(result.error || "Failed to create expense")
      }

      console.log("Expense created successfully:", result.data)

      toast({
        title: "Expense recorded",
        description: "Your expense has been successfully recorded.",
        variant: "default",
      })

      router.push("/dashboard/expenses")
    } catch (error) {
      console.error("Error submitting expense form:", error)

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was an error recording your expense.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Add Expense</h1>

      <Card className="border border-rose-100 shadow-md">
        <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50">
          <CardTitle className="text-rose-700">New Expense</CardTitle>
          <CardDescription>Record a new expense with details like amount, category, and date.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-rose-700">
                Expense Title
              </Label>
              <Input
                id="title"
                placeholder="e.g., Rent, Groceries, Electricity"
                {...form.register("title")}
                className="border-rose-200 focus:border-rose-300 focus:ring-rose-200"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-rose-700">
                Amount (UGX)
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g., 50000"
                {...form.register("amount")}
                className="border-rose-200 focus:border-rose-300 focus:ring-rose-200"
              />
              {form.formState.errors.amount && (
                <p className="text-sm text-red-500">{form.formState.errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-rose-700">
                Category
              </Label>
              <Select
                onValueChange={(value) => form.setValue("category", value)}
                defaultValue={form.getValues("category")}
              >
                <SelectTrigger className="border-rose-200 focus:ring-rose-200">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Housing">Housing</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Transportation">Transportation</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.category && (
                <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-rose-700">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-rose-200 focus:ring-rose-200",
                        !form.getValues("date") && "text-muted-foreground",
                      )}
                      type="button"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-rose-500" />
                      {form.getValues("date") ? (
                        format(new Date(form.getValues("date")), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={form.getValues("date") ? new Date(form.getValues("date")) : undefined}
                      onSelect={(date) => date && form.setValue("date", date.toISOString())}
                      initialFocus
                      className="rounded-md border border-rose-200"
                    />
                  </PopoverContent>
                </Popover>
                {form.formState.errors.date && (
                  <p className="text-sm text-red-500">{form.formState.errors.date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-rose-700">Time</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-rose-200 focus:ring-rose-200"
                    type="button"
                    onClick={() => {
                      // Update the time component of the date
                      const currentDate = form.getValues("date") ? new Date(form.getValues("date")) : new Date()
                      const now = new Date()
                      currentDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds())
                      form.setValue("date", currentDate.toISOString())
                    }}
                  >
                    <Clock className="mr-2 h-4 w-4 text-rose-500" />
                    {form.getValues("date") ? format(new Date(form.getValues("date")), "h:mm a") : "Set time"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-rose-700">
                Description (Optional)
              </Label>
              <Input
                id="description"
                placeholder="Add any additional details"
                {...form.register("description")}
                className="border-rose-200 focus:border-rose-300 focus:ring-rose-200"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/expenses")}
                className="border-rose-200 text-rose-700 hover:bg-rose-50"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-rose-600 hover:bg-rose-700 text-white">
                {isSubmitting ? "Recording..." : "Record Expense"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
