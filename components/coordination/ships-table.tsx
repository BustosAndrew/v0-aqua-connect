"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { EditShipDialog } from "./edit-ship-dialog"

interface Ship {
  id: number
  name: string
  port: string
}

interface ShipsTableProps {
  ships: Ship[]
  setShips: (ships: Ship[]) => void
  getCrewCountForShip: (shipName: string) => number
}

export function ShipsTable({ ships, setShips, getCrewCountForShip }: ShipsTableProps) {
  const [editingShip, setEditingShip] = useState<Ship | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEditShip = (ship: Ship) => {
    setEditingShip(ship)
    setIsEditDialogOpen(true)
  }

  const handleSaveShip = (updatedShip: Ship) => {
    setShips(ships.map((ship) => (ship.id === updatedShip.id ? updatedShip : ship)))
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
                <td className="p-4 text-white">{getCrewCountForShip(ship.name)}</td>
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
                    <Button variant="link" className="text-red-400 hover:text-red-300 p-0">
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
