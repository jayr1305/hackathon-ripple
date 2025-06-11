"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface DistributionChartProps {
  data: any[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function DistributionChart({ data }: DistributionChartProps) {
  // Group data by district and calculate averages
  const districtData = data.reduce(
    (acc, item) => {
      const district = item.District
      if (!acc[district]) {
        acc[district] = {
          name: district,
          value: 0,
          count: 0,
        }
      }
      acc[district].value += item["Achievement (Mar, 25) "]
      acc[district].count += 1
      return acc
    },
    {} as Record<string, { name: string; value: number; count: number }>,
  )

  const chartData = Object.values(districtData).map((district) => ({
    name: district.name,
    value: Math.round(district.value / district.count),
    count: district.count,
  }))

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="value">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string, props: any) => [`${value}%`, `Avg Achievement`]}
            labelFormatter={(label: string) => `District: ${label}`}
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
