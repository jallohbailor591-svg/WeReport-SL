import { createServerClient_ } from "@/lib/supabase-server"
import { NextResponse } from "next/server"
import { log } from "@/lib/logger"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")

  // Handle OAuth errors
  if (error) {
    log.error("OAuth callback error", new Error(errorDescription || error), {
      error,
      errorDescription,
    })
    const url = new URL("/auth/login", request.url)
    url.searchParams.set("error", "oauth_failed")
    return NextResponse.redirect(url)
  }

  if (code) {
    try {
      const supabase = await createServerClient_()
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        log.error("Failed to exchange code for session", exchangeError, {
          route: "/auth/callback",
        })
        const url = new URL("/auth/login", request.url)
        url.searchParams.set("error", "session_exchange_failed")
        return NextResponse.redirect(url)
      }

      // Success - redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url))
    } catch (error) {
      log.error("Unexpected error in auth callback", error, {
        route: "/auth/callback",
      })
      const url = new URL("/auth/login", request.url)
      url.searchParams.set("error", "unexpected_error")
      return NextResponse.redirect(url)
    }
  }

  // No code provided - redirect to login
  return NextResponse.redirect(new URL("/auth/login", request.url))
}
