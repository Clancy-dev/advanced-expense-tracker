"use server"

import type { IncomeFormProps } from "@/components/Forms/IncomeForm"
import { verifySession } from "@/lib/dal"
import { db } from "@/prisma/db"
import { revalidatePath } from "next/cache"


export async function createIncome(data: IncomeFormProps) {
  try {
    console.log("Creating income with data:", data)
    const session = await verifySession()
    const createdIncome = await db.income.create({
      data: {
        ...data,
        date: new Date(data.date),
        userId: session.userId,
      },
    })

    console.log("Successfully created income:", createdIncome)

    revalidatePath("/")
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/income")

    return { success: true, data: createdIncome }
  } catch (error) {
    console.error("Error creating income:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

export async function fetchIncomes() {
  try {
     const session = await verifySession()
     

    const fetchedIncomes = await db.income.findMany({
      where: {
         userId: session.userId,
      },
      orderBy: {
        date: "desc",
      },
    })

    console.log(`Fetched ${fetchedIncomes.length} incomes`)
    return fetchedIncomes
  } catch (error) {
    console.error("Error fetching incomes:", error)
    return [] // Return empty array on failure
  }
}

// Other functions remain the same...
export async function fetchIncomeById(id: string) {
  try {
    // const session = await requireAuth()

    const fetchedIncome = await db.income.findUnique({
      where: {
        id,
        // userId: session.userId,
      },
    })

    if (!fetchedIncome) {
      throw new Error("Income not found")
    }

    console.log("Fetched income:", fetchedIncome)
    return fetchedIncome
  } catch (error) {
    console.error("Error fetching income by ID:", error)
    return null // Return null on failure
  }
}





export async function updateIncome(id: string, data: Partial<IncomeFormProps>) {
  try {
    const session = await verifySession()

    const updated = await db.income.update({
      where: {
        id,
        userId: session.userId,
      },
      data,
    })

    revalidatePath("/dashboard")
    return { success: true, data: updated }
  } catch (error) {
    console.error("Error updating income:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function deleteIncome(id: string) {
  try {
    const session = await verifySession()

    await db.income.delete({
      where: {
        id,
        userId: session.userId,
      },
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error deleting income:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
