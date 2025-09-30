"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react"
import Link from "next/link"

const mockCatchLogs = [
  {
    id: 1,
    date: "2024-07-26",
    vessel: "El Sol",
    species: "Anchoveta",
    totalKg: 1500,
    pricePerKg: 2.5,
    totalValue: 3750,
  },
  {
    id: 2,
    date: "2024-07-25",
    vessel: "La Luna",
    species: "Mackerel",
    totalKg: 800,
    pricePerKg: 3.0,
    totalValue: 2400,
  },
  {
    id: 3,
    date: "2024-07-24",
    vessel: "El Sol",
    species: "Sardine",
    totalKg: 1200,
    pricePerKg: 2.0,
    totalValue: 2400,
  },
  {
    id: 4,
    date: "2024-07-23",
    vessel: "La Luna",
    species: "Tuna",
    totalKg: 500,
    pricePerKg: 5.0,
    totalValue: 2500,
  },
  {
    id: 5,
    date: "2024-07-22",
    vessel: "El Sol",
    species: "Anchoveta",
    totalKg: 1800,
    pricePerKg: 2.5,
    totalValue: 4500,
  },
  {
    id: 6,
    date: "2024-07-21",
    vessel: "La Luna",
    species: "Mackerel",
    totalKg: 900,
    pricePerKg: 3.0,
    totalValue: 2700,
  },
  {
    id: 7,
    date: "2024-07-20",
    vessel: "El Sol",
    species: "Sardine",
    totalKg: 1100,
    pricePerKg: 2.0,
    totalValue: 2200,
  },
  {
    id: 8,
    date: "2024-07-19",
    vessel: "La Luna",
    species: "Tuna",
    totalKg: 600,
    pricePerKg: 5.0,
    totalValue: 3000,
  },
]

export function CatchLogsTable() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredLogs = mockCatchLogs.filter(
    (log) =>
      log.vessel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.date.includes(searchQuery),
  )

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search by species, date, or vessel"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-800 border-slate-700 pl-10 text-white placeholder:text-slate-400"
        />
      </div>

      {/* Table */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Vessel</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Species</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Total kg</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Price/kg</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Total Value</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                    <td className="p-4 text-white">{log.date}</td>
                    <td className="p-4 text-white">{log.vessel}</td>
                    <td className="p-4 text-white">{log.species}</td>
                    <td className="p-4 text-white">{log.totalKg.toLocaleString()}</td>
                    <td className="p-4 text-white">S/ {log.pricePerKg.toFixed(2)}</td>
                    <td className="p-4 text-white">S/ {log.totalValue.toLocaleString()}</td>
                    <td className="p-4">
                      <Link href={`/catches/${log.date}`}>
                        <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="flex justify-center space-x-8 text-sm text-slate-400 pt-8 border-t border-slate-800">
        <a href="#" className="hover:text-white">
          Privacy Policy
        </a>
        <a href="#" className="hover:text-white">
          Terms of Service
        </a>
        <a href="#" className="hover:text-white">
          Contact Us
        </a>
      </div>
      <div className="text-center text-sm text-slate-500">© 2025 AquaConnect. All rights reserved.</div>
    </div>
  )
}
