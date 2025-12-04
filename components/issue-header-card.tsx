import { MapPin, Clock, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getSeverityColor } from "@/lib/sample-data"

interface IssueHeaderCardProps {
  title: string
  category: string
  categoryLabel: string
  location: string
  status: string
  severity: number
  createdAt: string
}

export function IssueHeaderCard({
  title,
  category,
  categoryLabel,
  location,
  status,
  severity,
  createdAt,
}: IssueHeaderCardProps) {
  const statusColors: Record<string, string> = {
    pending: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
    "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    resolved: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  }

  const categoryColors: Record<string, string> = {
    water: "bg-blue-100 text-blue-800",
    waste: "bg-amber-100 text-amber-800",
    roads: "bg-slate-100 text-slate-800",
    electricity: "bg-yellow-100 text-yellow-800",
    safety: "bg-red-100 text-red-800",
  }

  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-bold text-balance">{title}</h1>

      <div className="flex flex-wrap gap-3 items-center">
        <span
          className={`inline-block px-3 py-1 rounded text-xs font-semibold ${categoryColors[category] || categoryColors.roads}`}
        >
          {categoryLabel}
        </span>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          {location}
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          {new Date(createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Badge className={statusColors[status] || statusColors.pending}>
          {status === "in-progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
        <div
          className={`px-3 py-1 rounded text-sm font-semibold flex items-center gap-1 ${getSeverityColor(severity)}`}
        >
          <AlertCircle className="w-4 h-4" />
          Severity: {severity}%
        </div>
      </div>
    </div>
  )
}
