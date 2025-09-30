import type React from "react"
import { Card, CardContent } from "@/components/ui/card"

interface WeatherCardProps {
  title: string
  value: string
  icon: React.ReactNode
}

export function WeatherCard({ title, value, icon }: WeatherCardProps) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
          <div className="text-blue-400">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
