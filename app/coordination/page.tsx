import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ShipsAndCrewContent } from "@/components/coordination/ships-and-crew-content"

export default function CoordinationPage() {
  return (
    <MainLayout
      title="Ships & Crew"
      subtitle="Manage your fleet and crew members"
      headerActions={
        <div className="flex gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Ship
          </Button>
          <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800 bg-transparent">
            <Plus className="h-4 w-4 mr-2" />
            Add Crew Member
          </Button>
        </div>
      }
    >
      <ShipsAndCrewContent />
    </MainLayout>
  )
}
