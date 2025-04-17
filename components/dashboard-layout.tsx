"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { Home, DollarSign, CreditCard, PiggyBank, FileText, User, Menu, LogOut, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import { logout } from "@/actions/auth"
// import type { AuthUser } from "@/lib/dal"
import { usePathname } from "next/navigation"
import { AuthUser } from "@/lib/dal"
import { Header } from "@radix-ui/react-accordion"


interface DashboardLayoutProps {
  children: ReactNode
  user?: AuthUser | null
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const isMobile = useMobile()
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {!isMobile ? (
        <Sidebar className="hidden md:flex" user={user} pathname={pathname} />
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden absolute top-4 left-4 z-10">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <Sidebar user={user} pathname={pathname} />
          </SheetContent>
        </Sheet>
      )}

      <div className="flex-1">
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}

interface SidebarProps {
  className?: string
  user?: AuthUser | null
  pathname?: string
}

function Sidebar({ className, user, pathname = "" }: SidebarProps) {
  return (
    <div className={cn("w-64 bg-white shadow-md flex flex-col h-full", className)}>
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          Expense Tracker
        </h2>
        {user && (
          <div className="mt-4 flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-400 flex items-center justify-center text-white font-medium">
              {user.fullName.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user.fullName}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
        )}
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        <NavItem
          href="/dashboard"
          icon={<Home className="h-5 w-5" />}
          label="Dashboard"
          active={pathname === "/dashboard"}
        />
        <NavItem
          href="/dashboard/income"
          icon={<DollarSign className="h-5 w-5" />}
          label="Income"
          active={pathname.includes("/dashboard/income")}
        />
        <NavItem
          href="/dashboard/expenses"
          icon={<CreditCard className="h-5 w-5" />}
          label="Expenses"
          active={pathname.includes("/dashboard/expenses")}
        />
        <NavItem
          href="/dashboard/budget"
          icon={<PiggyBank className="h-5 w-5" />}
          label="Budget"
          active={pathname.includes("/dashboard/budget")}
        />
        <NavItem href="/dashboard/docs" icon={<FileText className="h-5 w-5" />} label="Reports" active={pathname === "/docs"} />
        <NavItem
          href="/dashboard/user"
          icon={<User className="h-5 w-5" />}
          label="Profile"
          active={pathname === "/dashboard/user"}
        />
      </nav>
      <div className="p-4 border-t border-slate-100">
        <form action={logout}>
          <Button
            variant="ghost"
            className="w-full flex items-center justify-start text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
        </form>
        <p className="text-xs text-center text-slate-400 mt-4">© 2025 Expense Tracker</p>
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: ReactNode
  label: string
  active?: boolean
}

function NavItem({ href, icon, label, active = false }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between rounded-lg px-3 py-2 transition-colors",
        active
          ? "bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 font-medium"
          : "text-slate-600 hover:bg-slate-50",
      )}
    >
      <div className="flex items-center">
        <div className={cn("mr-3", active ? "text-purple-500" : "text-slate-400")}>{icon}</div>
        {label}
      </div>
      {active && <ChevronRight className="h-4 w-4 text-purple-400" />}
    </Link>
  )
}
