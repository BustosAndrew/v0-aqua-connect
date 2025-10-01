"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"

interface AvailabilityForecastTableProps {
  selectedSpecies: string
  selectedRegion: string
  selectedDateRange: string
}

interface AvailabilityData {
  id: number
  species: string
  region: string
  forecast_date: string
  availability_percentage: number
  confidence_level: string
  created_at: string
}

export function AvailabilityForecastTable({
  selectedSpecies,
  selectedRegion,
  selectedDateRange,
}: AvailabilityForecastTableProps) {
  const [data, setData] = useState<AvailabilityData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (selectedSpecies !== "all") params.append("species", selectedSpecies)
        if (selectedRegion !== "all") params.append("region", selectedRegion)
        if (selectedDateRange !== "all") params.append("dateRange", selectedDateRange)

        const response = await fetch(`/api/predictions/availability?${params.toString()}`)
        if (!response.ok) throw new Error("Failed to fetch data")

        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error("[v0] Error fetching availability data:", error)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedSpecies, selectedRegion, selectedDateRange])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffHours < 1) return "Less than 1 hour ago"
    if (diffHours === 1) return "1 hour ago"
    if (diffHours < 24) return `${diffHours} hours ago`

    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return "1 day ago"
    return `${diffDays} days ago`
  }

  return (
    <Card className="bg-slate-900 border-slate-800">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-800 hover:bg-slate-800/50">
            <TableHead className="text-slate-400">SPECIES</TableHead>
            <TableHead className="text-slate-400">REGION</TableHead>
            <TableHead className="text-slate-400">FORECAST DATE</TableHead>
            <TableHead className="text-slate-400">AVAILABILITY</TableHead>
            <TableHead className="text-slate-400">CONFIDENCE</TableHead>
            <TableHead className="text-slate-400">LAST UPDATED</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow className="border-slate-800">
              <TableCell colSpan={6} className="text-center text-slate-400 py-8">
                Loading...
              </TableCell>
            </TableRow>
          ) : data.length > 0 ? (
            data.map((item) => (
              <TableRow key={item.id} className="border-slate-800 hover:bg-slate-800/50">
                <TableCell className="font-medium text-white">{item.species}</TableCell>
                <TableCell className="text-slate-300">{item.region}</TableCell>
                <TableCell className="text-slate-300">{formatDate(item.forecast_date)}</TableCell>
                <TableCell className="text-slate-300">{item.availability_percentage}%</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.confidence_level === "High"
                        ? "bg-green-500/20 text-green-400"
                        : item.confidence_level === "Medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {item.confidence_level}
                  </span>
                </TableCell>
                <TableCell className="text-slate-400">{getTimeAgo(item.created_at)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="border-slate-800">
              <TableCell colSpan={6} className="text-center text-slate-400 py-8">
                No data available for the selected filters
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  )
}
