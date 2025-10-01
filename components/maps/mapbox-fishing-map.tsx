"use client"

import { useState, useEffect } from "react"
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
  const [zoom, setZoom] = useState(10)
  const [mapImageUrl, setMapImageUrl] = useState<string>("")

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

  const activeHotspots = hotspots.length > 0 ? hotspots : defaultHotspots

  useEffect(() => {
    const fetchMapUrl = async () => {
      try {
        const response = await fetch(`/api/map-image?lng=-81.1&lat=-5.1&zoom=${zoom}&width=800&height=600`)
        const data = await response.json()
        if (data.url) {
          setMapImageUrl(data.url)
        }
      } catch (error) {
        console.error("Failed to fetch map URL:", error)
      }
    }
    fetchMapUrl()
  }, [zoom])

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 1, 20))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 1, 1))
  }

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
    <div className={`relative h-96 bg-slate-900 rounded-lg overflow-hidden ${className}`}>
      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-16 z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search for a location"
            className="w-full bg-slate-800/90 border-slate-700 pl-10 text-white placeholder:text-slate-400 backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button
          size="icon"
          variant="outline"
          className="bg-slate-800/90 border-slate-700 text-white backdrop-blur-sm hover:bg-slate-700"
          onClick={handleZoomIn}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="bg-slate-800/90 border-slate-700 text-white backdrop-blur-sm hover:bg-slate-700"
          onClick={handleZoomOut}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="bg-slate-800/90 border-slate-700 text-white backdrop-blur-sm hover:bg-slate-700"
        >
          <Navigation className="h-4 w-4" />
        </Button>
      </div>

      {/* Static Map Background with Mapbox Static API */}
      <div className="absolute inset-0">
        {mapImageUrl ? (
          <img
            src={mapImageUrl || "/placeholder.svg"}
            alt="Fishing Map"
            className="w-full h-full object-cover"
            key={zoom}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">Loading map...</div>
        )}
      </div>

      {/* Hotspot Markers Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {activeHotspots.map((hotspot, index) => {
          const xPercent = ((hotspot.coordinates[0] + 81.3) / 0.4) * 100
          const yPercent = ((hotspot.coordinates[1] + 5.3) / 0.4) * 100

          return (
            <div
              key={hotspot.id}
              className="absolute pointer-events-auto group"
              style={{
                left: `${xPercent}%`,
                top: `${yPercent}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className={`w-3 h-3 rounded-full ${getHotspotColor(hotspot.type)} border-2 border-white shadow-lg cursor-pointer transition-transform hover:scale-150`}
              />
              <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-slate-800 text-white text-xs rounded-lg p-2 shadow-xl whitespace-nowrap">
                  <div className="font-bold">{hotspot.name}</div>
                  <div className="text-slate-300">Species: {hotspot.species.join(", ")}</div>
                  <div className="text-slate-300">Priority: {hotspot.type}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Enhanced Weather Overlay */}
      {showWeather && <EnhancedWeatherOverlay weatherPoints={enhancedWeather} mapBounds={mapBounds} />}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 text-white text-xs">
        <div className="font-semibold mb-2">Fishing Hotspots</div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-pink-500 border-2 border-white" />
            <span>High Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600 border-2 border-white" />
            <span>Medium Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600 border-2 border-white" />
            <span>Low Priority</span>
          </div>
        </div>
      </div>
    </div>
  )
}
