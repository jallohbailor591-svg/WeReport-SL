import { describe, it, expect } from "vitest"
import { apiResponse, apiError, validateRequest } from "@/lib/api-response"

describe("API Response Utilities", () => {
  describe("apiResponse", () => {
    it("should create successful response", () => {
      const response = apiResponse({ test: "data" }, "Success message")
      expect(response.status).toBe(200)
    })

    it("should include metadata", async () => {
      const response = apiResponse({ items: [] }, "Success", { total: 0 })
      const json = await response.json()
      expect(json.metadata).toEqual({ total: 0 })
    })
  })

  describe("apiError", () => {
    it("should create error response", () => {
      const response = apiError("Error message", 400)
      expect(response.status).toBe(400)
    })

    it("should default to 500 status", () => {
      const response = apiError("Internal error")
      expect(response.status).toBe(500)
    })
  })

  describe("validateRequest", () => {
    it("should validate request method", async () => {
      const mockRequest = { method: "POST" } as Request
      const result = await validateRequest(mockRequest, ["POST"])
      expect(result).toBeNull()
    })

    it("should reject invalid method", async () => {
      const mockRequest = { method: "DELETE" } as Request
      const result = await validateRequest(mockRequest, ["GET", "POST"])
      expect(result).not.toBeNull()
      expect(result?.status).toBe(405)
    })
  })
})
