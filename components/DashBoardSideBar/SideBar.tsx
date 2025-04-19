"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home, DollarSign, CreditCard, PiggyBank, FileText, User, Settings, ChevronRight, X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import LogOut from "../LogOut"
import { motion, AnimatePresence } from "framer-motion"

const menuItems = [
  { title: "Dashboard", icon: Home, href: "/dashboard" },
  { title: "Income", icon: DollarSign, href: "/dashboard/income" },
  { title: "Expenses", icon: CreditCard, href: "/dashboard/expenses" },
  { title: "Budget", icon: PiggyBank, href: "/dashboard/budget" },
  { title: "Docs", icon: FileText, href: "/dashboard/docs" },
  { title: "Profile", icon: User, href: "/dashboard/user" },
]

export default function SideBar({ isMobile = false, onClose }: { isMobile?: boolean, onClose?: () => void }) {
  const pathname = usePathname()

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-white shadow-lg">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        {isMobile && onClose && (
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      <div className="p-4 flex-1">
        <nav className="space-y-2">
          <div className="py-2">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Main Menu</p>
            <div className="mt-3 space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between py-2 px-3 rounded-lg text-sm font-medium transition-colors",
                      isActive ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                    )}
                    onClick={onClose}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </div>
                    {isActive && <ChevronRight className="h-4 w-4" />}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="py-2">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Settings</p>
            <div className="mt-3">
              <Link
                href="/dashboard/settings"
                className={cn(
                  "flex items-center justify-between py-2 px-3 rounded-lg text-sm font-medium transition-colors",
                  pathname === "/dashboard/settings"
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
                onClick={onClose}
              >
                <div className="flex items-center gap-3">
                  <Settings className="h-4 w-4" />
                  Settings
                </div>
                {pathname === "/dashboard/settings" && <ChevronRight className="h-4 w-4" />}
              </Link>
            </div>
            <div className="mt-3 text-xs font-semibold text-gray-500 w-full min-h-8">
              <LogOut />
            </div>
          </div>
        </nav>
      </div>
    </div>
  )

  if (!isMobile) {
    return (
      <div className="w-[20rem] bg-white min-h-[85vh] hidden lg:block md:block border-r">
        <SidebarContent />
      </div>
    )
  }

  return (
    <AnimatePresence>
      <motion.aside
        className="fixed left-0 top-0 bottom-0 w-[20rem] bg-white shadow-lg z-50 sm:hidden"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <SidebarContent />
      </motion.aside>
    </AnimatePresence>
  )
}
