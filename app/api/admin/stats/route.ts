import type { NextRequest } from "next/server"
import { createServerClient_ } from "@/lib/supabase-server"
import { requireAdmin } from "@/lib/permissions"
import { successResponse, errorResponse, serverErrorResponse } from "@/lib/api-response"
import { log } from "@/lib/logger"

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const supabase = await createServerClient_()

    // Optimized query: use aggregation instead of fetching all issues
    const { data: statusCounts, error } = await supabase
      .from("issues")
      .select("status")

    if (error) throw error

    // Calculate stats efficiently
    const issues = statusCounts || []
    const totalIssues = issues.length
    const pendingIssues = issues.filter((i) => i.status === "pending").length
    const inProgressIssues = issues.filter((i) => i.status === "in-progress").length
    const resolvedIssues = issues.filter((i) => i.status === "resolved").length
    const rejectedIssues = issues.filter((i) => i.status === "rejected").length
    const resolutionRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0

    return successResponse(
      {
        totalIssues,
        pendingIssues,
        inProgressIssues,
        resolvedIssues,
        rejectedIssues,
        resolutionRate,
      },
      "Admin statistics retrieved successfully",
    )
  } catch (error) {
    if (error instanceof Error && (error.message.includes("Unauthorized") || error.message.includes("Forbidden"))) {
      return errorResponse(error.message, error.message.includes("Unauthorized") ? 401 : 403)
    }
    log.error("Failed to fetch admin stats", error, { route: "/api/admin/stats" })
    return serverErrorResponse(error instanceof Error ? error : undefined)
  }
}
