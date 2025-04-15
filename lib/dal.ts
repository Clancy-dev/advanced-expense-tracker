import "server-only"

import { cookies } from "next/headers"
import { cache } from "react"
import { decrypt } from "./session"
import { redirect } from "next/navigation"
import { db } from "@/prisma/db"
import { UserRole } from "@prisma/client"

// Define the AuthUser interface to match what we're returning
type AuthUser = {
  id: string
  fullName: string
  role: UserRole
  email: string
  imageUrl: string | null
}


// Verify the user's session
export const verifySession = cache(async () => { 
    const cookie = (await cookies()).get('session')?.value
    if (!cookie) {
      console.log("Cookie not found")
    }
    const session = await decrypt(cookie)
    if (!session?.userId) {
      redirect('/login')
    }

    return {
      isAuth: true,
      userId: session.userId,
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

    const id = String(session.userId)
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

    if (!user) {
      console.log("User not found")
    }

    // Construct and return the AuthUser object
    return user as AuthUser
  } catch (error) {
    console.log("Failed to fetch user:", error)
    return null
  }
})



