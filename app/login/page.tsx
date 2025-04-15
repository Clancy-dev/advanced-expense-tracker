"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import LoginForm from "@/components/Forms/Auth/LoginForm"


export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
     <LoginForm/>
    </div>
  )
}
