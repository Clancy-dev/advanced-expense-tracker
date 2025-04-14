"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { Home, DollarSign, CreditCard, PiggyBank, FileText, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const isMobile = useMobile()

  return (
    <div className="flex min-h-screen bg-slate-50">
      {!isMobile ? (
        <Sidebar className="hidden md:flex" />
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden absolute top-4 left-4 z-10">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <Sidebar />
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
}

function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("w-64 border-r bg-white flex flex-col h-full", className)}>
      <div className="p-6">
        <h2 className="text-2xl font-bold">Expense Tracker</h2>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        <NavItem href="/dashboard" icon={<Home className="h-5 w-5" />} label="Dashboard" />
        <NavItem href="/dashboard/income" icon={<DollarSign className="h-5 w-5" />} label="Income" />
        <NavItem href="/dashboard/expenses" icon={<CreditCard className="h-5 w-5" />} label="Expenses" />
        <NavItem href="/dashboard/budget" icon={<PiggyBank className="h-5 w-5" />} label="Budget" />
        <NavItem href="/docs" icon={<FileText className="h-5 w-5" />} label="Docs" />
        <NavItem href="/dashboard/user" icon={<User className="h-5 w-5" />} label="Profile" />
      </nav>
      <div className="p-4 border-t">
        <p className="text-sm text-slate-500">© 2023 Expense Tracker</p>
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: ReactNode
  label: string
}

function NavItem({ href, icon, label }: NavItemProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition-all hover:bg-slate-100"
    >
      {icon}
      {label}
    </Link>
  )
}
