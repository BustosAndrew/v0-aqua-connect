import { MainLayout } from "@/components/layout/main-layout"
import { ReportIssueForm } from "@/components/report-issue/report-issue-form"

export default function ReportIssuePage() {
  return (
    <MainLayout title="Report an Issue" subtitle="Help us improve AquaConnect by reporting problems">
      <div className="max-w-3xl mx-auto">
        <ReportIssueForm />
      </div>
    </MainLayout>
  )
}
