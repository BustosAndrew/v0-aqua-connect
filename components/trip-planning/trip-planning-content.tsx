"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Minus, Plus } from "lucide-react"

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
]

export function TripPlanningContent() {
  const [selectedCrewMembers, setSelectedCrewMembers] = useState(mockCrewMembers)

  const removeCrewMember = (id: number) => {
    setSelectedCrewMembers(selectedCrewMembers.filter((member) => member.id !== id))
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
              <Input type="date" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400" />
            </div>
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Duration (Days)</label>
              <Input
                placeholder="e.g., 3"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Target Species</label>
              <Select>
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
              <Select>
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
            <Select>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Select Vessel" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="esperanza" className="text-white hover:bg-slate-700">
                  Esperanza
                </SelectItem>
                <SelectItem value="mar-azul" className="text-white hover:bg-slate-700">
                  Mar Azul
                </SelectItem>
                <SelectItem value="nuevo-amanecer" className="text-white hover:bg-slate-700">
                  Nuevo Amanecer
                </SelectItem>
              </SelectContent>
            </Select>
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
                className="w-full border-dashed border-slate-600 text-slate-400 hover:text-white hover:bg-slate-800 bg-transparent"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Crew Member
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Plan Trip</Button>
            <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800 bg-transparent">
              Save as Draft
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
