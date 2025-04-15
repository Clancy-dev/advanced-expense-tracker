import { db } from "@/prisma/db"
import { revalidatePath } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"
import { createSession } from "@/lib/session"
import { compareSync } from "bcrypt-ts"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Find user by email
    const existingUser = await db.user.findFirst({
      where: {
        email,
      },
    })

    if (!existingUser) {
      return NextResponse.json(
        {
          data: null,
          error: "Wrong Credentials",
        },
        {
          status: 403,
        },
      )
    }

    // Verify password
    let isCorrect = false
    isCorrect = compareSync(password, existingUser.password)

    if (!isCorrect) {
      return NextResponse.json(
        {
          data: null,
          error: "Wrong Credentials",
        },
        {
          status: 403,
        },
      )
    }

    // Create session
    await createSession(existingUser)

    // Remove sensitive data before returning
    const { password:returnedPassword,token,...others } = existingUser

    revalidatePath("/dashboard")

    return NextResponse.json(
      {
        data: others,
        error: null,
      },
      {
        status: 201,
      },
    )
  } catch (error) {
    console.error("Login error:", error)

    // Return a proper error response
    return NextResponse.json(
      {
        data: null,
        error: "An error occurred during login",
      },
      {
        status: 500,
      },
    )
  }
}
