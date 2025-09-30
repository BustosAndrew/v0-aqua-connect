import { MainLayout } from "@/components/layout/main-layout"
import { PredictionsContent } from "@/components/predictions/predictions-content"

export default function PredictionsPage() {
  return (
    <MainLayout
      title="AI Predictions"
      subtitle="Forecasts for fish availability and prices to optimize your operations."
    >
      <PredictionsContent />
    </MainLayout>
  )
}
