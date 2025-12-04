export interface UserProfile {
  id: string
  name: string
  avatar: string
  level: "bronze" | "silver" | "gold" | "champion"
  points: number
  reportsSubmitted: number
  photosUploaded: number
  verificationsCompleted: number
  upvotesGiven: number
  badges: string[]
  joinDate: string
  district: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  condition: string
  unlockedAt?: string
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  name: string
  avatar: string
  points: number
  level: "bronze" | "silver" | "gold" | "champion"
  reportsSubmitted: number
  district: string
}

// User profiles with reputation data
export const USERS: Record<string, UserProfile> = {
  "user-1": {
    id: "user-1",
    name: "Amara Sesay",
    avatar: "👩‍💼",
    level: "gold",
    points: 2850,
    reportsSubmitted: 12,
    photosUploaded: 28,
    verificationsCompleted: 45,
    upvotesGiven: 156,
    badges: ["first-reporter", "community-guardian", "10-verified", "clean-advocate"],
    joinDate: "2024-06-15",
    district: "Freetown",
  },
  "user-2": {
    id: "user-2",
    name: "Ibrahim Koroma",
    avatar: "👨‍💼",
    level: "silver",
    points: 1650,
    reportsSubmitted: 8,
    photosUploaded: 16,
    verificationsCompleted: 32,
    upvotesGiven: 98,
    badges: ["first-reporter", "community-guardian"],
    joinDate: "2024-08-22",
    district: "Bo",
  },
  "user-3": {
    id: "user-3",
    name: "Fatima Bah",
    avatar: "👩",
    level: "champion",
    points: 4200,
    reportsSubmitted: 28,
    photosUploaded: 52,
    verificationsCompleted: 89,
    upvotesGiven: 234,
    badges: ["first-reporter", "community-guardian", "10-verified", "clean-advocate", "top-reporter"],
    joinDate: "2024-04-10",
    district: "Makeni",
  },
  "user-4": {
    id: "user-4",
    name: "Mohamed Jalloh",
    avatar: "👨",
    level: "bronze",
    points: 450,
    reportsSubmitted: 2,
    photosUploaded: 4,
    verificationsCompleted: 8,
    upvotesGiven: 23,
    badges: ["first-reporter"],
    joinDate: "2025-01-05",
    district: "Kenema",
  },
}

// Available badges with unlock conditions
export const AVAILABLE_BADGES: Badge[] = [
  {
    id: "first-reporter",
    name: "First Reporter",
    description: "Submitted your first report",
    icon: "🌟",
    condition: "Submit 1 report",
    unlockedAt: "2024-06-15",
  },
  {
    id: "community-guardian",
    name: "Community Guardian",
    description: "Verified 10 community reports",
    icon: "🛡️",
    condition: "Verify 10 reports",
    unlockedAt: "2024-07-20",
  },
  {
    id: "10-verified",
    name: "10 Verified Reports",
    description: "Had 10 reports verified by community",
    icon: "✅",
    condition: "Get 10 verifications",
  },
  {
    id: "clean-advocate",
    name: "Clean Community Advocate",
    description: "Reported 5+ waste management issues",
    icon: "🌱",
    condition: "Report 5 waste issues",
    unlockedAt: "2024-09-10",
  },
  {
    id: "top-reporter",
    name: "Top Reporter of the Week",
    description: "Most active reporter this week",
    icon: "🏆",
    condition: "Top 1 reporter weekly",
    unlockedAt: "2025-01-20",
  },
  {
    id: "safety-hero",
    name: "Safety Hero",
    description: "Reported 3+ public safety issues",
    icon: "🚨",
    condition: "Report 3 safety issues",
  },
  {
    id: "photo-master",
    name: "Photo Master",
    description: "Uploaded 25+ photos with reports",
    icon: "📸",
    condition: "Upload 25 photos",
  },
]

// Leaderboard rankings
export const LEADERBOARD_WEEKLY: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: "user-3",
    name: "Fatima Bah",
    avatar: "👩",
    points: 1240,
    level: "champion",
    reportsSubmitted: 8,
    district: "Makeni",
  },
  {
    rank: 2,
    userId: "user-1",
    name: "Amara Sesay",
    avatar: "👩‍💼",
    points: 890,
    level: "gold",
    reportsSubmitted: 5,
    district: "Freetown",
  },
  {
    rank: 3,
    userId: "user-2",
    name: "Ibrahim Koroma",
    avatar: "👨‍💼",
    points: 567,
    level: "silver",
    reportsSubmitted: 3,
    district: "Bo",
  },
  {
    rank: 4,
    userId: "user-4",
    name: "Mohamed Jalloh",
    avatar: "👨",
    points: 320,
    level: "bronze",
    reportsSubmitted: 2,
    district: "Kenema",
  },
  {
    rank: 5,
    userId: "user-5",
    name: "Sekou Bangura",
    avatar: "👨‍🎓",
    points: 245,
    level: "bronze",
    reportsSubmitted: 1,
    district: "Kono",
  },
]

export const LEADERBOARD_ALLTIME: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: "user-3",
    name: "Fatima Bah",
    avatar: "👩",
    points: 4200,
    level: "champion",
    reportsSubmitted: 28,
    district: "Makeni",
  },
  {
    rank: 2,
    userId: "user-1",
    name: "Amara Sesay",
    avatar: "👩‍💼",
    points: 2850,
    level: "gold",
    reportsSubmitted: 12,
    district: "Freetown",
  },
  {
    rank: 3,
    userId: "user-2",
    name: "Ibrahim Koroma",
    avatar: "👨‍💼",
    points: 1650,
    level: "silver",
    reportsSubmitted: 8,
    district: "Bo",
  },
  {
    rank: 4,
    userId: "user-4",
    name: "Mohamed Jalloh",
    avatar: "👨",
    points: 450,
    level: "bronze",
    reportsSubmitted: 2,
    district: "Kenema",
  },
  {
    rank: 5,
    userId: "user-5",
    name: "Sekou Bangura",
    avatar: "👨‍🎓",
    points: 345,
    level: "bronze",
    reportsSubmitted: 1,
    district: "Kono",
  },
]

// Helper functions
export const getLevelColor = (level: string) => {
  const colors: Record<string, string> = {
    bronze: "bg-orange-100 text-orange-800",
    silver: "bg-slate-100 text-slate-800",
    gold: "bg-yellow-100 text-yellow-800",
    champion: "bg-purple-100 text-purple-800",
  }
  return colors[level] || colors.bronze
}

export const getLevelFromPoints = (points: number): "bronze" | "silver" | "gold" | "champion" => {
  if (points >= 4000) return "champion"
  if (points >= 2500) return "gold"
  if (points >= 1500) return "silver"
  return "bronze"
}

export const getPointsForLevel = (level: "bronze" | "silver" | "gold" | "champion"): number => {
  const points: Record<string, number> = {
    bronze: 0,
    silver: 1500,
    gold: 2500,
    champion: 4000,
  }
  return points[level]
}
