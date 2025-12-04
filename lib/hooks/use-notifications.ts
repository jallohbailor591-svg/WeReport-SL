"use client"

import { useEffect, useState } from "react"
import { realtimeManager } from "../realtime/supabase-realtime"

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  issue_id?: string
  read: boolean
  created_at: string
}

export function useNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch initial notifications
  useEffect(() => {
    if (!userId) {
      setIsLoading(false)
      return
    }

    fetchNotifications()
  }, [userId])

  // Subscribe to real-time updates
  useEffect(() => {
    if (!userId) return

    const subscription = realtimeManager.subscribeToNotifications(userId, (payload) => {
      if (payload.eventType === "INSERT") {
        setNotifications((prev) => [payload.new as Notification, ...prev])
        setUnreadCount((prev) => prev + 1)

        // Show browser notification if permission granted
        if (Notification.permission === "granted") {
          new Notification(payload.new.title, {
            body: payload.new.message,
            icon: "/favicon.ico",
          })
        }
      } else if (payload.eventType === "UPDATE") {
        setNotifications((prev) =>
          prev.map((notif) => (notif.id === payload.new.id ? (payload.new as Notification) : notif)),
        )
        updateUnreadCount()
      } else if (payload.eventType === "DELETE") {
        setNotifications((prev) => prev.filter((notif) => notif.id !== payload.old.id))
        updateUnreadCount()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [userId])

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications")
      const result = await response.json()
      if (result.success) {
        setNotifications(result.data)
        setUnreadCount(result.data.filter((n: Notification) => !n.read).length)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateUnreadCount = () => {
    setUnreadCount(notifications.filter((n) => !n.read).length)
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      })

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif)),
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await Promise.all(notifications.filter((n) => !n.read).map((n) => markAsRead(n.id)))
    } catch (error) {
      console.error("Error marking all as read:", error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
        updateUnreadCount()
      }
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: fetchNotifications,
  }
}

export function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission()
  }
}
