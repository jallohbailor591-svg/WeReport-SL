"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { IssueHeaderCard } from "@/components/issue-header-card"
import { IssueInfoCard } from "@/components/issue-info-card"
import { ImageGallery } from "@/components/image-gallery"
import { MapPreview } from "@/components/map-preview"
import { Timeline } from "@/components/timeline"
import { CommentsSection } from "@/components/comments-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { SAMPLE_PROBLEMS } from "@/lib/sample-data"
import { Heart, Share2, Flag } from "lucide-react"
import { useState as useStateHook } from "react"

interface Issue {
  id: string
  title: string
  description: string
  category: string
  categoryLabel: string
  status: string
  severity: number
  latitude: number
  longitude: number
  location: string
  imageUrls?: string[]
  authority?: string
  createdAt: string
  reportedBy?: string
  upvotes: number
}

const SAMPLE_TIMELINE_EVENTS = [
  {
    date: "Jan 15, 2025",
    title: "Issue Reported",
    description: "Community member reported this issue",
    status: "reported" as const,
  },
  {
    date: "Jan 16, 2025",
    title: "Public Acknowledged",
    description: "Authority acknowledged the issue",
    status: "acknowledged" as const,
  },
  {
    date: "Jan 18, 2025",
    title: "Work Started",
    description: "Repair work has begun",
    status: "in-progress" as const,
  },
]

export default function IssueDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [issue, setIssue] = useState<Issue | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [upvoted, setUpvoted] = useStateHook(false)
  const [upvoteCount, setUpvoteCount] = useStateHook(0)

  useEffect(() => {
    if (!id) return

    const fetchIssue = async () => {
      try {
        setLoading(true)

        // First try to fetch from API
        const response = await fetch(`/api/issues/${id}`)

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            setIssue(data.data)
            setUpvoteCount(data.data.upvotes || 0)
          } else {
            // Fallback to sample data
            const sample = SAMPLE_PROBLEMS.find((p) => p.id === id)
            if (sample) {
              setIssue({
                ...sample,
                createdAt: sample.reportedDate,
                imageUrls: [sample.thumbnail],
                latitude: sample.coordinates.lat,
                longitude: sample.coordinates.lng,
              })
              setUpvoteCount(sample.upvotes)
            } else {
              setError("Issue not found")
            }
          }
        } else {
          // Fallback to sample data
          const sample = SAMPLE_PROBLEMS.find((p) => p.id === id)
          if (sample) {
            setIssue({
              ...sample,
              createdAt: sample.reportedDate,
              imageUrls: [sample.thumbnail],
              latitude: sample.coordinates.lat,
              longitude: sample.coordinates.lng,
            })
            setUpvoteCount(sample.upvotes)
          } else {
            setError("Issue not found")
          }
        }
      } catch (err) {
        console.error("Error fetching issue:", err)
        // Fallback to sample data
        const sample = SAMPLE_PROBLEMS.find((p) => p.id === id)
        if (sample) {
          setIssue({
            ...sample,
            createdAt: sample.reportedDate,
            imageUrls: [sample.thumbnail],
            latitude: sample.coordinates.lat,
            longitude: sample.coordinates.lng,
          })
          setUpvoteCount(sample.upvotes)
        } else {
          setError("Failed to load issue")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchIssue()
  }, [id])

  const handleUpvote = async () => {
    try {
      const endpoint = upvoted ? `/api/issues/${id}/upvote/remove` : `/api/issues/${id}/upvote`
      const response = await fetch(endpoint, { method: "POST" })

      if (response.ok) {
        setUpvoted(!upvoted)
        setUpvoteCount(upvoted ? upvoteCount - 1 : upvoteCount + 1)
      }
    } catch (error) {
      console.error("Failed to toggle upvote", error)
    }
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background py-8 md:py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-96 mb-8" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Skeleton className="h-32" />
                <Skeleton className="h-48" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  if (error || !issue) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background py-8 md:py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold">Issue Not Found</h1>
              <p className="text-muted-foreground">{error || "The issue you are looking for does not exist."}</p>
              <Button onClick={() => (window.location.href = "/feed")}>← Back to Feed</Button>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <a href="/feed" className="text-sm text-primary hover:underline mb-6 inline-flex items-center gap-2">
            ← Back to Issues
          </a>

          {/* Image Gallery */}
          <div className="mb-8">
            <ImageGallery images={issue.imageUrls || ["/issue-image.jpg"]} title={issue.title} />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <IssueHeaderCard
                title={issue.title}
                category={issue.category}
                categoryLabel={issue.categoryLabel}
                location={issue.location}
                status={issue.status}
                severity={issue.severity}
                createdAt={issue.createdAt}
              />

              {/* Description */}
              <div className="space-y-2">
                <h2 className="font-semibold text-lg">Issue Description</h2>
                <p className="text-foreground leading-relaxed">{issue.description}</p>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <h2 className="font-semibold text-lg">Progress Timeline</h2>
                <Card>
                  <CardContent className="pt-6">
                    <Timeline events={SAMPLE_TIMELINE_EVENTS} />
                  </CardContent>
                </Card>
              </div>

              {/* Comments */}
              <div className="space-y-4">
                <h2 className="font-semibold text-lg">Community Discussion</h2>
                <CommentsSection issueId={id} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Action Buttons */}
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <button
                    onClick={handleUpvote}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${upvoted ? "bg-red-500 text-white" : "bg-primary/10 text-primary hover:bg-primary/20"
                      }`}
                  >
                    <Heart className={`w-5 h-5 ${upvoted ? "fill-current" : ""}`} />
                    {upvoted ? "Upvoted" : "Upvote"} ({upvoteCount})
                  </button>
                  <Button variant="outline" className="w-full gap-2 bg-transparent">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button variant="outline" className="w-full gap-2 bg-transparent">
                    <Flag className="w-4 h-4" />
                    Report
                  </Button>
                </CardContent>
              </Card>

              {/* Issue Info */}
              <IssueInfoCard reportedBy={issue.reportedBy} authority={issue.authority} severity={issue.severity} />

              {/* Map Preview */}
              <MapPreview latitude={issue.latitude} longitude={issue.longitude} location={issue.location} />

              {/* Similar Issues */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Similar Issues</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {SAMPLE_PROBLEMS.filter((p) => p.id !== issue.id && p.category === issue.category)
                    .slice(0, 2)
                    .map((p) => (
                      <a
                        key={p.id}
                        href={`/issues/${p.id}`}
                        className="block p-2 hover:bg-muted rounded transition text-sm text-muted-foreground hover:text-foreground"
                      >
                        {p.title}
                      </a>
                    ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
