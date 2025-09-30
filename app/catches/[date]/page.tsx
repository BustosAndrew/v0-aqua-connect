import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { DailyCatchDetailsContent } from "@/components/catches/daily-catch-details-content"

interface DailyCatchDetailsPageProps {
  params: {
    date: string
  }
}

export default function DailyCatchDetailsPage({ params }: DailyCatchDetailsPageProps) {
  // Format the date for display
  const formattedDate = params.date

  return (
    <MainLayout
      title={`Daily Catch Details: ${formattedDate}`}
      subtitle=""
      headerActions={
        <Link href="/catches">
          <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800 bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Catch Log
          </Button>
        </Link>
      }
    >
      <DailyCatchDetailsContent date={formattedDate} />
    </MainLayout>
  )
}
