"use server"

import type { BudgetItemFormProps } from "@/components/Forms/BudgetItemForm"
import { db } from "@/prisma/db"
import { revalidatePath } from "next/cache"
import { verifySession } from "@/lib/dal"

export async function createBudgetItem(data: BudgetItemFormProps) {
  try {
    console.log("Creating budget item with data:", data)
    const session = await verifySession()
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
    const session = await verifySession()

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

export async function fetchBudgetItemById(id: string) {
  try {
    const session = await verifySession()

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

export async function updateBudgetItem(id: string, data: BudgetItemFormProps) {
  try {
    console.log("Updating budget item with id:", id, "and data:", data)
    const session = await verifySession()

    // Verify the budget item belongs to the user
    const existingItem = await db.budgetItem.findUnique({
      where: {
        id,
        userId: session.userId,
      },
    })

    if (!existingItem) {
      throw new Error("Budget item not found or you don't have permission to update it")
    }

    const updatedBudgetItem = await db.budgetItem.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        cost: data.cost,
        category: data.category,
      },
    })

    console.log("Successfully updated budget item:", updatedBudgetItem)

    revalidatePath("/")
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/budget")

    return { success: true, data: updatedBudgetItem }
  } catch (error) {
    console.error("Error updating budget item:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

export async function deleteBudgetItem(id: string) {
  try {
    console.log("Deleting budget item with id:", id)
    const session = await verifySession()

    // Verify the budget item belongs to the user
    const existingItem = await db.budgetItem.findUnique({
      where: {
        id,
        userId: session.userId,
      },
    })

    if (!existingItem) {
      throw new Error("Budget item not found or you don't have permission to delete it")
    }

    await db.budgetItem.delete({
      where: {
        id,
      },
    })

    console.log("Successfully deleted budget item with id:", id)

    revalidatePath("/")
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/budget")

    return { success: true }
  } catch (error) {
    console.error("Error deleting budget item:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
