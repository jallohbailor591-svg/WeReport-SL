import type { NextRequest } from "next/server"
import { requireAdmin } from "@/lib/permissions"
import { getAnalytics } from "@/lib/analytics"
import { successResponse, errorResponse, serverErrorResponse } from "@/lib/api-response"

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined
    const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined

    const analytics = await getAnalytics(startDate, endDate)

    return successResponse(analytics, "Analytics retrieved successfully")
  } catch (error) {
    if (error instanceof Error && (error.message.includes("Unauthorized") || error.message.includes("Forbidden"))) {
      return errorResponse(error.message, error.message.includes("Unauthorized") ? 401 : 403)
    }
    return serverErrorResponse(error instanceof Error ? error : undefined)
  }
}
