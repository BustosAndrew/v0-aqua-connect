"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

interface CrewMember {
  id: number
  name: string
  ship: string
  role: string
}

interface Ship {
  id: number
  name: string
  port: string
}

interface EditCrewMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  crewMember: CrewMember
  onSave: (updatedCrewMember: CrewMember) => void
  ships: Ship[]
}

const availableRoles = ["Captain", "Engineer", "Navigator", "Deckhand", "Cook", "Mechanic"]

export function EditCrewMemberDialog({ open, onOpenChange, crewMember, onSave, ships }: EditCrewMemberDialogProps) {
  const [formData, setFormData] = useState({
    name: crewMember.name,
    ship: crewMember.ship,
    role: crewMember.role,
  })

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Crew member name is required",
        variant: "destructive",
      })
      return
    }

    if (!formData.ship) {
      toast({
        title: "Error",
        description: "Ship assignment is required",
        variant: "destructive",
      })
      return
    }

    if (!formData.role) {
      toast({
        title: "Error",
        description: "Role is required",
        variant: "destructive",
      })
      return
    }

    const updatedCrewMember: CrewMember = {
      ...crewMember,
      name: formData.name.trim(),
      ship: formData.ship,
      role: formData.role,
    }

    onSave(updatedCrewMember)
    onOpenChange(false)

    toast({
      title: "Success",
      description: "Crew member updated successfully",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Crew Member</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-white mb-2 block">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
              placeholder="Enter crew member name"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white mb-2 block">Assigned Ship</label>
            <Select value={formData.ship} onValueChange={(value) => setFormData({ ...formData, ship: value })}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue />
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

          <div>
            <label className="text-sm font-medium text-white mb-2 block">Role</label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {availableRoles.map((role) => (
                  <SelectItem key={role} value={role} className="text-white hover:bg-slate-700">
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
