"use client"

import { Wind, Cloud, Sun, CloudRain, CloudSnow, Zap } from "lucide-react"

interface WeatherPoint {
  id: string
  condition: "sunny" | "cloudy" | "windy" | "rainy" | "stormy" | "snowy"
  windDirection: "north" | "northeast" | "east" | "southeast" | "south" | "southwest" | "west" | "northwest"
  windSpeed: number
  temperature?: number
  coordinates: [number, number]
  intensity?: "low" | "medium" | "high"
}

interface EnhancedWeatherOverlayProps {
  weatherPoints: WeatherPoint[]
  mapBounds: {
    north: number
    south: number
    east: number
    west: number
  }
}

export function EnhancedWeatherOverlay({ weatherPoints, mapBounds }: EnhancedWeatherOverlayProps) {
  const getWeatherIcon = (condition: string, intensity = "medium") => {
    const iconSize = intensity === "high" ? "h-5 w-5" : intensity === "low" ? "h-3 w-3" : "h-4 w-4"

    switch (condition) {
      case "sunny":
        return <Sun className={iconSize} />
      case "cloudy":
        return <Cloud className={iconSize} />
      case "windy":
        return <Wind className={iconSize} />
      case "rainy":
        return <CloudRain className={iconSize} />
      case "stormy":
        return <Zap className={iconSize} />
      case "snowy":
        return <CloudSnow className={iconSize} />
      default:
        return <Sun className={iconSize} />
    }
  }

  const getWeatherColor = (condition: string, intensity = "medium") => {
    const baseColors = {
      sunny: "bg-yellow-500",
      cloudy: "bg-gray-500",
      windy: "bg-blue-500",
      rainy: "bg-blue-700",
      stormy: "bg-purple-700",
      snowy: "bg-white",
    }

    const intensityModifier = intensity === "high" ? "/90" : intensity === "low" ? "/60" : "/80"
    return baseColors[condition as keyof typeof baseColors] + intensityModifier
  }

  const convertCoordinatesToPixels = (coordinates: [number, number]) => {
    const [lng, lat] = coordinates
    const { north, south, east, west } = mapBounds

    const leftPercent = ((lng - west) / (east - west)) * 100
    const topPercent = ((north - lat) / (north - south)) * 100

    return {
      left: Math.max(5, Math.min(90, leftPercent)),
      top: Math.max(10, Math.min(85, topPercent)),
    }
  }

  return (
    <>
      {weatherPoints.map((weather) => {
        const position = convertCoordinatesToPixels(weather.coordinates)
        const intensity = weather.intensity || "medium"

        return (
          <div
            key={weather.id}
            className="absolute z-20 pointer-events-none"
            style={{
              left: `${position.left}%`,
              top: `${position.top}%`,
            }}
          >
            {/* Weather symbol container */}
            <div className="relative">
              {/* Main weather icon */}
              <div
                className={`${getWeatherColor(weather.condition, intensity)} text-white p-2 rounded-full shadow-lg backdrop-blur-sm border border-white/20`}
              >
                {getWeatherIcon(weather.condition, intensity)}
              </div>

              {/* Weather details tooltip */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-slate-900/95 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-auto">
                <div className="font-medium capitalize">{weather.condition}</div>
                <div>
                  Wind: {weather.windSpeed}kt {weather.windDirection.toUpperCase()}
                </div>
                {weather.temperature && <div>Temp: {weather.temperature}°C</div>}
              </div>

              {/* Wind speed indicator */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                <div className="bg-slate-800/90 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap">
                  {weather.windSpeed}kt
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}
