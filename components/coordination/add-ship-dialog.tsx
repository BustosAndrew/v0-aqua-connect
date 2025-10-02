"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

interface AddShipDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: () => void
}

const availablePorts = ["Puerto Vallarta", "Mazatlán", "Cabo San Lucas", "Acapulco", "Veracruz", "Tampico"]

export function AddShipDialog({ open, onOpenChange, onSave }: AddShipDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    port: availablePorts[0],
  })

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Ship name is required",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/ships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          port: formData.port,
        }),
      })

      if (!response.ok) throw new Error("Failed to add ship")

      toast({
        title: "Success",
        description: "Ship added successfully",
      })

      setFormData({ name: "", port: availablePorts[0] })
      onSave()
      onOpenChange(false)
    } catch (error) {
      console.error("[v0] Error adding ship:", error)
      toast({
        title: "Error",
        description: "Failed to add ship",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Ship</DialogTitle>
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
            Add Ship
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
