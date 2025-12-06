import { z } from "zod"

// Issue validation schemas
export const CreateIssueSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().min(1, "Description is required").max(5000, "Description too long"),
  category: z.enum(["infrastructure", "sanitation", "safety", "environment", "healthcare", "education", "other"], {
    errorMap: () => ({ message: "Invalid category" }),
  }),
  severity: z.number().min(1).max(5).default(3),
  location: z.string().min(3, "Location is required"),
  coordinates: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    })
    .optional(),
  image_urls: z.array(z.string().url()).max(5, "Maximum 5 images allowed").default([]),
  user_id: z.string().uuid(),
})

export const UpdateIssueSchema = z.object({
  title: z.string().min(10).max(200).optional(),
  description: z.string().min(20).max(5000).optional(),
  category: z
    .enum(["infrastructure", "sanitation", "safety", "environment", "healthcare", "education", "other"])
    .optional(),
  severity: z.number().min(1).max(5).optional(),
  status: z.enum(["pending", "in-progress", "resolved", "rejected"]).optional(),
  assigned_authority: z.string().optional(),
})

export const CommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment too long"),
  issue_id: z.string().uuid(),
  user_id: z.string().uuid(),
})

export const ProfileUpdateSchema = z.object({
  first_name: z.string().min(1).max(50).optional(),
  last_name: z.string().min(1).max(50).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  avatar_url: z.string().url().optional(),
})

export const SearchIssuesSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  sortBy: z.enum(["upvotes", "newest", "trending"]).optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
})

export const BulkModerationSchema = z.object({
  issue_ids: z.array(z.string().uuid()).min(1).max(50),
  action: z.enum(["approve", "reject", "delete"]),
  reason: z.string().max(500).optional(),
})

// Utility function to validate and sanitize data
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ")
      return { success: false, error: errorMessages }
    }
    return { success: false, error: "Validation failed" }
  }
}

// Sanitize HTML to prevent XSS attacks
export function sanitizeHtml(html: string): string {
  // Remove all HTML tags except safe ones
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/on\w+="[^"]*"/g, "")
    .replace(/on\w+='[^']*'/g, "")
    .trim()
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets
    .slice(0, 10000) // Limit length
}
