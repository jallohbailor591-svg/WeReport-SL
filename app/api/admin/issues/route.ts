import type { NextRequest } from "next/server"
import { createServerClient_ } from "@/lib/supabase-server"
import { requireAdmin } from "@/lib/permissions"
import { checkRateLimit, DEFAULT_RATE_LIMIT, getRateLimitHeaders } from "@/lib/rate-limit"
import { successResponse, errorResponse, rateLimitResponse, serverErrorResponse } from "@/lib/api-response"

export async function GET(request: NextRequest) {
  try {
    const user = await requireAdmin()

    const rateLimitResult = await checkRateLimit(`admin:${user.id}`, DEFAULT_RATE_LIMIT)
    if (!rateLimitResult.allowed) {
      return rateLimitResponse(rateLimitResult.resetTime)
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status") || "pending"

    const supabase = await createServerClient_()

    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .eq("status", status)
      .order("upvotes", { ascending: false })
      .limit(50)

    if (error) throw error

    const response = successResponse(data || [], "Issues retrieved successfully")

    Object.entries(getRateLimitHeaders(rateLimitResult)).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error) {
    if (error instanceof Error && (error.message.includes("Unauthorized") || error.message.includes("Forbidden"))) {
      return errorResponse(error.message, error.message.includes("Unauthorized") ? 401 : 403)
    }
    return serverErrorResponse(error instanceof Error ? error : undefined)
  }
}
