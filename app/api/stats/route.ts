import {
  apiError,
  apiResponse,
  parseBody,
  withAuth,
  withErrorHandling,
} from "@/lib/api-helpers";
import connectDB from "@/lib/db";
import Stats from "@/lib/models/Stats";
import { NextRequest } from "next/server";

// GET /api/stats - Get all stats
async function getStatsHandler() {
  await connectDB();
  const stats = await Stats.findOne().sort({ updatedAt: -1 });
  return apiResponse(stats || { items: [] }, 200);
}

// POST /api/stats - Update stats (Protected)
async function updateStatsHandler(request: NextRequest) {
  await connectDB();
  const body = await parseBody(request);

  if (!body.items || !Array.isArray(body.items)) {
    return apiError("Items array is required", 400);
  }

  let stats = await Stats.findOne();

  if (stats) {
    stats.items = body.items;
    if (body.description !== undefined) {
      stats.description = body.description;
    }
    await stats.save();
  } else {
    stats = await Stats.create({
      items: body.items,
      description: body.description,
    });
  }

  return apiResponse(stats, 200, "Stats updated successfully");
}

export const GET = withErrorHandling(getStatsHandler);
export const POST = withAuth(withErrorHandling(updateStatsHandler));
