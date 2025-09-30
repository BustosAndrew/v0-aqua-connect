import { MainLayout } from "@/components/layout/main-layout"
import { MarketAnalysisContent } from "@/components/market-analysis/market-analysis-content"

export default function MarketAnalysisPage() {
  return (
    <MainLayout
      title="Market Price Analysis"
      subtitle="Track live prices, view historical data, and get AI-driven predictions for various fish species across different ports."
    >
      <MarketAnalysisContent />
    </MainLayout>
  )
}
