import { type NextRequest } from "next/server"
import { createServerClient_ } from "@/lib/supabase-server"
import { requireAuth } from "@/lib/permissions"
import { ProfileUpdateSchema, validateData } from "@/lib/validation"
import { successResponse, errorResponse, serverErrorResponse } from "@/lib/api-response"

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()

    // Users can only update their own profile unless admin
    const targetUserId = body.userId || user.id
    if (targetUserId !== user.id && !user.isAdmin) {
      return errorResponse("You can only update your own profile", 403)
    }

    const { userId, ...updates } = body
    const validation = validateData(ProfileUpdateSchema, updates)

    if (!validation.success) {
      return errorResponse(validation.error, 400)
    }

    const supabase = await createServerClient_()
    const { data, error } = await supabase
      .from("profiles")
      .update({
        ...validation.data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", targetUserId)
      .select()
      .single()

    if (error) throw error

    return successResponse(data, "Profile updated successfully")
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return errorResponse(error.message, 401)
    }
    console.error("[API] Error updating profile:", error)
    return serverErrorResponse(error instanceof Error ? error : undefined)
  }
}
