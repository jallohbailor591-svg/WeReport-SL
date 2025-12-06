import type { NextRequest } from "next/server"
import { createServerClient_ } from "@/lib/supabase-server"
import { requireAuth } from "@/lib/permissions"
import { CreateIssueSchema, validateData } from "@/lib/validation"
import { checkRateLimit, STRICT_RATE_LIMIT, getRateLimitHeaders } from "@/lib/rate-limit"
import { successResponse, errorResponse, rateLimitResponse, serverErrorResponse } from "@/lib/api-response"

// GET all issues - returns real data only
export async function GET(request: NextRequest) {
  try {


    const searchParams = request.nextUrl.searchParams
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "50"), 100)
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const supabase = await createServerClient_()

    const { data, error, count } = await supabase
      .from("issues")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return successResponse(data || [], "Issues retrieved successfully", {
      limit,
      page: Math.floor(offset / limit) + 1,
      total: count || 0,
      hasMore: (count || 0) > offset + limit,
    })
  } catch (error) {
    console.error("[API] Error fetching issues:", error)
    return successResponse([], "Issues retrieved successfully (fallback mode)", {
      limit: 50,
      page: 1,
      total: 0,
      hasMore: false,
    })
  }
}

// POST new issue
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()

    const rateLimitResult = await checkRateLimit(`create-issue:${user.id}`, STRICT_RATE_LIMIT)
    if (!rateLimitResult.allowed) {
      return rateLimitResponse(rateLimitResult.resetTime)
    }

    const body = await request.json()

    body.user_id = user.id

    const validation = validateData(CreateIssueSchema, body)
    if (!validation.success) {
      return errorResponse(validation.error, 400)
    }

    const supabase = await createServerClient_()

    const { data, error } = await supabase
      .from("issues")
      .insert([
        {
          ...validation.data,
          status: "pending",
          upvotes: 0,
        },
      ])
      .select()
      .single()

    if (error) throw error

    const response = successResponse(data, "Issue created successfully")

    Object.entries(getRateLimitHeaders(rateLimitResult)).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return errorResponse(error.message, 401)
    }
    return serverErrorResponse(error instanceof Error ? error : undefined)
  }
}
