import { apiResponse, withErrorHandling } from "@/lib/api-helpers";
import { removeTokenCookie } from "@/lib/auth";
import { NextRequest } from "next/server";

async function logoutHandler(request: NextRequest) {
  // Remove token cookie
  await removeTokenCookie();

  return apiResponse(null, 200, "Logout successful");
}

export const POST = withErrorHandling(logoutHandler);
export const GET = withErrorHandling(logoutHandler);
