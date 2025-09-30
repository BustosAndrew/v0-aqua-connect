"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShipsTable } from "./ships-table"
import { CrewMembersTable } from "./crew-members-table"

interface Ship {
  id: number
  name: string
  port: string
}

interface CrewMember {
  id: number
  name: string
  ship: string
  role: string
}

const initialMockShips: Ship[] = [
  {
    id: 1,
    name: "La Perla del Mar",
    port: "Puerto Vallarta",
  },
  {
    id: 2,
    name: "El Veloz",
    port: "Mazatlán",
  },
  {
    id: 3,
    name: "Estrella del Sur",
    port: "Cabo San Lucas",
  },
]

const initialMockCrewMembers: CrewMember[] = [
  {
    id: 1,
    name: "Mateo Rodriguez",
    ship: "La Perla del Mar",
    role: "Captain",
  },
  {
    id: 2,
    name: "Sofia Ramirez",
    ship: "La Perla del Mar",
    role: "Engineer",
  },
  {
    id: 3,
    name: "Carlos Lopez",
    ship: "El Veloz",
    role: "Captain",
  },
  {
    id: 4,
    name: "Isabella Torres",
    ship: "El Veloz",
    role: "Deckhand",
  },
  {
    id: 5,
    name: "Diego Vargas",
    ship: "Estrella del Sur",
    role: "Navigator",
  },
]

export function ShipsAndCrewContent() {
  const [ships, setShips] = useState<Ship[]>(initialMockShips)
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>(initialMockCrewMembers)

  const getCrewCountForShip = (shipName: string): number => {
    return crewMembers.filter((member) => member.ship === shipName).length
  }

  return (
    <div className="space-y-8">
      {/* Ships Section */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white text-xl">Ships</CardTitle>
        </CardHeader>
        <CardContent>
          <ShipsTable ships={ships} setShips={setShips} getCrewCountForShip={getCrewCountForShip} />
        </CardContent>
      </Card>

      {/* Crew Members Section */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white text-xl">Crew Members</CardTitle>
        </CardHeader>
        <CardContent>
          <CrewMembersTable crewMembers={crewMembers} setCrewMembers={setCrewMembers} ships={ships} />
        </CardContent>
      </Card>
    </div>
  )
}
