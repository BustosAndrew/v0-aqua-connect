import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Thermometer, Waves, Wind } from "lucide-react"
import { WeatherCard } from "@/components/dashboard/weather-card"
import { FishingHotspotMap } from "@/components/dashboard/fishing-hotspot-map"
import { MarketPriceChart } from "@/components/dashboard/market-price-chart"
import { CoordinationHub } from "@/components/dashboard/coordination-hub"
import { AIPredictions } from "@/components/dashboard/ai-predictions"

export default function HomePage() {
  return (
    <MainLayout
      title="Overview"
      subtitle="Monitor your cooperative's fishing operations and market conditions"
      headerActions={
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Plan a Trip
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Weather and Ocean Data */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">Weather and Ocean Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <WeatherCard title="Temperature" value="22°C" icon={<Thermometer className="h-5 w-5" />} />
            <WeatherCard title="Wave Height" value="1.5m" icon={<Waves className="h-5 w-5" />} />
            <WeatherCard title="Current Speed" value="0.8 m/s" icon={<Wind className="h-5 w-5" />} />
          </div>
        </section>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Fishing Hotspot Forecasts */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-900 border-slate-800 h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="text-white">Fishing Hotspot Forecasts</CardTitle>
              </CardHeader>
              <CardContent>
                <FishingHotspotMap />
              </CardContent>
            </Card>
          </div>

          {/* Right Side Cards */}
          <div className="space-y-4">
            <CoordinationHub />
            <AIPredictions />
          </div>
        </div>

        {/* Real-Time Market Prices */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-white">Real-Time Market Prices</CardTitle>
          </CardHeader>
          <CardContent>
            <MarketPriceChart />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
