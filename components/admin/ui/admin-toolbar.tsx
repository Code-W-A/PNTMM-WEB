import { Search } from "lucide-react"
import type { ReactNode } from "react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

/**
 * Bara de deasupra tabelelor: căutare și filtre la stânga, export și acțiunea
 * principală la dreapta.
 */
export function AdminToolbar({
  children,
  actions,
  className,
}: {
  children?: ReactNode
  actions?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        {children}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  )
}

export function AdminSearchInput({
  value,
  onValueChange,
  placeholder = "Caută...",
  label,
}: {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  label: string
}) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="h-9 pl-9"
      />
    </div>
  )
}

export interface FilterOption {
  value: string
  label: string
}

export function AdminFilterSelect({
  value,
  onValueChange,
  options,
  label,
}: {
  value: string
  onValueChange: (value: string) => void
  options: FilterOption[]
  label: string
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-9 w-full sm:w-[180px]" aria-label={label}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/** Numărul de rezultate afișate, pentru context după filtrare. */
export function ResultCount({
  filtered,
  total,
  noun,
}: {
  filtered: number
  total: number
  noun: string
}) {
  if (filtered === total) return null

  return (
    <p className="text-sm text-muted-foreground" role="status">
      {filtered} din {total} {noun}
    </p>
  )
}
