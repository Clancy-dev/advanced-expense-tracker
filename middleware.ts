import { type NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'
import { decrypt } from "./lib/session"

// 1. Specify protected and public routes
const protectedRoutes = ["/dashboard", "/dashboard/income", "/dashboard/expenses", "/dashboard/budget"]
const publicApiRoutes = ["/api/auth/login", "/api/auth/signup", "/api/auth/logout"]
const publicRoutes = ["/login", "/signup","/"]
const authRoutes = ["/login", "/signup"]

// Test
// const protectedRoutes = [""]
// const publicApiRoutes = [""]
// const publicRoutes = [""]
// const authRoutes = [""]



export default async function middleware(req: NextRequest) {

  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)
  const isAuthRoute = authRoutes.includes(path)

  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  // 5. Redirect to /dashboard if the user is authenticated
  if (isAuthRoute && 
    session?.userId &&
    !req.nextUrl.pathname.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }

  return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
