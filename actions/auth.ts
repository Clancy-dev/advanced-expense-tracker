"use server"

import { db } from "@/prisma/db"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { signIn } from "@/lib/auth"
import { redirect } from "next/navigation"
import { deleteSession } from "@/lib/session"

export async function register(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (!name || !email || !password || !confirmPassword) {
      return { error: "All fields are required" }
    }

    if (password !== confirmPassword) {
      return { error: "Passwords do not match" }
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "User with this email already exists" }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    revalidatePath("/login")

    // Sign in the user
    await signIn("credentials", { email, password, redirect: false })

    redirect("/dashboard")
  } catch (error) {
    console.error("Registration error:", error)
    return { error: "Something went wrong. Please try again." }
  }
}

export async function login(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      return { error: "Email and password are required" }
    }

    const result = await signIn("credentials", { email, password, redirect: false })

    if (result?.error) {
      return { error: "Invalid credentials" }
    }

    redirect("/dashboard")
  } catch (error) {
    console.error("Login error:", error)
    return { error: "Something went wrong. Please try again." }
  }
}

export async function logout() {
  deleteSession()
  redirect("/login")
}
