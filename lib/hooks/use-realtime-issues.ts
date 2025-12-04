"use client"

import { useEffect, useState } from "react"
import { realtimeManager } from "../realtime/supabase-realtime"
import type { Issue } from "../db"

export function useRealtimeIssues(initialIssues: Issue[]) {
  const [issues, setIssues] = useState<Issue[]>(initialIssues)

  useEffect(() => {
    const subscription = realtimeManager.subscribeToIssues((payload) => {
      if (payload.eventType === "INSERT") {
        setIssues((prev) => [payload.new as Issue, ...prev])
      } else if (payload.eventType === "UPDATE") {
        setIssues((prev) => prev.map((issue) => (issue.id === payload.new.id ? (payload.new as Issue) : issue)))
      } else if (payload.eventType === "DELETE") {
        setIssues((prev) => prev.filter((issue) => issue.id !== payload.old.id))
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return issues
}

export function useRealtimeIssue(initialIssue: Issue | null) {
  const [issue, setIssue] = useState<Issue | null>(initialIssue)

  useEffect(() => {
    let subscription: any

    if (initialIssue) {
      subscription = realtimeManager.subscribeToIssues((payload) => {
        if (payload.eventType === "UPDATE" && payload.new.id === initialIssue.id) {
          setIssue(payload.new as Issue)
        } else if (payload.eventType === "DELETE" && payload.old.id === initialIssue.id) {
          setIssue(null)
        }
      })
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [initialIssue])

  return issue
}
