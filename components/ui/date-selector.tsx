"use client"

import * as React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarDays } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/components/ui/utils"

export interface DateSelectorProps {
  date?: DateRange | undefined
  onDateChange?: (date: DateRange | undefined) => void
  className?: string
}

export function DateSelector({ date: controlledDate, onDateChange, className }: DateSelectorProps) {
  const [internalDate, setInternalDate] = React.useState<DateRange | undefined>()
  const isControlled = controlledDate !== undefined || onDateChange !== undefined
  const date = isControlled ? controlledDate : internalDate
  const setDate = isControlled && onDateChange ? onDateChange : setInternalDate

  const startDate = date?.from ? format(date.from, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"
  const endDate = date?.to ? format(date.to, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("justify-start gap-2 text-left font-normal min-w-0 overflow-hidden", className)}
          aria-label="Selecionar período"
        >
          <CalendarDays className="size-4 shrink-0" />
          <span className="truncate flex-1 text-left">
            {startDate} - {endDate}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <Calendar
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={1}
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  )
}
