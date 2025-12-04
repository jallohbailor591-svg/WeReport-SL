import { type NextRequest } from "next/server"
import { createServerClient_ } from "@/lib/supabase-server"
import { requireAuth } from "@/lib/permissions"
import { successResponse, errorResponse, serverErrorResponse } from "@/lib/api-response"
import { z } from "zod"

const CreateNotificationSchema = z.object({
  user_id: z.string().uuid(),
  type: z.enum(["issue_update", "comment", "upvote", "status_change", "system"]),
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(1000),
  link: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId") || user.id
    const unreadOnly = searchParams.get("unread") === "true"

    // Users can only view their own notifications unless admin
    if (userId !== user.id && !user.isAdmin) {
      return errorResponse("You can only view your own notifications", 403)
    }

    const supabase = await createServerClient_()
    let query = supabase.from("notifications").select("*").eq("user_id", userId)

    if (unreadOnly) {
      query = query.eq("read", false)
    }

    const { data, error } = await query.order("created_at", { ascending: false }).limit(50)

    if (error) throw error

    return successResponse(data || [], "Notifications retrieved successfully")
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return errorResponse(error.message, 401)
    }
    console.error("[API] Error fetching notifications:", error)
    return serverErrorResponse(error instanceof Error ? error : undefined)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    // Only admins or system can create notifications
    if (!user.isAdmin) {
      return errorResponse("Only admins can create notifications", 403)
    }

    const body = await request.json()
    const validation = CreateNotificationSchema.safeParse(body)

    if (!validation.success) {
      return errorResponse("Invalid notification data", 400)
    }

    const supabase = await createServerClient_()
    const { data, error } = await supabase
      .from("notifications")
      .insert([validation.data])
      .select()
      .single()

    if (error) throw error

    return successResponse(data, "Notification created successfully", undefined, 201)
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return errorResponse(error.message, 401)
    }
    console.error("[API] Error creating notification:", error)
    return serverErrorResponse(error instanceof Error ? error : undefined)
  }
}
