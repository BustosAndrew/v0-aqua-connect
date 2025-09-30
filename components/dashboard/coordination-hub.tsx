import { Card, CardContent } from "@/components/ui/card"
import { Users, Sparkles } from "lucide-react"

export function CoordinationHub() {
  return (
    <div className="space-y-4">
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-white">Trip Planning & Co-op Coordination</h3>
              <p className="text-sm text-slate-400">Plan and coordinate fishing trips.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-white">Co-op Trip Optimization</h3>
              <p className="text-sm text-slate-400">Optimize trips with AI predictions.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
