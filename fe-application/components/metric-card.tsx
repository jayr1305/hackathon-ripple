"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string
  change?: number
  description: string
  icon: LucideIcon
}

export function MetricCard({ title, value, change, description, icon: Icon }: MetricCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground">{description}</p>
          {change !== undefined && (
            <Badge variant={change >= 0 ? "default" : "destructive"} className="text-xs">
              {change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {Math.abs(change).toFixed(1)}%
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
