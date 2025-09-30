"use client"

import { MapboxFishingMap } from "@/components/maps/mapbox-fishing-map"

export function FishingHotspotMap() {
  return <MapboxFishingMap showWeather={true} className="h-96" />
}
