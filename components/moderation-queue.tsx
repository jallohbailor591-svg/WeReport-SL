"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock } from "lucide-react"

interface ModerationIssue {
  id: string
  title: string
  description: string
  category: string
  status: string
  severity: number
  upvotes: number
  created_at: string
}

interface ModerationQueueProps {
  userId: string
}

export function ModerationQueue({ userId: _userId }: ModerationQueueProps) {
  const [issues, setIssues] = useState<ModerationIssue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState("pending")

  useEffect(() => {
    fetchIssues()
  }, [filter])

  const fetchIssues = async () => {
    try {
      const response = await fetch(`/api/admin/issues?status=${filter}`)
      const result = await response.json()
      if (result.success) {
        setIssues(result.data)
      }
    } catch (error) {
      console.error("[v0] Error fetching moderation issues:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateIssueStatus = async (issueId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/issues/${issueId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      const result = await response.json()
      if (result.success) {
        setIssues(issues.filter((i) => i.id !== issueId))
      }
    } catch (error) {
      console.error("[v0] Error updating issue:", error)
    }
  }

  const getSeverityColor = (severity: number) => {
    if (severity <= 2) return "bg-blue-100 text-blue-800"
    if (severity <= 3) return "bg-yellow-100 text-yellow-800"
    if (severity <= 4) return "bg-orange-100 text-orange-800"
    return "bg-red-100 text-red-800"
  }

  const getSeverityLabel = (severity: number) => {
    const labels = ["Critical", "High", "Medium", "Minor", "Low"]
    return labels[5 - severity] || "Unknown"
  }

  if (isLoading) {
    return <div className="text-muted-foreground">Loading issues...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Moderation Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            {["pending", "in-progress", "resolved"].map((status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status.replace("-", " ")}
              </Button>
            ))}
          </div>

          <div className="space-y-3">
            {issues.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No {filter} issues to moderate</div>
            ) : (
              issues.map((issue) => (
                <div key={issue.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{issue.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{issue.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(issue.severity)}>{getSeverityLabel(issue.severity)}</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span>{issue.category}</span>
                    <span>{issue.upvotes} upvotes</span>
                    <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-2">
                    {issue.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => updateIssueStatus(issue.id, "in-progress")}
                          className="gap-1"
                        >
                          <Clock className="w-3 h-3" />
                          Start Work
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => updateIssueStatus(issue.id, "rejected")}>
                          Reject
                        </Button>
                      </>
                    )}
                    {issue.status === "in-progress" && (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => updateIssueStatus(issue.id, "resolved")}
                          className="gap-1"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Mark Resolved
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => updateIssueStatus(issue.id, "pending")}>
                          Back to Pending
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => (window.location.href = `/issues/${issue.id}`)}>
                      View
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
