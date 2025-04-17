"use client"

import { useState } from "react"
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  CreditCard,
  DollarSign,
  Home,
  ShoppingBag,
  Briefcase,
  Laptop,
  Calendar,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { formatCurrency } from "@/lib/utils"
import type { Income, Expense } from "@prisma/client"
import { motion } from "framer-motion"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface RecentTransactionsProps {
  incomes: Income[]
  expenses: Expense[]
}

const ITEMS_PER_PAGE = 5

export function RecentTransactions({ incomes, expenses }: RecentTransactionsProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const transactions = [
    ...incomes.map((item) => ({
      ...item,
      type: "income" as const,
    })),
    ...expenses.map((item) => ({
      ...item,
      type: "expense" as const,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE)
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const getCategoryIcon = (category: string, type: "income" | "expense") => {
    if (type === "income") {
      if (category === "Employment") return <Briefcase className="h-4 w-4" />
      if (category === "Freelance") return <Laptop className="h-4 w-4" />
      return <DollarSign className="h-4 w-4" />
    } else {
      if (category === "Housing") return <Home className="h-4 w-4" />
      if (category === "Food") return <ShoppingBag className="h-4 w-4" />
      if (category === "Utilities") return <CreditCard className="h-4 w-4" />
      return <CreditCard className="h-4 w-4" />
    }
  }

  const getCategoryColor = (type: "income" | "expense") => {
    return type === "income"
      ? "bg-gradient-to-r from-emerald-500 to-green-400"
      : "bg-gradient-to-r from-rose-500 to-pink-400"
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Calendar className="h-12 w-12 text-slate-300 mb-3" />
        <p className="text-slate-500 mb-2">No transactions yet</p>
        <p className="text-sm text-slate-400">
          Add income or expenses to see them here
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {paginatedTransactions.map((transaction, index) => (
        <motion.div
          key={transaction.id}
          className="flex items-center p-3 rounded-lg hover:bg-slate-50 transition-colors"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Avatar className={`h-10 w-10 ${getCategoryColor(transaction.type)}`}>
            <AvatarFallback className="text-white">
              {getCategoryIcon(transaction.category, transaction.type)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1 flex-1 min-w-0">
            <p className="text-sm font-medium leading-none truncate">
              {transaction.title}
            </p>
            <div className="flex items-center text-xs text-slate-500">
              <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 mr-2">
                {transaction.category}
              </span>
              <span>
                {formatDistanceToNow(new Date(transaction.date), { addSuffix: true })}
              </span>
            </div>
          </div>
          <div
            className={`font-medium ${
              transaction.type === "income" ? "text-emerald-500" : "text-rose-500"
            }`}
          >
            {transaction.type === "income" ? "+" : "-"}{" "}
            {formatCurrency(transaction.amount)}
          </div>
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
