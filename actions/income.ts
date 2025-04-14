"use server"

import type { IncomeFormProps } from "@/components/Forms/IncomeForm"
import { db } from "@/prisma/db"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function createIncome(data: IncomeFormProps) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      throw new Error("You must be logged in to create income")
    }

    const createdIncome = await db.income.create({
      data: {
        ...data,
        date: new Date(data.date),
        userId: session.user.id,
      },
    })

    revalidatePath("/")
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/income")

    console.log("Created Income:", createdIncome)

    return createdIncome
  } catch (error) {
    console.error("Error creating income:", error)
    return {
      error,
    }
  }
}

export async function fetchIncomes() {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return []
    }

    const fetchedIncomes = await db.income.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: "desc",
      },
    })

    console.log("Fetched Incomes:", fetchedIncomes)
    return fetchedIncomes
  } catch (error) {
    console.error("Error fetching incomes:", error)
    return [] // Return empty array on failure
  }
}

export async function fetchIncomeById(id: string) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return null
    }

    const fetchedIncome = await db.income.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    })

    console.log("Fetched Income:", fetchedIncome)
    return fetchedIncome
  } catch (error) {
    console.error("Error fetching income:", error)
    return null // Return null if the income isn't found
  }
}

export async function deleteIncome(id: string) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      throw new Error("You must be logged in to delete income")
    }

    const deletedIncome = await db.income.delete({
      where: {
        id,
        userId: session.user.id,
      },
    })

    revalidatePath("/")
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/income")

    console.log("Deleted Income:", deletedIncome)
    return deletedIncome
  } catch (error) {
    console.error("Error deleting income:", error)
    return {
      error,
    }
  }
}
