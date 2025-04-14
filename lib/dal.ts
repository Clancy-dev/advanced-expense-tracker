import "server-only"

import { cookies } from "next/headers"
import { cache } from "react"
import { decrypt } from "./session"
import { redirect } from "next/navigation"
import { db } from "@/prisma/db"

// Define the AuthUser interface to match what we're returning
export interface AuthUser {
  id: string
  name: string
  role: string
  email: string
  imageUrl?: string | null
}

// Define the session data structure
export interface SessionData {
  isAuth: boolean
  userId: string
  data: {
    id: string
    name: string
    role: string
    email: string
  }
}

// Verify the user's session
export const verifySession = cache(async (): Promise<SessionData | null> => {
  try {
    const cookieStore = await cookies()
    const cookie = cookieStore.get("session")?.value

    if (!cookie) {
      return null
    }

    const session = await decrypt(cookie)

    if (!session?.userId) {
      return null
    }

    return {
      isAuth: true,
      userId: session.userId,
      data: {
        id: session.userId,
        name: session.name,
        role: session.role,
        email: session.email,
      },
    }
  } catch (error) {
    console.error("Error verifying session:", error)
    return null
  }
})

// Get the authenticated user
export const getAuthUser = cache(async (): Promise<AuthUser | null> => {
  try {
    const session = await verifySession()

    if (!session) {
      return null
    }

    const id = session.userId

    const user = await db.user.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
        //        role: true, // Removed because 'role' does not exist in the User type
        email: true,
        // imageUrl: true, // Removed because it does not exist in the UserSelect type
      },
    })

    if (!user) {
      return null
    }

    // Construct and return the AuthUser object
    return {
      id,
      name: user.name ?? "Unknown",
      role: "Unknown", // Added a default value for 'role'
      email: user.email,
      // imageUrl: user.imageUrl, // Removed because it does not exist in the User type
    }
  } catch (error) {
    console.error("Failed to fetch user:", error)
    return null
  }
})

// Redirect to login if not authenticated
export const requireAuth = cache(async (): Promise<SessionData> => {
  const session = await verifySession()

  if (!session) {
    redirect("/login")
  }

  return session
})
