"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

interface Ship {
  id: number
  name: string
  port: string
}

interface AddCrewMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: () => void
  ships: Ship[]
}

const availableRoles = ["Captain", "Engineer", "Navigator", "Deckhand", "Cook", "Mechanic"]

export function AddCrewMemberDialog({ open, onOpenChange, onSave, ships }: AddCrewMemberDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    ship_id: ships[0]?.id || 0,
    role: availableRoles[0],
  })

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Crew member name is required",
        variant: "destructive",
      })
      return
    }

    if (!formData.ship_id) {
      toast({
        title: "Error",
        description: "Ship assignment is required",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/crew-members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          ship_id: formData.ship_id,
          role: formData.role,
        }),
      })

      if (!response.ok) throw new Error("Failed to add crew member")

      toast({
        title: "Success",
        description: "Crew member added successfully",
      })

      setFormData({ name: "", ship_id: ships[0]?.id || 0, role: availableRoles[0] })
      onSave()
      onOpenChange(false)
    } catch (error) {
      console.error("[v0] Error adding crew member:", error)
      toast({
        title: "Error",
        description: "Failed to add crew member",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Crew Member</DialogTitle>
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
            <Select
              value={formData.ship_id.toString()}
              onValueChange={(value) => setFormData({ ...formData, ship_id: Number.parseInt(value) })}
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {ships.map((ship) => (
                  <SelectItem key={ship.id} value={ship.id.toString()} className="text-white hover:bg-slate-700">
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
            Add Crew Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
