"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const species = ["All Species", "Anchoveta", "Sardine", "Mackerel", "Tuna", "Bonito"]
const locations = ["Paita", "Callao", "Chimbote", "Ilo", "Pisco"]

interface ForecastFiltersProps {
  selectedSpecies: string
  selectedLocation: string
  fromDate: Date
  toDate: Date
  onSpeciesChange: (species: string) => void
  onLocationChange: (location: string) => void
  onFromDateChange: (date: Date) => void
  onToDateChange: (date: Date) => void
}

export function ForecastFilters({
  selectedSpecies,
  selectedLocation,
  fromDate,
  toDate,
  onSpeciesChange,
  onLocationChange,
  onFromDateChange,
  onToDateChange,
}: ForecastFiltersProps) {
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value)
    onFromDateChange(newDate)
  }

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value)
    onToDateChange(newDate)
  }

  return (
    <div className="space-y-6">
      {/* Species Filter */}
      <div>
        <label className="text-sm font-medium text-white mb-3 block">Species</label>
        <Select value={selectedSpecies} onValueChange={onSpeciesChange}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {species.map((s) => (
              <SelectItem key={s} value={s} className="text-white hover:bg-slate-700">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location Filter */}
      <div>
        <label className="text-sm font-medium text-white mb-3 block">Location</label>
        <Select value={selectedLocation} onValueChange={onLocationChange}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {locations.map((location) => (
              <SelectItem key={location} value={location} className="text-white hover:bg-slate-700">
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-white mb-3 block">Date Range</label>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-2 block">From</label>
            <Input
              type="date"
              value={formatDateForInput(fromDate)}
              onChange={handleFromDateChange}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-2 block">To</label>
            <Input
              type="date"
              value={formatDateForInput(toDate)}
              onChange={handleToDateChange}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Apply Filters Button */}
      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Apply Filters</Button>
    </div>
  )
}
