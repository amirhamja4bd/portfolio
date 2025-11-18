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

// GET /api/skills/[id] - Get a single skill
async function getSkillHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

  const skill = await Skill.findById(id);

  if (!skill) {
    return apiError("Skill not found", 404);
  }

  return apiResponse(skill, 200);
}

// PUT /api/skills/[id] - Update a skill (Protected)
async function updateSkillHandler(
  request: NextRequest,
  { params, user }: { params: Promise<{ id: string }>; user: any }
) {
  await connectDB();
  const { id } = await params;
  const body = await parseBody(request);

  // Find the skill
  const skill = await Skill.findById(id);

  if (!skill) {
    return apiError("Skill not found", 404);
  }

  // Check if name is being changed and already exists
  if (body.name && body.name !== skill.name) {
    const existingSkill = await Skill.findOne({ name: body.name });
    if (existingSkill) {
      return apiError("A skill with this name already exists", 409);
    }
  }

  // Update the skill
  Object.assign(skill, body);
  await skill.save();

  return apiResponse(skill, 200, "Skill updated successfully");
}

// DELETE /api/skills/[id] - Delete a skill (Protected)
async function deleteSkillHandler(
  request: NextRequest,
  { params, user }: { params: Promise<{ id: string }>; user: any }
) {
  await connectDB();
  const { id } = await params;

  const skill = await Skill.findByIdAndDelete(id);

  if (!skill) {
    return apiError("Skill not found", 404);
  }

  return apiResponse(null, 200, "Skill deleted successfully");
}

export const GET = withErrorHandling(getSkillHandler);
export const PUT = withAuth(withErrorHandling(updateSkillHandler));
export const DELETE = withAuth(withErrorHandling(deleteSkillHandler));
