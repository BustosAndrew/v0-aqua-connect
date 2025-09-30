"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

const incomeData = [
  { date: "Jan 1", daily: 4200, weekly: 28500, monthly: 125000 },
  { date: "Jan 8", daily: 3800, weekly: 31200, monthly: 128000 },
  { date: "Jan 15", daily: 4500, weekly: 29800, monthly: 132000 },
  { date: "Jan 22", daily: 5200, weekly: 35600, monthly: 138000 },
  { date: "Jan 29", daily: 4800, weekly: 33400, monthly: 142000 },
  { date: "Feb 5", daily: 5500, weekly: 38200, monthly: 148000 },
  { date: "Feb 12", daily: 4900, weekly: 34800, monthly: 145000 },
  { date: "Feb 19", daily: 6200, weekly: 41500, monthly: 155000 },
]

const chartConfig = {
  daily: {
    label: "Daily Income",
    color: "hsl(var(--chart-1))",
  },
  weekly: {
    label: "Weekly Income",
    color: "hsl(var(--chart-2))",
  },
  monthly: {
    label: "Monthly Income",
    color: "hsl(var(--chart-3))",
  },
}

interface IncomeTrendsChartProps {
  timeframe: "daily" | "weekly" | "monthly"
}

export function IncomeTrendsChart({ timeframe = "daily" }: IncomeTrendsChartProps) {
  const currentValue = incomeData[incomeData.length - 1][timeframe]
  const previousValue = incomeData[incomeData.length - 2][timeframe]
  const change = ((currentValue - previousValue) / previousValue) * 100
  const isPositive = change > 0

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Income Trends</CardTitle>
          <div className={`flex items-center gap-2 ${isPositive ? "text-green-400" : "text-red-400"}`}>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span className="text-sm">
              {isPositive ? "+" : ""}
              {change.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold text-white">S/ {currentValue.toLocaleString()}</p>
          <p className="text-sm text-slate-400 capitalize">{timeframe} Income</p>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={incomeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickFormatter={(value) => `S/ ${(value / 1000).toFixed(0)}k`}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => [`S/ ${value.toLocaleString()}`, ""]}
              />
              <Line
                type="monotone"
                dataKey={timeframe}
                stroke={`var(--color-${timeframe})`}
                strokeWidth={3}
                dot={{ fill: `var(--color-${timeframe})`, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: `var(--color-${timeframe})`, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
