export interface ErrorLog {
  message: string
  stack?: string
  context?: Record<string, any>
  timestamp: Date
  severity: "low" | "medium" | "high" | "critical"
  userId?: string
  url?: string
}

class MonitoringService {
  private errorLogs: ErrorLog[] = []
  private maxLogs = 100
  private sentryEnabled = false

  constructor() {
    // Initialize Sentry in production if DSN is available
    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_SENTRY_DSN) {
      this.initSentry()
    }
  }

  private initSentry() {
    // TODO: Uncomment when Sentry is added to package.json
    // import('@sentry/nextjs').then((Sentry) => {
    //   Sentry.init({
    //     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    //     environment: process.env.NODE_ENV,
    //     tracesSampleRate: 0.1,
    //   })
    //   this.sentryEnabled = true
    // })
  }

  logError(
    error: Error | string,
    context?: Record<string, any>,
    severity: ErrorLog["severity"] = "medium",
    userId?: string,
    url?: string,
  ) {
    const errorLog: ErrorLog = {
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      context,
      timestamp: new Date(),
      severity,
      userId,
      url,
    }

    this.errorLogs.push(errorLog)

    if (this.errorLogs.length > this.maxLogs) {
      this.errorLogs.shift()
    }

    if (process.env.NODE_ENV === "development") {
      console.error("[Monitoring]", errorLog)
    }

    if (process.env.NODE_ENV === "production") {
      this.sendToExternalService(errorLog)
    }
  }

  private sendToExternalService(errorLog: ErrorLog) {
    // Send to Sentry if available
    if (this.sentryEnabled && typeof window !== "undefined") {
      // window.Sentry?.captureException(new Error(errorLog.message), {
      //   extra: errorLog.context,
      //   level: errorLog.severity,
      // })
    }

    // Can also send to custom logging endpoint
    if (typeof fetch !== "undefined") {
      fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(errorLog),
      }).catch(() => {
        // Silently fail to avoid logging loops
      })
    }
  }

  getRecentErrors(limit = 10): ErrorLog[] {
    return this.errorLogs.slice(-limit)
  }

  clearLogs() {
    this.errorLogs = []
  }

  trackMetric(name: string, value: number, tags?: Record<string, string>) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[Metric] ${name}: ${value}`, tags)
    }

    // Send to analytics service in production
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", name, {
        value,
        ...tags,
      })
    }
  }
}

export const monitoring = new MonitoringService()

// Performance monitoring decorator
export function measurePerformance(name: string) {
  return (_target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const start = performance.now()
      try {
        const result = await originalMethod.apply(this, args)
        const duration = performance.now() - start

        monitoring.trackMetric(`${name}_duration`, duration, {
          method: propertyKey,
          status: "success",
        })

        if (duration > 1000) {
          console.warn(`[Performance] ${name}.${propertyKey} took ${duration.toFixed(2)}ms`)
        }

        return result
      } catch (error) {
        const duration = performance.now() - start
        monitoring.logError(error as Error, { name, method: propertyKey, duration }, "high")
        monitoring.trackMetric(`${name}_duration`, duration, {
          method: propertyKey,
          status: "error",
        })
        throw error
      }
    }

    return descriptor
  }
}

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}
