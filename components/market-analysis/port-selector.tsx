"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ports = ["All Ports", "Callao", "Chimbote", "Paita", "Ilo", "Pisco"]

interface PortSelectorProps {
  selectedPort: string
  onPortChange: (port: string) => void
}

export function PortSelector({ selectedPort, onPortChange }: PortSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {ports.map((port) => (
        <Button
          key={port}
          variant={selectedPort === port ? "default" : "outline"}
          onClick={() => onPortChange(port)}
          className={cn(
            "text-sm",
            selectedPort === port
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white",
          )}
        >
          {port}
        </Button>
      ))}
    </div>
  )
}
