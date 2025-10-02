"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ShipsAndCrewContent } from "@/components/coordination/ships-and-crew-content"
import { AddShipDialog } from "@/components/coordination/add-ship-dialog"
import { AddCrewMemberDialog } from "@/components/coordination/add-crew-member-dialog"

interface Ship {
  id: number
  name: string
  port: string
}

export default function CoordinationPage() {
  const [isAddShipDialogOpen, setIsAddShipDialogOpen] = useState(false)
  const [isAddCrewDialogOpen, setIsAddCrewDialogOpen] = useState(false)
  const [ships, setShips] = useState<Ship[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    fetchShips()
  }, [])

  const fetchShips = async () => {
    try {
      const response = await fetch("/api/ships")
      const data = await response.json()
      setShips(data)
    } catch (error) {
      console.error("[v0] Error fetching ships:", error)
    }
  }

  const handleAddShip = () => {
    setRefreshKey((prev) => prev + 1)
    fetchShips()
  }

  const handleAddCrew = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <MainLayout
      title="Ships & Crew"
      subtitle="Manage your fleet and crew members"
      headerActions={
        <div className="flex gap-2">
          <Button
            onClick={() => setIsAddShipDialogOpen(true)}
            variant="outline"
            className="border-slate-700 text-white hover:bg-slate-800 bg-transparent"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Ship
          </Button>
          <Button
            onClick={() => setIsAddCrewDialogOpen(true)}
            variant="outline"
            className="border-slate-700 text-white hover:bg-slate-800 bg-transparent"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Crew Member
          </Button>
        </div>
      }
    >
      <ShipsAndCrewContent key={refreshKey} />

      <AddShipDialog open={isAddShipDialogOpen} onOpenChange={setIsAddShipDialogOpen} onAdd={handleAddShip} />
      <AddCrewMemberDialog
        open={isAddCrewDialogOpen}
        onOpenChange={setIsAddCrewDialogOpen}
        onAdd={handleAddCrew}
        ships={ships}
      />
    </MainLayout>
  )
}
