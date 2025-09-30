"use client"

import { Card, CardContent } from "@/components/ui/card"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"

const mockData = [
  { name: "Anchoveta", price: 12.5, change: 2.3, trend: "up", data: [10, 11, 12, 13, 12.5, 14, 12.5] },
  { name: "Mackerel", price: 8.75, change: -1.5, trend: "down", data: [9, 8.5, 9.2, 8.8, 8.75, 8.9, 8.75] },
  { name: "Tuna", price: 15.2, change: 0.8, trend: "up", data: [14, 15, 14.5, 15.5, 15.2, 15.8, 15.2] },
]

interface LivePricesGridProps {
  selectedPort: string
  searchQuery: string
}

export function LivePricesGrid({ selectedPort, searchQuery }: LivePricesGridProps) {
  const filteredData = mockData.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredData.map((species) => (
        <Card key={species.name} className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">{species.name}</h3>
                <div
                  className={`flex items-center gap-1 ${species.trend === "up" ? "text-green-400" : "text-red-400"}`}
                >
                  {species.trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="text-sm">
                    {species.change > 0 ? "+" : ""}
                    {species.change}%
                  </span>
                </div>
              </div>

              <div>
                <p className="text-3xl font-bold text-white">S/. {species.price.toFixed(2)}</p>
                <p className="text-sm text-slate-400">Last 24 Hours</p>
              </div>

              <div className="h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={species.data.map((value, index) => ({ value, index }))}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={species.trend === "up" ? "#10b981" : "#ef4444"}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
