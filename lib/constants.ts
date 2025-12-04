export const APP_CONFIG = {
  name: "WeReport",
  description: "Sierra Leone Community Issues Platform",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://wereport.sl",
  locale: "en_US",
  contact: {
    email: "support@wereport.sl",
    twitter: "@wereport_sl",
  },
} as const

export const RATE_LIMITS = {
  public: { requests: 60, window: 60 * 1000 }, // 60 req/min
  authenticated: { requests: 120, window: 60 * 1000 }, // 120 req/min
  admin: { requests: 300, window: 60 * 1000 }, // 300 req/min
} as const

export const PAGINATION = {
  defaultLimit: 24,
  maxLimit: 100,
  issuesPerPage: 24,
} as const

export const UPLOAD_LIMITS = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 5,
  allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
} as const

export const CATEGORIES = [
  { id: "infrastructure", label: "Infrastructure", icon: "🏗️" },
  { id: "sanitation", label: "Sanitation", icon: "🚮" },
  { id: "safety", label: "Public Safety", icon: "🚨" },
  { id: "environment", label: "Environment", icon: "🌳" },
  { id: "healthcare", label: "Healthcare", icon: "🏥" },
  { id: "education", label: "Education", icon: "📚" },
  { id: "utilities", label: "Utilities", icon: "💡" },
  { id: "transport", label: "Transportation", icon: "🚌" },
] as const

export const ISSUE_STATUSES = [
  { id: "pending", label: "Pending", color: "gray" },
  { id: "in-progress", label: "In Progress", color: "blue" },
  { id: "resolved", label: "Resolved", color: "green" },
  { id: "rejected", label: "Rejected", color: "red" },
] as const

export const SEVERITY_LEVELS = [
  { value: 1, label: "Low", color: "green" },
  { value: 2, label: "Medium", color: "yellow" },
  { value: 3, label: "High", color: "orange" },
  { value: 4, label: "Critical", color: "red" },
] as const

export const USER_ROLES = {
  USER: "user",
  MODERATOR: "moderator",
  ADMIN: "admin",
  AUTHORITY: "authority",
} as const

export const NOTIFICATION_TYPES = {
  ISSUE_CREATED: "issue_created",
  ISSUE_UPDATED: "issue_updated",
  ISSUE_RESOLVED: "issue_resolved",
  COMMENT_ADDED: "comment_added",
  UPVOTE_RECEIVED: "upvote_received",
  ASSIGNMENT: "assignment",
} as const
