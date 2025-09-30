"use client"

import { MapboxFishingMap } from "@/components/maps/mapbox-fishing-map"

interface ForecastMapProps {
  selectedSpecies: string
  selectedLocation: string
  selectedDate: Date
}

export function ForecastMap({ selectedSpecies, selectedLocation, selectedDate }: ForecastMapProps) {
  return <MapboxFishingMap showWeather={true} className="h-96" />
}
