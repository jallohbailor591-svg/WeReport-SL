import { type NextRequest } from "next/server"
import { createServerClient_ } from "@/lib/supabase-server"
import { requireAuth } from "@/lib/permissions"
import { successResponse, errorResponse, notFoundResponse, serverErrorResponse } from "@/lib/api-response"
import { z } from "zod"

const UpdateNotificationSchema = z.object({
  read: z.boolean().optional(),
})

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth()
    const { id } = await params

    if (!id || !z.string().uuid().safeParse(id).success) {
      return errorResponse("Invalid notification ID", 400)
    }

    // Check if notification exists and belongs to user
    const supabase = await createServerClient_()
    const { data: notification, error: fetchError } = await supabase
      .from("notifications")
      .select("user_id")
      .eq("id", id)
      .single()

    if (fetchError || !notification) {
      return notFoundResponse("Notification")
    }

    // Users can only update their own notifications
    if (notification.user_id !== user.id && !user.isAdmin) {
      return errorResponse("You can only update your own notifications", 403)
    }

    const body = await request.json()
    const validation = UpdateNotificationSchema.safeParse(body)

    if (!validation.success) {
      return errorResponse("Invalid update data", 400)
    }

    const { data, error } = await supabase
      .from("notifications")
      .update(validation.data)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return successResponse(data, "Notification updated successfully")
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return errorResponse(error.message, 401)
    }
    console.error("[API] Error updating notification:", error)
    return serverErrorResponse(error instanceof Error ? error : undefined)
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth()
    const { id } = await params

    if (!id || !z.string().uuid().safeParse(id).success) {
      return errorResponse("Invalid notification ID", 400)
    }

    // Check if notification exists and belongs to user
    const supabase = await createServerClient_()
    const { data: notification, error: fetchError } = await supabase
      .from("notifications")
      .select("user_id")
      .eq("id", id)
      .single()

    if (fetchError || !notification) {
      return notFoundResponse("Notification")
    }

    // Users can only delete their own notifications
    if (notification.user_id !== user.id && !user.isAdmin) {
      return errorResponse("You can only delete your own notifications", 403)
    }

    const { error } = await supabase.from("notifications").delete().eq("id", id)

    if (error) throw error

    return successResponse(null, "Notification deleted successfully")
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return errorResponse(error.message, 401)
    }
    console.error("[API] Error deleting notification:", error)
    return serverErrorResponse(error instanceof Error ? error : undefined)
  }
}
