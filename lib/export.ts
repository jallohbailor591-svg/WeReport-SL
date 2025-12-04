import type { Issue } from "./db"

export function exportToCSV(issues: Issue[], filename = "issues-export.csv"): void {
  if (typeof window === "undefined") return

  const headers = [
    "ID",
    "Title",
    "Description",
    "Category",
    "Status",
    "Severity",
    "Location",
    "Upvotes",
    "Created At",
    "Updated At",
    "Resolved At",
  ]

  const csvContent = [
    headers.join(","),
    ...issues.map((issue) =>
      [
        issue.id,
        `"${issue.title.replace(/"/g, '""')}"`,
        `"${issue.description.replace(/"/g, '""')}"`,
        issue.category,
        issue.status,
        issue.severity,
        `"${issue.location.replace(/"/g, '""')}"`,
        issue.upvotes,
        issue.created_at,
        issue.updated_at,
        issue.resolved_at || "",
      ].join(","),
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportToJSON(issues: Issue[], filename = "issues-export.json"): void {
  if (typeof window === "undefined") return

  const jsonContent = JSON.stringify(issues, null, 2)
  const blob = new Blob([jsonContent], { type: "application/json" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export interface ExportFilters {
  startDate?: string
  endDate?: string
  status?: string
  category?: string
}

export function filterIssuesForExport(issues: Issue[], filters: ExportFilters): Issue[] {
  return issues.filter((issue) => {
    if (filters.startDate && new Date(issue.created_at) < new Date(filters.startDate)) {
      return false
    }
    if (filters.endDate && new Date(issue.created_at) > new Date(filters.endDate)) {
      return false
    }
    if (filters.status && issue.status !== filters.status) {
      return false
    }
    if (filters.category && issue.category !== filters.category) {
      return false
    }
    return true
  })
}
