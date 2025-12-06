import { Navigation } from "@/components/navigation"
import { ProblemCardClient } from "@/components/problem-card-client"
import { FeedFiltersClient } from "@/components/feed-filters-client"
import { Zap } from "lucide-react"
import { searchIssues } from "@/lib/db"
import { getIssueStats } from "@/lib/db-stats"
import { Suspense } from "react"
import { FeedSkeleton } from "@/components/feed-skeleton"

interface PageProps {
  searchParams: Promise<{
    search?: string
    category?: string
    status?: string
    sort?: "upvotes" | "newest" | "trending"
    page?: string
  }>
}

export default async function FeedPage(props: PageProps) {
  const searchParams = await props.searchParams
  const { search, category, status, sort } = searchParams
  const page = Number.parseInt(searchParams.page || "1", 10)
  const limit = 24
  const offset = (page - 1) * limit

  // Fetch data in parallel
  const [issues, stats] = await Promise.all([
    searchIssues({
      search,
      category,
      status,
      sortBy: sort || "newest",
      limit: limit,
      offset: offset,
    }),
    getIssueStats()
  ])

  const paginatedIssues = issues
  const hasMore = issues.length >= limit // This is an approximation since we don't fetch n+1, but standard behavior is fine or we can match `limit` behavior if we fetched extra. 
  // Actually, let's trust the current page size. If it's less than limit, we know we are done. If it matches limit, there MIGHT be more.
  // Ideally we query count.
  const hasPrev = page > 1

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-b border-border py-10 md:py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-balance text-foreground">Community Issues</h1>
                <p className="text-muted-foreground mt-2 text-base md:text-lg">
                  Browse and upvote local problems being tracked across Sierra Leone
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  {stats.total} Active
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          {/* Filters */}
          <div className="mb-10">
            <Suspense fallback={<div className="h-32 bg-card animate-pulse rounded-lg" />}>
              <FeedFiltersClient />
            </Suspense>
          </div>

          {/* Problem Grid */}
          {paginatedIssues.length > 0 ? (
            <>
              <Suspense fallback={<FeedSkeleton />}>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {paginatedIssues.map((issue) => (
                    <ProblemCardClient key={issue.id} issue={issue} />
                  ))}
                </div>
              </Suspense>

              <div className="flex justify-center gap-2 mb-16">
                {hasPrev && (
                  <a
                    href={`/feed?${new URLSearchParams({
                      ...(search && { search }),
                      ...(category && category !== "all" && { category }),
                      ...(status && status !== "all" && { status }),
                      ...(sort && sort !== "newest" && { sort }),
                      page: (page - 1).toString(),
                    })}`}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-muted hover:border-emerald-500 transition-all font-medium"
                  >
                    Previous
                  </a>
                )}
                <span className="px-4 py-2 text-muted-foreground font-medium">Page {page}</span>
                {/* Simple Next Logic: If we got a full page, assume there's a next page */}
                {paginatedIssues.length === limit && (
                  <a
                    href={`/feed?${new URLSearchParams({
                      ...(search && { search }),
                      ...(category && category !== "all" && { category }),
                      ...(status && status !== "all" && { status }),
                      ...(sort && sort !== "newest" && { sort }),
                      page: (page + 1).toString(),
                    })}`}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-muted hover:border-emerald-500 transition-all font-medium"
                  >
                    Next
                  </a>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-card border border-border rounded-xl">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2 text-foreground">No issues found</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Try adjusting your filters or search terms to find community issues
              </p>
            </div>
          )}

          {/* Stats Section */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-border rounded-xl p-8">
            {[
              { label: "Total Issues", value: stats.total, icon: "📊" },
              { label: "Resolved", value: stats.resolved, icon: "✅" },
              {
                label: "In Progress",
                value: stats.inProgress,
                icon: "⚙️",
              },
              { label: "Pending", value: stats.pending, icon: "⏳" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
