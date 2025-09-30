"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"

const anchovetaData = [
  { day: "Mon", price: 12.2 },
  { day: "Tue", price: 12.4 },
  { day: "Wed", price: 12.6 },
  { day: "Thu", price: 12.8 },
  { day: "Fri", price: 13.0 },
  { day: "Sat", price: 12.7 },
  { day: "Sun", price: 12.5 },
]

const mackerelData = [
  { day: "Mon", price: 8.9 },
  { day: "Tue", price: 8.8 },
  { day: "Wed", price: 8.7 },
  { day: "Thu", price: 8.75 },
  { day: "Fri", price: 8.8 },
  { day: "Sat", price: 8.7 },
  { day: "Sun", price: 8.75 },
]

export function PriceForecastCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Anchoveta Price Forecast */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white text-base">Anchoveta Price Forecast</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">S/ 12.50/kg</span>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>+5%</span>
            </div>
          </div>
          <p className="text-sm text-slate-400">Next 7 Days</p>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={anchovetaData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "6px",
                  }}
                  labelStyle={{ color: "#f1f5f9" }}
                  itemStyle={{ color: "#3b82f6" }}
                  formatter={(value: number) => [`S/ ${value.toFixed(2)}/kg`, "Price"]}
                />
                <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Mackerel Price Forecast */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white text-base">Mackerel Price Forecast</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">S/ 8.75/kg</span>
            <div className="flex items-center gap-1 text-red-400 text-sm">
              <TrendingDown className="h-4 w-4" />
              <span>-2%</span>
            </div>
          </div>
          <p className="text-sm text-slate-400">Next 7 Days</p>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mackerelData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "6px",
                  }}
                  labelStyle={{ color: "#f1f5f9" }}
                  itemStyle={{ color: "#3b82f6" }}
                  formatter={(value: number) => [`S/ ${value.toFixed(2)}/kg`, "Price"]}
                />
                <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
