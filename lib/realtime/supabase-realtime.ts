"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { RealtimeChannel } from "@supabase/supabase-js"

export type RealtimeEventType = "INSERT" | "UPDATE" | "DELETE"

export interface RealtimeSubscription {
  channel: RealtimeChannel
  unsubscribe: () => void
}

class SupabaseRealtimeManager {
  private supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
  private channels: Map<string, RealtimeChannel> = new Map()

  subscribeToIssues(
    callback: (payload: any) => void,
    events: RealtimeEventType[] = ["INSERT", "UPDATE", "DELETE"],
  ): RealtimeSubscription {
    const channelName = `issues-${Date.now()}`

    const channel = this.supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "issues",
        },
        (payload) => {
          if (events.includes(payload.eventType as RealtimeEventType)) {
            callback(payload)
          }
        },
      )
      .subscribe()

    this.channels.set(channelName, channel)

    return {
      channel,
      unsubscribe: () => {
        channel.unsubscribe()
        this.channels.delete(channelName)
      },
    }
  }

  subscribeToComments(issueId: string, callback: (payload: any) => void): RealtimeSubscription {
    const channelName = `comments-${issueId}-${Date.now()}`

    const channel = this.supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `issue_id=eq.${issueId}`,
        },
        callback,
      )
      .subscribe()

    this.channels.set(channelName, channel)

    return {
      channel,
      unsubscribe: () => {
        channel.unsubscribe()
        this.channels.delete(channelName)
      },
    }
  }

  subscribeToNotifications(userId: string, callback: (payload: any) => void): RealtimeSubscription {
    const channelName = `notifications-${userId}-${Date.now()}`

    const channel = this.supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        callback,
      )
      .subscribe()

    this.channels.set(channelName, channel)

    return {
      channel,
      unsubscribe: () => {
        channel.unsubscribe()
        this.channels.delete(channelName)
      },
    }
  }

  subscribeToUpvotes(issueId: string, callback: (payload: any) => void): RealtimeSubscription {
    const channelName = `upvotes-${issueId}-${Date.now()}`

    const channel = this.supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "upvotes",
          filter: `issue_id=eq.${issueId}`,
        },
        callback,
      )
      .subscribe()

    this.channels.set(channelName, channel)

    return {
      channel,
      unsubscribe: () => {
        channel.unsubscribe()
        this.channels.delete(channelName)
      },
    }
  }

  unsubscribeAll() {
    this.channels.forEach((channel) => {
      channel.unsubscribe()
    })
    this.channels.clear()
  }
}

export const realtimeManager = new SupabaseRealtimeManager()
