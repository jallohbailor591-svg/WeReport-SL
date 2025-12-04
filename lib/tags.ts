import { createServerClient_ } from "./supabase-server"

export interface Tag {
  id: string
  name: string
  slug: string
  description?: string
  color: string
  icon?: string
  usage_count: number
  created_at: string
  updated_at: string
}

export async function getAllTags(): Promise<Tag[]> {
  try {
    const supabase = await createServerClient_()
    const { data, error } = await supabase.from("tags").select("*").order("usage_count", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("[Tags] Error fetching tags:", error)
    return []
  }
}

export async function getTagById(id: string): Promise<Tag | null> {
  try {
    const supabase = await createServerClient_()
    const { data, error } = await supabase.from("tags").select("*").eq("id", id).single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("[Tags] Error fetching tag:", error)
    return null
  }
}

export async function createTag(
  tag: Omit<Tag, "id" | "usage_count" | "created_at" | "updated_at">,
): Promise<Tag | null> {
  try {
    const supabase = await createServerClient_()
    const { data, error } = await supabase.from("tags").insert([tag]).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("[Tags] Error creating tag:", error)
    return null
  }
}

export async function addTagsToIssue(issueId: string, tagIds: string[]): Promise<boolean> {
  try {
    const supabase = await createServerClient_()

    const insertData = tagIds.map((tagId) => ({
      issue_id: issueId,
      tag_id: tagId,
    }))

    const { error } = await supabase.from("issue_tags").insert(insertData)

    if (error) throw error
    return true
  } catch (error) {
    console.error("[Tags] Error adding tags to issue:", error)
    return false
  }
}

export async function removeTagFromIssue(issueId: string, tagId: string): Promise<boolean> {
  try {
    const supabase = await createServerClient_()
    const { error } = await supabase.from("issue_tags").delete().eq("issue_id", issueId).eq("tag_id", tagId)

    if (error) throw error
    return true
  } catch (error) {
    console.error("[Tags] Error removing tag from issue:", error)
    return false
  }
}

export async function getIssueTagsWithDetails(issueId: string): Promise<Tag[]> {
  try {
    const supabase = await createServerClient_()
    const { data, error } = await supabase.from("issue_tags").select("tags(*)").eq("issue_id", issueId)

    if (error) throw error
    return data?.map((item: any) => item.tags) || []
  } catch (error) {
    console.error("[Tags] Error fetching issue tags:", error)
    return []
  }
}

export async function getTrendingTags(limit = 10): Promise<Tag[]> {
  try {
    const supabase = await createServerClient_()
    const { data, error } = await supabase
      .from("tags")
      .select("*")
      .order("usage_count", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("[Tags] Error fetching trending tags:", error)
    return []
  }
}
