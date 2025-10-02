"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShipsTable } from "./ships-table"
import { CrewMembersTable } from "./crew-members-table"

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

export function ShipsAndCrewContent() {
  const [ships, setShips] = useState<Ship[]>([])
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

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
    <div className="space-y-8">
      {/* Ships Section */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white text-xl">Ships</CardTitle>
        </CardHeader>
        <CardContent>
          <ShipsTable ships={ships} refreshData={fetchData} />
        </CardContent>
      </Card>

      {/* Crew Members Section */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white text-xl">Crew Members</CardTitle>
        </CardHeader>
        <CardContent>
          <CrewMembersTable crewMembers={crewMembers} ships={ships} refreshData={fetchData} />
        </CardContent>
      </Card>
    </div>
  )
}
