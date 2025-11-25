import { apiError, withAuth, withErrorHandling } from "@/lib/api-helpers";
import { NextRequest, NextResponse } from "next/server";

/**
 * Accepts POST { url: string } and returns Editor.js expected response
 * POST /api/upload/fetch-image
 */
async function handler(request: NextRequest, { user }: { user: any }) {
  try {
    const body = await request.json();
    const url = body?.url;

    if (!url || typeof url !== "string") {
      return apiError("Invalid or missing url", 400);
    }

    // For now, we simply return the provided URL. For production, you may
    // want to download and store the image locally and return the hosted URL.
    return NextResponse.json(
      {
        success: 1,
        file: {
          url,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("fetch-image error:", err);
    return apiError(err?.message || "Failed to fetch image", 500);
  }
}

export const POST = withAuth(withErrorHandling(handler));
