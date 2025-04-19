import DashboardLayout from "@/components/DashboardLayout"
import type React from "react"

import { Toaster } from "react-hot-toast"


export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>
    <Toaster />
    {children}
  </DashboardLayout>
}
