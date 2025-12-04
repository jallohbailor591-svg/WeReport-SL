import { Navigation } from "@/components/navigation"
import { ReportForm } from "@/components/report-form"

export default function ReportPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-2">Report a Problem</h1>
            <p className="text-muted-foreground">Help improve your community by reporting local issues</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-8">
            <ReportForm />
          </div>
        </div>
      </main>
    </>
  )
}
