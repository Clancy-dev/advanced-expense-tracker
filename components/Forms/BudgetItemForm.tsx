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
import { useToast } from "@/hooks/use-toast"
import { createBudgetItem } from "@/actions/budget"

const budgetItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  cost: z.coerce.number().positive("Cost must be a positive number"),
  category: z.enum(["Most Important", "Less Important"]),
})

export type BudgetItemFormProps = z.infer<typeof budgetItemSchema>

export default function BudgetItemForm() {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<BudgetItemFormProps>({
    resolver: zodResolver(budgetItemSchema),
    defaultValues: {
      title: "",
      cost: undefined,
      category: "Most Important",
    },
  })

  async function onSubmit(data: BudgetItemFormProps) {
    try {
      const result = await createBudgetItem(data)

      if (result.error) {
        throw new Error("Failed to create budget item")
      }

      toast({
        title: "Budget item created",
        description: "Your budget item has been successfully created.",
      })

      router.push("/dashboard/budget")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating your budget item.",
        variant: "destructive",
      })
      console.error(error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Add Budget Item</h1>

      <Card>
        <CardHeader>
          <CardTitle>New Budget Item</CardTitle>
          <CardDescription>
            Add a new item to your budget. Items are categorized as either "Most Important" or "Less Important".
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Item Title</Label>
              <Input id="title" placeholder="e.g., Rent, Groceries, New Laptop" {...form.register("title")} />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Cost (UGX)</Label>
              <Input id="cost" type="number" placeholder="e.g., 500000" {...form.register("cost")} />
              {form.formState.errors.cost && (
                <p className="text-sm text-red-500">{form.formState.errors.cost.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <RadioGroup
                defaultValue="Most Important"
                onValueChange={(value) => form.setValue("category", value as "Most Important" | "Less Important")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Most Important" id="most-important" />
                  <Label htmlFor="most-important">Most Important</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Less Important" id="less-important" />
                  <Label htmlFor="less-important">Less Important but Needed</Label>
                </div>
              </RadioGroup>
              {form.formState.errors.category && (
                <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard/budget")}>
                Cancel
              </Button>
              <Button type="submit">Create Budget Item</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
