"use client"

import { useEffect, useState } from "react"
import { TripCard } from "./trip-card"

interface Trip {
  id: number
  ship_name: string
  image_url: string
  departure: string
  return: string
  location: string
  target: string
  status: "On Time" | "Delayed" | "In Progress" | "Completed" | "Cancelled"
}

export function TripsList() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/trips")
      const data = await response.json()
      setTrips(data)
    } catch (error) {
      console.error("[v0] Error fetching trips:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center text-slate-400 py-8">Loading trips...</div>
  }

  return (
    <div className="space-y-6">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  )
}
