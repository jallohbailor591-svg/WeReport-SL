"use client"

import { Navigation } from "@/components/navigation"
import { Timeline } from "@/components/timeline"
import { CommentsSection } from "@/components/comments-section"
import { Button } from "@/components/ui/button"
import { SAMPLE_PROBLEMS, getStatusBadge, getCategoryColor } from "@/lib/sample-data"
import { Heart, Share2, Flag, MapPin, User, Calendar } from "lucide-react"
import { useState } from "react"

const TIMELINE_EVENTS = [
  {
    date: "Jan 15, 2025",
    title: "Issue Reported",
    description: "Sarah Chen reported this issue with photographic evidence",
    status: "reported" as const,
  },
  {
    date: "Jan 16, 2025",
    title: "Public Acknowledged",
    description: "Issue was acknowledged by the city and added to priority list",
    status: "acknowledged" as const,
  },
  {
    date: "Jan 18, 2025",
    title: "Work Started",
    description: "Road maintenance crew began repair work",
    status: "in-progress" as const,
  },
  {
    date: "Jan 20, 2025",
    title: "Nearly Complete",
    description: "Repairs are 90% complete, expected to finish within 2 days",
    status: "in-progress" as const,
  },
]

const COMMENTS = [
  {
    id: "1",
    author: "James Robertson",
    role: "City Council Member",
    avatar: "🏛️",
    text: "Thank you for reporting this issue. Our team has prioritized it and started repairs. We expect completion within a week.",
    date: "Jan 16, 2025",
  },
  {
    id: "2",
    author: "Michael Chen",
    role: "Community Member",
    avatar: "👨",
    text: "I also hit this pothole this morning and damaged my tire. Glad it's finally being fixed!",
    date: "Jan 17, 2025",
  },
  {
    id: "3",
    author: "Lisa Wong",
    role: "Community Member",
    avatar: "👩",
    text: "This pothole has been there for months. Great work getting it fixed so quickly with community support!",
    date: "Jan 15, 2025",
  },
]

export default function ProblemDetailPage({ params }: { params: { id: string } }) {
  const problem = SAMPLE_PROBLEMS.find((p) => p.id === params.id) || SAMPLE_PROBLEMS[0]
  const badge = getStatusBadge(problem.status)
  const [upvoted, setUpvoted] = useState(false)
  const [upvoteCount, setUpvoteCount] = useState(problem.upvotes)

  const handleUpvote = () => {
    setUpvoted(!upvoted)
    setUpvoteCount(upvoted ? upvoteCount - 1 : upvoteCount + 1)
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Back Button */}
          <a href="/feed" className="text-sm text-primary hover:underline mb-6 inline-flex items-center gap-2">
            ← Back to Feed
          </a>

          {/* Main Image */}
          <div className="relative h-96 bg-muted rounded-lg overflow-hidden mb-8">
            <img
              src={problem.thumbnail || "/placeholder.svg"}
              alt={problem.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${badge.color}`}>
                {badge.label}
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title and Info */}
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-balance">{problem.title}</h1>
                <div className="flex flex-wrap gap-3 items-center">
                  <span
                    className={`inline-block px-3 py-1 rounded text-xs font-semibold ${getCategoryColor(problem.category)}`}
                  >
                    {problem.categoryLabel}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {problem.location}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h2 className="font-semibold">Issue Description</h2>
                <p className="text-foreground leading-relaxed">{problem.description}</p>
              </div>

              {/* Metadata */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">
                      Reported By
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <p className="font-medium text-sm">{problem.reportedBy}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">
                      Reported Date
                    </p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <p className="font-medium text-sm">{new Date(problem.reportedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">
                      Community Support
                    </p>
                    <p className="font-bold text-lg text-accent">{upvoteCount} upvotes</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <h2 className="font-semibold text-lg">Progress Timeline</h2>
                <div className="bg-card border border-border rounded-lg p-6">
                  <Timeline events={TIMELINE_EVENTS} />
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-4">
                <h2 className="font-semibold text-lg">Community Discussion</h2>
                <CommentsSection initialComments={COMMENTS} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Action Buttons */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                <button
                  onClick={handleUpvote}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                    upvoted ? "bg-accent text-accent-foreground" : "bg-primary/10 text-primary hover:bg-primary/20"
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
              </div>

              {/* Quick Stats */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                <h3 className="font-semibold">Quick Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-semibold">{badge.label}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-semibold text-right text-xs">{problem.location}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-border">
                    <span className="text-muted-foreground">Community Support</span>
                    <span className="font-bold text-accent">{upvoteCount}</span>
                  </div>
                </div>
              </div>

              {/* Related Issues */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                <h3 className="font-semibold">Similar Issues</h3>
                <div className="space-y-2 text-sm">
                  {SAMPLE_PROBLEMS.filter((p) => p.id !== problem.id && p.category === problem.category)
                    .slice(0, 2)
                    .map((p) => (
                      <a
                        key={p.id}
                        href={`/problem/${p.id}`}
                        className="block p-2 hover:bg-muted rounded transition text-muted-foreground hover:text-foreground"
                      >
                        {p.title}
                      </a>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
