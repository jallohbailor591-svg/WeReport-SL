"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ThumbsUp, MapPin, Calendar } from "lucide-react"
import type { Issue } from "@/lib/db"

interface ProblemCardClientProps {
  issue: Issue
}

export function ProblemCardClient({ issue }: ProblemCardClientProps) {
  const [upvotes, setUpvotes] = useState(issue.upvotes)
  const [hasUpvoted, setHasUpvoted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpvote = async () => {
    if (isLoading) return
    setIsLoading(true)

    try {
      const endpoint = hasUpvoted ? `/api/issues/${issue.id}/upvote/remove` : `/api/issues/${issue.id}/upvote`
      const response = await fetch(endpoint, { method: "POST" })

      if (response.ok) {
        setUpvotes((prev) => (hasUpvoted ? prev - 1 : prev + 1))
        setHasUpvoted(!hasUpvoted)
      }
    } catch (error) {
      console.error("Error toggling upvote:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
      "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      resolved: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    }
    return colors[status] || colors.pending
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
      <CardContent className="p-0">
        <div className="relative h-48 bg-muted rounded-t-lg overflow-hidden">
          {issue.image_urls && issue.image_urls.length > 0 ? (
            <img
              src={issue.image_urls[0] || "/placeholder.svg"}
              alt={issue.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
              <span className="text-6xl opacity-30">📍</span>
            </div>
          )}
          <Badge className={`absolute top-3 right-3 ${getStatusColor(issue.status)}`}>{issue.status}</Badge>
        </div>

        <div className="p-4 space-y-3">
          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">{issue.title}</h3>

          <p className="text-sm text-muted-foreground line-clamp-2">{issue.description}</p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{issue.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(issue.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <Button
              variant={hasUpvoted ? "default" : "outline"}
              size="sm"
              onClick={handleUpvote}
              disabled={isLoading}
              className="gap-1"
            >
              <ThumbsUp className={`w-4 h-4 ${hasUpvoted ? "fill-current" : ""}`} />
              {upvotes}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => (window.location.href = `/issues/${issue.id}`)}>
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
