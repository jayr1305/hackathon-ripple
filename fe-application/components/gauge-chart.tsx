"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface GaugeChartProps {
  title: string
  value: number
  max: number
  unit: string
  color: "blue" | "green" | "red" | "orange"
  highlighted?: boolean
}

export function GaugeChart({ title, value, max, unit, color, highlighted = false }: GaugeChartProps) {
  const percentage = Math.min((value / max) * 100, 100)
  const circumference = 2 * Math.PI * 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const colorClasses = {
    blue: "stroke-blue-500",
    green: "stroke-green-500",
    red: "stroke-red-500",
    orange: "stroke-orange-500",
  }

  const bgColorClasses = {
    blue: "stroke-blue-100",
    green: "stroke-green-100",
    red: "stroke-red-100",
    orange: "stroke-orange-100",
  }

  return (
    <Card className={`hover:shadow-md transition-shadow cursor-pointer ${highlighted ? "ring-2 ring-red-200" : ""}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle cx="50" cy="50" r="45" fill="none" strokeWidth="8" className={bgColorClasses[color]} />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              className={colorClasses[color]}
              style={{
                strokeDasharray,
                strokeDashoffset,
                transition: "stroke-dashoffset 0.5s ease-in-out",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold">{Math.round(value)}</span>
            <span className="text-xs text-muted-foreground">{unit}</span>
          </div>
        </div>
        <div className="text-center mt-2">
          <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}% of target</p>
        </div>
      </CardContent>
    </Card>
  )
}
