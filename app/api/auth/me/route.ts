import { apiError, apiResponse, withErrorHandling } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Admin from "@/lib/models/Admin";
import { NextRequest } from "next/server";

async function meHandler(request: NextRequest) {
  try {
    // Get authenticated user
    const authUser = await requireAuth(request);

    // Connect to database
    await connectDB();

    // Fetch full user data
    const admin = await Admin.findById(authUser.userId);

    if (!admin) {
      return apiError("User not found", 404);
    }

    if (!admin.isActive) {
      return apiError("Account is deactivated", 403);
    }

    return apiResponse(admin, 200);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return apiError("Unauthorized - Please login", 401);
    }
    throw error;
  }
}

export const GET = withErrorHandling(meHandler);
