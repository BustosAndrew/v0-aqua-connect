"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { EditCrewMemberDialog } from "./edit-crew-member-dialog"
import { toast } from "@/hooks/use-toast"

interface CrewMember {
  id: number
  name: string
  ship_name: string
  role: string
  ship_id: number
}

interface Ship {
  id: number
  name: string
  port: string
}

interface CrewMembersTableProps {
  crewMembers: CrewMember[]
  ships: Ship[]
  refreshData: () => void
}

export function CrewMembersTable({ crewMembers, ships, refreshData }: CrewMembersTableProps) {
  const [editingCrewMember, setEditingCrewMember] = useState<CrewMember | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEditCrewMember = (crewMember: CrewMember) => {
    setEditingCrewMember(crewMember)
    setIsEditDialogOpen(true)
  }

  const handleSaveCrewMember = async (updatedCrewMember: CrewMember) => {
    try {
      const response = await fetch("/api/crew-members", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCrewMember),
      })

      if (!response.ok) throw new Error("Failed to update crew member")

      await refreshData()
      toast({
        title: "Success",
        description: "Crew member updated successfully",
      })
    } catch (error) {
      console.error("[v0] Error updating crew member:", error)
      toast({
        title: "Error",
        description: "Failed to update crew member",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCrewMember = async (crewMemberId: number) => {
    if (!confirm("Are you sure you want to delete this crew member?")) return

    try {
      const response = await fetch(`/api/crew-members?id=${crewMemberId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete crew member")

      await refreshData()
      toast({
        title: "Success",
        description: "Crew member deleted successfully",
      })
    } catch (error) {
      console.error("[v0] Error deleting crew member:", error)
      toast({
        title: "Error",
        description: "Failed to delete crew member",
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
              <th className="text-left p-4 text-sm font-medium text-slate-400">Crew Member Name</th>
              <th className="text-left p-4 text-sm font-medium text-slate-400">Ship</th>
              <th className="text-left p-4 text-sm font-medium text-slate-400">Role</th>
              <th className="text-left p-4 text-sm font-medium text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {crewMembers.map((member) => (
              <tr key={member.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                <td className="p-4 text-white font-medium">{member.name}</td>
                <td className="p-4 text-white">{member.ship_name || "Unassigned"}</td>
                <td className="p-4 text-white">{member.role}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button
                      variant="link"
                      className="text-blue-400 hover:text-blue-300 p-0"
                      onClick={() => handleEditCrewMember(member)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="link"
                      className="text-red-400 hover:text-red-300 p-0"
                      onClick={() => handleDeleteCrewMember(member.id)}
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

      {editingCrewMember && (
        <EditCrewMemberDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          crewMember={editingCrewMember}
          onSave={handleSaveCrewMember}
          ships={ships}
        />
      )}
    </>
  )
}
