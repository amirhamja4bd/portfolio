import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "./auth";

/**
 * API Response helper
 */
export function apiResponse<T = any>(
  data: T,
  status: number = 200,
  message?: string
) {
  return NextResponse.json(
    {
      success: status >= 200 && status < 300,
      message,
      data,
    },
    { status }
  );
}

/**
 * API Error response helper
 */
export function apiError(message: string, status: number = 400, errors?: any) {
  return NextResponse.json(
    {
      success: false,
      message,
      errors,
    },
    { status }
  );
}

/**
 * Middleware to protect API routes
 */
export async function withAuth(
  handler: (
    request: NextRequest,
    context: { params?: any; user: any }
  ) => Promise<NextResponse>,
  requiredRole?: string
) {
  return async (request: NextRequest, context: { params?: any }) => {
    try {
      const user = await getAuthUser(request);

      if (!user) {
        return apiError("Unauthorized - Please login", 401);
      }

      // Check role if required
      if (requiredRole && user.role !== requiredRole) {
        return apiError("Forbidden - Insufficient permissions", 403);
      }

      // Call the handler with user context
      return handler(request, { ...context, user });
    } catch (error: any) {
      console.error("Auth middleware error:", error);
      return apiError(error.message || "Authentication failed", 401);
    }
  };
}

/**
 * Try-catch wrapper for API handlers
 */
export function withErrorHandling(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any) => {
    try {
      return await handler(request, context);
    } catch (error: any) {
      console.error("API Error:", error);

      // Mongoose validation error
      if (error.name === "ValidationError") {
        return apiError(
          "Validation failed",
          400,
          Object.values(error.errors).map((e: any) => e.message)
        );
      }

      // Mongoose duplicate key error
      if (error.code === 11000) {
        return apiError("Duplicate entry - Resource already exists", 409);
      }

      // MongoDB cast error
      if (error.name === "CastError") {
        return apiError("Invalid ID format", 400);
      }

      return apiError(
        error.message || "Internal server error",
        error.status || 500
      );
    }
  };
}

/**
 * Parse request body safely
 */
export async function parseBody<T = any>(request: NextRequest): Promise<T> {
  try {
    return await request.json();
  } catch (error) {
    throw new Error("Invalid JSON body");
  }
}

/**
 * Get pagination parameters from URL
 */
export function getPaginationParams(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  return {
    page: Math.max(1, page),
    limit: Math.min(100, Math.max(1, limit)), // Max 100 items per page
    skip,
  };
}

/**
 * Get search/filter parameters from URL
 */
export function getSearchParams(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  return {
    search: searchParams.get("search") || undefined,
    category: searchParams.get("category") || undefined,
    tag: searchParams.get("tag") || undefined,
    status: searchParams.get("status") || undefined,
    featured: searchParams.get("featured") === "true" ? true : undefined,
    published: searchParams.get("published") === "true" ? true : undefined,
    sort: searchParams.get("sort") || "-createdAt",
  };
}

/**
 * Build pagination response
 */
export function paginationResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}
