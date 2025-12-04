import { Navigation } from "@/components/navigation"
import { ResolutionChart, DepartmentPerformance, TimeSeriesChart } from "@/components/dashboard-charts"
import { AdminTable } from "@/components/admin-table"
import { TrendingUp, CheckCircle, Clock, AlertCircle, Activity } from "lucide-react"
import { redirect } from "next/navigation"
import { createServerClient_ } from "@/lib/supabase-server"
import { getAnalytics } from "@/lib/analytics"

export default async function DashboardPage() {
  // Server-side authentication check
  const supabase = await createServerClient_()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch real analytics data
  const analytics = await getAnalytics()

  const DASHBOARD_STATS = {
    totalReports: analytics.totalIssues,
    resolved: analytics.resolvedIssues,
    inProgress: analytics.inProgressIssues,
    pending: analytics.pendingIssues,
    avgResolutionTime: analytics.avgResolutionTimeHours,
    resolutionRate:
      analytics.totalIssues > 0 ? Math.round((analytics.resolvedIssues / analytics.totalIssues) * 100) : 0,
    communityEngagement: analytics.totalUsers,
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-primary/8 to-accent/5 border-b border-border py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-2 text-base md:text-lg">
                  Real-time tracking of community issues and government response
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-lg">
                <Activity className="w-5 h-5 text-accent animate-pulse" />
                <span className="text-sm font-semibold text-accent">Live</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          {/* Key Metrics Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md hover:border-primary/30 transition-all">
              <div className="flex items-start justify-between mb-4">
                <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                <div className="p-2.5 bg-primary/10 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-4xl font-bold mb-1">{DASHBOARD_STATS.totalReports}</p>
              <p className="text-xs text-muted-foreground font-medium">All categories combined</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md hover:border-accent/30 transition-all">
              <div className="flex items-start justify-between mb-4">
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <div className="p-2.5 bg-accent/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-accent" />
                </div>
              </div>
              <p className="text-4xl font-bold text-accent mb-1">{DASHBOARD_STATS.resolved}</p>
              <p className="text-xs text-muted-foreground font-medium">
                {DASHBOARD_STATS.resolutionRate}% resolution rate
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md hover:border-warning/30 transition-all">
              <div className="flex items-start justify-between mb-4">
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <div className="p-2.5 bg-warning/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-warning" />
                </div>
              </div>
              <p className="text-4xl font-bold text-warning mb-1">{DASHBOARD_STATS.inProgress}</p>
              <p className="text-xs text-muted-foreground font-medium">Currently being worked on</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md hover:border-destructive/30 transition-all">
              <div className="flex items-start justify-between mb-4">
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <div className="p-2.5 bg-destructive/10 rounded-lg">
                  <Clock className="w-5 h-5 text-destructive" />
                </div>
              </div>
              <p className="text-4xl font-bold text-destructive mb-1">{DASHBOARD_STATS.pending}</p>
              <p className="text-xs text-muted-foreground font-medium">Awaiting further action</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all">
              <ResolutionChart />
            </div>
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all">
              <DepartmentPerformance />
            </div>
          </div>

          {/* Time Series Chart */}
          <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all mb-8">
            <TimeSeriesChart />
          </div>

          {/* Priority Table */}
          <div className="space-y-4 mb-12">
            <div>
              <h2 className="text-2xl font-bold mb-1">Top Priority Issues</h2>
              <p className="text-sm text-muted-foreground font-medium">Sorted by upvotes and severity</p>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <AdminTable />
            </div>
          </div>

          {/* Insights Section */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-primary/8 to-primary/5 border border-primary/20 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">Community Engagement</h3>
              <p className="text-4xl font-bold text-primary mb-2">
                {DASHBOARD_STATS.communityEngagement.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground font-medium">Active citizens using the platform</p>
            </div>
            <div className="bg-gradient-to-br from-accent/8 to-accent/5 border border-accent/20 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">Avg Resolution Time</h3>
              <p className="text-4xl font-bold text-accent mb-2">{DASHBOARD_STATS.avgResolutionTime.toFixed(1)}h</p>
              <p className="text-sm text-muted-foreground font-medium">Average time to resolve issues</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all">
              <h3 className="font-bold text-lg mb-3">Next Steps</h3>
              <ul className="text-sm text-muted-foreground font-medium space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full" />
                  Review top 3 priority issues
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full" />
                  Allocate teams to pending items
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full" />
                  Update community on progress
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
