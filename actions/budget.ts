"use server"

import type { BudgetItemFormProps } from "@/components/Forms/BudgetItemForm"
import { db } from "@/prisma/db"
import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/dal"

export async function createBudgetItem(data: BudgetItemFormProps) {
  try {
    console.log("Creating budget item with data:", data)
    const session = await requireAuth()
    if (typeof session.userId !== "string") {
      throw new Error("Invalid userId type")
    }

    const createdBudgetItem = await db.budgetItem.create({
      data: {
        ...data,
        userId: session.userId,
      },
    })

    console.log("Successfully created budget item:", createdBudgetItem)

    revalidatePath("/")
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/budget")

    return { success: true, data: createdBudgetItem }
  } catch (error) {
    console.error("Error creating budget item:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

export async function fetchBudgetItems() {
  try {
    const session = await requireAuth()

    const fetchedBudgetItems = await db.budgetItem.findMany({
      where: {
        userId: session.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    console.log(`Fetched ${fetchedBudgetItems.length} budget items`)
    return fetchedBudgetItems
  } catch (error) {
    console.error("Error fetching budget items:", error)
    return [] // Return empty array on failure
  }
}

// Other functions remain the same...
export async function fetchBudgetItemById(id: string) {
  try {
    const session = await requireAuth()

    const fetchedBudgetItem = await db.budgetItem.findUnique({
      where: {
        id,
        userId: session.userId,
      },
    })

    if (!fetchedBudgetItem) {
      throw new Error("Budget item not found")
    }

    console.log("Fetched budget item:", fetchedBudgetItem)
    return fetchedBudgetItem
  } catch (error) {
    console.error("Error fetching budget item:", error)
    return null // Return null on failure
  }
}