import "server-only"
import { SignJWT, jwtVerify } from "jose"
import type { User } from "@prisma/client"
import { cookies } from "next/headers"

// Define the session payload type with proper types
export type SessionPayloadProps = {
  userId: string
  role: string
  email: string
  name: string
  expiresAt: string // Changed from Date to string for JSON compatibility
}

// SECRET
const getSecret = () => {
  const secretKey = process.env.SECRET_KEY || "your-secret-key-at-least-32-characters"
  return new TextEncoder().encode(secretKey)
}

// ENCRYPTING THE PAYLOAD DATA INTO A TOKEN
export async function encrypt(payload: SessionPayloadProps): Promise<string> {
  try {
    return await new SignJWT(payload as any)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(getSecret())
  } catch (error) {
    console.error("Error encrypting session:", error)
    throw new Error("Failed to create session token")
  }
}

// DECRYPTING THE TOKEN TO GET BACK OUR PAYLOAD DATA
export async function decrypt(session: string | undefined = ""): Promise<SessionPayloadProps | null> {
  if (!session) return null

  try {
    const { payload } = await jwtVerify(session, getSecret(), {
      algorithms: ["HS256"],
    })
    return payload as unknown as SessionPayloadProps
  } catch (error) {
    console.error("Failed to verify session:", error)
    return null
  }
}

export async function createSession(user: User): Promise<boolean> {
  try {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    const payloadData: SessionPayloadProps = {
      userId: user.id,
      role: "user", // Default role assigned since 'role' is not present in the User type
      email: user.email,
      name: user.name ?? "Unknown User",
      expiresAt: expiresAt.toISOString(), // Convert Date to ISO string
    }

    const session = await encrypt(payloadData)
    const cookieStore = await cookies()

    cookieStore.set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expiresAt,
      sameSite: "lax",
      path: "/",
    })

    return true
  } catch (error) {
    console.error("Error creating session:", error)
    return false
  }
}

// Prevent someone logging in after use everytime, auto check and update the session time
export async function updateSession(): Promise<SessionPayloadProps | null> {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")?.value

    if (!session) return null

    const payload = await decrypt(session)

    if (!payload) return null

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    cookieStore.set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expires,
      sameSite: "lax",
      path: "/",
    })

    return payload
  } catch (error) {
    console.error("Error updating session:", error)
    return null
  }
}

export async function deleteSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("session")
    return true
  } catch (error) {
    console.error("Error deleting session:", error)
    return false
  }
}
