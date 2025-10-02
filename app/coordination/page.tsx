import { MainLayout } from "@/components/layout/main-layout"
import { ShipsAndCrewContent } from "@/components/coordination/ships-and-crew-content"

export default function CoordinationPage() {
  return (
    <MainLayout title="Ships & Crew" subtitle="Manage your fleet and crew members">
      <ShipsAndCrewContent />
    </MainLayout>
  )
}
