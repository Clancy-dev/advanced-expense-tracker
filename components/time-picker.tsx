"use client"

import * as React from "react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { Input } from "@/components/ui/input"

export function TimePickerDemo() {
  const [time, setTime] = React.useState<Date | null>(new Date())

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-[200px] justify-start text-left font-normal", !time && "text-muted-foreground")}
        >
          {time ? format(time, "HH:mm") : <span>Pick a time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <Input
          type="time"
          value={time ? format(time, "HH:mm") : ""}
          onChange={(e) => {
            const [hours, minutes] = e.target.value.split(":")
            const newTime = new Date()
            newTime.setHours(Number.parseInt(hours))
            newTime.setMinutes(Number.parseInt(minutes))
            setTime(newTime)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
