import { NextResponse } from "next/server"

export async function GET() {
  const startTime = Date.now()

  try {
    const checks: Record<string, { status: string; message?: string }> = {}

    // Check environment variables
    checks.env_vars = {
      status: process.env.NEXT_PUBLIC_SUPABASE_URL ? "configured" : "missing",
      message: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Supabase URL found" : "Supabase URL missing",
    }

    // Check database connection (skip if invalid credentials)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      try {
        const { createServerClient } = await import("@supabase/ssr")
        const { cookies } = await import("next/headers")
        const cookieStore = await cookies()
        
        const supabase = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            cookies: {
              getAll() {
                return cookieStore.getAll()
              },
              setAll() {
                // Handle cookies silently
              },
            },
          }
        )

        const { error: dbError } = await supabase.from("profiles").select("id").limit(1)
        checks.database = {
          status: dbError ? "down" : "up",
          ...(dbError && { message: dbError.message }),
        }
      } catch (error) {
        checks.database = {
          status: "down",
          message: error instanceof Error ? error.message : "Database connection failed",
        }
      }
    } else {
      checks.database = {
        status: "skipped",
        message: "Using placeholder credentials",
      }
    }

    const responseTime = Date.now() - startTime
    const allHealthy = Object.values(checks).every(
      (check) => check.status === "up" || check.status === "configured" || check.status === "skipped",
    )

    const healthStatus = {
      status: allHealthy ? "healthy" : "degraded",
      checks,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      uptime: process.uptime(),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV,
    }

    return NextResponse.json(healthStatus)
  } catch (error) {
    const responseTime = Date.now() - startTime

    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Internal server error",
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`,
      },
      { status: 500 },
    )
  }
}
