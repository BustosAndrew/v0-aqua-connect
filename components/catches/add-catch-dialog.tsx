"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

interface AddCatchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: () => void
}

const availableSpecies = ["Anchoveta", "Tuna", "Mackerel", "Sardine", "Bonito", "Jurel"]

export function AddCatchDialog({ open, onOpenChange, onSave }: AddCatchDialogProps) {
  const [vessels, setVessels] = useState<{ id: number; name: string }[]>([])
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    vessel_id: 0,
    species: availableSpecies[0],
    total_kg: "",
    price_per_kg: "",
  })

  useEffect(() => {
    fetchVessels()
  }, [])

  const fetchVessels = async () => {
    try {
      const response = await fetch("/api/ships")
      const data = await response.json()
      setVessels(data)
      if (data.length > 0) {
        setFormData((prev) => ({ ...prev, vessel_id: data[0].id }))
      }
    } catch (error) {
      console.error("[v0] Error fetching vessels:", error)
    }
  }

  const handleSave = async () => {
    if (!formData.vessel_id) {
      toast({
        title: "Error",
        description: "Vessel is required",
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

    try {
      const vessel = vessels.find((v) => v.id === formData.vessel_id)
      const totalKg = Number.parseFloat(formData.total_kg)
      const pricePerKg = Number.parseFloat(formData.price_per_kg)

      const response = await fetch("/api/catches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: formData.date,
          vessel: vessel?.name || "",
          species: formData.species,
          total_kg: totalKg,
          price_per_kg: pricePerKg,
          total_value: totalKg * pricePerKg,
        }),
      })

      if (!response.ok) throw new Error("Failed to add catch")

      toast({
        title: "Success",
        description: "Catch logged successfully",
      })

      setFormData({
        date: new Date().toISOString().split("T")[0],
        vessel_id: vessels[0]?.id || 0,
        species: availableSpecies[0],
        total_kg: "",
        price_per_kg: "",
      })
      onSave()
      onOpenChange(false)
    } catch (error) {
      console.error("[v0] Error adding catch:", error)
      toast({
        title: "Error",
        description: "Failed to log catch",
        variant: "destructive",
      })
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
            <Select
              value={formData.vessel_id.toString()}
              onValueChange={(value) => setFormData({ ...formData, vessel_id: Number.parseInt(value) })}
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {vessels.map((vessel) => (
                  <SelectItem key={vessel.id} value={vessel.id.toString()} className="text-white hover:bg-slate-700">
                    {vessel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-white mb-2 block">Species</label>
            <Select value={formData.species} onValueChange={(value) => setFormData({ ...formData, species: value })}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {availableSpecies.map((species) => (
                  <SelectItem key={species} value={species} className="text-white hover:bg-slate-700">
                    {species}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                S/ {(Number.parseFloat(formData.total_kg) * Number.parseFloat(formData.price_per_kg)).toFixed(2)}
              </p>
            </div>
          )}
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
            Log Catch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
