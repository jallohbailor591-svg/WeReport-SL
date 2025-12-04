"use client"

import type { UserProfile } from "@/lib/gamification-data"
import { AVAILABLE_BADGES, getLevelColor } from "@/lib/gamification-data"
import { Zap, Camera, CheckCircle, ThumbsUp } from "lucide-react"

interface UserReputationCardProps {
  user: UserProfile
  variant?: "compact" | "full"
}

export function UserReputationCard({ user, variant = "full" }: UserReputationCardProps) {
  const progressToNextLevel = user.level === "champion" ? 100 : Math.min(100, (user.points % 1500) / 15)

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-slate-200 rounded-xl p-6 space-y-4">
      {/* Header with Avatar and Name */}
      <div className="flex items-start gap-4">
        <div className="text-5xl">{user.avatar}</div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getLevelColor(user.level)} mt-2`}>
            {user.level.charAt(0).toUpperCase() + user.level.slice(1)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">{user.points}</div>
          <p className="text-xs font-semibold text-slate-600">Points</p>
        </div>
      </div>

      {/* Level Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Progress</p>
          <p className="text-xs font-bold text-slate-800">{Math.round(progressToNextLevel)}%</p>
        </div>
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
            style={{ width: `${progressToNextLevel}%` }}
          />
        </div>
      </div>

      {variant === "full" && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t-2 border-slate-200">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs text-slate-600">Reports</p>
                <p className="font-bold text-slate-900">{user.reportsSubmitted}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs text-slate-600">Photos</p>
                <p className="font-bold text-slate-900">{user.photosUploaded}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs text-slate-600">Verified</p>
                <p className="font-bold text-slate-900">{user.verificationsCompleted}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs text-slate-600">Upvotes</p>
                <p className="font-bold text-slate-900">{user.upvotesGiven}</p>
              </div>
            </div>
          </div>

          {/* Badges Section */}
          <div className="pt-3 border-t-2 border-slate-200 space-y-2">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Badges Earned</p>
            <div className="flex flex-wrap gap-2">
              {user.badges.length > 0 ? (
                user.badges.map((badgeId) => {
                  const badge = AVAILABLE_BADGES.find((b) => b.id === badgeId)
                  return badge ? (
                    <div
                      key={badgeId}
                      className="w-10 h-10 bg-white rounded-full border-2 border-slate-300 flex items-center justify-center text-lg hover:scale-110 transition-transform cursor-pointer"
                      title={badge.name}
                    >
                      {badge.icon}
                    </div>
                  ) : null
                })
              ) : (
                <p className="text-xs text-slate-500">No badges yet</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
