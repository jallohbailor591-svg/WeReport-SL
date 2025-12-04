import { createServerClient_ } from "./supabase-server"
import { type NextRequest, NextResponse } from "next/server"

export type UserRole = "user" | "admin" | "moderator" | "authority"

export interface UserPermissions {
  canCreateIssue: boolean
  canEditIssue: boolean
  canDeleteIssue: boolean
  canModerateIssues: boolean
  canAccessAdminPanel: boolean
  canManageUsers: boolean
  canExportData: boolean
  canBulkModerate: boolean
  canAssignIssues: boolean
  canViewAnalytics: boolean
}

export async function getCurrentUser() {
  try {
    const supabase = await createServerClient_()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    // Fetch profile with role information
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    return {
      id: user.id,
      email: user.email,
      profile,
      isAdmin: profile?.is_admin || false,
    }
  } catch (error) {
    console.error("[Security] Error fetching current user:", error)
    return null
  }
}

export async function checkUserRole(userId: string): Promise<UserRole> {
  try {
    const supabase = await createServerClient_()
    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", userId).single()

    if (profile?.is_admin) {
      return "admin"
    }

    return "user"
  } catch (error) {
    console.error("[Security] Error checking user role:", error)
    return "user"
  }
}

export async function getUserPermissions(userId: string): Promise<UserPermissions> {
  const role = await checkUserRole(userId)

  const permissions: Record<UserRole, UserPermissions> = {
    admin: {
      canCreateIssue: true,
      canEditIssue: true,
      canDeleteIssue: true,
      canModerateIssues: true,
      canAccessAdminPanel: true,
      canManageUsers: true,
      canExportData: true,
      canBulkModerate: true,
      canAssignIssues: true,
      canViewAnalytics: true,
    },
    moderator: {
      canCreateIssue: true,
      canEditIssue: true,
      canDeleteIssue: false,
      canModerateIssues: true,
      canAccessAdminPanel: true,
      canManageUsers: false,
      canExportData: true,
      canBulkModerate: true,
      canAssignIssues: true,
      canViewAnalytics: true,
    },
    authority: {
      canCreateIssue: true,
      canEditIssue: false,
      canDeleteIssue: false,
      canModerateIssues: false,
      canAccessAdminPanel: false,
      canManageUsers: false,
      canExportData: false,
      canBulkModerate: false,
      canAssignIssues: false,
      canViewAnalytics: false,
    },
    user: {
      canCreateIssue: true,
      canEditIssue: false,
      canDeleteIssue: false,
      canModerateIssues: false,
      canAccessAdminPanel: false,
      canManageUsers: false,
      canExportData: false,
      canBulkModerate: false,
      canAssignIssues: false,
      canViewAnalytics: false,
    },
  }

  return permissions[role]
}

export async function requireAuth(_request?: NextRequest) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized: Authentication required")
  }

  return user
}

export async function requireAdmin(request?: NextRequest) {
  const user = await requireAuth(request)

  if (!user.isAdmin) {
    throw new Error("Forbidden: Admin access required")
  }

  return user
}

export async function requirePermission(permission: keyof UserPermissions) {
  const user = await requireAuth()
  const permissions = await getUserPermissions(user.id)

  if (!permissions[permission]) {
    throw new Error(`Forbidden: Missing permission '${permission}'`)
  }

  return user
}

// Middleware helper to protect API routes
export function withAuth(handler: (req: NextRequest, user: any) => Promise<NextResponse>) {
  return async (req: NextRequest, ..._args: any[]) => {
    try {
      const user = await requireAuth(req)
      return await handler(req, user)
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Authentication required",
        },
        { status: 401 },
      )
    }
  }
}

export function withAdmin(handler: (req: NextRequest, user: any) => Promise<NextResponse>) {
  return async (req: NextRequest, ..._args: any[]) => {
    try {
      const user = await requireAdmin(req)
      return await handler(req, user)
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Admin access required",
        },
        { status: error instanceof Error && error.message.includes("Unauthorized") ? 401 : 403 },
      )
    }
  }
}
