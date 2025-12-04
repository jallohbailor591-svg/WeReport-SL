import { MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface MapPreviewProps {
  latitude: number
  longitude: number
  location: string
}

export function MapPreview({ latitude, longitude, location }: MapPreviewProps) {
  const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`

  return (
    <Card>
      <CardContent className="p-0">
        <div className="relative h-64 bg-muted rounded-lg overflow-hidden">
          {/* Simple static map using Google Static Maps API */}
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.${Math.random()}!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${latitude}%2C${longitude}!5e0!3m2!1sen!2s!4v${Date.now()}`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
        </div>

        <div className="p-4 space-y-2 bg-card border-t border-border">
          <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold">{location}</p>
              <p className="text-xs text-muted-foreground">
                {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline mt-2 inline-block"
              >
                View on Google Maps →
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
