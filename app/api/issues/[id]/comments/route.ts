import { type NextRequest } from "next/server"
import { getCommentsForIssue, addComment } from "@/lib/db"
import { requireAuth } from "@/lib/permissions"
import { successResponse, errorResponse, serverErrorResponse } from "@/lib/api-response"
import { checkRateLimit, DEFAULT_RATE_LIMIT, getRateLimitHeaders } from "@/lib/rate-limit"
import { CommentSchema, validateData } from "@/lib/validation"

// GET comments
export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params

        const comments = await getCommentsForIssue(id)
        return successResponse(comments, "Comments retrieved successfully")
    } catch (error) {
        return serverErrorResponse(error instanceof Error ? error : undefined)
    }
}

// POST new comment
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const user = await requireAuth()
        const { id } = await context.params

        const rateLimitResult = await checkRateLimit(`comment:${user.id}`, DEFAULT_RATE_LIMIT)
        if (!rateLimitResult.allowed) {
            return errorResponse("Rate limit exceeded", 429)
        }

        const body = await request.json()

        // Inject system fields for validation
        const payload = {
            ...body,
            issue_id: id,
            user_id: user.id
        }

        const validation = validateData(CommentSchema, payload)
        if (!validation.success) {
            return errorResponse(validation.error, 400)
        }

        const comment = await addComment(id, user.id, validation.data.content)

        if (!comment) {
            return errorResponse("Failed to post comment", 500)
        }

        const response = successResponse(comment, "Comment posted successfully")

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
