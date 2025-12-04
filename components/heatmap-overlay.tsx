export function HeatmapOverlay() {
  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 400 300" className="w-full h-full absolute inset-0" style={{ opacity: 0.4 }}>
        {/* Gradient circles representing density */}
        <defs>
          <radialGradient id="heatmap1" cx="35%" cy="45%">
            <stop offset="0%" stopColor="rgba(239, 68, 68, 0.8)" />
            <stop offset="70%" stopColor="rgba(252, 191, 73, 0.4)" />
            <stop offset="100%" stopColor="rgba(252, 191, 73, 0)" />
          </radialGradient>
          <radialGradient id="heatmap2" cx="65%" cy="55%">
            <stop offset="0%" stopColor="rgba(239, 68, 68, 0.6)" />
            <stop offset="70%" stopColor="rgba(252, 191, 73, 0.3)" />
            <stop offset="100%" stopColor="rgba(252, 191, 73, 0)" />
          </radialGradient>
        </defs>

        {/* Hotspots */}
        <circle cx="100" cy="100" r="80" fill="url(#heatmap1)" />
        <circle cx="280" cy="180" r="60" fill="url(#heatmap2)" />
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur border border-border rounded-lg p-3 text-xs space-y-2">
        <p className="font-semibold">Issue Density</p>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500"></div>
          <span>High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-400"></div>
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-300"></div>
          <span>Low</span>
        </div>
      </div>
    </div>
  )
}
