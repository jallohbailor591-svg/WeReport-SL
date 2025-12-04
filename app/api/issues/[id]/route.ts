import { type NextRequest } from "next/server"
import { getIssueById, updateIssue, deleteIssue } from "@/lib/db"
import { UpdateIssueSchema, validateData } from "@/lib/validation"
import { requireAuth } from "@/lib/permissions"
import { successResponse, errorResponse, notFoundResponse, serverErrorResponse } from "@/lib/api-response"
import { z } from "zod"

// GET single issue by ID
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
    if (!id || !z.string().uuid().safeParse(id).success) {
      return errorResponse("Invalid issue ID", 400)
    }

    const issue = await getIssueById(id)
    
    if (!issue) {
      return notFoundResponse("Issue")
    }

    return successResponse(issue, "Issue retrieved successfully")
  } catch (error) {
    console.error("[API] Error fetching issue:", error)
    return serverErrorResponse(error instanceof Error ? error : undefined)
  }
}

// PUT update issue
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth()
    const { id } = params
    
    if (!id || !z.string().uuid().safeParse(id).success) {
      return errorResponse("Invalid issue ID", 400)
    }

    // Check if issue exists and user has permission
    const existingIssue = await getIssueById(id)
    if (!existingIssue) {
      return notFoundResponse("Issue")
    }

    // Only allow users to update their own issues unless they're admin
    if (existingIssue.user_id !== user.id && !user.isAdmin) {
      return errorResponse("You can only update your own issues", 403)
    }

    const body = await request.json()
    const validation = validateData(UpdateIssueSchema, body)
    
    if (!validation.success) {
      return errorResponse(validation.error, 400)
    }

    const updatedIssue = await updateIssue(id, validation.data)

    if (!updatedIssue) {
      return errorResponse("Failed to update issue", 500)
    }

    return successResponse(updatedIssue, "Issue updated successfully")
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return errorResponse(error.message, 401)
    }
    console.error("[API] Error updating issue:", error)
    return serverErrorResponse(error instanceof Error ? error : undefined)
  }
}

// DELETE issue
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth()
    const { id } = params
    
    if (!id || !z.string().uuid().safeParse(id).success) {
      return errorResponse("Invalid issue ID", 400)
    }

    // Check if issue exists and user has permission
    const existingIssue = await getIssueById(id)
    if (!existingIssue) {
      return notFoundResponse("Issue")
    }

    // Only allow users to delete their own issues or admins
    if (existingIssue.user_id !== user.id && !user.isAdmin) {
      return errorResponse("You can only delete your own issues", 403)
    }

    const success = await deleteIssue(id)

    if (!success) {
      return errorResponse("Failed to delete issue", 500)
    }

    return successResponse(null, "Issue deleted successfully")
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return errorResponse(error.message, 401)
    }
    console.error("[API] Error deleting issue:", error)
    return serverErrorResponse(error instanceof Error ? error : undefined)
  }
}