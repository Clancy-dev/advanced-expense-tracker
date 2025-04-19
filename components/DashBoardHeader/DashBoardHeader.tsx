"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Search } from "lucide-react"
import { UserProfile } from "./UserProfile"
import { ResponsiveMenu } from "./ResponsiveMenu"
import type { AuthUser } from "@/lib/dal"

export function DashboardHeader({ user }: { user: AuthUser }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen)

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMenuOpen])

  return (
    <header className="bg-white z-50 w-full h-16 lg:h-20 fixed">
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          <Image src="/expense-logo.png" alt="Logo" width={85} height={40} className="rounded-full" />
          <div className="hidden md:flex items-center space-x-4 flex-1 justify-center">
            <div className="relative w-full max-w-xl">
              <input
                type="text"
                placeholder="Search..."
                className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={toggleSearch} className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none">
              <Search className="h-6 w-6" />
            </button>
            <UserProfile user={{ ...user, imageUrl: user.imageUrl ?? "" }} />
            <motion.button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-gray-700 focus:outline-none sm:hidden"
              whileTap={{ scale: 0.97 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isMenuOpen ? "close" : "menu"}
                  initial={{ rotate: 0 }}
                  animate={{ rotate: isMenuOpen ? 180 : 0 }}
                  exit={{ rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute left-0 right-0 bg-white p-4 shadow-md"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ResponsiveMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  )
}
