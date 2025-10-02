"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"

interface LivePricesGridProps {
  selectedPort: string
  searchQuery: string
}

interface PriceData {
  species: string
  port: string
  price_per_kg: number | string | null | undefined
  change_percentage: number | string | null | undefined
  recorded_at: string
}

export function LivePricesGrid({ selectedPort, searchQuery }: LivePricesGridProps) {
  const [prices, setPrices] = useState<PriceData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (selectedPort !== "All Ports") {
          params.append("port", selectedPort)
        }
        params.append("days", "7")

        const response = await fetch(`/api/market-prices?${params.toString()}`)
        if (!response.ok) throw new Error("Failed to fetch prices")

        const data = await response.json()
        setPrices(data)
      } catch (error) {
        console.error("[v0] Error fetching market prices:", error)
        setPrices([])
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()
  }, [selectedPort])

  const filteredData = prices.filter((item) => item.species.toLowerCase().includes(searchQuery.toLowerCase()))

  const latestPrices = filteredData.reduce(
    (acc, item) => {
      if (!acc[item.species] || new Date(item.recorded_at) > new Date(acc[item.species].recorded_at)) {
        acc[item.species] = item
      }
      return acc
    },
    {} as Record<string, PriceData>,
  )

  const displayData = Object.values(latestPrices)

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6 text-center text-slate-400">Loading...</CardContent>
        </Card>
      </div>
    )
  }

  if (displayData.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6 text-center text-slate-400">No price data available</CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayData.map((species) => {
        const pricePerKg = Number(species.price_per_kg) || 0

        const mockChartData = Array.from({ length: 7 }, (_, i) => ({
          value: pricePerKg * (1 + (Math.random() - 0.5) * 0.1),
          index: i,
        }))

        const changePercentage = Number(species.change_percentage) || 0
        const isPositive = changePercentage >= 0

        return (
          <Card key={`${species.species}-${species.port}`} className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">{species.species}</h3>
                  <div className={`flex items-center gap-1 ${isPositive ? "text-green-400" : "text-red-400"}`}>
                    {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span className="text-sm">
                      {changePercentage > 0 ? "+" : ""}
                      {changePercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-3xl font-bold text-white">S/ {pricePerKg.toFixed(2)}</p>
                  <p className="text-sm text-slate-400">{species.port} • Last 24 Hours</p>
                </div>

                <div className="h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockChartData}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={isPositive ? "#10b981" : "#ef4444"}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
