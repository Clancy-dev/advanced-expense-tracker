"use server"

import type { ExpenseFormProps } from "@/components/Forms/ExpenseForm"
import { db } from "@/prisma/db"
import { revalidatePath } from "next/cache"
import { verifySession } from "@/lib/dal"

export async function createExpense(data: ExpenseFormProps) {
  try {
    console.log("Creating expense with data:", data)
    const session = await verifySession()

    const createdExpense = await db.expense.create({
      data: {
        ...data,
        date: new Date(data.date),
        userId: session.userId,
      },
    })

    console.log("Successfully created expense:", createdExpense)

    revalidatePath("/")
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/expenses")

    return { success: true, data: createdExpense }
  } catch (error) {
    console.error("Error creating expense:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

export async function fetchExpenses() {
  try {
    const session = await verifySession()

    const fetchedExpenses = await db.expense.findMany({
      where: {
        userId: session.userId,
      },
      orderBy: {
        date: "desc",
      },
    })

    console.log(`Fetched ${fetchedExpenses.length} expenses`)
    return fetchedExpenses
  } catch (error) {
    console.error("Error fetching expenses:", error)
    return [] // Return empty array on failure
  }
}

// Other functions remain the same...
export async function fetchExpenseById(id: string) {
  try {
    const session = await verifySession()

    const fetchedExpense = await db.expense.findUnique({
      where: {
        id,
        userId: session.userId,
      },
    })

    console.log("Fetched expense:", fetchedExpense)
    return fetchedExpense
  } catch (error) {
    console.error("Error fetching expense by ID:", error)
    return null // Return null on failure
  }
}