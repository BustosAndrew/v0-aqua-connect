"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapboxFishingMap } from "@/components/maps/mapbox-fishing-map"

interface TripDetailsContentProps {
  tripData: TripData
  onStatusChange?: (status: "Active" | "Completed" | "Delayed") => void
}

interface CatchLogEntry {
  species: string
  quantity: number
  pricePerKg: number
}

interface TripData {
  id: string
  status: "Active" | "Completed" | "Delayed"
  date: string
  shipName: string
  captain: string
  crewMembers: string[]
  departureTime: string
  returnTime: string
  estimatedIncome: number
  catchLog: CatchLogEntry[]
}

export function TripDetailsContent({ tripData, onStatusChange }: TripDetailsContentProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-600"
      case "Completed":
        return "bg-blue-600"
      case "Delayed":
        return "bg-orange-600"
      default:
        return "bg-slate-600"
    }
  }

  const handleStatusChange = (newStatus: "Active" | "Completed" | "Delayed") => {
    if (onStatusChange) {
      onStatusChange(newStatus)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Trip Overview */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Trip Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-slate-400 mb-1">Trip ID</p>
              <p className="text-white font-medium">{tripData.id}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Status</p>
              <Select value={tripData.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                  <SelectValue>
                    <Badge className={`${getStatusColor(tripData.status)} text-white border-0`}>
                      {tripData.status}
                    </Badge>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="Active" className="text-white hover:bg-slate-700">
                    <Badge className="bg-green-600 text-white border-0">Active</Badge>
                  </SelectItem>
                  <SelectItem value="Completed" className="text-white hover:bg-slate-700">
                    <Badge className="bg-blue-600 text-white border-0">Completed</Badge>
                  </SelectItem>
                  <SelectItem value="Delayed" className="text-white hover:bg-slate-700">
                    <Badge className="bg-orange-600 text-white border-0">Delayed</Badge>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Date</p>
              <p className="text-white font-medium">{tripData.date}</p>
            </div>
          </div>
        </Card>

        {/* Fishing Location */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Fishing Location</h2>
          <MapboxFishingMap
            showWeather={true}
            className="h-64 rounded-lg"
            hotspots={[
              {
                id: "trip-location",
                name: "Current Fishing Area",
                coordinates: [-81.08, -5.12],
                type: "high",
                species: ["Anchovy", "Mackerel", "Sardine"],
              },
            ]}
          />
        </Card>

        {/* Catch Log */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Catch Log</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 text-slate-300 font-medium">Species</th>
                  <th className="text-right py-3 text-slate-300 font-medium">Quantity (kg)</th>
                  <th className="text-right py-3 text-slate-300 font-medium">Price/kg</th>
                </tr>
              </thead>
              <tbody>
                {tripData.catchLog && tripData.catchLog.length > 0 ? (
                  tripData.catchLog.map((entry, index) => (
                    <tr key={index} className="border-b border-slate-700/50">
                      <td className="py-3 text-white">{entry.species}</td>
                      <td className="py-3 text-right text-slate-300">{entry.quantity}</td>
                      <td className="py-3 text-right text-slate-300">${entry.pricePerKg.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-slate-400">
                      No catch data recorded yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Ship & Crew */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Ship & Crew</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-400 mb-1">Ship Name</p>
              <p className="text-white font-medium">{tripData.shipName}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-2">Crew Members</p>
              <p className="text-white">
                <span className="font-medium">Captain: {tripData.captain}</span>
                <br />
                <span>
                  Crew:{" "}
                  {tripData.crewMembers && tripData.crewMembers.length > 0
                    ? tripData.crewMembers.join(", ")
                    : "No crew members assigned"}
                </span>
              </p>
            </div>
          </div>
        </Card>

        {/* Trip Timeline */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Trip Timeline</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-400 mb-1">Departure Time</p>
              <p className="text-white font-medium">{tripData.departureTime}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Return Time</p>
              <p className="text-white font-medium">{tripData.returnTime}</p>
            </div>
          </div>
        </Card>

        {/* Estimated Income */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Estimated Income</h2>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-400 mb-2">${tripData.estimatedIncome.toLocaleString()}</p>
            <p className="text-sm text-slate-400">Based on current catch log and market prices.</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
