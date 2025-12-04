"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Issue {
  id: string
  title: string
  description: string
  category: string
  status: string
  upvotes: number
  created_at: string
}

interface BulkModerationProps {
  issues: Issue[]
  onUpdate: () => void
}

export function BulkModeration({ issues, onUpdate }: BulkModerationProps) {
  const [selectedIssues, setSelectedIssues] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const toggleIssue = (issueId: string) => {
    const newSelected = new Set(selectedIssues)
    if (newSelected.has(issueId)) {
      newSelected.delete(issueId)
    } else {
      newSelected.add(issueId)
    }
    setSelectedIssues(newSelected)
  }

  const toggleAll = () => {
    if (selectedIssues.size === issues.length) {
      setSelectedIssues(new Set())
    } else {
      setSelectedIssues(new Set(issues.map((i) => i.id)))
    }
  }

  const handleBulkAction = async (action: "approve" | "reject" | "delete") => {
    if (selectedIssues.size === 0) {
      toast({
        title: "No issues selected",
        description: "Please select at least one issue",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const statusMap = {
        approve: "in-progress",
        reject: "rejected",
        delete: "delete",
      }

      if (action === "delete") {
        // Delete issues
        await Promise.all(Array.from(selectedIssues).map((id) => fetch(`/api/issues/${id}`, { method: "DELETE" })))
      } else {
        // Update status
        await Promise.all(
          Array.from(selectedIssues).map((id) =>
            fetch(`/api/issues/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: statusMap[action] }),
            }),
          ),
        )
      }

      toast({
        title: "Success",
        description: `${selectedIssues.size} issue(s) ${action === "delete" ? "deleted" : "updated"}`,
      })

      setSelectedIssues(new Set())
      onUpdate()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to perform bulk action",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Bulk Moderation</CardTitle>
          <Badge variant="secondary">{selectedIssues.size} selected</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" variant="outline" onClick={toggleAll} disabled={isLoading || issues.length === 0}>
            {selectedIssues.size === issues.length ? "Deselect All" : "Select All"}
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={() => handleBulkAction("approve")}
            disabled={isLoading || selectedIssues.size === 0}
            className="gap-1"
          >
            <CheckCircle className="w-4 h-4" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleBulkAction("reject")}
            disabled={isLoading || selectedIssues.size === 0}
            className="gap-1"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleBulkAction("delete")}
            disabled={isLoading || selectedIssues.size === 0}
            className="gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {issues.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No issues to moderate</div>
          ) : (
            issues.map((issue) => (
              <div
                key={issue.id}
                className={`flex items-start gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition cursor-pointer ${
                  selectedIssues.has(issue.id) ? "bg-primary/5 border-primary" : ""
                }`}
                onClick={() => toggleIssue(issue.id)}
              >
                <Checkbox
                  checked={selectedIssues.has(issue.id)}
                  onCheckedChange={() => toggleIssue(issue.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm mb-1 line-clamp-1">{issue.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{issue.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {issue.category}
                    </Badge>
                    <span>{issue.upvotes} upvotes</span>
                    <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
