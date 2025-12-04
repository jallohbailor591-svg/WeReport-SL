"use client"

import { Component, type ReactNode } from "react"
import { AlertCircle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: any) => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: any
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("[ErrorBoundary] Error caught:", error, errorInfo)
    
    // Log to monitoring service if available
    if (typeof window !== "undefined" && this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Store error info for display
    this.setState({ errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div 
          className="min-h-[400px] flex items-center justify-center p-8"
          role="alert"
          aria-live="assertive"
        >
          <div className="text-center max-w-md">
            <AlertCircle 
              className="w-16 h-16 text-destructive mx-auto mb-4" 
              aria-hidden="true"
            />
            <h2 className="text-2xl font-bold mb-2 text-foreground">
              Something went wrong
            </h2>
            <p className="text-muted-foreground mb-6">
              We encountered an error while loading this content. Please try refreshing the page or returning to the home page.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mb-6 text-left bg-muted p-4 rounded-lg text-sm">
                <summary className="cursor-pointer font-semibold mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="whitespace-pre-wrap text-xs overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack && (
                    <div className="mt-2 pt-2 border-t">
                      {this.state.errorInfo.componentStack}
                    </div>
                  )}
                </pre>
              </details>
            )}
            <div className="flex gap-3 justify-center flex-wrap">
              <Button 
                onClick={this.handleReset} 
                variant="default"
                className="gap-2"
                aria-label="Try again"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                Try Again
              </Button>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="gap-2"
                aria-label="Refresh page"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                Refresh Page
              </Button>
              <Button 
                onClick={() => (window.location.href = "/")} 
                variant="outline"
                className="gap-2"
                aria-label="Go to home page"
              >
                <Home className="w-4 h-4" aria-hidden="true" />
                Go Home
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
