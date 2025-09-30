import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "On Time" | "Delayed" | "In Progress"
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "On Time":
        return "bg-green-600 text-white"
      case "Delayed":
        return "bg-orange-600 text-white"
      case "In Progress":
        return "bg-blue-600 text-white"
      default:
        return "bg-slate-600 text-white"
    }
  }

  return (
    <span
      className={cn("inline-flex items-center px-3 py-1 rounded-full text-sm font-medium", getStatusStyles(status))}
    >
      <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
      {status}
    </span>
  )
}
