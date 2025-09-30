"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Minus, Navigation } from "lucide-react"
import { EnhancedWeatherOverlay } from "./enhanced-weather-overlay"

interface FishingHotspot {
  id: string
  name: string
  coordinates: [number, number]
  type: "high" | "medium" | "low"
  species: string[]
}

interface WeatherData {
  condition: "sunny" | "cloudy" | "windy" | "rainy"
  windDirection: "north" | "northeast" | "east" | "southeast" | "south" | "southwest" | "west" | "northwest"
  windSpeed: number
  coordinates: [number, number]
}

interface EnhancedWeatherData {
  id: string
  condition: "sunny" | "cloudy" | "windy" | "rainy"
  windDirection: "north" | "northeast" | "east" | "southeast" | "south" | "southwest" | "west" | "northwest"
  windSpeed: number
  temperature: number
  coordinates: [number, number]
  intensity: "high" | "medium" | "low"
}

interface MapboxFishingMapProps {
  hotspots?: FishingHotspot[]
  weather?: WeatherData[]
  showWeather?: boolean
  className?: string
}

export function MapboxFishingMap({
  hotspots = [],
  weather = [],
  showWeather = true,
  className = "",
}: MapboxFishingMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [lng, setLng] = useState(-81.1) // Paita, Peru longitude
  const [lat, setLat] = useState(-5.1) // Paita, Peru latitude
  const [zoom, setZoom] = useState(10)

  // Default hotspots for Paita area
  const defaultHotspots: FishingHotspot[] = [
    {
      id: "1",
      name: "Bote Gavel",
      coordinates: [-81.05, -5.05],
      type: "high",
      species: ["Anchovy", "Sardine"],
    },
    {
      id: "2",
      name: "Boso de Sal Resort",
      coordinates: [-81.02, -5.08],
      type: "high",
      species: ["Mackerel", "Tuna"],
    },
    {
      id: "3",
      name: "Playa Audaz",
      coordinates: [-81.15, -5.15],
      type: "medium",
      species: ["Anchovy", "Bonito"],
    },
    {
      id: "4",
      name: "Playa Las Gaviotas",
      coordinates: [-81.12, -5.18],
      type: "medium",
      species: ["Sardine", "Mackerel"],
    },
  ]

  // Default weather data
  const defaultWeather: WeatherData[] = [
    {
      condition: "windy",
      windDirection: "northwest",
      windSpeed: 15,
      coordinates: [-81.08, -5.02],
    },
    {
      condition: "sunny",
      windDirection: "west",
      windSpeed: 8,
      coordinates: [-81.18, -5.12],
    },
    {
      condition: "cloudy",
      windDirection: "southwest",
      windSpeed: 12,
      coordinates: [-81.05, -5.2],
    },
  ]

  const activeHotspots = hotspots.length > 0 ? hotspots : defaultHotspots
  const activeWeather = weather.length > 0 ? weather : defaultWeather

  useEffect(() => {
    // Initialize Mapbox map
    if (map.current) return // Initialize map only once

    // For now, we'll create a styled div that looks like a map
    // In production, you would use: mapboxgl.Map()
    if (mapContainer.current) {
      // This is a placeholder - in real implementation you'd use:
      // map.current = new mapboxgl.Map({
      //   container: mapContainer.current,
      //   style: 'mapbox://styles/mapbox/satellite-v9',
      //   center: [lng, lat],
      //   zoom: zoom
      // })
    }
  }, [lng, lat, zoom])

  const getHotspotColor = (type: string) => {
    switch (type) {
      case "high":
        return "bg-pink-500"
      case "medium":
        return "bg-green-600"
      case "low":
        return "bg-blue-600"
      default:
        return "bg-blue-600"
    }
  }

  const mapBounds = {
    north: -4.9,
    south: -5.3,
    east: -80.9,
    west: -81.3,
  }

  const enhancedWeather: EnhancedWeatherData[] = [
    {
      id: "weather-1",
      condition: "windy",
      windDirection: "northwest",
      windSpeed: 15,
      temperature: 22,
      coordinates: [-81.08, -5.02],
      intensity: "high",
    },
    {
      id: "weather-2",
      condition: "sunny",
      windDirection: "west",
      windSpeed: 8,
      temperature: 25,
      coordinates: [-81.18, -5.12],
      intensity: "medium",
    },
    {
      id: "weather-3",
      condition: "cloudy",
      windDirection: "southwest",
      windSpeed: 12,
      temperature: 20,
      coordinates: [-81.05, -5.2],
      intensity: "medium",
    },
    {
      id: "weather-4",
      condition: "rainy",
      windDirection: "northeast",
      windSpeed: 18,
      temperature: 18,
      coordinates: [-81.15, -5.08],
      intensity: "high",
    },
  ]

  return (
    <div
      className={`relative h-96 bg-gradient-to-br from-blue-300 to-blue-100 rounded-lg overflow-hidden ${className}`}
    >
      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-16 z-20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search for a location"
            className="w-full bg-slate-800/90 border-slate-700 pl-10 text-white placeholder:text-slate-400 backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <Button size="icon" variant="outline" className="bg-slate-800/90 border-slate-700 text-white backdrop-blur-sm">
          <Plus className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="outline" className="bg-slate-800/90 border-slate-700 text-white backdrop-blur-sm">
          <Minus className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="outline" className="bg-slate-800/90 border-slate-700 text-white backdrop-blur-sm">
          <Navigation className="h-4 w-4" />
        </Button>
      </div>

      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0">
        {/* Styled map background - this would be replaced by actual Mapbox */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-teal-100 to-blue-300">
          {/* Coastline representation */}
          <div className="absolute right-0 top-0 h-full w-2/5 bg-gradient-to-l from-amber-100 via-yellow-50 to-transparent opacity-90">
            {/* Land features */}
            <div className="absolute top-1/3 right-1/4 text-xs text-gray-700 font-medium">CERCADO DE PAITA</div>
            <div className="absolute top-1/2 right-1/3 text-xs text-gray-700">Paita</div>
            <div className="absolute bottom-1/3 right-1/4 text-xs text-gray-700">Yacila</div>
            <div className="absolute bottom-1/4 left-1/4 text-xs text-gray-700">Cangrejos</div>
          </div>

          {/* Ocean depth indicators */}
          <div className="absolute top-1/4 left-1/4 text-blue-700 text-xs opacity-60 font-medium">-50m</div>
          <div className="absolute top-1/2 left-1/6 text-blue-800 text-xs opacity-60 font-medium">-100m</div>
          <div className="absolute bottom-1/3 left-1/8 text-blue-900 text-xs opacity-60 font-medium">-200m</div>

          {/* Road indicators */}
          <div className="absolute top-1/2 right-1/3">
            <div className="bg-gray-500 px-2 py-1 rounded text-xs text-white shadow">102</div>
          </div>
          <div className="absolute bottom-1/3 right-1/4">
            <div className="bg-gray-500 px-2 py-1 rounded text-xs text-white shadow">1N</div>
          </div>
        </div>

        {/* Fishing Hotspots */}
        {activeHotspots.map((hotspot, index) => {
          // Convert coordinates to pixel positions (simplified)
          const leftPercent = ((hotspot.coordinates[0] + 81.2) / 0.3) * 100
          const topPercent = ((hotspot.coordinates[1] + 5.25) / 0.3) * 100

          return (
            <div
              key={hotspot.id}
              className="absolute z-10"
              style={{
                left: `${Math.max(5, Math.min(85, leftPercent))}%`,
                top: `${Math.max(15, Math.min(85, topPercent))}%`,
              }}
            >
              <div
                className={`flex items-center gap-2 ${getHotspotColor(hotspot.type)} text-white px-3 py-1 rounded-full text-sm shadow-lg hover:shadow-xl transition-shadow cursor-pointer`}
              >
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="font-medium">{hotspot.name}</span>
              </div>
              {/* Hotspot details tooltip */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                Species: {hotspot.species.join(", ")}
              </div>
            </div>
          )
        })}

        {/* Enhanced Weather Overlay */}
        {showWeather && <EnhancedWeatherOverlay weatherPoints={enhancedWeather} mapBounds={mapBounds} />}
      </div>
    </div>
  )
}
