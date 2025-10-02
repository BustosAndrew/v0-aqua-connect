import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TripsList } from "@/components/trips/trips-list"

export default function TripsPage() {
  return (
    <MainLayout
      title="Today's Trips"
      headerActions={
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Trip
        </Button>
      }
    >
      <TripsList />
    </MainLayout>
  )
}
