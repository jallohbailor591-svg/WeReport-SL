import { type NextRequest } from "next/server"
import { removeUpvote } from "@/lib/db"
import { requireAuth } from "@/lib/permissions"
import { successResponse, errorResponse, serverErrorResponse } from "@/lib/api-response"
import { checkRateLimit, DEFAULT_RATE_LIMIT, getRateLimitHeaders } from "@/lib/rate-limit"

export async function POST(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const user = await requireAuth()
        const { id } = await context.params

        const rateLimitResult = await checkRateLimit(`upvote:${user.id}`, DEFAULT_RATE_LIMIT)
        if (!rateLimitResult.allowed) {
            return errorResponse("Rate limit exceeded", 429)
        }

        const success = await removeUpvote(id, user.id)

        if (!success) {
            return errorResponse("Failed to remove upvote", 500)
        }

        const response = successResponse({ upvoted: false }, "Upvote removed successfully")

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
