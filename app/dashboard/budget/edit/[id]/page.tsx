import { fetchBudgetItemById } from "@/actions/budget"
import EditBudgetItemForm from "@/components/Forms/EditBudgetItemForm"
import { notFound } from "next/navigation"

interface EditBudgetItemPageProps {
  params: {
    id: string
  }
}

export default async function EditBudgetItemPage({ params }: EditBudgetItemPageProps) {
  const budgetItem = await fetchBudgetItemById(params.id)

  if (!budgetItem) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Edit Budget Item</h1>
      <EditBudgetItemForm
        budgetItem={{
          ...budgetItem,
          category: budgetItem.category === "MOST_IMPORTANT" || budgetItem.category === "LESS_IMPORTANT"
            ? budgetItem.category
            : "LESS_IMPORTANT", // Default or fallback value
        }}
      />
    </div>
  )
}
