"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface TrendChartProps {
  data: any[]
}

export function TrendChart({ data }: TrendChartProps) {
  // Transform data for the chart
  const chartData = data.map((item, index) => ({
    name: item.Blocks,
    "Mar 2024": item["Achievement (Mar, 24) "],
    "Mar 2025": item["Achievement (Mar, 25) "],
    district: item.District,
  }))

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="name" className="text-xs" tick={{ fontSize: 12 }} />
          <YAxis className="text-xs" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="Mar 2024"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--muted-foreground))", strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="Mar 2025"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
