/**
 * Production-ready logging utility
 * Replaces console.log/error/warn with structured logging
 */

export type LogLevel = "debug" | "info" | "warn" | "error" | "critical"

export interface LogContext {
  [key: string]: any
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development"
  private isProduction = process.env.NODE_ENV === "production"

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` ${JSON.stringify(context)}` : ""
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.isDevelopment) return true
    // In production, only log warn, error, and critical
    return ["warn", "error", "critical"].includes(level)
  }

  debug(message: string, context?: LogContext): void {
    if (!this.shouldLog("debug")) return
    if (this.isDevelopment) {
      console.debug(this.formatMessage("debug", message, context))
    }
  }

  info(message: string, context?: LogContext): void {
    if (!this.shouldLog("info")) return
    if (this.isDevelopment) {
      console.info(this.formatMessage("info", message, context))
    }
  }

  warn(message: string, context?: LogContext): void {
    if (!this.shouldLog("warn")) return
    console.warn(this.formatMessage("warn", message, context))
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (!this.shouldLog("error")) return
    
    const errorContext: LogContext = {
      ...context,
      ...(error instanceof Error
        ? {
            errorMessage: error.message,
            errorStack: error.stack,
            errorName: error.name,
          }
        : { error: String(error) }),
    }

    console.error(this.formatMessage("error", message, errorContext))

    // In production, also send to monitoring service
    if (this.isProduction && typeof window !== "undefined") {
      // Could integrate with monitoring service here
      this.sendToMonitoring(message, errorContext)
    }
  }

  critical(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext: LogContext = {
      ...context,
      ...(error instanceof Error
        ? {
            errorMessage: error.message,
            errorStack: error.stack,
            errorName: error.name,
          }
        : { error: String(error) }),
    }

    console.error(this.formatMessage("critical", message, errorContext))
    
    // Always send critical errors to monitoring
    this.sendToMonitoring(message, errorContext)
  }

  private sendToMonitoring(message: string, context: LogContext): void {
    // In production, integrate with your monitoring service
    // For now, we'll use the monitoring service from lib/monitoring
    try {
      if (typeof window !== "undefined") {
        // Client-side: could send to analytics endpoint
        fetch("/api/monitoring/errors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            context,
            timestamp: new Date().toISOString(),
            severity: "critical",
          }),
        }).catch(() => {
          // Silently fail to avoid logging loops
        })
      }
    } catch {
      // Silently fail
    }
  }
}

// Export singleton instance
export const logger = new Logger()

// Export convenience functions
export const log = {
  debug: (message: string, context?: LogContext) => logger.debug(message, context),
  info: (message: string, context?: LogContext) => logger.info(message, context),
  warn: (message: string, context?: LogContext) => logger.warn(message, context),
  error: (message: string, error?: Error | unknown, context?: LogContext) =>
    logger.error(message, error, context),
  critical: (message: string, error?: Error | unknown, context?: LogContext) =>
    logger.critical(message, error, context),
}

