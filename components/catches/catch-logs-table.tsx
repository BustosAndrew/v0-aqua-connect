"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Plus } from "lucide-react"
import Link from "next/link"
import { AddCatchDialog } from "./add-catch-dialog"

interface CatchLog {
  id: number
  date: string
  vessel: string
  species: string
  total_kg: number
  price_per_kg: number
  total_value: number
}

export function CatchLogsTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [catchLogs, setCatchLogs] = useState<CatchLog[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddCatchDialogOpen, setIsAddCatchDialogOpen] = useState(false)

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  useEffect(() => {
    fetchCatchLogs()
  }, [searchQuery])

  const fetchCatchLogs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append("search", searchQuery)

      const response = await fetch(`/api/catches?${params}`)
      const data = await response.json()
      setCatchLogs(data)
    } catch (error) {
      console.error("[v0] Error fetching catch logs:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* New Catch button above search bar */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Catch Logs</h2>
          <Button onClick={() => setIsAddCatchDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Catch
          </Button>
        </div>

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
            {loading ? (
              <div className="p-8 text-center text-slate-400">Loading catch logs...</div>
            ) : (
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
                    {catchLogs.map((log) => (
                      <tr key={log.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                        <td className="p-4 text-white">{formatDate(log.date)}</td>
                        <td className="p-4 text-white">{log.vessel}</td>
                        <td className="p-4 text-white">{log.species}</td>
                        <td className="p-4 text-white">{Number(log.total_kg).toLocaleString()}</td>
                        <td className="p-4 text-white">S/ {Number(log.price_per_kg).toFixed(2)}</td>
                        <td className="p-4 text-white">S/ {Number(log.total_value).toLocaleString()}</td>
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
            )}
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

      {/* Add catch dialog */}
      <AddCatchDialog open={isAddCatchDialogOpen} onOpenChange={setIsAddCatchDialogOpen} onSave={fetchCatchLogs} />
    </>
  )
}
