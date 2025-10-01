"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SlidersHorizontal, ChevronDown } from "lucide-react"
import { AvailabilityForecastTable } from "./availability-forecast-table"
import { PriceForecastCards } from "./price-forecast-cards"

export function PredictionsContent() {
  const [selectedSpecies, setSelectedSpecies] = useState("all")
  const [selectedDateRange, setSelectedDateRange] = useState("7days")
  const [selectedRegion, setSelectedRegion] = useState("all")

  const speciesLabels: Record<string, string> = {
    all: "All Species",
    Tuna: "Tuna",
    Salmon: "Salmon",
    Mackerel: "Mackerel",
    Sardine: "Sardine",
    Cod: "Cod",
  }

  const dateRangeLabels: Record<string, string> = {
    "7days": "Next 7 Days",
    "14days": "Next 14 Days",
    "30days": "Next 30 Days",
  }

  const regionLabels: Record<string, string> = {
    all: "All Regions",
    "North Pacific": "North Pacific",
    "South Pacific": "South Pacific",
    Atlantic: "Atlantic",
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-white">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="font-medium">Filters</span>
            </div>

            {/* Species Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={`rounded-full px-4 py-2 h-auto border ${
                    selectedSpecies === "all"
                      ? "bg-cyan-600 border-cyan-600 text-white hover:bg-cyan-700 hover:border-cyan-700"
                      : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600"
                  }`}
                >
                  {speciesLabels[selectedSpecies]}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-700">
                <DropdownMenuItem
                  onClick={() => setSelectedSpecies("all")}
                  className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
                >
                  All Species
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedSpecies("Tuna")}
                  className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
                >
                  Tuna
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedSpecies("Salmon")}
                  className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
                >
                  Salmon
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedSpecies("Mackerel")}
                  className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
                >
                  Mackerel
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedSpecies("Sardine")}
                  className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
                >
                  Sardine
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedSpecies("Cod")}
                  className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
                >
                  Cod
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Date Range Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-full px-4 py-2 h-auto bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600"
                >
                  {dateRangeLabels[selectedDateRange]}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-700">
                <DropdownMenuItem
                  onClick={() => setSelectedDateRange("7days")}
                  className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
                >
                  Next 7 Days
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedDateRange("14days")}
                  className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
                >
                  Next 14 Days
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedDateRange("30days")}
                  className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
                >
                  Next 30 Days
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Region Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-full px-4 py-2 h-auto bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600"
                >
                  {regionLabels[selectedRegion]}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-700">
                <DropdownMenuItem
                  onClick={() => setSelectedRegion("all")}
                  className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
                >
                  All Regions
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedRegion("North Pacific")}
                  className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
                >
                  North Pacific
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedRegion("South Pacific")}
                  className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
                >
                  South Pacific
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedRegion("Atlantic")}
                  className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
                >
                  Atlantic
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Availability Forecast Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Availability Forecast</h2>
        <AvailabilityForecastTable
          selectedSpecies={selectedSpecies}
          selectedRegion={selectedRegion}
          selectedDateRange={selectedDateRange}
        />
      </div>

      {/* Price Forecast Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Price Forecast</h2>
        <PriceForecastCards
          selectedSpecies={selectedSpecies}
          selectedDateRange={selectedDateRange}
          selectedRegion={selectedRegion}
        />
      </div>
    </div>
  )
}
