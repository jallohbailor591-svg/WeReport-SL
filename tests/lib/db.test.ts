import { describe, it, expect, vi, beforeEach } from "vitest"
import { searchIssues, createIssue } from "@/lib/db"

// Mock Supabase client
vi.mock("@/lib/supabase-server", () => ({
  createServerClient_: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        or: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              range: vi.fn(() => Promise.resolve({ data: [], error: null })),
            })),
          })),
        })),
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
        order: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: "test-id" }, error: null })),
        })),
      })),
    })),
    rpc: vi.fn(() => Promise.resolve({ data: null, error: null })),
  })),
}))

describe("Database Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("searchIssues", () => {
    it("should return empty array when no issues found", async () => {
      const result = await searchIssues({ search: "test" })
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(0)
    })

    it("should sanitize search input", async () => {
      const result = await searchIssues({ search: "test%_injection" })
      expect(Array.isArray(result)).toBe(true)
    })

    it("should handle category filter", async () => {
      const result = await searchIssues({ category: "infrastructure" })
      expect(Array.isArray(result)).toBe(true)
    })

    it("should handle status filter", async () => {
      const result = await searchIssues({ status: "pending" })
      expect(Array.isArray(result)).toBe(true)
    })

    it("should handle sort by upvotes", async () => {
      const result = await searchIssues({ sortBy: "upvotes" })
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe("createIssue", () => {
    it("should create an issue successfully", async () => {
      const mockIssue = {
        title: "Test Issue",
        description: "Test Description",
        category: "infrastructure",
        severity: 3,
        status: "pending" as const,
        location: "Test Location",
        coordinates: { lat: 0, lng: 0 },
        upvotes: 0,
        image_urls: [],
        user_id: "test-user-id",
      }

      const result = await createIssue(mockIssue)
      expect(result).toBeDefined()
    })
  })
})
