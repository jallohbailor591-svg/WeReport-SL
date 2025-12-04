"use client"

import useSWR from "swr"
import type { Issue } from "../db"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch")
  const data = await res.json()
  return data.data || data
}

export function useIssues(filters?: { limit?: number; offset?: number; status?: string; category?: string }) {
  const params = new URLSearchParams()
  if (filters?.limit) params.append("limit", filters.limit.toString())
  if (filters?.offset) params.append("offset", filters.offset.toString())
  if (filters?.status) params.append("status", filters.status)
  if (filters?.category) params.append("category", filters.category)

  const { data, error, mutate, isLoading } = useSWR<Issue[]>(`/api/issues?${params.toString()}`, fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
    revalidateOnFocus: true,
    dedupingInterval: 5000,
  })

  return {
    issues: data,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useIssue(id: string) {
  const { data, error, mutate, isLoading } = useSWR<Issue>(id ? `/api/issues/${id}` : null, fetcher, {
    refreshInterval: 10000,
    revalidateOnFocus: true,
  })

  return {
    issue: data,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useAdminStats() {
  const { data, error, mutate, isLoading } = useSWR("/api/admin/stats", fetcher, {
    refreshInterval: 60000, // Refresh every minute
  })

  return {
    stats: data,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useAnalytics(startDate?: string, endDate?: string) {
  const params = new URLSearchParams()
  if (startDate) params.append("startDate", startDate)
  if (endDate) params.append("endDate", endDate)

  const { data, error, mutate, isLoading } = useSWR(`/api/analytics?${params.toString()}`, fetcher, {
    refreshInterval: 120000, // Refresh every 2 minutes
    revalidateOnFocus: false,
  })

  return {
    analytics: data,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useTags() {
  const { data, error, mutate, isLoading } = useSWR("/api/tags", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  })

  return {
    tags: data,
    isLoading,
    isError: error,
    mutate,
  }
}
