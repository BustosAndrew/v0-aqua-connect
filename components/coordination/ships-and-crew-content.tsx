"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShipsTable } from "./ships-table"
import { CrewMembersTable } from "./crew-members-table"
import { AddShipDialog } from "./add-ship-dialog"
import { AddCrewMemberDialog } from "./add-crew-member-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface Ship {
  id: number
  name: string
  port: string
  crew_count: number
  image_url?: string
}

interface CrewMember {
  id: number
  name: string
  ship_name: string
  role: string
  ship_id: number
  avatar_url?: string
}

interface ShipsAndCrewContentProps {
  onAddShipClick?: () => void
  onAddCrewClick?: () => void
}

export function ShipsAndCrewContent({ onAddShipClick, onAddCrewClick }: ShipsAndCrewContentProps) {
  const [ships, setShips] = useState<Ship[]>([])
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddShipDialogOpen, setIsAddShipDialogOpen] = useState(false)
  const [isAddCrewDialogOpen, setIsAddCrewDialogOpen] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (onAddShipClick) {
      const handleClick = () => setIsAddShipDialogOpen(true)
      // This is a workaround - ideally the buttons should be in this component
    }
  }, [onAddShipClick])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [shipsResponse, crewResponse] = await Promise.all([fetch("/api/ships"), fetch("/api/crew-members")])

      const shipsData = await shipsResponse.json()
      const crewData = await crewResponse.json()

      setShips(shipsData)
      setCrewMembers(crewData)
    } catch (error) {
      console.error("[v0] Error fetching ships and crew:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center text-slate-400 py-8">Loading ships and crew...</div>
  }

  return (
    <>
      <div className="space-y-8">
        {/* Ships Section */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white text-xl">Ships</CardTitle>
            <Button onClick={() => setIsAddShipDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Ship
            </Button>
          </CardHeader>
          <CardContent>
            <ShipsTable ships={ships} refreshData={fetchData} />
          </CardContent>
        </Card>

        {/* Crew Members Section */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white text-xl">Crew Members</CardTitle>
            <Button
              onClick={() => setIsAddCrewDialogOpen(true)}
              variant="outline"
              className="border-slate-700 text-white hover:bg-slate-800 bg-transparent"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Crew Member
            </Button>
          </CardHeader>
          <CardContent>
            <CrewMembersTable crewMembers={crewMembers} ships={ships} refreshData={fetchData} />
          </CardContent>
        </Card>
      </div>

      <AddShipDialog open={isAddShipDialogOpen} onOpenChange={setIsAddShipDialogOpen} onSave={fetchData} />
      <AddCrewMemberDialog
        open={isAddCrewDialogOpen}
        onOpenChange={setIsAddCrewDialogOpen}
        onSave={fetchData}
        ships={ships}
      />
    </>
  )
}
