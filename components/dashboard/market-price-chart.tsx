"use client"

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

const data = [
  { day: "Mon", price: 11.2 },
  { day: "Tue", price: 12.8 },
  { day: "Wed", price: 11.5 },
  { day: "Thu", price: 13.2 },
  { day: "Fri", price: 12.1 },
  { day: "Sat", price: 14.8 },
  { day: "Sun", price: 12.5 },
]

export function MarketPriceChart() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">Market Price Trends</p>
          <p className="text-3xl font-bold text-white">$12.50/kg</p>
        </div>
        <div className="flex items-center gap-2 text-green-400">
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm">+2.5%</span>
          <span className="text-xs text-slate-400">Last 7 Days</span>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis hide />
            <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
