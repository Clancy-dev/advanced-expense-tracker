"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"
import { createBudgetItem } from "@/actions/budget"
import { useState } from "react"

// Update to match your Prisma enum
const budgetItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  cost: z.coerce.number().positive("Cost must be a positive number"),
  category: z.enum(["MOST_IMPORTANT", "LESS_IMPORTANT"]),
})

export type BudgetItemFormProps = {
  title: string
  cost: number
  category: "MOST_IMPORTANT" | "LESS_IMPORTANT"
  userId?: string
}

export default function BudgetItemForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<BudgetItemFormProps>({
    resolver: zodResolver(budgetItemSchema),
    defaultValues: {
      title: "",
      cost: undefined,
      category: "MOST_IMPORTANT",
    },
  })

  async function onSubmit(data: BudgetItemFormProps) {
    try {
      setIsSubmitting(true)
      console.log("Submitting budget item form with data:", data)

      const result = await createBudgetItem(data)

      if (!result.success) {
        throw new Error(result.error || "Failed to create budget item")
      }

      console.log("Budget item created successfully:", result.data)
      toast.success("Budget item created successfully")

      router.push("/dashboard/budget")
    } catch (error) {
      console.error("Error submitting budget item form:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create budget item")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <Toaster position="top-center" />
      <h1 className="text-3xl font-bold tracking-tight mb-6">Add Budget Item</h1>

      <Card className="border border-purple-100 shadow-md">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardTitle className="text-purple-700">New Budget Item</CardTitle>
          <CardDescription>
            Add a new item to your budget. Items are categorized as either "Most Important" or "Less Important".
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-purple-700">
                Item Title
              </Label>
              <Input
                id="title"
                placeholder="e.g., Rent, Groceries, New Laptop"
                {...form.register("title")}
                className="border-purple-200 focus:border-purple-300 focus:ring-purple-200"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost" className="text-purple-700">
                Cost (UGX)
              </Label>
              <Input
                id="cost"
                type="number"
                placeholder="e.g., 500000"
                {...form.register("cost")}
                className="border-purple-200 focus:border-purple-300 focus:ring-purple-200"
              />
              {form.formState.errors.cost && (
                <p className="text-sm text-red-500">{form.formState.errors.cost.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-purple-700">Category</Label>
              <RadioGroup
                defaultValue={form.watch("category") || "MOST_IMPORTANT"}
                onValueChange={(value) => form.setValue("category", value as "MOST_IMPORTANT" | "LESS_IMPORTANT")}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 bg-white p-3 rounded-md border border-purple-100 hover:border-purple-200 transition-colors">
                  <RadioGroupItem value="MOST_IMPORTANT" id="most-important" className="text-purple-600" />
                  <Label htmlFor="most-important" className="font-medium cursor-pointer">
                    Most Important
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-white p-3 rounded-md border border-purple-100 hover:border-purple-200 transition-colors">
                  <RadioGroupItem value="LESS_IMPORTANT" id="less-important" className="text-purple-600" />
                  <Label htmlFor="less-important" className="font-medium cursor-pointer">
                    Less Important but Needed
                  </Label>
                </div>
              </RadioGroup>
              {form.formState.errors.category && (
                <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/budget")}
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700 text-white">
                {isSubmitting ? "Creating..." : "Create Budget Item"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
