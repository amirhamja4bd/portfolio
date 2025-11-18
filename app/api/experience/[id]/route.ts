import {
  apiError,
  apiResponse,
  parseBody,
  withAuth,
  withErrorHandling,
} from "@/lib/api-helpers";
import connectDB from "@/lib/db";
import Experience from "@/lib/models/Experience";
import { NextRequest } from "next/server";

// GET /api/experience/[id] - Get a single experience entry
async function getExperienceEntryHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

  const experience = await Experience.findById(id);

  if (!experience) {
    return apiError("Experience not found", 404);
  }

  return apiResponse(experience, 200);
}

// PUT /api/experience/[id] - Update an experience entry (Protected)
async function updateExperienceHandler(
  request: NextRequest,
  { params, user }: { params: Promise<{ id: string }>; user: any }
) {
  await connectDB();
  const { id } = await params;
  const body = await parseBody(request);

  // Find the experience
  const experience = await Experience.findById(id);

  if (!experience) {
    return apiError("Experience not found", 404);
  }

  // Update the experience
  Object.assign(experience, body);
  await experience.save();

  return apiResponse(experience, 200, "Experience updated successfully");
}

// DELETE /api/experience/[id] - Delete an experience entry (Protected)
async function deleteExperienceHandler(
  request: NextRequest,
  { params, user }: { params: Promise<{ id: string }>; user: any }
) {
  await connectDB();
  const { id } = await params;

  const experience = await Experience.findByIdAndDelete(id);

  if (!experience) {
    return apiError("Experience not found", 404);
  }

  return apiResponse(null, 200, "Experience deleted successfully");
}

export const GET = withErrorHandling(getExperienceEntryHandler);
export const PUT = withAuth(withErrorHandling(updateExperienceHandler));
export const DELETE = withAuth(withErrorHandling(deleteExperienceHandler));
