import type { NextRequest } from "next/server"
import { requireAdmin } from "@/lib/permissions"
import { getAllTags, createTag } from "@/lib/tags"
import { checkRateLimit, DEFAULT_RATE_LIMIT } from "@/lib/rate-limit"
import { successResponse, errorResponse, rateLimitResponse, serverErrorResponse } from "@/lib/api-response"
import { z } from "zod"
import { validateData } from "@/lib/validation"

const CreateTagSchema = z.object({
  name: z.string().min(2).max(50),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().max(200).optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i)
    .optional(),
  icon: z.string().max(10).optional(),
})

export async function GET() {
  try {
    const tags = await getAllTags()
    return successResponse(tags, "Tags retrieved successfully")
  } catch (error) {
    return serverErrorResponse(error instanceof Error ? error : undefined)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin()

    const rateLimitResult = await checkRateLimit(`create-tag:${user.id}`, DEFAULT_RATE_LIMIT)
    if (!rateLimitResult.allowed) {
      return rateLimitResponse(rateLimitResult.resetTime)
    }

    const body = await request.json()
    const validation = validateData(CreateTagSchema, body)

    if (!validation.success) {
      return errorResponse(validation.error, 400)
    }

    const tag = await createTag({
      ...validation.data,
      // Ensure color is always a non-optional string to satisfy Tag type
      color: validation.data.color ?? "#000000",
    })

    if (!tag) {
      return errorResponse("Failed to create tag", 500)
    }

    return successResponse(tag, "Tag created successfully")
  } catch (error) {
    if (error instanceof Error && (error.message.includes("Unauthorized") || error.message.includes("Forbidden"))) {
      return errorResponse(error.message, error.message.includes("Unauthorized") ? 401 : 403)
    }
    return serverErrorResponse(error instanceof Error ? error : undefined)
  }
}
