import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CatchLogsTable } from "@/components/catches/catch-logs-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CatchTrendsChart } from "@/components/analytics/catch-trends-chart"
import { IncomeTrendsChart } from "@/components/analytics/income-trends-chart"

export default function CatchesPage() {
  return (
    <MainLayout
      title="Catch Logs"
      headerActions={
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Catch
        </Button>
      }
    >
      <Tabs defaultValue="logs" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-slate-700">
          <TabsTrigger
            value="logs"
            className="text-blue-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Catch Logs
          </TabsTrigger>
          <TabsTrigger
            value="trends"
            className="text-slate-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Catch Trends
          </TabsTrigger>
          <TabsTrigger
            value="income"
            className="text-slate-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Income Analytics
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="logs">
            <CatchLogsTable />
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="space-y-6">
              <CatchTrendsChart chartType="line" />
              <CatchTrendsChart chartType="area" />
            </div>
          </TabsContent>

          <TabsContent value="income" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <IncomeTrendsChart timeframe="daily" />
              <IncomeTrendsChart timeframe="weekly" />
              <IncomeTrendsChart timeframe="monthly" />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </MainLayout>
  )
}
