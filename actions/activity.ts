"use server"

import { deleteIncome } from "@/actions/income"
import { deleteExpense } from "@/actions/expense"

export async function deleteActivity(id: string, type: "income" | "expense") {
  if (type === "income") {
    return await deleteIncome(id)
  } else {
    return await deleteExpense(id)
  }
}
