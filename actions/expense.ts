"use server"

import type { ExpenseFormProps } from "@/components/Forms/ExpenseForm"
import { db } from "@/prisma/db"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function createExpense(data: ExpenseFormProps) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      throw new Error("You must be logged in to create an expense")
    }

    const createdExpense = await db.expense.create({
      data: {
        ...data,
        date: new Date(data.date),
        userId: session.user.id,
      },
    })

    revalidatePath("/")
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/expenses")

    console.log("Created Expense:", createdExpense)

    return createdExpense
  } catch (error) {
    console.error("Error creating expense:", error)
    return {
      error,
    }
  }
}

export async function fetchExpenses() {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return []
    }

    const fetchedExpenses = await db.expense.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: "desc",
      },
    })

    console.log("Fetched Expenses:", fetchedExpenses)
    return fetchedExpenses
  } catch (error) {
    console.error("Error fetching expenses:", error)
    return [] // Return empty array on failure
  }
}

export async function fetchExpenseById(id: string) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return null
    }

    const fetchedExpense = await db.expense.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    })

    console.log("Fetched Expense:", fetchedExpense)
    return fetchedExpense
  } catch (error) {
    console.error("Error fetching expense:", error)
    return null // Return null if the expense isn't found
  }
}

export async function deleteExpense(id: string) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      throw new Error("You must be logged in to delete an expense")
    }

    const deletedExpense = await db.expense.delete({
      where: {
        id,
        userId: session.user.id,
      },
    })

    revalidatePath("/")
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/expenses")

    console.log("Deleted Expense:", deletedExpense)
    return deletedExpense
  } catch (error) {
    console.error("Error deleting expense:", error)
    return {
      error,
    }
  }
}
