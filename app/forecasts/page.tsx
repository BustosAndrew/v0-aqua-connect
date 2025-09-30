import { MainLayout } from "@/components/layout/main-layout"
import { ForecastsContent } from "@/components/forecasts/forecasts-content"

export default function ForecastsPage() {
  return (
    <MainLayout title="Forecasts">
      <ForecastsContent />
    </MainLayout>
  )
}
