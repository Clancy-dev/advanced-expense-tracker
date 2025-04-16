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
import toast, { Toaster } from "react-hot-toast"
import { CalendarIcon, Clock } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { createIncome } from "@/actions/income"
import { useState } from "react"

const incomeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.coerce.number().positive("Amount must be a positive number"),
  category: z.string().min(1, "Category is required"),
  date: z.string(),
  description: z.string().optional(),
})

export type IncomeFormProps = {
  title: string
  amount: number
  category: string
  date: string
  description?: string
}

export default function IncomeForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<IncomeFormProps>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      title: "",
      amount: undefined,
      category: "",
      date: new Date().toISOString(),
      description: "",
    },
  })

  async function onSubmit(data: IncomeFormProps) {
    try {
      setIsSubmitting(true)
      console.log("Submitting income form with data:", data)

      const result = await createIncome(data)

      if (!result.success) {
        throw new Error(result.error || "Failed to create income")
      }

      console.log("Income created successfully:", result.data)
      toast.success("Income recorded successfully")

      router.push("/dashboard/income")
    } catch (error) {
      console.error("Error submitting income form:", error)
      toast.error("Failed to record income")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <Toaster position="top-center" />
      <h1 className="text-3xl font-bold tracking-tight mb-6">Add Income</h1>

      <Card className="border border-emerald-100 shadow-md">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
          <CardTitle className="text-emerald-700">New Income</CardTitle>
          <CardDescription>Record a new income with details like amount, category, and date.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-emerald-700">
                Income Title
              </Label>
              <Input
                id="title"
                placeholder="e.g., Salary, Freelance, Gift"
                {...form.register("title")}
                className="border-emerald-200 focus:border-emerald-300 focus:ring-emerald-200"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-emerald-700">
                Amount (UGX)
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g., 2000000"
                {...form.register("amount")}
                className="border-emerald-200 focus:border-emerald-300 focus:ring-emerald-200"
              />
              {form.formState.errors.amount && (
                <p className="text-sm text-red-500">{form.formState.errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-emerald-700">
                Category
              </Label>
              <Select
                onValueChange={(value) => form.setValue("category", value)}
                defaultValue={form.getValues("category")}
              >
                <SelectTrigger id="category" className="border-emerald-200 focus:ring-emerald-200">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Employment">Employment</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Investment">Investment</SelectItem>
                  <SelectItem value="Gift">Gift</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.category && (
                <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-emerald-700">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-emerald-200 focus:ring-emerald-200",
                        !form.watch("date") && "text-muted-foreground",
                      )}
                      type="button"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-emerald-500" />
                      {form.watch("date") ? format(new Date(form.watch("date")), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={form.watch("date") ? new Date(form.watch("date")) : undefined}
                      onSelect={(date) => date && form.setValue("date", date.toISOString())}
                      initialFocus
                      className="rounded-md border border-emerald-200"
                    />
                  </PopoverContent>
                </Popover>
                {form.formState.errors.date && (
                  <p className="text-sm text-red-500">{form.formState.errors.date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-emerald-700">Time</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-emerald-200 focus:ring-emerald-200"
                    type="button"
                    onClick={() => {
                      // Update the time component of the date
                      const currentDate = form.watch("date") ? new Date(form.watch("date")) : new Date()
                      const now = new Date()
                      currentDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds())
                      form.setValue("date", currentDate.toISOString())
                    }}
                  >
                    <Clock className="mr-2 h-4 w-4 text-emerald-500" />
                    {form.watch("date") ? format(new Date(form.watch("date")), "h:mm a") : "Set time"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-emerald-700">
                Description (Optional)
              </Label>
              <Input
                id="description"
                placeholder="Add any additional details"
                {...form.register("description")}
                className="border-emerald-200 focus:border-emerald-300 focus:ring-emerald-200"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/income")}
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {isSubmitting ? "Recording..." : "Record Income"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
