"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ForecastFilters } from "./forecast-filters"
import { ForecastMap } from "./forecast-map"
import { EnvironmentalAlerts } from "./environmental-alerts"

export function ForecastsContent() {
  const [selectedSpecies, setSelectedSpecies] = useState("All Species")
  const [selectedLocation, setSelectedLocation] = useState("Paita")
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() + 7) // Default to 7 days from now
    return date
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
      {/* Forecast Filters Sidebar */}
      <div className="lg:col-span-1">
        <Card className="bg-slate-900 border-slate-800 h-full">
          <CardHeader>
            <CardTitle className="text-white">Forecast Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <ForecastFilters
              selectedSpecies={selectedSpecies}
              selectedLocation={selectedLocation}
              fromDate={fromDate}
              toDate={toDate}
              onSpeciesChange={setSelectedSpecies}
              onLocationChange={setSelectedLocation}
              onFromDateChange={setFromDate}
              onToDateChange={setToDate}
            />
          </CardContent>
        </Card>
      </div>

      {/* Main Map Area */}
      <div className="lg:col-span-3 space-y-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Fishing Hotspot Forecasts</CardTitle>
          </CardHeader>
          <CardContent>
            <ForecastMap
              selectedSpecies={selectedSpecies}
              selectedLocation={selectedLocation}
              selectedDate={fromDate}
            />
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Environmental Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <EnvironmentalAlerts />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
