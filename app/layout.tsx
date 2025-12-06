import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: {
    default: "WeReport - Sierra Leone Community Issues Platform",
    template: "%s | WeReport",
  },
  description:
    "Report, track, and resolve local community issues across Sierra Leone. Join thousands of citizens working together to improve their neighborhoods through civic engagement.",
  keywords: [
    "Sierra Leone",
    "civic engagement",
    "community issues",
    "local government",
    "issue tracking",
    "public services",
  ],
  authors: [{ name: "WeReport Team" }],
  creator: "WeReport",
  publisher: "WeReport",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://wereport.sl"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://wereport.sl",
    title: "WeReport - Sierra Leone Community Issues Platform",
    description: "Report and track local community issues across Sierra Leone",
    siteName: "WeReport",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WeReport Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WeReport - Sierra Leone Community Issues Platform",
    description: "Report and track local community issues across Sierra Leone",
    images: ["/og-image.png"],
    creator: "@wereport_sl",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/app-icon-192.png",
    shortcut: "/app-icon-192.png",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#10b981" },
    { media: "(prefers-color-scheme: dark)", color: "#059669" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster position="top-right" expand={true} richColors closeButton />
          </ThemeProvider>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}
