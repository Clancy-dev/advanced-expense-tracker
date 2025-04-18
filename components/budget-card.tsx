"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Pencil, Trash2, ChevronDown, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { deleteBudgetItem } from "@/actions/budget"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

interface BudgetCardProps {
  id: string
  title: string
  cost: string
  progress: number
  attainable: boolean
}

export function BudgetCard({ id, title, cost, progress, attainable }: BudgetCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = () => {
    router.push(`/dashboard/budget/edit/${id}`)
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this budget item?")) {
      try {
        setIsDeleting(true)
        const result = await deleteBudgetItem(id)

        if (!result.success) {
          throw new Error(result.error || "Failed to delete budget item")
        }

        toast.success("Budget item deleted successfully")
        router.refresh()
      } catch (error) {
        console.error("Error deleting budget item:", error)
        toast.error(error instanceof Error ? error.message : "Failed to delete budget item")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <Card className="border border-purple-100 shadow-md hover:shadow-lg transition-all bg-white overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-indigo-50 relative">
        <div className="absolute top-3 right-3 flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-purple-600 hover:text-purple-800 hover:bg-purple-100"
            onClick={handleEdit}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-rose-600 hover:text-rose-800 hover:bg-rose-100"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
        <CardTitle className="text-lg text-purple-800">{title}</CardTitle>
        <CardDescription className="text-purple-600 font-medium">{cost}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-slate-700">Progress</span>
              <span className={`font-medium ${attainable ? "text-emerald-600" : "text-amber-600"}`}>{progress}%</span>
            </div>
            <Progress
              value={progress}
              className="h-2.5 rounded-full"
              indicatorClassName={`${
                attainable
                  ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                  : "bg-gradient-to-r from-amber-400 to-amber-500"
              }`}
            />
          </div>

          <Accordion type="single" collapsible className="border-t border-purple-100 pt-2">
            <AccordionItem value="attainability" className="border-b-0">
              <AccordionTrigger className="py-2 text-sm font-medium text-slate-700 hover:text-purple-700 hover:no-underline">
                Attainability Status
                <ChevronDown className="h-4 w-4" />
              </AccordionTrigger>
              <AccordionContent>
                <div
                  className={`flex items-center text-sm p-2 rounded-md ${
                    attainable ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {attainable ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>Attainable with current funds</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>Not attainable with current funds</span>
                    </>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  )
}
