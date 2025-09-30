import { MainLayout } from "@/components/layout/main-layout"
import { TripPlanningContent } from "@/components/trip-planning/trip-planning-content"

export default function TripPlanningPage() {
  return (
    <MainLayout
      title="Co-op Trip Optimization"
      subtitle="Plan and coordinate your next fishing trip with the cooperative."
    >
      <TripPlanningContent />
    </MainLayout>
  )
}
