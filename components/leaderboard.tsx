"use client"

import { useState } from "react"
import { LEADERBOARD_WEEKLY, LEADERBOARD_ALLTIME, getLevelColor } from "@/lib/gamification-data"
import { Trophy, TrendingUp } from "lucide-react"

interface LeaderboardProps {
  district?: string
}

export function Leaderboard({ district }: LeaderboardProps) {
  const [timeframe, setTimeframe] = useState<"weekly" | "alltime">("weekly")

  const data = timeframe === "weekly" ? LEADERBOARD_WEEKLY : LEADERBOARD_ALLTIME
  const filteredData = district ? data.filter((entry) => entry.district === district) : data

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-300" />
            <h2 className="text-xl font-bold text-white">Top Contributors</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeframe("weekly")}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
                timeframe === "weekly" ? "bg-yellow-400 text-slate-900" : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeframe("alltime")}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
                timeframe === "alltime" ? "bg-yellow-400 text-slate-900" : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              All Time
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-slate-200 bg-slate-50">
              <th className="px-6 py-4 text-left font-bold text-slate-900 text-sm uppercase tracking-wide">Rank</th>
              <th className="px-6 py-4 text-left font-bold text-slate-900 text-sm uppercase tracking-wide">
                Contributor
              </th>
              <th className="px-6 py-4 text-left font-bold text-slate-900 text-sm uppercase tracking-wide">District</th>
              <th className="px-6 py-4 text-center font-bold text-slate-900 text-sm uppercase tracking-wide">
                Reports
              </th>
              <th className="px-6 py-4 text-right font-bold text-slate-900 text-sm uppercase tracking-wide">Points</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((entry) => (
              <tr
                key={entry.userId}
                className={`border-b border-slate-100 hover:bg-blue-50 transition ${
                  entry.rank === 1 ? "bg-yellow-50" : ""
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {entry.rank === 1 && <Trophy className="w-5 h-5 text-yellow-500" />}
                    {entry.rank === 2 && <Trophy className="w-5 h-5 text-slate-400" />}
                    {entry.rank === 3 && <Trophy className="w-5 h-5 text-orange-400" />}
                    <span className="font-bold text-lg text-slate-900">#{entry.rank}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{entry.avatar}</span>
                    <div>
                      <p className="font-bold text-slate-900">{entry.name}</p>
                      <div className={`inline-block px-2 py-1 rounded text-xs font-bold ${getLevelColor(entry.level)}`}>
                        {entry.level.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-slate-600 font-semibold">{entry.district}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <p className="font-bold text-slate-900">{entry.reportsSubmitted}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <p className="font-bold text-lg text-blue-600">{entry.points}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
