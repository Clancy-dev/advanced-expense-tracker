import "server-only"
import { SignJWT, jwtVerify } from "jose"
import type { User, UserRole } from "@prisma/client"
import { cookies } from "next/headers"

// Define the session payload type with proper types
export type SessionPayloadProps = {
  userId: string
  role: UserRole
  email: string
  fullName: string
  expiresAt: Date;
}

// SECRET
  const secretKey = new TextEncoder().encode(process.env.SECRET_KEY) 
  if (!secretKey) {
    throw new Error('SECRET_KEY is not defined in the environment variables.');
  }


// ENCRYPTING THE PAYLOAD DATA INTO A TOKEN
export async function encrypt(payload: SessionPayloadProps) {
  try {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secretKey)
  } catch (error) {
    console.log("Error encrypting session:", error)
    throw new Error("Failed to create session token")
  }
}

// DECRYPTING THE TOKEN TO GET BACK OUR PAYLOAD DATA
export async function decrypt(session: string | undefined = ""){
  if (!session) return null

  try {
    const { payload } = await jwtVerify(session, secretKey, {
      algorithms: ["HS256"],
    })
    return payload 
  } catch (error) {
    console.log("Failed to verify session:", error)
    
  }
}

export async function createSession(user: User){
  try {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    const payloadData = {
      userId: user.id,
      role: user.role,
      email: user.email,
      fullName: user.fullName,
      expiresAt: expiresAt,
    }

    const session = await encrypt(payloadData)
    const cookieStore = await cookies()

    cookieStore.set("session", session, {
      httpOnly: true,
      secure: true,
      expires: expiresAt,
      sameSite: "lax",
      path: "/",
    })

  } catch (error) {
    console.log("Error creating session:", error)
    
  }
}

// Prevent someone logging in after use everytime, auto check and update the session time
export async function updateSession(){
  try {
    const session = (await cookies()).get('session')?.value
    if (!session) return null
    const payload = await decrypt(session)
    if (!payload) return null
    // Extend time from now
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    const cookieStore = await cookies()
    cookieStore.set("session", session, {
      httpOnly: true,
      secure: true,
      expires: expires,
      sameSite: "lax",
      path: "/",
    })

  } catch (error) {
    console.log("Error updating session:", error)
    
  }
}

export async function deleteSession() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("session")
  } catch (error) {
    console.log("Error deleting session:", error)
  }
}
