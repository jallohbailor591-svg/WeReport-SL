import { createServerClient_ } from "./supabase-server"

export type Issue = {
  id: string
  title: string
  description: string
  category: string
  severity: number
  status: "pending" | "in-progress" | "resolved" | "rejected"
  location: string
  coordinates: { lat: number; lng: number }
  upvotes: number
  image_urls: string[]
  user_id: string
  assigned_authority?: string
  created_at: string
  updated_at: string
  resolved_at?: string
}

// Get all issues with pagination - optimized
export async function getIssues(limit = 50, offset = 0): Promise<Issue[]> {
  try {
    const supabase = await createServerClient_()
    const safeLimit = Math.min(limit, 100) // Cap at 100
    const safeOffset = Math.max(offset, 0)
    
    // Uses idx_issues_created_at index
    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .order("created_at", { ascending: false })
      .range(safeOffset, safeOffset + safeLimit - 1)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("[DB] Error fetching issues:", error)
    return []
  }
}

// Get single issue by ID
export async function getIssueById(id: string): Promise<Issue | null> {
  try {
    const supabase = await createServerClient_()
    const { data, error } = await supabase.from("issues").select("*").eq("id", id).single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("[v0] Error fetching issue:", error)
    return null
  }
}

// Create new issue
export async function createIssue(issue: Omit<Issue, "id" | "created_at" | "updated_at">): Promise<Issue | null> {
  try {
    const supabase = await createServerClient_()
    const { data, error } = await supabase
      .from("issues")
      .insert([
        {
          ...issue,
          coordinates: JSON.stringify(issue.coordinates),
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("[v0] Error creating issue:", error)
    return null
  }
}

// Update issue
export async function updateIssue(id: string, updates: Partial<Issue>): Promise<Issue | null> {
  try {
    const supabase = await createServerClient_()
    const { data, error } = await supabase.from("issues").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("[v0] Error updating issue:", error)
    return null
  }
}

// Delete issue
export async function deleteIssue(id: string): Promise<boolean> {
  try {
    const supabase = await createServerClient_()
    const { error } = await supabase.from("issues").delete().eq("id", id)

    if (error) throw error
    return true
  } catch (error) {
    console.error("[v0] Error deleting issue:", error)
    return false
  }
}

// Search issues with filters - optimized with proper indexing
export async function searchIssues(filters: {
  search?: string
  category?: string
  status?: string
  sortBy?: "upvotes" | "newest" | "trending"
  limit?: number
  offset?: number
}): Promise<Issue[]> {
  try {
    const supabase = await createServerClient_()
    
    // Build query with proper index usage
    let query = supabase.from("issues").select("*", { count: "exact" })

    // Use full-text search if available, otherwise use ILIKE with proper escaping
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.trim().replace(/[%_]/g, "\\$&")
      const searchPattern = `%${searchTerm}%`
      query = query.or(`title.ilike.${searchPattern},description.ilike.${searchPattern}`)
    }

    // Apply filters - these use indexes
    if (filters.category && filters.category !== "all") {
      query = query.eq("category", filters.category)
    }

    if (filters.status && filters.status !== "all") {
      query = query.eq("status", filters.status)
    }

    // Optimize sorting based on available indexes
    if (filters.sortBy === "upvotes") {
      // Uses idx_issues_upvotes
      query = query.order("upvotes", { ascending: false }).order("created_at", { ascending: false })
    } else if (filters.sortBy === "newest") {
      // Uses idx_issues_created_at
      query = query.order("created_at", { ascending: false })
    } else {
      // Trending: uses composite index if available
      query = query.order("upvotes", { ascending: false }).order("created_at", { ascending: false })
    }

    // Apply pagination
    const limit = Math.min(filters.limit || 50, 100) // Cap at 100
    const offset = Math.max(filters.offset || 0, 0)
    query = query.range(offset, offset + limit - 1)

    const { data, error } = await query

    if (error) {
      // Provide a clearer hint when Supabase returns an empty error object (common when
      // the schema hasn't been created yet in a fresh Supabase project).
      const enhancedError =
        Object.keys(error as Record<string, unknown>).length === 0
          ? new Error(
              "Supabase returned an unknown error while querying `issues`. " +
                "Make sure you have run the SQL in `scripts/001_create_issues_table.sql` and `scripts/001_add_indexes.sql` " +
                "in your Supabase project so the `issues` table and its indexes/policies exist.",
            )
          : error

      console.error("[DB] Error searching issues:", enhancedError)
      throw enhancedError
    }

    return data || []
  } catch (error) {
    console.error("[DB] Error searching issues:", error)
    return []
  }
}

// Upvote an issue
export async function upvoteIssue(issueId: string, userId: string): Promise<boolean> {
  try {
    const supabase = await createServerClient_()

    // Insert upvote (unique constraint on issue_id + user_id will prevent duplicates)
    const { error: upvoteError } = await supabase.from("upvotes").insert([
      {
        issue_id: issueId,
        user_id: userId,
      },
    ])

    if (upvoteError && !upvoteError.message.includes("duplicate")) throw upvoteError

    // Increment upvotes count on the issue
    const { error: updateError } = await supabase.rpc("increment_upvotes", {
      issue_id: issueId,
    })

    if (updateError) throw updateError
    return true
  } catch (error) {
    console.error("[v0] Error upvoting issue:", error)
    return false
  }
}

// Remove upvote from an issue
export async function removeUpvote(issueId: string, userId: string): Promise<boolean> {
  try {
    const supabase = await createServerClient_()

    const { error: deleteError } = await supabase.from("upvotes").delete().eq("issue_id", issueId).eq("user_id", userId)

    if (deleteError) throw deleteError

    // Decrement upvotes count on the issue
    const { error: updateError } = await supabase.rpc("decrement_upvotes", {
      issue_id: issueId,
    })

    if (updateError) throw updateError
    return true
  } catch (error) {
    console.error("[v0] Error removing upvote:", error)
    return false
  }
}

// Add comment to issue
export async function addComment(
  issueId: string,
  userId: string,
  content: string,
): Promise<{ id: string; created_at: string } | null> {
  try {
    const supabase = await createServerClient_()
    const { data, error } = await supabase
      .from("comments")
      .insert([
        {
          issue_id: issueId,
          user_id: userId,
          content,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("[v0] Error adding comment:", error)
    return null
  }
}

// Get comments for an issue - optimized with join
export async function getCommentsForIssue(issueId: string): Promise<any[]> {
  try {
    const supabase = await createServerClient_()
    // Uses idx_comments_issue_created index
    const { data, error } = await supabase
      .from("comments")
      .select("*, profiles(first_name, last_name, avatar_url)")
      .eq("issue_id", issueId)
      .order("created_at", { ascending: false })
      .limit(100) // Limit to prevent large responses

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("[DB] Error fetching comments:", error)
    return []
  }
}
