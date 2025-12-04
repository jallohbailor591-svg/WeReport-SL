"use client"

import { useState } from "react"
import { SAMPLE_PROBLEMS, getStatusBadge } from "@/lib/sample-data"
import { Heart, X } from "lucide-react"
import { useRouter } from "next/navigation"

export function MapView() {
  const router = useRouter()
  const [selectedPin, setSelectedPin] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const pins = SAMPLE_PROBLEMS.map((problem) => ({
    id: problem.id,
    lat: problem.coordinates.lat,
    lng: problem.coordinates.lng,
    title: problem.title,
    category: problem.category,
    status: problem.status,
    upvotes: problem.upvotes,
  }))

  const filteredPins = selectedCategory === "all" ? pins : pins.filter((p) => p.category === selectedCategory)
  const selected = selectedPin ? pins.find((p) => p.id === selectedPin) : null
  const problem = selected ? SAMPLE_PROBLEMS.find((p) => p.id === selected.id) : null

  const handlePinClick = (pinId: string) => {
    setSelectedPin(pinId)
  }

  const handleViewDetails = (problemId: string) => {
    router.push(`/problem/${problemId}`)
  }

  // Generate SVG map with pins
  const mapSvg = (
    <svg
      viewBox="0 0 400 300"
      className="w-full h-full bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900"
    >
      {/* Grid background */}
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(200,200,200,0.2)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="400" height="300" fill="url(#grid)" />

      {/* Major roads */}
      <line x1="50" y1="0" x2="50" y2="300" stroke="rgba(100,100,100,0.3)" strokeWidth="4" strokeDasharray="5,5" />
      <line x1="0" y1="150" x2="400" y2="150" stroke="rgba(100,100,100,0.3)" strokeWidth="4" strokeDasharray="5,5" />

      {/* Pins */}
      {filteredPins.map((pin) => {
        const isSelected = selectedPin === pin.id
        const categoryIcons: Record<string, string> = {
          roads: "🛣️",
          water: "💧",
          electricity: "⚡",
          waste: "🗑️",
          safety: "🚨",
        }
        return (
          <g key={pin.id} onClick={() => handlePinClick(pin.id)} className="cursor-pointer">
            {/* Pin background */}
            <circle
              cx={pin.lng}
              cy={pin.lat}
              r={isSelected ? 20 : 14}
              fill={isSelected ? "#fff" : "#fff"}
              stroke={isSelected ? "#1f3a93" : "#666"}
              strokeWidth={isSelected ? 3 : 2}
              className="transition-all hover:stroke-blue-600"
            />
            {/* Pin icon */}
            <text x={pin.lng} y={pin.lat} textAnchor="middle" dy="0.3em" className="text-2xl pointer-events-none">
              {categoryIcons[pin.category]}
            </text>
          </g>
        )
      })}
    </svg>
  )

  return (
    <div className="grid lg:grid-cols-3 gap-4 h-[600px]">
      {/* Map */}
      <div className="lg:col-span-2 bg-card border border-border rounded-lg overflow-hidden relative group">
        {mapSvg}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition pointer-events-none"></div>
      </div>

      {/* Sidebar */}
      <div className="flex flex-col gap-4">
        {/* Filter */}
        <div className="bg-card border border-border rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-sm">Filter by Category</h3>
          <div className="space-y-2">
            {["all", "water", "waste", "roads", "electricity", "safety"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                  selectedCategory === cat ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                {cat === "all" ? "All Issues" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Pin Details or Top Issues */}
        <div className="bg-card border border-border rounded-lg p-4 space-y-3 flex-1 overflow-y-auto">
          {selectedPin && problem ? (
            <>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Selected Issue</h3>
                <button onClick={() => setSelectedPin(null)} className="p-1 hover:bg-muted rounded transition">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-sm line-clamp-2">{problem.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{problem.location}</p>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusBadge(problem.status).color}`}>
                    {getStatusBadge(problem.status).label}
                  </span>
                  <span className="text-xs font-semibold text-accent flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-current" />
                    {problem.upvotes}
                  </span>
                </div>
                <button
                  onClick={() => handleViewDetails(problem.id)}
                  className="w-full mt-3 px-3 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition"
                >
                  View Full Details
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="font-semibold text-sm">Top Issues by Upvotes</h3>
              <div className="space-y-2">
                {SAMPLE_PROBLEMS.sort((a, b) => b.upvotes - a.upvotes)
                  .slice(0, 5)
                  .map((issue) => (
                    <button
                      key={issue.id}
                      onClick={() => setSelectedPin(issue.id)}
                      className="w-full text-left p-2 hover:bg-muted rounded transition border border-transparent hover:border-border"
                    >
                      <p className="font-medium text-xs line-clamp-1">{issue.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{issue.location}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span
                          className={`text-xs font-semibold px-1.5 py-0.5 rounded ${getStatusBadge(issue.status).color}`}
                        >
                          {getStatusBadge(issue.status).label}
                        </span>
                        <span className="text-xs font-bold text-accent">{issue.upvotes} upvotes</span>
                      </div>
                    </button>
                  ))}
              </div>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="bg-primary text-primary-foreground rounded-lg p-4 space-y-2 text-center text-sm">
          <p className="font-semibold">{filteredPins.length} Issues Reported</p>
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-primary-foreground/20">
            <div>
              <p className="font-semibold">{SAMPLE_PROBLEMS.filter((p) => p.status === "resolved").length}</p>
              <p className="opacity-80">Resolved</p>
            </div>
            <div>
              <p className="font-semibold">{SAMPLE_PROBLEMS.filter((p) => p.status !== "resolved").length}</p>
              <p className="opacity-80">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
