"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Thermometer, Waves, Wind } from "lucide-react"

const weatherData = [
  { time: "00:00", temperature: 18, waveHeight: 1.2, windSpeed: 12 },
  { time: "04:00", temperature: 17, waveHeight: 1.4, windSpeed: 15 },
  { time: "08:00", temperature: 19, waveHeight: 1.8, windSpeed: 18 },
  { time: "12:00", temperature: 22, waveHeight: 2.1, windSpeed: 22 },
  { time: "16:00", temperature: 24, waveHeight: 2.3, windSpeed: 20 },
  { time: "20:00", temperature: 21, waveHeight: 1.9, windSpeed: 16 },
  { time: "24:00", temperature: 19, waveHeight: 1.5, windSpeed: 14 },
]

const chartConfig = {
  temperature: {
    label: "Temperature (°C)",
    color: "hsl(var(--chart-1))",
  },
  waveHeight: {
    label: "Wave Height (m)",
    color: "hsl(var(--chart-2))",
  },
  windSpeed: {
    label: "Wind Speed (km/h)",
    color: "hsl(var(--chart-3))",
  },
}

export function WeatherTrendsChart() {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-blue-400" />
          Weather Conditions - 24 Hour Forecast
        </CardTitle>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-orange-400" />
            <div>
              <p className="text-sm text-slate-400">Temperature</p>
              <p className="text-lg font-semibold text-white">22°C</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Waves className="h-4 w-4 text-blue-400" />
            <div>
              <p className="text-sm text-slate-400">Wave Height</p>
              <p className="text-lg font-semibold text-white">2.1m</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-green-400" />
            <div>
              <p className="text-sm text-slate-400">Wind Speed</p>
              <p className="text-lg font-semibold text-white">22 km/h</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weatherData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="var(--color-temperature)"
                strokeWidth={2}
                dot={{ fill: "var(--color-temperature)", strokeWidth: 2, r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="waveHeight"
                stroke="var(--color-waveHeight)"
                strokeWidth={2}
                dot={{ fill: "var(--color-waveHeight)", strokeWidth: 2, r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="windSpeed"
                stroke="var(--color-windSpeed)"
                strokeWidth={2}
                dot={{ fill: "var(--color-windSpeed)", strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
