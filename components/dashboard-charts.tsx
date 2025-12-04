"use client"

const DASHBOARD_STATS = {
  totalReports: 14832,
  resolved: 8456,
  inProgress: 3245,
  pending: 3131,
  avgResolutionTime: 28,
  resolutionRate: 73,
  communityEngagement: 15000,
}

const DEPARTMENT_PERFORMANCE = [
  { name: "Roads & Infrastructure", resolved: 3245, pending: 450 },
  { name: "Water & Utilities", resolved: 2156, pending: 340 },
  { name: "Sanitation", resolved: 1876, pending: 290 },
  { name: "Public Safety", resolved: 892, pending: 710 },
  { name: "Electricity", resolved: 287, pending: 341 },
]

export function ResolutionChart() {
  const data = [
    { name: "Resolved", value: DASHBOARD_STATS.resolved, color: "bg-green-500" },
    { name: "In Progress", value: DASHBOARD_STATS.inProgress, color: "bg-amber-500" },
    { name: "Pending", value: DASHBOARD_STATS.pending, color: "bg-red-500" },
  ]

  const total = DASHBOARD_STATS.totalReports
  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="font-semibold mb-6">Issue Resolution Status</h3>
      <div className="space-y-4">
        {data.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">{item.name}</span>
              <span className="text-muted-foreground">
                {item.value.toLocaleString()} ({Math.round((item.value / total) * 100)}%)
              </span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} transition-all`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DepartmentPerformance() {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="font-semibold mb-6">Department Performance</h3>
      <div className="space-y-4">
        {DEPARTMENT_PERFORMANCE.map((dept, i) => {
          const total = dept.resolved + dept.pending
          const resolvedPercent = (dept.resolved / total) * 100
          return (
            <div key={i}>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-sm line-clamp-1">{dept.name}</span>
                <span className="text-xs text-muted-foreground">
                  {dept.resolved}/{total}
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  style={{ width: `${resolvedPercent}%` }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function TimeSeriesChart() {
  const data = [
    { week: "Week 1", issues: 450 },
    { week: "Week 2", issues: 520 },
    { week: "Week 3", issues: 480 },
    { week: "Week 4", issues: 630 },
    { week: "Week 5", issues: 750 },
    { week: "Week 6", issues: 680 },
    { week: "Week 7", issues: 820 },
    { week: "Week 8", issues: 920 },
  ]

  const maxIssues = Math.max(...data.map((d) => d.issues))

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="font-semibold mb-6">Issues Reported Over Time</h3>
      <div className="flex items-end justify-between h-48 gap-2 px-2">
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
            <div
              className="w-full bg-gradient-to-t from-primary to-primary/70 rounded-t transition-all hover:from-primary hover:to-primary/50"
              style={{ height: `${(item.issues / maxIssues) * 180}px` }}
            ></div>
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition hidden sm:block">
              {Math.round(item.issues / 100) * 100}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
