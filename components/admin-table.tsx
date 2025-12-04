"use client"

import Link from "next/link"
import { ArrowUpRight, ExternalLink } from "lucide-react"
import { SAMPLE_PROBLEMS, getStatusBadge } from "@/lib/sample-data"

const PRIORITY_RANKING = [
  {
    id: "5",
    title: "Dangerous intersection needs traffic light",
    location: "Intersection of Main Street and Oak Avenue",
    priority: 98.5,
    upvotes: 512,
    severity: 95,
    status: "pending",
  },
  {
    id: "1",
    title: "Large pothole on Main Street",
    location: "Main Street",
    priority: 87.3,
    upvotes: 342,
    severity: 75,
    status: "in-progress",
  },
  {
    id: "4",
    title: "Overflowing garbage collection",
    location: "Zone 3",
    priority: 76.8,
    upvotes: 234,
    severity: 85,
    status: "in-progress",
  },
  {
    id: "2",
    title: "Water supply interruption in Zone 3",
    location: "Zone 3",
    priority: 65.4,
    upvotes: 156,
    severity: 92,
    status: "resolved",
  },
  {
    id: "3",
    title: "Broken street lights on Oak Avenue",
    location: "Oak Avenue",
    priority: 54.2,
    upvotes: 89,
    severity: 70,
    status: "pending",
  },
]

export function AdminTable() {
  const priorityRanking = SAMPLE_PROBLEMS.map((problem) => {
    const statusMultiplier = problem.status === "pending" ? 1.5 : problem.status === "in-progress" ? 1.2 : 0.8
    const priority = (problem.upvotes * problem.severity * statusMultiplier) / 100
    return { ...problem, priority }
  }).sort((a, b) => b.priority - a.priority)

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left font-semibold p-4">Priority</th>
              <th className="text-left font-semibold p-4">Issue Title</th>
              <th className="text-left font-semibold p-4">Location</th>
              <th className="text-right font-semibold p-4">Upvotes</th>
              <th className="text-right font-semibold p-4">Severity</th>
              <th className="text-left font-semibold p-4">Status</th>
              <th className="text-center font-semibold p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {priorityRanking.map((issue) => {
              const badge = getStatusBadge(issue.status)
              return (
                <tr key={issue.id} className="hover:bg-muted/50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="w-4 h-4 text-accent" />
                      <span className="font-bold text-lg text-accent">{Math.round(issue.priority)}</span>
                    </div>
                  </td>
                  <td className="p-4 font-medium line-clamp-2">{issue.title}</td>
                  <td className="p-4 text-muted-foreground text-xs">{issue.location}</td>
                  <td className="p-4 text-right">
                    <span className="inline-flex items-center gap-1 font-semibold text-accent">❤️ {issue.upvotes}</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-red-500" style={{ width: `${issue.severity}%` }}></div>
                      </div>
                      <span className="text-xs font-semibold">{issue.severity}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${badge.color}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <Link
                      href={`/problem/${issue.id}`}
                      className="inline-flex items-center justify-center p-2 hover:bg-muted rounded transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
