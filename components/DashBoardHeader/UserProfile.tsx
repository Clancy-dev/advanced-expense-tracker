"use client"

import { useState } from "react"
import { ChevronDown, User, LogOut } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

import type { UserRole } from "@prisma/client"
import { redirect } from "next/navigation"

export type AuthUser = {
  fullName: string
  role: UserRole
  email: string
  imageUrl: string
}

export function UserProfile({ user }: { user: AuthUser }) {
  const [isOpen, setIsOpen] = useState(false)

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="bg-white ">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger className="flex items-center space-x-2 focus:outline-none bg-white">
          <Avatar>
            <AvatarImage src={user.imageUrl ?? ""} alt={user.fullName} />
            <AvatarFallback>{`${user.fullName.split(" ")[0].charAt(0)}${user.fullName.split(" ")[1]?.charAt(0) ?? ""}`}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-gray-700 hidden sm:inline-block">{user.fullName}</span>
          <div>
            <h2 className="hidden md:block">{user.email}</h2>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white">
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4 " />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

