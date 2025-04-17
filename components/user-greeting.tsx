"use client"

import { useEffect, useState } from "react"

type Props = {
  fullName?: string
}

const encouragements = [
  "Keep pushing forward!",
  "You’re doing great!",
  "Stay consistent and focused!",
  "Financial freedom is within reach!",
  "Your efforts are paying off!",
  "You’ve got this!",
  "Every step counts!",
  "Stay strong and keep saving!"
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

function getRandomEncouragement() {
  const index = Math.floor(Math.random() * encouragements.length)
  return encouragements[index]
}

export function UserGreeting({ fullName }: Props) {
  const [encouragement, setEncouragement] = useState("")

  useEffect(() => {
    setEncouragement(getRandomEncouragement())
  }, [])

  const firstName = fullName?.split(" ")[0] || "there"
  const greeting = `${getGreeting()}, ${firstName}`

  return (
    <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-4 mb-2">
      <h2 className="text-2xl font-semibold text-purple-800">{greeting}</h2>
      <p className="text-slate-600 mt-1">{encouragement}</p>
    </div>
  )
}
