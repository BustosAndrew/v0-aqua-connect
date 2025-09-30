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

interface EditShipDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ship: Ship
  onSave: (updatedShip: Ship) => void
}

const availablePorts = ["Puerto Vallarta", "Mazatlán", "Cabo San Lucas", "Acapulco", "Veracruz", "Tampico"]

export function EditShipDialog({ open, onOpenChange, ship, onSave }: EditShipDialogProps) {
  const [formData, setFormData] = useState({
    name: ship.name,
    port: ship.port,
  })

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Ship name is required",
        variant: "destructive",
      })
      return
    }

    const updatedShip: Ship = {
      ...ship,
      name: formData.name.trim(),
      port: formData.port,
    }

    onSave(updatedShip)
    onOpenChange(false)

    toast({
      title: "Success",
      description: "Ship updated successfully",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Ship</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-white mb-2 block">Ship Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
              placeholder="Enter ship name"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white mb-2 block">Port</label>
            <Select value={formData.port} onValueChange={(value) => setFormData({ ...formData, port: value })}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {availablePorts.map((port) => (
                  <SelectItem key={port} value={port} className="text-white hover:bg-slate-700">
                    {port}
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
