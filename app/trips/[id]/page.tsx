"use client"

import { useState, useEffect } from "react"
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
  status: "Active" | "Completed" | "Delayed" | "In Progress" | "On Time" | "Cancelled"
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
  const [tripData, setTripData] = useState<TripData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTripDetails()
  }, [params.id])

  const fetchTripDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/trips/${params.id}`)
      const data = await response.json()

      // Transform API data to component format
      setTripData({
        id: `#${data.id}`,
        status: data.status,
        date: data.trip_date,
        shipName: data.ship_name,
        captain: data.captain || "Unknown",
        crewMembers: data.crew_members || [],
        departureTime: data.departure_time,
        returnTime: data.return_time,
        estimatedIncome: Number(data.estimated_income) || 0,
        targetSpecies: data.target_species,
        fishingZone: data.fishing_zone,
        duration: data.duration_days,
        catchLog: [], // This would come from a separate API call if needed
      })
    } catch (error) {
      console.error("[v0] Error fetching trip details:", error)
      toast({
        title: "Error",
        description: "Failed to load trip details.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditTrip = () => {
    setEditDialogOpen(true)
  }

  const handleSaveTrip = async (updatedTrip: TripData) => {
    try {
      const response = await fetch(`/api/trips/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ship_name: updatedTrip.shipName,
          captain: updatedTrip.captain,
          crew_members: updatedTrip.crewMembers,
          departure_time: updatedTrip.departureTime,
          return_time: updatedTrip.returnTime,
          location: tripData?.fishingZone || "Unknown",
          target_species: updatedTrip.targetSpecies,
          fishing_zone: updatedTrip.fishingZone,
          status: updatedTrip.status,
          trip_date: updatedTrip.date,
          estimated_income: updatedTrip.estimatedIncome,
          duration_days: updatedTrip.duration,
        }),
      })

      if (response.ok) {
        setTripData(updatedTrip)
        toast({
          title: "Trip Updated",
          description: "Trip details have been successfully updated.",
        })
      } else {
        throw new Error("Failed to update trip")
      }
    } catch (error) {
      console.error("[v0] Error updating trip:", error)
      toast({
        title: "Error",
        description: "Failed to update trip details.",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async (
    newStatus: "Active" | "Completed" | "Delayed" | "In Progress" | "On Time" | "Cancelled",
  ) => {
    if (!tripData) return

    try {
      const response = await fetch(`/api/trips/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ship_name: tripData.shipName,
          captain: tripData.captain,
          crew_members: tripData.crewMembers,
          departure_time: tripData.departureTime,
          return_time: tripData.returnTime,
          location: tripData.fishingZone || "Unknown",
          target_species: tripData.targetSpecies,
          fishing_zone: tripData.fishingZone,
          status: newStatus,
          trip_date: tripData.date,
          estimated_income: tripData.estimatedIncome,
          duration_days: tripData.duration,
        }),
      })

      if (response.ok) {
        setTripData((prev) => (prev ? { ...prev, status: newStatus } : null))
        toast({
          title: "Status Updated",
          description: `Trip status has been changed to ${newStatus}.`,
        })
      } else {
        throw new Error("Failed to update status")
      }
    } catch (error) {
      console.error("[v0] Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update trip status.",
        variant: "destructive",
      })
    }
  }

  const handleMarkCompleted = () => {
    if (tripData?.status === "Completed") return
    handleStatusChange("Completed")
  }

  if (loading) {
    return (
      <MainLayout title="Trip Details" subtitle="Loading...">
        <div className="text-center text-slate-400 py-8">Loading trip details...</div>
      </MainLayout>
    )
  }

  if (!tripData) {
    return (
      <MainLayout title="Trip Details" subtitle="Not Found">
        <div className="text-center text-slate-400 py-8">Trip not found.</div>
      </MainLayout>
    )
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
