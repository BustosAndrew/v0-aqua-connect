"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Fish, TrendingUp } from "lucide-react"

const catchData = [
  { date: "Week 1", anchoveta: 1200, bonito: 800, jurel: 600, mackerel: 400 },
  { date: "Week 2", anchoveta: 1500, bonito: 950, jurel: 750, mackerel: 520 },
  { date: "Week 3", anchoveta: 1100, bonito: 720, jurel: 680, mackerel: 380 },
  { date: "Week 4", anchoveta: 1800, bonito: 1200, jurel: 900, mackerel: 650 },
  { date: "Week 5", anchoveta: 1650, bonito: 1100, jurel: 850, mackerel: 600 },
  { date: "Week 6", anchoveta: 2000, bonito: 1350, jurel: 1000, mackerel: 750 },
  { date: "Week 7", anchoveta: 1750, bonito: 1180, jurel: 920, mackerel: 680 },
  { date: "Week 8", anchoveta: 2200, bonito: 1450, jurel: 1100, mackerel: 800 },
]

const chartConfig = {
  anchoveta: {
    label: "Anchoveta",
    color: "hsl(var(--chart-1))",
  },
  bonito: {
    label: "Bonito",
    color: "hsl(var(--chart-2))",
  },
  jurel: {
    label: "Jurel",
    color: "hsl(var(--chart-3))",
  },
  mackerel: {
    label: "Mackerel",
    color: "hsl(var(--chart-4))",
  },
}

interface CatchTrendsChartProps {
  chartType?: "line" | "area"
}

export function CatchTrendsChart({ chartType = "line" }: CatchTrendsChartProps) {
  const totalCatch = catchData[catchData.length - 1]
  const currentTotal = Object.values(totalCatch)
    .slice(1)
    .reduce((sum, val) => sum + (val as number), 0)

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Fish className="h-5 w-5 text-blue-400" />
            Catch Volume Trends by Species
          </CardTitle>
          <div className="flex items-center gap-2 text-green-400">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">+15.2% this week</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold text-white">{currentTotal.toLocaleString()} kg</p>
          <p className="text-sm text-slate-400">Total Weekly Catch</p>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" ? (
              <AreaChart data={catchData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [`${value.toLocaleString()} kg`, ""]}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                  type="monotone"
                  dataKey="anchoveta"
                  stackId="1"
                  stroke="var(--color-anchoveta)"
                  fill="var(--color-anchoveta)"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="bonito"
                  stackId="1"
                  stroke="var(--color-bonito)"
                  fill="var(--color-bonito)"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="jurel"
                  stackId="1"
                  stroke="var(--color-jurel)"
                  fill="var(--color-jurel)"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="mackerel"
                  stackId="1"
                  stroke="var(--color-mackerel)"
                  fill="var(--color-mackerel)"
                  fillOpacity={0.6}
                />
              </AreaChart>
            ) : (
              <LineChart data={catchData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [`${value.toLocaleString()} kg`, ""]}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  type="monotone"
                  dataKey="anchoveta"
                  stroke="var(--color-anchoveta)"
                  strokeWidth={3}
                  dot={{ fill: "var(--color-anchoveta)", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="bonito"
                  stroke="var(--color-bonito)"
                  strokeWidth={3}
                  dot={{ fill: "var(--color-bonito)", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="jurel"
                  stroke="var(--color-jurel)"
                  strokeWidth={3}
                  dot={{ fill: "var(--color-jurel)", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="mackerel"
                  stroke="var(--color-mackerel)"
                  strokeWidth={3}
                  dot={{ fill: "var(--color-mackerel)", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
