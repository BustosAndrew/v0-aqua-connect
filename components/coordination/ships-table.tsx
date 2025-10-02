"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { EditShipDialog } from "./edit-ship-dialog"
import { toast } from "@/hooks/use-toast"

interface Ship {
  id: number
  name: string
  port: string
  crew_count: number
}

interface ShipsTableProps {
  ships: Ship[]
  refreshData: () => void
}

export function ShipsTable({ ships, refreshData }: ShipsTableProps) {
  const [editingShip, setEditingShip] = useState<Ship | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEditShip = (ship: Ship) => {
    setEditingShip(ship)
    setIsEditDialogOpen(true)
  }

  const handleSaveShip = async (updatedShip: Ship) => {
    try {
      const response = await fetch("/api/ships", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedShip),
      })

      if (!response.ok) throw new Error("Failed to update ship")

      await refreshData()
      toast({
        title: "Success",
        description: "Ship updated successfully",
      })
    } catch (error) {
      console.error("[v0] Error updating ship:", error)
      toast({
        title: "Error",
        description: "Failed to update ship",
        variant: "destructive",
      })
    }
  }

  const handleDeleteShip = async (shipId: number) => {
    if (!confirm("Are you sure you want to delete this ship?")) return

    try {
      const response = await fetch(`/api/ships?id=${shipId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete ship")

      await refreshData()
      toast({
        title: "Success",
        description: "Ship deleted successfully",
      })
    } catch (error) {
      console.error("[v0] Error deleting ship:", error)
      toast({
        title: "Error",
        description: "Failed to delete ship",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left p-4 text-sm font-medium text-slate-400">Ship Name</th>
              <th className="text-left p-4 text-sm font-medium text-slate-400">Number of Crew</th>
              <th className="text-left p-4 text-sm font-medium text-slate-400">Port</th>
              <th className="text-left p-4 text-sm font-medium text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ships.map((ship) => (
              <tr key={ship.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                <td className="p-4 text-white font-medium">{ship.name}</td>
                <td className="p-4 text-white">{ship.crew_count}</td>
                <td className="p-4 text-slate-300">{ship.port}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button
                      variant="link"
                      className="text-blue-400 hover:text-blue-300 p-0"
                      onClick={() => handleEditShip(ship)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="link"
                      className="text-red-400 hover:text-red-300 p-0"
                      onClick={() => handleDeleteShip(ship.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingShip && (
        <EditShipDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          ship={editingShip}
          onSave={handleSaveShip}
        />
      )}
    </>
  )
}
