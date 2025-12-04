import { describe, it, expect } from "vitest"
import { validateData, CreateIssueSchema, sanitizeHtml, sanitizeInput } from "@/lib/validation"

describe("Validation", () => {
  describe("validateData", () => {
    it("should validate correct issue data", () => {
      const validData = {
        title: "Test Issue Title",
        description: "This is a test description that is long enough",
        category: "infrastructure",
        severity: 3,
        location: "Test Location",
        user_id: "123e4567-e89b-12d3-a456-426614174000",
        image_urls: [],
      }

      const result = validateData(CreateIssueSchema, validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.title).toBe(validData.title)
      }
    })

    it("should reject invalid issue data", () => {
      const invalidData = {
        title: "Short",
        description: "Too short",
        category: "invalid-category",
      }

      const result = validateData(CreateIssueSchema, invalidData)
      expect(result.success).toBe(false)
    })

    it("should reject title that is too long", () => {
      const invalidData = {
        title: "a".repeat(201),
        description: "Valid description that is long enough",
        category: "infrastructure",
        location: "Test",
        user_id: "123e4567-e89b-12d3-a456-426614174000",
      }

      const result = validateData(CreateIssueSchema, invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe("sanitizeHtml", () => {
    it("should remove script tags", () => {
      const html = '<p>Test</p><script>alert("xss")</script>'
      const sanitized = sanitizeHtml(html)
      expect(sanitized).not.toContain("<script>")
    })

    it("should remove iframe tags", () => {
      const html = '<p>Test</p><iframe src="evil.com"></iframe>'
      const sanitized = sanitizeHtml(html)
      expect(sanitized).not.toContain("<iframe>")
    })

    it("should remove inline event handlers", () => {
      const html = "<div onclick=\"alert('xss')\">Test</div>"
      const sanitized = sanitizeHtml(html)
      expect(sanitized).not.toContain("onclick")
    })
  })

  describe("sanitizeInput", () => {
    it("should remove angle brackets", () => {
      const input = '<script>alert("test")</script>'
      const sanitized = sanitizeInput(input)
      expect(sanitized).not.toContain("<")
      expect(sanitized).not.toContain(">")
    })

    it("should trim whitespace", () => {
      const input = "  test  "
      const sanitized = sanitizeInput(input)
      expect(sanitized).toBe("test")
    })
  })
})
