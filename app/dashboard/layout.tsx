import type React from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Toaster } from "react-hot-toast"


export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>
    <Toaster />
    {children}
  </DashboardLayout>
}
