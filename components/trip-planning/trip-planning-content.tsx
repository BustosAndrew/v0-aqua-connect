"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Minus, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface CrewMember {
  id: number
  name: string
  role: string
  avatar_url: string | null
}

interface Ship {
  id: number
  name: string
}

export function TripPlanningContent() {
  const { toast } = useToast()
  const router = useRouter()
  const [allCrewMembers, setAllCrewMembers] = useState<CrewMember[]>([])
  const [ships, setShips] = useState<Ship[]>([])
  const [selectedCrewMembers, setSelectedCrewMembers] = useState<CrewMember[]>([])
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    departureDate: new Date().toISOString().split("T")[0],
    duration: 3,
    targetSpecies: "anchoveta",
    fishingZone: "paita",
    vessel: "",
    departureTime: "06:00",
    returnTime: "18:00",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [crewResponse, shipsResponse] = await Promise.all([fetch("/api/crew-members"), fetch("/api/ships")])

      const crewData = await crewResponse.json()
      const shipsData = await shipsResponse.json()

      setAllCrewMembers(crewData)
      setShips(shipsData)

      // Pre-select first two crew members
      if (crewData.length >= 2) {
        setSelectedCrewMembers([crewData[0], crewData[1]])
      }
    } catch (error) {
      console.error("[v0] Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeCrewMember = (id: number) => {
    setSelectedCrewMembers(selectedCrewMembers.filter((member) => member.id !== id))
  }

  const addCrewMember = () => {
    const availableMembers = allCrewMembers.filter(
      (member) => !selectedCrewMembers.some((selected) => selected.id === member.id),
    )
    if (availableMembers.length > 0) {
      setSelectedCrewMembers([...selectedCrewMembers, availableMembers[0]])
    }
  }

  const handlePlanTrip = async () => {
    if (!formData.vessel) {
      toast({
        title: "Error",
        description: "Please select a vessel.",
        variant: "destructive",
      })
      return
    }

    if (selectedCrewMembers.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one crew member.",
        variant: "destructive",
      })
      return
    }

    try {
      const captain = selectedCrewMembers.find((m) => m.role === "Captain")
      const crewNames = selectedCrewMembers.filter((m) => m.role !== "Captain").map((m) => m.name)

      const response = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ship_name: formData.vessel,
          captain: captain?.name || selectedCrewMembers[0].name,
          crew_members: crewNames,
          departure_time: formData.departureTime,
          return_time: formData.returnTime,
          location: formData.fishingZone,
          target_species: formData.targetSpecies,
          fishing_zone: formData.fishingZone,
          trip_date: formData.departureDate,
          duration_days: formData.duration,
          estimated_income: 0,
        }),
      })

      if (response.ok) {
        const newTrip = await response.json()
        toast({
          title: "Trip Planned",
          description: "Your trip has been successfully planned!",
        })
        router.push(`/trips/${newTrip.id}`)
      } else {
        throw new Error("Failed to create trip")
      }
    } catch (error) {
      console.error("[v0] Error planning trip:", error)
      toast({
        title: "Error",
        description: "Failed to plan trip. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="text-center text-slate-400 py-8">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white text-xl">Plan a New Trip</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Trip Details Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Departure Date</label>
              <Input
                type="date"
                value={formData.departureDate}
                onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Duration (Days)</label>
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) || 3 })}
                placeholder="e.g., 3"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Target Species</label>
              <Select
                value={formData.targetSpecies}
                onValueChange={(value) => setFormData({ ...formData, targetSpecies: value })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Select Species" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="anchoveta" className="text-white hover:bg-slate-700">
                    Anchoveta
                  </SelectItem>
                  <SelectItem value="tuna" className="text-white hover:bg-slate-700">
                    Tuna
                  </SelectItem>
                  <SelectItem value="mackerel" className="text-white hover:bg-slate-700">
                    Mackerel
                  </SelectItem>
                  <SelectItem value="sardine" className="text-white hover:bg-slate-700">
                    Sardine
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Fishing Zone</label>
              <Select
                value={formData.fishingZone}
                onValueChange={(value) => setFormData({ ...formData, fishingZone: value })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Select Zone" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="paita" className="text-white hover:bg-slate-700">
                    Paita
                  </SelectItem>
                  <SelectItem value="callao" className="text-white hover:bg-slate-700">
                    Callao
                  </SelectItem>
                  <SelectItem value="chimbote" className="text-white hover:bg-slate-700">
                    Chimbote
                  </SelectItem>
                  <SelectItem value="ilo" className="text-white hover:bg-slate-700">
                    Ilo
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-white mb-2 block">Vessel</label>
            <Select value={formData.vessel} onValueChange={(value) => setFormData({ ...formData, vessel: value })}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Select Vessel" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {ships.map((ship) => (
                  <SelectItem key={ship.id} value={ship.name} className="text-white hover:bg-slate-700">
                    {ship.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Departure Time</label>
              <Input
                type="time"
                value={formData.departureTime}
                onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Return Time</label>
              <Input
                type="time"
                value={formData.returnTime}
                onChange={(e) => setFormData({ ...formData, returnTime: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>

          {/* Crew Members Section */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Crew Members</h3>
            <div className="space-y-3">
              {selectedCrewMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar_url || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-white">{member.name}</p>
                      <p className="text-sm text-slate-400">{member.role}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCrewMember(member.id)}
                    className="text-slate-400 hover:text-red-400 hover:bg-slate-700"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {/* Add Crew Member Button */}
              <Button
                variant="outline"
                onClick={addCrewMember}
                disabled={selectedCrewMembers.length >= allCrewMembers.length}
                className="w-full border-dashed border-slate-600 text-slate-400 hover:text-white hover:bg-slate-800 bg-transparent disabled:opacity-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Crew Member
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <Button onClick={handlePlanTrip} className="flex-1 bg-blue-600 hover:bg-blue-700">
              Plan Trip
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
