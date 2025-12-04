import type { NextRequest } from "next/server";
import { createServerClient_ } from "@/lib/supabase-server";
import { SearchIssuesSchema } from "@/lib/validation";
import { successResponse, errorResponse, serverErrorResponse } from "@/lib/api-response";
import { checkRateLimit, DEFAULT_RATE_LIMIT, getRateLimitHeaders } from "@/lib/rate-limit";
import { log } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Rate limiting for search endpoint
    const clientId = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "anonymous"
    const rateLimitResult = await checkRateLimit(`search:${clientId}`, DEFAULT_RATE_LIMIT)
    if (!rateLimitResult.allowed) {
      return errorResponse("Rate limit exceeded. Please try again later.", 429)
    }

    const validationResult = SearchIssuesSchema.safeParse({
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "all",
      status: searchParams.get("status") || "all",
      sortBy: searchParams.get("sortBy") || "newest",
      limit: Number.parseInt(searchParams.get("limit") || "50"),
      offset: Number.parseInt(searchParams.get("offset") || "0"),
    })

    if (!validationResult.success) {
      return errorResponse("Invalid search parameters", 400)
    }

    const { search, category, status, sortBy, limit, offset } = validationResult.data
    const supabase = await createServerClient_()

    // Build query with proper index usage
    let query = supabase.from("issues").select("*", { count: "exact" })

    // Search with proper escaping - match the working pattern from lib/db.ts
    if (search && search.trim()) {
      const searchTerm = search.trim().replace(/[%_]/g, "\\$&")
      const searchPattern = `%${searchTerm}%`
      // Use the same syntax as lib/db.ts which is proven to work
      query = query.or(`title.ilike.${searchPattern},description.ilike.${searchPattern}`)
    }

    // Apply filters using indexes
    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    // Optimize sorting based on available indexes
    switch (sortBy) {
      case "upvotes":
        // Uses idx_issues_upvotes
        query = query.order("upvotes", { ascending: false }).order("created_at", { ascending: false })
        break
      case "newest":
        // Uses idx_issues_created_at
        query = query.order("created_at", { ascending: false })
        break
      case "trending":
      default:
        // Uses composite index
        query = query.order("upvotes", { ascending: false }).order("created_at", { ascending: false })
        break
    }

    // Apply pagination
    const safeLimit = Math.min(limit || 50, 100)
    const safeOffset = Math.max(offset || 0, 0)
    query = query.range(safeOffset, safeOffset + safeLimit - 1)

    const { data, error, count } = await query

    if (error) {
      log.error("Database error searching issues", error, { search, category, status })
      return serverErrorResponse(error instanceof Error ? error : undefined)
    }

    const response = successResponse(
      data || [],
      "Issues searched successfully",
      {
        limit: safeLimit,
        page: Math.floor(safeOffset / safeLimit) + 1,
        total: count || 0,
        hasMore: (count || 0) > safeOffset + safeLimit,
      },
    )

    // Add rate limit headers
    Object.entries(getRateLimitHeaders(rateLimitResult)).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error) {
    log.error("Unexpected error searching issues", error, { route: "/api/issues/search" })
    return serverErrorResponse(error instanceof Error ? error : undefined)
  }
}
