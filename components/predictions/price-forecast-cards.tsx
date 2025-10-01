"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface PriceForecastCardsProps {
  selectedSpecies: string
  selectedDateRange: string
  selectedRegion: string
}

interface PriceData {
  id: number
  species: string
  region: string
  forecast_date: string
  price: number
  confidence_level: number
  trend: string
  created_at: string
}

export function PriceForecastCards({ selectedSpecies, selectedDateRange, selectedRegion }: PriceForecastCardsProps) {
  const [data, setData] = useState<PriceData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (selectedSpecies !== "all") params.append("species", selectedSpecies)
        if (selectedRegion !== "all") params.append("region", selectedRegion)
        if (selectedDateRange !== "all") params.append("dateRange", selectedDateRange)

        const response = await fetch(`/api/predictions/prices?${params.toString()}`)
        if (!response.ok) throw new Error("Failed to fetch data")

        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error("[v0] Error fetching price data:", error)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedSpecies, selectedDateRange, selectedRegion])

  const groupedData = data.reduce(
    (acc, item) => {
      if (!acc[item.species]) {
        acc[item.species] = []
      }
      acc[item.species].push(item)
      return acc
    },
    {} as Record<string, PriceData[]>,
  )

  const displaySpecies =
    selectedSpecies === "all"
      ? Object.keys(groupedData).slice(0, 4) // Show up to 4 species when "all" is selected
      : [selectedSpecies]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-8 text-center text-slate-400">Loading...</CardContent>
        </Card>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-8 text-center text-slate-400">
            No price data available for the selected filters
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {displaySpecies.map((species) => {
        const speciesData = groupedData[species]
        if (!speciesData || speciesData.length === 0) return null

        const currentData = speciesData[0]
        const chartData = speciesData.map((item, index) => ({
          day: new Date(item.forecast_date).toLocaleDateString("en-US", { weekday: "short" }),
          price: Number.parseFloat(item.price.toString()),
        }))

        const getTrendIcon = () => {
          if (currentData.trend === "up") return <TrendingUp className="h-4 w-4" />
          if (currentData.trend === "down") return <TrendingDown className="h-4 w-4" />
          return <Minus className="h-4 w-4" />
        }

        const getTrendColor = () => {
          if (currentData.trend === "up") return "text-green-400"
          if (currentData.trend === "down") return "text-red-400"
          return "text-slate-400"
        }

        return (
          <Card key={species} className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-base">{species} Price Forecast</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">
                  S/ {Number.parseFloat(currentData.price.toString()).toFixed(2)}/kg
                </span>
                <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
                  {getTrendIcon()}
                  <span>{currentData.confidence_level}% confidence</span>
                </div>
              </div>
              <p className="text-sm text-slate-400">
                {currentData.region} • {selectedDateRange === "7days" && "Next 7 Days"}
                {selectedDateRange === "14days" && "Next 14 Days"}
                {selectedDateRange === "30days" && "Next 30 Days"}
              </p>

              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
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
        )
      })}
    </div>
  )
}
