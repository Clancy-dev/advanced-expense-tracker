"use server"
import { deleteSession } from '@/lib/session'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
 
export async function logout() {
  deleteSession()
  redirect('/login')
}