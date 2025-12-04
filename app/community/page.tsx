"use client"

import { Navigation } from "@/components/navigation"
import { UserReputationCard } from "@/components/user-reputation-card"
import { Leaderboard } from "@/components/leaderboard"
import { USERS, AVAILABLE_BADGES } from "@/lib/gamification-data"
import { Award, Zap, Medal } from "lucide-react"

export default function CommunityPage() {
  const currentUser = USERS["user-1"] // Amara Sesay
  const allUsers = Object.values(USERS)

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 text-balance">
              Community Engagement & Gamification
            </h1>
            <p className="text-lg text-slate-600 font-semibold">
              Earn points, unlock badges, and climb the leaderboard by helping your community
            </p>
          </div>

          {/* Current User Profile */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-6 h-6 text-blue-600" />
              Your Reputation
            </h2>
            <UserReputationCard user={currentUser} variant="full" />
          </div>

          {/* How to Earn Points */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 space-y-4">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Medal className="w-6 h-6 text-blue-600" />
              How to Earn Points
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <p className="font-bold text-slate-900 mb-1">Report an Issue</p>
                <p className="text-sm text-slate-600">+50 points</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <p className="font-bold text-slate-900 mb-1">Upload Photo</p>
                <p className="text-sm text-slate-600">+25 points per photo</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <p className="font-bold text-slate-900 mb-1">Verify Report</p>
                <p className="text-sm text-slate-600">+15 points</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <p className="font-bold text-slate-900 mb-1">Complete Profile</p>
                <p className="text-sm text-slate-600">+100 points (one-time)</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <p className="font-bold text-slate-900 mb-1">Upvote Report</p>
                <p className="text-sm text-slate-600">+5 points per upvote</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <p className="font-bold text-slate-900 mb-1">User Levels</p>
                <p className="text-xs text-slate-600">Bronze: 0+ • Silver: 1500+ • Gold: 2500+ • Champion: 4000+</p>
              </div>
            </div>
          </div>

          {/* Available Badges */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" />
              Unlock Badges
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {AVAILABLE_BADGES.map((badge) => {
                const isUnlocked = currentUser.badges.includes(badge.id)
                return (
                  <div
                    key={badge.id}
                    className={`rounded-xl p-6 border-2 transition ${
                      isUnlocked
                        ? "bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300"
                        : "bg-slate-50 border-slate-200 opacity-75"
                    }`}
                  >
                    <div className="text-5xl mb-3">{badge.icon}</div>
                    <h3 className="font-bold text-slate-900 text-lg mb-1">{badge.name}</h3>
                    <p className="text-sm text-slate-600 mb-2">{badge.description}</p>
                    <p className="text-xs font-semibold text-slate-500">{badge.condition}</p>
                    {isUnlocked && (
                      <p className="text-xs font-bold text-green-600 mt-3">✓ Unlocked {badge.unlockedAt}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Medal className="w-6 h-6 text-slate-900" />
              Top Contributors
            </h2>
            <Leaderboard />
          </div>

          {/* Community Stats */}
          <div className="grid md:grid-cols-4 gap-4 pb-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white">
              <p className="text-4xl font-black mb-1">{allUsers.length}</p>
              <p className="text-sm font-bold opacity-90">Active Contributors</p>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 text-white">
              <p className="text-4xl font-black mb-1">{allUsers.reduce((sum, u) => sum + u.reportsSubmitted, 0)}</p>
              <p className="text-sm font-bold opacity-90">Total Reports</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 text-white">
              <p className="text-4xl font-black mb-1">{allUsers.reduce((sum, u) => sum + u.points, 0)}</p>
              <p className="text-sm font-bold opacity-90">Combined Points</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl p-6 text-white">
              <p className="text-4xl font-black mb-1">{AVAILABLE_BADGES.length}</p>
              <p className="text-sm font-bold opacity-90">Badges Available</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
