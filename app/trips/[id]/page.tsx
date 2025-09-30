"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { TripDetailsContent } from "@/components/trips/trip-details-content"
import { EditTripDialog } from "@/components/trips/edit-trip-dialog"
import { useToast } from "@/hooks/use-toast"

interface TripDetailsPageProps {
  params: {
    id: string
  }
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
  targetSpecies?: string
  fishingZone?: string
  duration?: number
  catchLog: Array<{
    species: string
    quantity: number
    pricePerKg: number
  }>
}

export default function TripDetailsPage({ params }: TripDetailsPageProps) {
  const { toast } = useToast()
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const [tripData, setTripData] = useState<TripData>({
    id: "#12345",
    status: "Active",
    date: "2024-07-15",
    shipName: "El Pescador",
    captain: "Ricardo",
    crewMembers: ["Mateo", "Sofia"],
    departureTime: "06:00",
    returnTime: "18:00",
    estimatedIncome: 2350,
    targetSpecies: "anchoveta",
    fishingZone: "paita",
    duration: 3,
    catchLog: [
      { species: "Anchoveta", quantity: 150, pricePerKg: 8.5 },
      { species: "Sardina", quantity: 75, pricePerKg: 12.0 },
      { species: "Caballa", quantity: 45, pricePerKg: 15.2 },
    ],
  })

  const handleEditTrip = () => {
    setEditDialogOpen(true)
  }

  const handleSaveTrip = (updatedTrip: TripData) => {
    setTripData(updatedTrip)
    toast({
      title: "Trip Updated",
      description: "Trip details have been successfully updated.",
    })
  }

  const handleStatusChange = (newStatus: "Active" | "Completed" | "Delayed") => {
    setTripData((prev) => ({ ...prev, status: newStatus }))
    toast({
      title: "Status Updated",
      description: `Trip status has been changed to ${newStatus}.`,
    })
  }

  const handleMarkCompleted = () => {
    if (tripData.status === "Completed") return

    setTripData((prev) => ({ ...prev, status: "Completed" }))
    toast({
      title: "Trip Completed",
      description: "Trip has been marked as completed.",
    })
  }

  return (
    <>
      <MainLayout
        title="Trip Details"
        subtitle="View and manage details for the current fishing trip."
        headerActions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-slate-700 text-white hover:bg-slate-800 bg-transparent"
              onClick={handleEditTrip}
            >
              Edit Trip
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed"
              onClick={handleMarkCompleted}
              disabled={tripData.status === "Completed"}
            >
              {tripData.status === "Completed" ? "Completed" : "Mark as Completed"}
            </Button>
          </div>
        }
      >
        <TripDetailsContent tripData={tripData} onStatusChange={handleStatusChange} />
      </MainLayout>

      <EditTripDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        tripData={tripData}
        onSave={handleSaveTrip}
      />
    </>
  )
}
