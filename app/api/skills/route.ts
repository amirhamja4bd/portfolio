import {
  apiError,
  apiResponse,
  parseBody,
  withAuth,
  withErrorHandling,
} from "@/lib/api-helpers";
import connectDB from "@/lib/db";
import Skill from "@/lib/models/Skill";
import { NextRequest } from "next/server";

// GET /api/skills - Get all skills
async function getSkillsHandler(request: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const showAll = searchParams.get("all") === "true";

  const query: any = {};

  if (category) {
    query.category = category;
  }

  if (!showAll) {
    query.isActive = true;
  }

  const skills = await Skill.find(query).sort({ category: 1, order: 1 });

  return apiResponse(skills, 200);
}

// POST /api/skills - Create a new skill (Protected)
async function createSkillHandler(
  request: NextRequest,
  { user }: { user: any }
) {
  await connectDB();

  const body = await parseBody(request);

  // Validate required fields
  if (
    !body.name ||
    !body.category ||
    body.proficiency === undefined ||
    !body.description ||
    !body.icon
  ) {
    return apiError(
      "Name, category, proficiency, description, and icon are required",
      400
    );
  }

  // Check if skill already exists
  const existingSkill = await Skill.findOne({ name: body.name });
  if (existingSkill) {
    return apiError("A skill with this name already exists", 409);
  }

  // Create the skill
  const skill = await Skill.create(body);

  return apiResponse(skill, 201, "Skill created successfully");
}

export const GET = withErrorHandling(getSkillsHandler);
export const POST = withAuth(withErrorHandling(createSkillHandler));
