"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Target } from "lucide-react"
import { StatusBadge } from "./status-badge"
import Link from "next/link"

interface Trip {
  id: number
  shipName: string
  imageUrl: string
  departure: string
  return: string
  location: string
  target: string
  status: "On Time" | "Delayed" | "In Progress"
}

interface TripCardProps {
  trip: Trip
}

export function TripCard({ trip }: TripCardProps) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardContent className="p-0">
        <div className="flex">
          {/* Ship Image */}
          <div className="w-80 h-48 relative overflow-hidden rounded-l-lg">
            <img
              src={trip.imageUrl || "/placeholder.svg"}
              alt={`Ship ${trip.shipName}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Trip Details */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Ship: {trip.shipName}</h3>
              </div>
              <StatusBadge status={trip.status} />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Departure: {trip.departure}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">Location: {trip.location}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Return: {trip.return}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Target className="h-4 w-4" />
                  <span className="text-sm">Target: {trip.target}</span>
                </div>
              </div>
            </div>

            <Link href={`/trips/${trip.id}`}>
              <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
