"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ChartContainerProps {
  children: ReactNode
  config: any
  className?: string
}

export function ChartContainer({ children, config: _config, className }: ChartContainerProps) {
  return <div className={cn("w-full h-full", className)}>{children}</div>
}

interface ChartTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
  className?: string
}

export function ChartTooltip({ active, payload, label, className }: ChartTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className={cn("bg-background border border-border rounded-lg shadow-md p-2", className)}>
      <p className="text-sm font-medium">{label}</p>
      {payload.map((entry: any, index: number) => (
        <p key={index} className="text-sm text-muted-foreground">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  )
}

export const ChartLegend = () => null
export const ChartStyle = () => null
