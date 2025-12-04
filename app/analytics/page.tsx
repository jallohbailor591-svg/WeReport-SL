import { redirect } from "next/navigation"
import { createServerClient_ } from "@/lib/supabase-server"
import { getAnalytics } from "@/lib/analytics"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ExportDialog } from "@/components/export-dialog"
import { BarChart3, Users, Clock, CheckCircle } from "lucide-react"

export default async function AnalyticsPage() {
  const supabase = await createServerClient_()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

  if (!profile?.is_admin) {
    redirect("/dashboard")
  }

  const analytics = await getAnalytics()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive insights and performance metrics</p>
          </div>
          <ExportDialog />
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Total Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.totalIssues}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent" />
                Resolution Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {analytics.totalIssues > 0 ? Math.round((analytics.resolvedIssues / analytics.totalIssues) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">{analytics.resolvedIssues} resolved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-warning" />
                Avg Resolution Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{analytics.avgResolutionTimeHours.toFixed(1)}h</div>
              <p className="text-xs text-muted-foreground mt-1">Hours to resolve</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{analytics.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered citizens</p>
            </CardContent>
          </Card>
        </div>

        {/* Issues by Category */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Issues by Category</CardTitle>
              <CardDescription>Distribution across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(analytics.issuesByCategory).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{category}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{
                            width: `${(count / analytics.totalIssues) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Reporters</CardTitle>
              <CardDescription>Most active community members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.topReporters.map((reporter, index) => (
                  <div key={reporter.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium">{reporter.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{reporter.count} reports</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Engagement */}
        <Card>
          <CardHeader>
            <CardTitle>Community Engagement</CardTitle>
            <CardDescription>Platform activity metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-2xl font-bold text-primary mb-1">{analytics.totalComments}</div>
                <p className="text-sm text-muted-foreground">Total Comments</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent mb-1">{analytics.totalUpvotes}</div>
                <p className="text-sm text-muted-foreground">Total Upvotes</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning mb-1">
                  {analytics.totalComments > 0 ? (analytics.totalComments / analytics.totalIssues).toFixed(1) : 0}
                </div>
                <p className="text-sm text-muted-foreground">Avg Comments per Issue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
