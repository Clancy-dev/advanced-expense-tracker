

import { getAuthUser } from "@/lib/dal"
import { redirect } from "next/navigation"
import type React from "react"
import { DashboardHeader } from "./DashBoardHeader/DashBoardHeader"
import SideBar from "./DashBoardSideBar/SideBar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getAuthUser()
  if (!user) {
    redirect("/login")
  }
  return (
    <div className="w-full min-h-screen bg-gray-100">
      <DashboardHeader user={user} />
      <div className="w-full flex bg-white h-full ">
        <SideBar />
        <div className="lg:w-[90%] md:w-[90%] sm:w-[100%] w-[100%] min-h-[90vh] bg-gray-200 p-6 mt-16">{children}</div>
      </div>
    </div>
  )
}

