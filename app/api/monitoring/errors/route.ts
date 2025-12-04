import type { NextRequest } from "next/server"
import { requireAdmin } from "@/lib/permissions"
import { monitoring } from "@/lib/monitoring"
import { successResponse, errorResponse, serverErrorResponse } from "@/lib/api-response"
import { log } from "@/lib/logger"

// Get recent error logs (admin only)
export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const searchParams = request.nextUrl.searchParams
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "50"), 100)

    const recentErrors = monitoring.getRecentErrors(limit)

    return successResponse(recentErrors, "Error logs retrieved successfully", {
      total: recentErrors.length,
      limit,
    })
  } catch (error) {
    if (error instanceof Error && (error.message.includes("Unauthorized") || error.message.includes("Forbidden"))) {
      return errorResponse(error.message, error.message.includes("Unauthorized") ? 401 : 403)
    }
    log.error("Failed to fetch error logs", error, { route: "/api/monitoring/errors" })
    return serverErrorResponse(error instanceof Error ? error : undefined)
  }
}

// Clear error logs (admin only)
export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin()

    monitoring.clearLogs()

    return successResponse(null, "Error logs cleared successfully")
  } catch (error) {
    if (error instanceof Error && (error.message.includes("Unauthorized") || error.message.includes("Forbidden"))) {
      return errorResponse(error.message, error.message.includes("Unauthorized") ? 401 : 403)
    }
    log.error("Failed to clear error logs", error, { route: "/api/monitoring/errors" })
    return serverErrorResponse(error instanceof Error ? error : undefined)
  }
}
