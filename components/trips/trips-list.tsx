"use client"

import { TripCard } from "./trip-card"

const mockTrips = [
  {
    id: 1,
    shipName: "Esperanza",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/screen-Hsb7dUftmGoYy0BskOedC7r3Aoaklu.png",
    departure: "6:00 AM",
    return: "4:00 PM",
    location: "Máncora",
    target: "Tuna",
    status: "On Time" as const,
  },
  {
    id: 2,
    shipName: "Mar Azul",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/screen-Hsb7dUftmGoYy0BskOedC7r3Aoaklu.png",
    departure: "7:30 AM",
    return: "5:30 PM",
    location: "Cabo Blanco",
    target: "Mackerel",
    status: "Delayed" as const,
  },
  {
    id: 3,
    shipName: "Nuevo Amanecer",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/screen-Hsb7dUftmGoYy0BskOedC7r3Aoaklu.png",
    departure: "8:00 AM",
    return: "6:00 PM",
    location: "El Ñuro",
    target: "Mahi-mahi",
    status: "In Progress" as const,
  },
]

export function TripsList() {
  return (
    <div className="space-y-6">
      {mockTrips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  )
}
