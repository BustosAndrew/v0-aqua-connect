"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Info, CheckCircle } from "lucide-react"

const alerts = [
  {
    id: 1,
    type: "warning" as const,
    title: "High Wave Alert",
    description: "Wave heights expected to reach 2.5m in the next 6 hours. Exercise caution when departing.",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "info" as const,
    title: "Optimal Fishing Conditions",
    description: "Water temperature and currents are ideal for Tuna fishing near Paita region.",
    time: "4 hours ago",
  },
  {
    id: 3,
    type: "success" as const,
    title: "Weather Improvement",
    description: "Storm conditions have cleared. Safe fishing conditions restored.",
    time: "6 hours ago",
  },
]

export function EnvironmentalAlerts() {
  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Alert key={alert.id} className="bg-slate-800 border-slate-700">
          <div className="flex items-start gap-3">
            {alert.type === "warning" && <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />}
            {alert.type === "info" && <Info className="h-5 w-5 text-blue-500 mt-0.5" />}
            {alert.type === "success" && <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />}
            <div className="flex-1">
              <h4 className="font-medium text-white mb-1">{alert.title}</h4>
              <AlertDescription className="text-slate-300 text-sm">{alert.description}</AlertDescription>
              <p className="text-xs text-slate-500 mt-2">{alert.time}</p>
            </div>
          </div>
        </Alert>
      ))}
    </div>
  )
}
