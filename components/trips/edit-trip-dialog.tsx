"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Minus, Plus } from "lucide-react"

interface TripData {
  id: string
  status: "Active" | "Completed" | "Delayed"
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
}

interface EditTripDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tripData: TripData
  onSave: (updatedTrip: TripData) => void
}

const mockCrewMembers = [
  {
    id: 1,
    name: "Ricardo Gomez",
    role: "Captain",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Mateo Flores",
    role: "Deckhand",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Sofia Martinez",
    role: "Engineer",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function EditTripDialog({ open, onOpenChange, tripData, onSave }: EditTripDialogProps) {
  const [formData, setFormData] = useState({
    date: tripData.date,
    duration: tripData.duration || 3,
    targetSpecies: tripData.targetSpecies || "anchoveta",
    fishingZone: tripData.fishingZone || "paita",
    shipName: tripData.shipName,
    captain: tripData.captain,
    crewMembers: tripData.crewMembers,
    departureTime: tripData.departureTime,
    returnTime: tripData.returnTime,
  })

  const [selectedCrewMembers, setSelectedCrewMembers] = useState(
    mockCrewMembers.filter((member) => member.name === tripData.captain || tripData.crewMembers.includes(member.name)),
  )

  const removeCrewMember = (id: number) => {
    setSelectedCrewMembers(selectedCrewMembers.filter((member) => member.id !== id))
  }

  const addCrewMember = () => {
    const availableMembers = mockCrewMembers.filter(
      (member) => !selectedCrewMembers.some((selected) => selected.id === member.id),
    )
    if (availableMembers.length > 0) {
      setSelectedCrewMembers([...selectedCrewMembers, availableMembers[0]])
    }
  }

  const handleSave = () => {
    const captain = selectedCrewMembers.find((member) => member.role === "Captain")?.name || tripData.captain
    const crew = selectedCrewMembers.filter((member) => member.role !== "Captain").map((member) => member.name)

    const updatedTrip: TripData = {
      ...tripData,
      date: formData.date,
      shipName: formData.shipName,
      captain,
      crewMembers: crew,
      departureTime: formData.departureTime,
      returnTime: formData.returnTime,
      targetSpecies: formData.targetSpecies,
      fishingZone: formData.fishingZone,
      duration: formData.duration,
    }

    onSave(updatedTrip)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Trip {tripData.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Trip Details Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Departure Date</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Duration (Days)</label>
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) || 3 })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Target Species</label>
              <Select
                value={formData.targetSpecies}
                onValueChange={(value) => setFormData({ ...formData, targetSpecies: value })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
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
                  <SelectValue />
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
            <Select value={formData.shipName} onValueChange={(value) => setFormData({ ...formData, shipName: value })}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="Esperanza" className="text-white hover:bg-slate-700">
                  Esperanza
                </SelectItem>
                <SelectItem value="Mar Azul" className="text-white hover:bg-slate-700">
                  Mar Azul
                </SelectItem>
                <SelectItem value="Nuevo Amanecer" className="text-white hover:bg-slate-700">
                  Nuevo Amanecer
                </SelectItem>
                <SelectItem value="El Pescador" className="text-white hover:bg-slate-700">
                  El Pescador
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
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
                className="w-full border-dashed border-slate-600 text-slate-400 hover:text-white hover:bg-slate-800 bg-transparent"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Crew Member
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-slate-700 text-white hover:bg-slate-800 bg-transparent"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
