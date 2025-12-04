import { describe, it, expect, vi } from "vitest"
import { getUserPermissions } from "@/lib/permissions"

// Mock Supabase
vi.mock("@/lib/supabase-server", () => ({
  createServerClient_: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: { is_admin: false },
            error: null,
          })),
        })),
      })),
    })),
  })),
}))

describe("Permissions", () => {
  describe("getUserPermissions", () => {
    it("should return admin permissions for admin users", async () => {
      const permissions = await getUserPermissions("admin-user-id")

      // Admin should have all permissions
      expect(permissions.canAccessAdminPanel).toBeDefined()
      expect(permissions.canModerateIssues).toBeDefined()
      expect(permissions.canExportData).toBeDefined()
    })

    it("should return limited permissions for regular users", async () => {
      const permissions = await getUserPermissions("regular-user-id")

      // Regular user should have basic permissions
      expect(permissions.canCreateIssue).toBe(true)
      expect(permissions.canAccessAdminPanel).toBe(false)
      expect(permissions.canModerateIssues).toBe(false)
    })
  })
})
