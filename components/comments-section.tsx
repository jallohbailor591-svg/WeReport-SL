"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface Comment {
  id: string
  author: string
  role: string
  avatar: string
  text: string
  date: string
}

export function CommentsSection({ initialComments }: { initialComments: Comment[] }) {
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const comment: Comment = {
      id: Math.random().toString(),
      author: "Your Name",
      role: "Community Member",
      avatar: "👤",
      text: newComment,
      date: new Date().toLocaleDateString(),
    }

    setComments([comment, ...comments])
    setNewComment("")
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6">
      {/* New Comment Form */}
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

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-card border border-border rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{comment.avatar}</div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{comment.author}</p>
                <p className="text-xs text-muted-foreground">
                  {comment.role} • {comment.date}
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed">{comment.text}</p>
            <div className="flex gap-4 pt-2">
              <button className="text-xs text-muted-foreground hover:text-foreground transition">Like</button>
              <button className="text-xs text-muted-foreground hover:text-foreground transition">Reply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
