"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { PortSelector } from "./port-selector"
import { LivePricesGrid } from "./live-prices-grid"
import { MarketPriceChart } from "@/components/dashboard/market-price-chart"
import { AIPredictions } from "@/components/dashboard/ai-predictions"

export function MarketAnalysisContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPort, setSelectedPort] = useState("All Ports")

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search for species or ports"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-800 border-slate-700 pl-10 text-white placeholder:text-slate-400"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="live-prices" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
          <TabsTrigger
            value="live-prices"
            className="text-blue-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Live Prices
          </TabsTrigger>
          <TabsTrigger
            value="historical"
            className="text-slate-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Historical Data
          </TabsTrigger>
          <TabsTrigger
            value="predictions"
            className="text-slate-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Price Predictions
          </TabsTrigger>
          <TabsTrigger
            value="trends"
            className="text-slate-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Market Trends
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {/* Port Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-4">Select Port</h3>
            <PortSelector selectedPort={selectedPort} onPortChange={setSelectedPort} />
          </div>

          <TabsContent value="live-prices" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Live Prices per Kilogram</h3>
              <LivePricesGrid selectedPort={selectedPort} searchQuery={searchQuery} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MarketPriceChart />
              <AIPredictions />
            </div>
          </TabsContent>

          <TabsContent value="historical" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Historical Price Data</h3>
              <MarketPriceChart />
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">AI Price Predictions</h3>
              <AIPredictions />
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white mb-4">Market Trends Analysis</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MarketPriceChart />
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                  <h4 className="text-white font-medium mb-4">Trend Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Anchoveta</span>
                      <span className="text-green-400">+2.5% ↗</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Bonito</span>
                      <span className="text-red-400">-1.2% ↘</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Jurel</span>
                      <span className="text-green-400">+0.8% ↗</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Mackerel</span>
                      <span className="text-green-400">+1.5% ↗</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
