import { Navigation } from "@/components/navigation"
import { MapView } from "@/components/map-view"

export default function MapPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Interactive Issue Map</h1>
            <p className="text-muted-foreground">Visualize problems in your community at a glance</p>
          </div>

          <MapView />

          {/* Map Info */}
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-semibold mb-2">Location-Based Reporting</h3>
              <p className="text-sm text-muted-foreground">See exactly where issues are reported geographically</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-3xl mb-3">🔥</div>
              <h3 className="font-semibold mb-2">Density Heatmap</h3>
              <p className="text-sm text-muted-foreground">
                Red zones show areas with the highest concentration of issues
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold mb-2">Prioritization</h3>
              <p className="text-sm text-muted-foreground">
                Cities can focus resources on high-impact areas efficiently
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
