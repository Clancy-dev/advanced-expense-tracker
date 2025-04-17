"use client"

import { useState } from "react"
import type React from "react"
import type { Income } from "@prisma/client"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  Briefcase,
  DollarSign,
  Gift,
  Laptop,
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

interface IncomeListProps {
  incomes: Income[]
}

const ITEMS_PER_PAGE = 5

export function IncomeList({ incomes }: IncomeListProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const sortedIncome = [...incomes].sort(
    (a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const totalPages = Math.ceil(sortedIncome.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentIncomes = sortedIncome.slice(startIndex, endIndex)

  if (sortedIncome.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Calendar className="h-12 w-12 text-slate-300 mb-3" />
        <p className="text-slate-500 mb-2">No income recorded yet</p>
        <p className="text-sm text-slate-400">
          Add income to see it here
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {currentIncomes.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <IncomeItem
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
            {/* TEST */}

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

interface IncomeItemProps {
  icon: React.ReactNode
  iconColor: string
  title: string
  amount: string
  category: string
  date: Date
  timestamp: string
}

function IncomeItem({
  icon,
  iconColor,
  title,
  amount,
  category,
  date,
  timestamp,
}: IncomeItemProps) {
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
              className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
            >
              {category}
            </Badge>
            <p className="text-xs text-slate-500">
              {formatDistanceToNow(date, { addSuffix: true })} at {timestamp}
            </p>
          </div>
        </div>
      </div>
      <div className="font-medium text-emerald-500">+ {amount}</div>
    </div>
  )
}

// Helper functions
function getCategoryIcon(category: string) {
  switch (category) {
    case "Employment":
      return <Briefcase className="h-4 w-4" />
    case "Freelance":
      return <Laptop className="h-4 w-4" />
    case "Gift":
      return <Gift className="h-4 w-4" />
    default:
      return <DollarSign className="h-4 w-4" />
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case "Employment":
      return "bg-gradient-to-r from-emerald-500 to-green-400"
    case "Freelance":
      return "bg-gradient-to-r from-sky-500 to-blue-400"
    case "Gift":
      return "bg-gradient-to-r from-violet-500 to-purple-400"
    case "Investment":
      return "bg-gradient-to-r from-amber-500 to-yellow-400"
    default:
      return "bg-gradient-to-r from-slate-500 to-slate-400"
  }
}
