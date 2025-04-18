"use client"

import { useState } from "react"
import type React from "react"
import type { Expense } from "@prisma/client"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  Home,
  ShoppingBag,
  CreditCard,
  Car,
  Coffee,
  Calendar,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { formatDistanceToNow, format } from "date-fns"
import { formatCurrency } from "@/lib/utils"
import { motion } from "framer-motion"

interface ExpensesListProps {
  expenses: Expense[]
}

const ITEMS_PER_PAGE = 5

export function ExpensesList({ expenses }: ExpensesListProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const sortedExpenses = [...expenses].sort(
    (a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const totalPages = Math.ceil(sortedExpenses.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentExpenses = sortedExpenses.slice(startIndex, endIndex)

  if (sortedExpenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Calendar className="h-12 w-12 text-slate-300 mb-3" />
        <p className="text-slate-500 mb-2">No expenses recorded yet</p>
        <p className="text-sm text-slate-400">
          Add expenses to see them here
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {currentExpenses.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <ExpenseItem
            icon={getCategoryIcon(item.category)}
            iconColor={getCategoryColor(item.category)}
            title={item.title}
            amount={formatCurrency(item.amount)}
            category={item.category}
            date={new Date(item.date)}
            timestamp={format(new Date(item.date), "h:mm a")}
          />
        </motion.div>
      ))}

      {totalPages > 1 && (
        <Pagination className="pt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                }}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={i + 1 === currentPage}
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentPage(i + 1)
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

interface ExpenseItemProps {
  icon: React.ReactNode
  iconColor: string
  title: string
  amount: string
  category: string
  date: Date
  timestamp: string
}

function ExpenseItem({
  icon,
  iconColor,
  title,
  amount,
  category,
  date,
  timestamp,
}: ExpenseItemProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
      <div className="flex items-center">
        <Avatar className={`h-10 w-10 ${iconColor}`}>
          <AvatarFallback className="text-white">{icon}</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">{title}</p>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200"
            >
              {category}
            </Badge>
            <p className="text-xs text-slate-500">
              {formatDistanceToNow(date, { addSuffix: true })} at {timestamp}
            </p>
          </div>
        </div>
      </div>
      <div className="font-medium text-rose-500">- {amount}</div>
    </div>
  )
}

// Helper functions
function getCategoryIcon(category: string) {
  switch (category) {
    case "Housing":
      return <Home className="h-4 w-4" />
    case "Food":
      return <ShoppingBag className="h-4 w-4" />
    case "Utilities":
      return <CreditCard className="h-4 w-4" />
    case "Transportation":
      return <Car className="h-4 w-4" />
    case "Entertainment":
      return <Coffee className="h-4 w-4" />
    default:
      return <CreditCard className="h-4 w-4" />
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case "Housing":
      return "bg-gradient-to-r from-rose-500 to-pink-400"
    case "Food":
      return "bg-gradient-to-r from-amber-500 to-orange-400"
    case "Utilities":
      return "bg-gradient-to-r from-sky-500 to-blue-400"
    case "Transportation":
      return "bg-gradient-to-r from-violet-500 to-purple-400"
    case "Entertainment":
      return "bg-gradient-to-r from-emerald-500 to-green-400"
    default:
      return "bg-gradient-to-r from-slate-500 to-slate-400"
  }
}
