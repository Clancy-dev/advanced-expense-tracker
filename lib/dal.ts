import "server-only"

import { cookies } from "next/headers"
import { cache } from "react"
import { decrypt } from "./session"
import { redirect } from "next/navigation"
import { db } from "@/prisma/db"

// Define the AuthUser interface to match what we're returning
export interface AuthUser {
  id: string
  fullName: string
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
    fullName: string
    role: string
    email: string
  }
}

// Verify the user's session
export const verifySession = cache(async () => {
  try {  
    const cookie = (await cookies()).get('session')?.value
    if (!cookie) {
      console.error("Cookie not found")
    }
    const session = await decrypt(cookie)
    if (!session?.userId) {
      redirect('/login')
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
    console.log("Error verifying session:", error)
  }
})

// Get the authenticated user
export const getAuthUser = cache(async () => {
  try {
    const session = await verifySession()
    if (!session) {
      return null
    }

    const id = String(session.userId)

    const user = await db.user.findUnique({
      where: {
        id
      },
      select: {
        fullName: true,
        role: true,
        email: true,
        imageUrl: true,
      },
    })

    if (!user) {
      console.log("User not found")
    }

    // Construct and return the AuthUser object
    return {
      id,
      fullName: user?.fullName || "",
      role: user?.role || "",
      email: user?.email || "",
      imageUrl: user?.imageUrl || null,
    } as AuthUser
  } catch (error) {
    console.log("Failed to fetch user:", error)
    return null
  }
})




// Redirect to login if not authenticated
export const requireAuth = cache(async () => {
  const session = await verifySession()

  if (!session) {
    redirect("/login")
  }

  return session
})
