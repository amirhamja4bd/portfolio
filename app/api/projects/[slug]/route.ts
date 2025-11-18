import {
  apiError,
  apiResponse,
  parseBody,
  withAuth,
  withErrorHandling,
} from "@/lib/api-helpers";
import connectDB from "@/lib/db";
import Project from "@/lib/models/Project";
import { NextRequest } from "next/server";
import slugify from "slugify";

// GET /api/projects/[slug] - Get a single project
async function getProjectHandler(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  await connectDB();
  const { slug } = await params;

  const project = await Project.findOne({ slug });

  if (!project) {
    return apiError("Project not found", 404);
  }

  return apiResponse(project, 200);
}

// PUT /api/projects/[slug] - Update a project (Protected)
async function updateProjectHandler(
  request: NextRequest,
  { params, user }: { params: Promise<{ slug: string }>; user: any }
) {
  await connectDB();
  const { slug } = await params;
  const body = await parseBody(request);

  // Find the project
  const project = await Project.findOne({ slug });

  if (!project) {
    return apiError("Project not found", 404);
  }

  // Update slug if title changed
  if (body.title && body.title !== project.title) {
    const newSlug = slugify(body.title, { lower: true, strict: true });
    const existingProject = await Project.findOne({ slug: newSlug });

    if (
      existingProject &&
      String(existingProject._id) !== String(project._id)
    ) {
      return apiError("A project with this title already exists", 409);
    }

    body.slug = newSlug;
  }

  // Update the project
  Object.assign(project, body);
  await project.save();

  return apiResponse(project, 200, "Project updated successfully");
}

// DELETE /api/projects/[slug] - Delete a project (Protected)
async function deleteProjectHandler(
  request: NextRequest,
  { params, user }: { params: Promise<{ slug: string }>; user: any }
) {
  await connectDB();
  const { slug } = await params;

  const project = await Project.findOneAndDelete({ slug });

  if (!project) {
    return apiError("Project not found", 404);
  }

  return apiResponse(null, 200, "Project deleted successfully");
}

export const GET = withErrorHandling(getProjectHandler);
export const PUT = withAuth(withErrorHandling(updateProjectHandler));
export const DELETE = withAuth(withErrorHandling(deleteProjectHandler));
