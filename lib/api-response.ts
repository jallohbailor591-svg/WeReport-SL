import { NextResponse } from "next/server"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  metadata?: {
    page?: number
    limit?: number
    total?: number
    hasMore?: boolean
  }
}

export function apiResponse<T>(data: T, message?: string, metadata?: ApiResponse["metadata"]): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    message,
    metadata,
  })
}

export function successResponse<T>(
  data: T,
  message?: string,
  metadata?: ApiResponse["metadata"],
  status = 200,
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      metadata,
    },
    { status },
  )
}

export function errorResponse(error: string | Error, status = 400): NextResponse {
  const errorMessage = error instanceof Error ? error.message : error

  return NextResponse.json(
    {
      success: false,
      error: errorMessage,
    },
    { status },
  )
}

export function validationErrorResponse(errors: string[]): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: "Validation failed",
      details: errors,
    },
    { status: 400 },
  )
}

export function unauthorizedResponse(message = "Authentication required"): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: 401 },
  )
}

export function forbiddenResponse(message = "Access forbidden"): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: 403 },
  )
}

export function notFoundResponse(resource = "Resource"): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: `${resource} not found`,
    },
    { status: 404 },
  )
}

export function rateLimitResponse(resetTime: number): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: "Rate limit exceeded",
      resetTime: new Date(resetTime).toISOString(),
    },
    {
      status: 429,
      headers: {
        "Retry-After": Math.ceil((resetTime - Date.now()) / 1000).toString(),
      },
    },
  )
}

export function serverErrorResponse(error?: Error): NextResponse {
  console.error("[API Error]", error)

  return NextResponse.json(
    {
      success: false,
      error: "Internal server error",
    },
    { status: 500 },
  )
}

export function apiError(error: string | Error, status = 400, details?: any): NextResponse {
  const errorMessage = error instanceof Error ? error.message : error

  return NextResponse.json(
    {
      success: false,
      error: errorMessage,
      ...(details && { details }),
    },
    { status },
  )
}

export async function validateRequest(request: Request, allowedMethods: string[]): Promise<NextResponse | null> {
  if (!allowedMethods.includes(request.method)) {
    return NextResponse.json(
      {
        success: false,
        error: `Method ${request.method} not allowed`,
        allowedMethods,
      },
      { status: 405, headers: { Allow: allowedMethods.join(", ") } },
    )
  }
  return null
}
