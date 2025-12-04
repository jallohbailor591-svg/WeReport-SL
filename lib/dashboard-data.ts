export interface DashboardStats {
  totalReports: number
  resolved: number
  inProgress: number
  pending: number
  avgResolutionTime: number
  resolutionRate: number
  communityEngagement: number
}

export const calculatePriority = (upvotes: number, severity: number, reportCount: number, communityImpact: number) => {
  return upvotes * 0.3 + severity * 0.25 + reportCount * 0.25 + communityImpact * 0.2
}

export const DASHBOARD_STATS: DashboardStats = {
  totalReports: 14832,
  resolved: 8456,
  inProgress: 3245,
  pending: 3131,
  avgResolutionTime: 28,
  resolutionRate: 73,
  communityEngagement: 15000,
}

export const DEPARTMENT_PERFORMANCE = [
  { name: "Roads & Infrastructure", resolved: 3245, pending: 450 },
  { name: "Water & Utilities", resolved: 2156, pending: 340 },
  { name: "Sanitation", resolved: 1876, pending: 290 },
  { name: "Public Safety", resolved: 892, pending: 710 },
  { name: "Electricity", resolved: 287, pending: 341 },
]

export const PRIORITY_RANKING = [
  {
    id: "5",
    title: "Dangerous intersection needs traffic light",
    priority: 98.5,
    upvotes: 512,
    severity: 95,
    status: "pending",
  },
  { id: "1", title: "Large pothole on Main Street", priority: 87.3, upvotes: 342, severity: 75, status: "in-progress" },
  {
    id: "4",
    title: "Overflowing garbage collection",
    priority: 76.8,
    upvotes: 234,
    severity: 85,
    status: "in-progress",
  },
  {
    id: "2",
    title: "Water supply interruption in Zone 3",
    priority: 65.4,
    upvotes: 156,
    severity: 92,
    status: "resolved",
  },
  {
    id: "3",
    title: "Broken street lights on Oak Avenue",
    priority: 54.2,
    upvotes: 89,
    severity: 70,
    status: "pending",
  },
]
