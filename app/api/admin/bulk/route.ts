import type { NextRequest } from "next/server"
import { requireAdmin } from "@/lib/permissions"
import { validateData, BulkModerationSchema } from "@/lib/validation"
import { createServerClient_ } from "@/lib/supabase-server"
import { logAuditAction } from "@/lib/analytics"
import { successResponse, errorResponse, serverErrorResponse } from "@/lib/api-response"

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const body = await request.json()

    const validation = validateData(BulkModerationSchema, body)
    if (!validation.success) {
      return errorResponse(validation.error, 400)
    }

    const { issue_ids, action, reason } = validation.data
    const supabase = await createServerClient_()

    if (action === "delete") {
      // Delete multiple issues
      const { error } = await supabase.from("issues").delete().in("id", issue_ids)

      if (error) throw error

      // Log audit action
      await logAuditAction("bulk_delete", "issues", "", {
        count: issue_ids.length,
        reason,
      })
    } else {
      // Update status for multiple issues
      const statusMap = {
        approve: "in-progress",
        reject: "rejected",
      }

      const { error } = await supabase
        .from("issues")
        .update({
          status: statusMap[action as "approve" | "reject"],
          updated_at: new Date().toISOString(),
        })
        .in("id", issue_ids)

      if (error) throw error

      // Log audit action
      await logAuditAction(`bulk_${action}`, "issues", "", {
        count: issue_ids.length,
        new_status: statusMap[action as "approve" | "reject"],
        reason,
      })
    }

    return successResponse(
      { affected: issue_ids.length },
      `Successfully ${action === "delete" ? "deleted" : "updated"} ${issue_ids.length} issue(s)`,
    )
  } catch (error) {
    if (error instanceof Error && (error.message.includes("Unauthorized") || error.message.includes("Forbidden"))) {
      return errorResponse(error.message, error.message.includes("Unauthorized") ? 401 : 403)
    }
    return serverErrorResponse(error instanceof Error ? error : undefined)
  }
}
