import { createServerClient_ } from "./supabase-server"

export interface AnalyticsData {
  totalIssues: number
  pendingIssues: number
  inProgressIssues: number
  resolvedIssues: number
  rejectedIssues: number
  totalUsers: number
  totalComments: number
  totalUpvotes: number
  avgResolutionTimeHours: number
  issuesByCategory: Record<string, number>
  issuesByStatus: Record<string, number>
  issuesTrend: Array<{ date: string; count: number }>
  topReporters: Array<{ id: string; name: string; count: number }>
}

export async function getAnalytics(_startDate?: Date, _endDate?: Date): Promise<AnalyticsData> {
  try {
    const supabase = await createServerClient_()

    // Get total issues with status breakdown
    const { data: issueStats } = await supabase.from("issues").select("status, category, created_at, resolved_at")

    const totalIssues = issueStats?.length || 0
    const pendingIssues = issueStats?.filter((i) => i.status === "pending").length || 0
    const inProgressIssues = issueStats?.filter((i) => i.status === "in-progress").length || 0
    const resolvedIssues = issueStats?.filter((i) => i.status === "resolved").length || 0
    const rejectedIssues = issueStats?.filter((i) => i.status === "rejected").length || 0

    // Calculate average resolution time
    const resolvedWithTime = issueStats?.filter((i) => i.status === "resolved" && i.resolved_at) || []
    const avgResolutionTimeHours =
      resolvedWithTime.length > 0
        ? resolvedWithTime.reduce((acc, issue) => {
            const created = new Date(issue.created_at).getTime()
            const resolved = new Date(issue.resolved_at!).getTime()
            return acc + (resolved - created) / (1000 * 60 * 60)
          }, 0) / resolvedWithTime.length
        : 0

    // Get issues by category
    const issuesByCategory =
      issueStats?.reduce(
        (acc, issue) => {
          acc[issue.category] = (acc[issue.category] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ) || {}

    // Get issues by status
    const issuesByStatus = {
      pending: pendingIssues,
      "in-progress": inProgressIssues,
      resolved: resolvedIssues,
      rejected: rejectedIssues,
    }

    // Get user stats
    const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true })

    const { count: totalComments } = await supabase.from("comments").select("*", { count: "exact", head: true })

    const { count: totalUpvotes } = await supabase.from("upvotes").select("*", { count: "exact", head: true })

    // Get top reporters
    const { data: reporterStats } = await supabase.from("issues").select("user_id, profiles(first_name, last_name)")

    const reporterCounts =
      reporterStats?.reduce(
        (acc, issue) => {
          const userId = issue.user_id
          if (!acc[userId]) {
            acc[userId] = {
              id: userId,
              name:
                `${(issue as any).profiles?.first_name || ""} ${(issue as any).profiles?.last_name || ""}`.trim() ||
                "Unknown",
              count: 0,
            }
          }
          acc[userId].count++
          return acc
        },
        {} as Record<string, any>,
      ) || {}

    const topReporters = Object.values(reporterCounts)
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 10)

    // Get issues trend (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: trendData } = await supabase
      .from("issues")
      .select("created_at")
      .gte("created_at", thirtyDaysAgo.toISOString())

    const issuesTrend =
      trendData?.reduce(
        (acc, issue) => {
          const date = new Date(issue.created_at).toISOString().split("T")[0]
          const existing = acc.find((item) => item.date === date)
          if (existing) {
            existing.count++
          } else {
            acc.push({ date, count: 1 })
          }
          return acc
        },
        [] as Array<{ date: string; count: number }>,
      ) || []

    return {
      totalIssues,
      pendingIssues,
      inProgressIssues,
      resolvedIssues,
      rejectedIssues,
      totalUsers: totalUsers || 0,
      totalComments: totalComments || 0,
      totalUpvotes: totalUpvotes || 0,
      avgResolutionTimeHours: Math.round(avgResolutionTimeHours * 10) / 10,
      issuesByCategory,
      issuesByStatus,
      issuesTrend,
      topReporters,
    }
  } catch (error) {
    console.error("[Analytics] Error fetching analytics:", error)
    throw error
  }
}

export async function logAuditAction(
  action: string,
  resourceType: string,
  resourceId: string,
  metadata?: Record<string, any>,
): Promise<void> {
  try {
    const supabase = await createServerClient_()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    await supabase.from("audit_logs").insert([
      {
        user_id: user.id,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        metadata,
      },
    ])
  } catch (error) {
    console.error("[Analytics] Error logging audit action:", error)
  }
}
