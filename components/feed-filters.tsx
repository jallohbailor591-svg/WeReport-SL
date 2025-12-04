"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

const CATEGORIES = [
  { id: "all", label: "All Categories" },
  { id: "water", label: "Water Supply" },
  { id: "waste", label: "Waste Management" },
  { id: "roads", label: "Roads & Potholes" },
  { id: "electricity", label: "Electricity" },
  { id: "safety", label: "Public Safety" },
]

const STATUSES = [
  { id: "all", label: "All Status" },
  { id: "pending", label: "Pending" },
  { id: "in-progress", label: "In Progress" },
  { id: "resolved", label: "Resolved" },
]

const SORT_OPTIONS = [
  { id: "trending", label: "Trending" },
  { id: "newest", label: "Newest" },
  { id: "upvotes", label: "Most Upvotes" },
]

interface FeedFiltersProps {
  onFiltersChange: (filters: any) => void
}

export function FeedFilters({ onFiltersChange }: FeedFiltersProps) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [status, setStatus] = useState("all")
  const [sort, setSort] = useState("trending")

  const handleFilterChange = () => {
    onFiltersChange({ search, category, status, sort })
  }

  const handleReset = () => {
    setSearch("")
    setCategory("all")
    setStatus("all")
    setSort("trending")
    onFiltersChange({ search: "", category: "all", status: "all", sort: "trending" })
  }

  return (
    <div className="space-y-4 p-4 bg-card border border-border rounded-lg">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search issues..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            handleFilterChange()
          }}
          className="pl-10"
        />
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-2 block">Category</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value)
              handleFilterChange()
            }}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-2 block">Status</label>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              handleFilterChange()
            }}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-2 block">Sort By</label>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value)
              handleFilterChange()
            }}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reset Button */}
      {(search || category !== "all" || status !== "all" || sort !== "trending") && (
        <Button variant="ghost" size="sm" onClick={handleReset} className="w-full gap-2">
          <X className="w-4 h-4" />
          Clear Filters
        </Button>
      )}
    </div>
  )
}
