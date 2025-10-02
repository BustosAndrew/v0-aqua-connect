"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"

interface AddCatchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: () => void
}

export function AddCatchDialog({ open, onOpenChange, onAdd }: AddCatchDialogProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    vessel: "",
    species: "",
    total_kg: "",
    price_per_kg: "",
  })
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    if (!formData.vessel.trim()) {
      toast({
        title: "Error",
        description: "Vessel name is required",
        variant: "destructive",
      })
      return
    }

    if (!formData.species.trim()) {
      toast({
        title: "Error",
        description: "Species is required",
        variant: "destructive",
      })
      return
    }

    if (!formData.total_kg || Number.parseFloat(formData.total_kg) <= 0) {
      toast({
        title: "Error",
        description: "Valid total weight is required",
        variant: "destructive",
      })
      return
    }

    if (!formData.price_per_kg || Number.parseFloat(formData.price_per_kg) <= 0) {
      toast({
        title: "Error",
        description: "Valid price per kg is required",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const total_kg = Number.parseFloat(formData.total_kg)
      const price_per_kg = Number.parseFloat(formData.price_per_kg)
      const total_value = total_kg * price_per_kg

      const response = await fetch("/api/catches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: formData.date,
          vessel: formData.vessel.trim(),
          species: formData.species.trim(),
          total_kg,
          price_per_kg,
          total_value,
        }),
      })

      if (!response.ok) throw new Error("Failed to add catch")

      toast({
        title: "Success",
        description: "Catch logged successfully",
      })

      setFormData({
        date: new Date().toISOString().split("T")[0],
        vessel: "",
        species: "",
        total_kg: "",
        price_per_kg: "",
      })
      onOpenChange(false)
      onAdd()
    } catch (error) {
      console.error("[v0] Error adding catch:", error)
      toast({
        title: "Error",
        description: "Failed to log catch",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Log New Catch</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-white mb-2 block">Date</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white mb-2 block">Vessel</label>
            <Input
              value={formData.vessel}
              onChange={(e) => setFormData({ ...formData, vessel: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
              placeholder="Enter vessel name"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white mb-2 block">Species</label>
            <Input
              value={formData.species}
              onChange={(e) => setFormData({ ...formData, species: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
              placeholder="Enter species"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white mb-2 block">Total Weight (kg)</label>
            <Input
              type="number"
              step="0.01"
              value={formData.total_kg}
              onChange={(e) => setFormData({ ...formData, total_kg: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
              placeholder="Enter total weight"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white mb-2 block">Price per kg (S/)</label>
            <Input
              type="number"
              step="0.01"
              value={formData.price_per_kg}
              onChange={(e) => setFormData({ ...formData, price_per_kg: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
              placeholder="Enter price per kg"
            />
          </div>

          {formData.total_kg && formData.price_per_kg && (
            <div className="p-3 bg-slate-800 rounded-lg">
              <p className="text-sm text-slate-400">Total Value</p>
              <p className="text-xl font-semibold text-white">
                S/ {(Number.parseFloat(formData.total_kg) * Number.parseFloat(formData.price_per_kg)).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-slate-700 text-white hover:bg-slate-800 bg-transparent"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
            {loading ? "Logging..." : "Log Catch"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
