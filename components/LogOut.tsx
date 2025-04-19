"use client"
// import { logout } from '@/actions/Auth'
import { LucideLogOut } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import { logout } from '@/actions/auth'
// import { Button } from '../ui/button'

export default function LogOut() {
    async function handleLogOut(){
        await logout()

    }

  return (
    <div>
       <Button onClick={handleLogOut} variant="outline" size="sm">
        <LucideLogOut className="h-4 w-4" />
        Log out
        </Button>
    </div>
  )
}
