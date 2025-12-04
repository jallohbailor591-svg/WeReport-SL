interface TimelineEvent {
  date: string
  title: string
  description: string
  status: "reported" | "acknowledged" | "in-progress" | "resolved"
}

export function Timeline({ events }: { events: TimelineEvent[] }) {
  const statusColors = {
    reported: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
    acknowledged: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    "in-progress": "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
    resolved: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  }

  return (
    <div className="space-y-6">
      {events.map((event, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${statusColors[event.status]}`}
            >
              {i + 1}
            </div>
            {i < events.length - 1 && <div className="w-1 h-16 bg-muted mt-2"></div>}
          </div>
          <div className="pb-6 pt-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-sm">{event.title}</h4>
              <span className={`text-xs font-semibold px-2 py-1 rounded ${statusColors[event.status]}`}>
                {event.status === "in-progress"
                  ? "In Progress"
                  : event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{event.date}</p>
            <p className="text-sm text-muted-foreground">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
