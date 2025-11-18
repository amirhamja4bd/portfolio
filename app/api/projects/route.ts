import {
  apiError,
  apiResponse,
  getPaginationParams,
  getSearchParams,
  paginationResponse,
  parseBody,
  withAuth,
  withErrorHandling,
} from "@/lib/api-helpers";
import connectDB from "@/lib/db";
import Project from "@/lib/models/Project";
import { NextRequest } from "next/server";
import slugify from "slugify";

// GET /api/projects - Get all projects with pagination and filters
async function getProjectsHandler(request: NextRequest) {
  await connectDB();

  const { page, limit, skip } = getPaginationParams(request);
  const { search, category, featured, published } = getSearchParams(request);

  // Build query
  const query: any = {};

  // Public access: only show published projects
  const { searchParams } = new URL(request.url);
  const showAll = searchParams.get("all") === "true";

  if (!showAll) {
    query.published = true;
  } else if (published !== undefined) {
    query.published = published;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { summary: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { technologies: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    query.category = category;
  }

  if (featured !== undefined) {
    query.featured = featured;
  }

  // Get total count
  const total = await Project.countDocuments(query);

  // Get projects with pagination
  const projects = await Project.find(query)
    .sort({ order: 1, createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return apiResponse(paginationResponse(projects, total, page, limit), 200);
}

// POST /api/projects - Create a new project (Protected)
async function createProjectHandler(
  request: NextRequest,
  { user }: { user: any }
) {
  await connectDB();

  const body = await parseBody(request);

  // Validate required fields
  if (
    !body.title ||
    !body.summary ||
    !body.description ||
    !body.technologies ||
    !body.category ||
    !body.image
  ) {
    return apiError(
      "Title, summary, description, technologies, category, and image are required",
      400
    );
  }

  // Generate slug from title
  const slug = slugify(body.title, { lower: true, strict: true });

  // Check if slug already exists
  const existingProject = await Project.findOne({ slug });
  if (existingProject) {
    return apiError("A project with this title already exists", 409);
  }

  // Create the project
  const project = await Project.create({
    ...body,
    slug,
  });

  return apiResponse(project, 201, "Project created successfully");
}

export const GET = withErrorHandling(getProjectsHandler);
export const POST = withAuth(withErrorHandling(createProjectHandler));
