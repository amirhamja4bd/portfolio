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

// GET /api/experience - Get all experience entries
async function getExperienceHandler(request: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const showAll = searchParams.get("all") === "true";

  const query: any = {};

  if (!showAll) {
    query.isActive = true;
  }

  const experiences = await Experience.find(query).sort({
    startDate: -1,
    order: 1,
  });

  return apiResponse(experiences, 200);
}

// POST /api/experience - Create a new experience entry (Protected)
async function createExperienceHandler(
  request: NextRequest,
  { user }: { user: any }
) {
  await connectDB();

  const body = await parseBody(request);

  // Validate required fields
  if (
    !body.company ||
    !body.position ||
    !body.location ||
    !body.startDate ||
    !body.description
  ) {
    return apiError(
      "Company, position, location, startDate, and description are required",
      400
    );
  }

  // Create the experience
  const experience = await Experience.create(body);

  return apiResponse(experience, 201, "Experience created successfully");
}

export const GET = withErrorHandling(getExperienceHandler);
export const POST = withAuth(withErrorHandling(createExperienceHandler));
