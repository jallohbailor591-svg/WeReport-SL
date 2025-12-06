"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface Comment {
  id: string
  content: string
  created_at: string
  profiles?: {
    first_name: string
    last_name: string
    avatar_url: string
  }
}

export function CommentsSection({ issueId }: { issueId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/issues/${issueId}/comments`)
        if (res.ok) {
          const result = await res.json()
          setComments(result.data || [])
        }
      } catch (error) {
        console.error("Failed to load comments", error)
      } finally {
        setIsLoading(false)
      }
    }
    if (issueId) fetchComments()
  }, [issueId])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/issues/${issueId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      })

      if (res.ok) {
        const result = await res.json()
        // Optimistically add or re-fetch. Let's simple re-fetch or append if we have profile data
        // For simplicity, just append with a placeholder profile until refresh, or rely on re-fetch
        // Re-fetching is safer for data consistency
        const commentsRes = await fetch(`/api/issues/${issueId}/comments`)
        const commentsData = await commentsRes.json()
        setComments(commentsData.data || [])
        setNewComment("")
      }
    } catch (error) {
      console.error("Failed to post comment", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <div className="text-center py-4 text-muted-foreground">Loading comments...</div>

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmitComment} className="bg-muted/50 rounded-lg p-4 space-y-3">
        <textarea
          placeholder="Share your thoughts or provide updates on this issue..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setNewComment("")} disabled={!newComment.trim()}>
            Clear
          </Button>
          <Button type="submit" disabled={isSubmitting || !newComment.trim()} className="gap-2">
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Post Comment
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center italic">No comments yet. Be the first to reply!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-card border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-3">
                <div className="text-2xl">
                  {comment.profiles?.avatar_url ? (
                    <img src={comment.profiles.avatar_url} className="w-8 h-8 rounded-full" alt="User" />
                  ) : (
                    "👤"
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">
                    {comment.profiles?.first_name
                      ? `${comment.profiles.first_name} ${comment.profiles.last_name || ""}`
                      : "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
