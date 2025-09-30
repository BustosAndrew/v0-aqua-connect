"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SlidersHorizontal } from "lucide-react"
import { AvailabilityForecastTable } from "./availability-forecast-table"
import { PriceForecastCards } from "./price-forecast-cards"

export function PredictionsContent() {
  const [selectedSpecies, setSelectedSpecies] = useState("all")
  const [selectedDateRange, setSelectedDateRange] = useState("7days")
  const [selectedRegion, setSelectedRegion] = useState("all")

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="font-medium">Filters</span>
            </div>

            <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
              <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="All Species" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Species</SelectItem>
                <SelectItem value="anchoveta">Anchoveta</SelectItem>
                <SelectItem value="mackerel">Mackerel</SelectItem>
                <SelectItem value="tuna">Tuna</SelectItem>
                <SelectItem value="sardine">Sardine</SelectItem>
                <SelectItem value="grouper">Grouper</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
              <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24hours">Next 24 Hours</SelectItem>
                <SelectItem value="7days">Next 7 Days</SelectItem>
                <SelectItem value="14days">Next 14 Days</SelectItem>
                <SelectItem value="30days">Next 30 Days</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="north">North Coast</SelectItem>
                <SelectItem value="central">Central Coast</SelectItem>
                <SelectItem value="south">South Coast</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Availability Forecast Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Availability Forecast</h2>
        <AvailabilityForecastTable />
      </div>

      {/* Price Forecast Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Price Forecast</h2>
        <PriceForecastCards />
      </div>
    </div>
  )
}
