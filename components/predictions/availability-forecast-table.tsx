"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"

const availabilityData = [
  {
    species: "Anchoveta",
    estimatedKg: 1500,
    location: "Near Pisco",
    lastUpdated: "2 hours ago",
  },
  {
    species: "Mackerel",
    estimatedKg: 800,
    location: "Offshore Callao",
    lastUpdated: "3 hours ago",
  },
  {
    species: "Tuna",
    estimatedKg: 500,
    location: "Deep Sea, North",
    lastUpdated: "5 hours ago",
  },
  {
    species: "Sardine",
    estimatedKg: 1200,
    location: "Coastal Ilo",
    lastUpdated: "1 hour ago",
  },
  {
    species: "Grouper",
    estimatedKg: 300,
    location: "Rocky Shores, South",
    lastUpdated: "4 hours ago",
  },
]

export function AvailabilityForecastTable() {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-800 hover:bg-slate-800/50">
            <TableHead className="text-slate-400">SPECIES</TableHead>
            <TableHead className="text-slate-400">ESTIMATED AVAILABILITY (KG)</TableHead>
            <TableHead className="text-slate-400">APPROXIMATE LOCATION</TableHead>
            <TableHead className="text-slate-400">LAST UPDATED</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {availabilityData.map((item) => (
            <TableRow key={item.species} className="border-slate-800 hover:bg-slate-800/50">
              <TableCell className="font-medium text-white">{item.species}</TableCell>
              <TableCell className="text-slate-300">{item.estimatedKg} kg</TableCell>
              <TableCell className="text-slate-300">{item.location}</TableCell>
              <TableCell className="text-slate-400">{item.lastUpdated}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
