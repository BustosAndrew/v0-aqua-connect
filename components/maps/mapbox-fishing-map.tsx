"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Minus, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
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
  const [center, setCenter] = useState<[number, number]>([-81.1, -5.1])
  const [mapImageUrl, setMapImageUrl] = useState("")
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null)

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
    const fetchMapImage = async () => {
      try {
        const response = await fetch(
          `/api/map-image?lng=${center[0]}&lat=${center[1]}&zoom=${zoom}&width=800&height=600`,
        )
        const data = await response.json()
        if (data.url) {
          setMapImageUrl(data.url)
        }
      } catch (error) {
        console.error("Failed to fetch map image:", error)
      }
    }

    fetchMapImage()
  }, [center, zoom])

  const handlePan = (direction: "up" | "down" | "left" | "right") => {
    const panAmount = 0.05 / zoom // Smaller pan at higher zoom levels
    setCenter((prev) => {
      switch (direction) {
        case "up":
          return [prev[0], prev[1] + panAmount]
        case "down":
          return [prev[0], prev[1] - panAmount]
        case "left":
          return [prev[0] - panAmount, prev[1]]
        case "right":
          return [prev[0] + panAmount, prev[1]]
        default:
          return prev
      }
    })
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 1, 18))
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

  const getHotspotPosition = (coordinates: [number, number]) => {
    const mapWidth = 100
    const mapHeight = 100

    const lonRange = 0.4 / zoom
    const latRange = 0.4 / zoom

    const x = ((coordinates[0] - (center[0] - lonRange / 2)) / lonRange) * mapWidth
    const y = ((center[1] + latRange / 2 - coordinates[1]) / latRange) * mapHeight

    return { x: `${x}%`, y: `${y}%` }
  }

  const mapBounds = {
    north: center[1] + 0.2 / zoom,
    south: center[1] - 0.2 / zoom,
    east: center[0] + 0.2 / zoom,
    west: center[0] - 0.2 / zoom,
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
      <div className="absolute top-1/2 left-4 -translate-y-1/2 z-10 flex flex-col gap-1">
        <Button
          size="icon"
          variant="outline"
          className="bg-slate-800/90 border-slate-700 text-white backdrop-blur-sm hover:bg-slate-700 h-8 w-8"
          onClick={() => handlePan("up")}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="outline"
            className="bg-slate-800/90 border-slate-700 text-white backdrop-blur-sm hover:bg-slate-700 h-8 w-8"
            onClick={() => handlePan("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="bg-slate-800/90 border-slate-700 text-white backdrop-blur-sm hover:bg-slate-700 h-8 w-8"
            onClick={() => handlePan("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button
          size="icon"
          variant="outline"
          className="bg-slate-800/90 border-slate-700 text-white backdrop-blur-sm hover:bg-slate-700 h-8 w-8"
          onClick={() => handlePan("down")}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      {/* Zoom Controls */}
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
      </div>

      {/* Map Image - always render with fallback */}
      <img
        src={mapImageUrl || "/placeholder.svg?height=600&width=800"}
        alt="Fishing map"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {activeHotspots.map((hotspot) => {
        const position = getHotspotPosition(hotspot.coordinates)
        const isVisible =
          hotspot.coordinates[0] >= mapBounds.west &&
          hotspot.coordinates[0] <= mapBounds.east &&
          hotspot.coordinates[1] >= mapBounds.south &&
          hotspot.coordinates[1] <= mapBounds.north

        if (!isVisible) return null

        return (
          <div
            key={hotspot.id}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
            style={{ left: position.x, top: position.y }}
          >
            <div
              className={`w-3 h-3 rounded-full border-2 border-white shadow-lg cursor-pointer transition-transform hover:scale-150 ${getHotspotColor(
                hotspot.type,
              )}`}
              onClick={() => setSelectedHotspot(selectedHotspot === hotspot.id ? null : hotspot.id)}
            />
            {selectedHotspot === hotspot.id && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-slate-800/95 backdrop-blur-sm rounded-lg p-2 text-white text-xs whitespace-nowrap shadow-xl">
                <div className="font-semibold mb-1">{hotspot.name}</div>
                <div className="text-slate-300">Species: {hotspot.species.join(", ")}</div>
                <div className="text-slate-300">Priority: {hotspot.type}</div>
              </div>
            )}
          </div>
        )
      })}

      {/* Enhanced Weather Overlay */}
      {showWeather && <EnhancedWeatherOverlay weatherPoints={enhancedWeather} mapBounds={mapBounds} />}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 text-white text-xs z-10">
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
