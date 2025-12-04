"use client"

import type React from "react"

import Link from "next/link"
import { Heart, MessageSquare, TrendingUp } from "lucide-react"
import { useState } from "react"
import { getCategoryColor, getStatusBadge } from "@/lib/sample-data"

interface ProblemCardProps {
  id: string
  title: string
  description: string
  category: string
  categoryLabel: string
  location: string
  upvotes: number
  status: string
  thumbnail: string
  reportedBy: string
  reportedDate: string
  severity: number
  initialUpvoted?: boolean
}

export function ProblemCard(props: ProblemCardProps) {
  const [upvoted, setUpvoted] = useState(props.initialUpvoted || false)
  const [upvoteCount, setUpvoteCount] = useState(props.upvotes)
  const badge = getStatusBadge(props.status)

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault()
    setUpvoted(!upvoted)
    setUpvoteCount(upvoted ? upvoteCount - 1 : upvoteCount + 1)
  }

  return (
    <Link href={`/problem/${props.id}`}>
      <div className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-accent/40 transition-all duration-300 cursor-pointer h-full flex flex-col hover:scale-105 transform">
        {/* Thumbnail Container */}
        <div className="relative h-44 bg-gradient-to-br from-muted to-muted/80 overflow-hidden">
          <img
            src={props.thumbnail || "/placeholder.svg"}
            alt={props.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {/* Overlay with status badge */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 right-3">
            <span
              className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-slate-900/90 ${badge.color} backdrop-blur-sm`}
            >
              {badge.label}
            </span>
          </div>
          {/* Severity indicator */}
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
            <TrendingUp className="w-3 h-3 text-accent" />
            <span className="text-accent font-semibold">{props.severity}%</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-4 flex-grow flex flex-col">
          {/* Title & Description */}
          <div className="space-y-2">
            <h3 className="font-bold text-base line-clamp-2 group-hover:text-accent transition-colors">
              {props.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{props.description}</p>
          </div>

          {/* Category & Location */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span
                className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${getCategoryColor(
                  props.category,
                )}`}
              >
                {props.categoryLabel}
              </span>
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
              <span className="text-base">📍</span>
              <span>{props.location}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border my-2" />

          {/* Reported Info */}
          <div className="text-xs text-muted-foreground">
            <p className="font-medium">By {props.reportedBy}</p>
            <p>{new Date(props.reportedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-1.5 text-xs font-bold transition-all px-2.5 py-1.5 rounded-lg ${
                upvoted ? "text-accent bg-accent/10" : "text-muted-foreground hover:text-accent hover:bg-accent/5"
              }`}
            >
              <Heart className={`w-4 h-4 ${upvoted ? "fill-current" : ""}`} />
              <span>{upvoteCount}</span>
            </button>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <MessageSquare className="w-4 h-4" />
              <span>{Math.floor(Math.random() * 50) + 5}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
