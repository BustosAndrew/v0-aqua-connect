"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { EditCrewMemberDialog } from "./edit-crew-member-dialog"

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

interface CrewMembersTableProps {
  crewMembers: CrewMember[]
  setCrewMembers: (crewMembers: CrewMember[]) => void
  ships: Ship[]
}

export function CrewMembersTable({ crewMembers, setCrewMembers, ships }: CrewMembersTableProps) {
  const [editingCrewMember, setEditingCrewMember] = useState<CrewMember | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEditCrewMember = (crewMember: CrewMember) => {
    setEditingCrewMember(crewMember)
    setIsEditDialogOpen(true)
  }

  const handleSaveCrewMember = (updatedCrewMember: CrewMember) => {
    setCrewMembers(crewMembers.map((member) => (member.id === updatedCrewMember.id ? updatedCrewMember : member)))
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
                <td className="p-4 text-white">{member.ship}</td>
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
