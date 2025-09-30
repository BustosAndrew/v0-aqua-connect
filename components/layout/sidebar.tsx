"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Ship, TrendingUp, MapPin, Users, Fish, Calendar, Brain } from "lucide-react"

const navigation = [
  { name: "Overview", href: "/", icon: Home },
  { name: "Trip Planning", href: "/trip-planning", icon: Calendar },
  { name: "Trips", href: "/trips", icon: Ship },
  { name: "Forecasts", href: "/forecasts", icon: MapPin },
  { name: "Predictions", href: "/predictions", icon: Brain },
  { name: "Market Prices", href: "/market-analysis", icon: TrendingUp },
  { name: "Co-op Coordination", href: "/coordination", icon: Users },
  { name: "Catches", href: "/catches", icon: Fish },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 border-r border-slate-800">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-blue-500 flex items-center justify-center">
            <Fish className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-white">AquaConnect</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
