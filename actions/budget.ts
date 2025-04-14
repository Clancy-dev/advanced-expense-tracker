"use server"

import type { BudgetItemFormProps } from "@/components/Forms/BudgetItemForm"
import { db } from "@/prisma/db"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function createBudgetItem(data: BudgetItemFormProps) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      throw new Error("You must be logged in to create a budget item")
    }

    const createdBudgetItem = await db.budgetItem.create({
      data: {
        ...data,
        userId: session.user.id,
      },
    })

    revalidatePath("/")
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/budget")

    console.log("Created Budget Item:", createdBudgetItem)

    return createdBudgetItem
  } catch (error) {
    console.error("Error creating budget item:", error)
    return {
      error,
    }
  }
}

export async function fetchBudgetItems() {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return []
    }

    const fetchedBudgetItems = await db.budgetItem.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    console.log("Fetched Budget Items:", fetchedBudgetItems)
    return fetchedBudgetItems
  } catch (error) {
    console.error("Error fetching budget items:", error)
    return [] // Return empty array on failure
  }
}

export async function fetchBudgetItemById(id: string) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return null
    }

    const fetchedBudgetItem = await db.budgetItem.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    })

    console.log("Fetched Budget Item:", fetchedBudgetItem)
    return fetchedBudgetItem
  } catch (error) {
    console.error("Error fetching budget item:", error)
    return null // Return null if the budget item isn't found
  }
}

export async function deleteBudgetItem(id: string) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      throw new Error("You must be logged in to delete a budget item")
    }

    const deletedBudgetItem = await db.budgetItem.delete({
      where: {
        id,
        userId: session.user.id,
      },
    })

    revalidatePath("/")
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/budget")

    console.log("Deleted Budget Item:", deletedBudgetItem)
    return deletedBudgetItem
  } catch (error) {
    console.error("Error deleting budget item:", error)
    return {
      error,
    }
  }
}
