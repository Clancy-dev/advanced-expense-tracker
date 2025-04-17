
import "server-only"

import { cookies } from "next/headers"
import { cache } from "react"
import { decrypt } from "./session"
import { redirect } from "next/navigation"
import { db } from "@/prisma/db"
import { UserRole } from "@prisma/client"

export type SessionData = {
  isAuth: true
  userId: string
  data: {
    id: string
    fullName: string
    role: string
    email: string
  }
}

// Define the AuthUser interface to match what we're returning
export type AuthUser = {
  id: string
  fullName: string
  role: UserRole
  email: string
  imageUrl: string | null
}


// Verify the user's session
export const verifySession = cache(async (): Promise<SessionData> => { 
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie) as { userId?: string; fullName?: string; role?: string; email?: string }
    if (!session?.userId) {
      redirect('/login')
    }

    return {
      isAuth: true,
      userId: session.userId as string,
      data: {
        id: session.userId as string,
        fullName: session.fullName as string,
        role: session.role as string,
        email: session.email as string,
      },
    }
  } )

// Get the authenticated user
export const getAuthUser = cache(async () => {
    const session = await verifySession()
    if (!session) {
      return null
    }

    const id = session.userId as string
   try{
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

    // Construct and return the AuthUser object
    return user as AuthUser
  } catch (error) {
    console.log("Failed to fetch user:", error)
    return null
  }
})



