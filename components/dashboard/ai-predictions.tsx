"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Brain, TrendingUp, TrendingDown } from "lucide-react"

const predictionData = [
  { hour: "Now", availability: 75, confidence: 85, price: 12.5 },
  { hour: "+2h", availability: 78, confidence: 82, price: 12.8 },
  { hour: "+4h", availability: 82, confidence: 88, price: 13.1 },
  { hour: "+6h", availability: 85, confidence: 90, price: 13.0 },
  { hour: "+8h", availability: 80, confidence: 85, price: 12.9 },
  { hour: "+10h", availability: 77, confidence: 80, price: 12.7 },
  { hour: "+12h", availability: 73, confidence: 78, price: 12.4 },
]

const chartConfig = {
  availability: {
    label: "Fish Availability %",
    color: "hsl(var(--chart-1))",
  },
  confidence: {
    label: "Prediction Confidence %",
    color: "hsl(var(--chart-2))",
  },
  price: {
    label: "Price Prediction",
    color: "hsl(var(--chart-3))",
  },
}

export function AIPredictions() {
  const [priceForecast, setPriceForecast] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPriceForecast = async () => {
      try {
        const response = await fetch("/api/prices/forecast?species=anchoveta&week=2024-W41")
        const data = await response.json()

        if (data.forecasts && data.forecasts.length > 0) {
          setPriceForecast(data.forecasts[0])
        }
      } catch (error) {
        console.error("[v0] Failed to fetch price forecast:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPriceForecast()
  }, [])

  const currentAvailability = predictionData[0].availability
  const currentConfidence = predictionData[0].confidence
  const currentPrice = priceForecast ? priceForecast.price_pred_pen_perkg : predictionData[0].price
  const priceDirection = priceForecast ? priceForecast.direction : "Up"
  const priceConfidence = priceForecast ? (priceForecast.directional_acc_val * 100).toFixed(0) : currentConfidence

  return (
    <div className="space-y-3">
      {/* Current Predictions Cards */}
      <div className="grid grid-cols-1 gap-3">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-slate-400 flex items-center gap-2">
                    <Brain className="h-4 w-4 text-blue-400" />
                    Fish Availability
                  </p>
                  <p className="text-2xl font-bold text-blue-400">{currentAvailability}%</p>
                  <div className="flex items-center gap-2 text-green-400">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-xs">High confidence</span>
                  </div>
                </div>
              </div>
              <div className="h-24 w-full">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={predictionData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <defs>
                        <linearGradient id="availabilityGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-availability)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--color-availability)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="hour"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 10 }}
                        interval={1}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 10 }}
                        width={30}
                        domain={[60, 90]}
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        formatter={(value: number) => [`${value}%`, "Availability"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="availability"
                        stroke="var(--color-availability)"
                        fill="url(#availabilityGradient)"
                        strokeWidth={2}
                        dot={{ fill: "var(--color-availability)", strokeWidth: 1, r: 3 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">Price Prediction</p>
                  <p className="text-2xl font-bold text-blue-400">S/ {currentPrice.toFixed(2)}/kg</p>
                  <div
                    className={`flex items-center gap-2 ${priceDirection === "Up" ? "text-green-400" : "text-red-400"}`}
                  >
                    {priceDirection === "Up" ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span className="text-xs">{priceConfidence}% confidence</span>
                  </div>
                  {priceForecast && (
                    <p className="text-xs text-slate-500">
                      {priceForecast.port} • Week {priceForecast.target_week}
                    </p>
                  )}
                </div>
              </div>
              <div className="h-20 w-full">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={predictionData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <XAxis
                        dataKey="hour"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 9 }}
                        interval={1}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 9 }}
                        width={30}
                        domain={[12, 14]}
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        formatter={(value: number) => [`S/ ${value.toFixed(2)}/kg`, "Price"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="var(--color-price)"
                        strokeWidth={2}
                        dot={{ fill: "var(--color-price)", strokeWidth: 1, r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Prediction Chart */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <Brain className="h-4 w-4 text-blue-400" />
            12-Hour AI Predictions
          </CardTitle>
        </CardHeader>
        <CardContent className="pr-2">
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictionData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <XAxis
                  dataKey="hour"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  interval={0}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} width={30} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number, name: string) => {
                    if (name === "price") return [`S/ ${value.toFixed(2)}/kg`, "Price"]
                    return [`${value}%`, name === "availability" ? "Availability" : "Confidence"]
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="availability"
                  stroke="var(--color-availability)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-availability)", strokeWidth: 1, r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="confidence"
                  stroke="var(--color-confidence)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "var(--color-confidence)", strokeWidth: 1, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
