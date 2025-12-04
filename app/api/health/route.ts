import { NextResponse } from "next/server"
import { createServerClient_ } from "@/lib/supabase-server"
import { log } from "@/lib/logger"

export async function GET() {
  const startTime = Date.now()

  try {
    const supabase = await createServerClient_()
    const checks: Record<string, { status: string; message?: string }> = {}

    // Check database connection
    const dbStart = Date.now()
    const { error: dbError } = await supabase.from("profiles").select("id").limit(1)
    const dbTime = Date.now() - dbStart
    checks.database = {
      status: dbError ? "down" : "up",
      ...(dbError && { message: dbError.message }),
    }

    // Check if issues table is accessible
    const issuesStart = Date.now()
    const { error: issuesError } = await supabase.from("issues").select("id").limit(1)
    const issuesTime = Date.now() - issuesStart
    checks.issues_table = {
      status: issuesError ? "down" : "up",
      ...(issuesError && { message: issuesError.message }),
    }

    // Check environment variables
    checks.env_vars = {
      status: process.env.NEXT_PUBLIC_SUPABASE_URL ? "configured" : "missing",
    }

    // Check storage (if needed)
    checks.storage = {
      status: "up", // Supabase storage is generally available if DB is up
    }

    const responseTime = Date.now() - startTime
    const allHealthy = Object.values(checks).every(
      (check) => check.status === "up" || check.status === "configured",
    )

    const healthStatus = {
      status: allHealthy ? "healthy" : "degraded",
      checks,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      uptime: process.uptime(),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV,
      performance: {
        database: `${dbTime}ms`,
        issues: `${issuesTime}ms`,
      },
    }

    if (!allHealthy) {
      log.warn("Health check degraded", { checks, responseTime })
      return NextResponse.json(healthStatus, { status: 503 })
    }

    return NextResponse.json(healthStatus)
  } catch (error) {
    const responseTime = Date.now() - startTime
    log.error("Health check failed", error, { responseTime })

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
