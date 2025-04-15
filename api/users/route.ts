import { db } from "@/prisma/db"
import { revalidatePath } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"
import { createSession } from "@/lib/session"
import { hashSync } from "bcrypt-ts"

export async function POST(request: NextRequest) {
  try {
    
    const { fullName, email, password } = await request.json()

    if (!fullName || !email || !password) {
      return NextResponse.json(
        {
          data: null,
          error: "Missing required fields",
        },
        {
          status: 400,
        },
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findFirst({
      where: {
        email,
      },
    })

    if (existingUser) {
      return NextResponse.json(
        {
          data: null,
          error: "Email Already Exists",
        },
        {
          status: 409,
        },
      )
    }

    // Hash the password
    const hashedPassword = hashSync(password, 10)

    // Create the data object with name instead of fullName to match our schema
    const data = {
      fullName, // Changed from fullName to name to match our schema
      email,
      password: hashedPassword,
    }

    // Save new user to db
    const newUser = await db.user.create({
      data,
    })
    console.log(newUser)

    // Create session
    await createSession(newUser)

    // Remove sensitive data before returning
    const { password: returnedPassword,token,...others } = newUser

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
    console.error("Registration error:", error)

    // Return a proper error response
    return NextResponse.json(
      {
        data: null,
        error: "An error occurred during registration or signing up",
      },
      {
        status: 500,
      },
    )
  }
}
