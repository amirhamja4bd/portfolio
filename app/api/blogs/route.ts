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
import docToHtml from "@/lib/doc-to-html";
import BlogPost from "@/lib/models/BlogPost";
import { NextRequest } from "next/server";
import slugify from "slugify";

// GET /api/blogs - Get all blog posts with pagination and filters
async function getBlogPostsHandler(request: NextRequest) {
  await connectDB();

  const { page, limit, skip } = getPaginationParams(request);
  const { search, category, tag, featured, published, sort } =
    getSearchParams(request);

  // Build query
  const query: any = {};

  // Public access: only show published posts
  // Admin can see all posts via a special query param
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
      { excerpt: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    query.category = category;
  }

  if (tag) {
    // Accept CSV (comma-separated tags) for multi-tag filtering (OR)
    const tags = String(tag)
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (tags.length > 1) query.tags = { $in: tags };
    else query.tags = tags[0];
  }

  if (featured !== undefined) {
    query.featured = featured;
  }

  // Get total count
  const total = await BlogPost.countDocuments(query);

  // Sort mapping: support 'latest', 'oldest', 'popular' or direct sort strings
  let sortVal: any = "-publishedAt -createdAt";
  if (sort === "latest") sortVal = "-publishedAt";
  else if (sort === "oldest") sortVal = "publishedAt";
  else if (sort === "popular") sortVal = "-viewsCount";
  else if (sort) sortVal = sort; // allow custom sort strings

  // Get posts with pagination
  const posts = await BlogPost.find(query)
    .sort(sortVal)
    .skip(skip)
    .limit(limit)
    .select("-content"); // Exclude full content from list view
  // Ensure compatibility field `views` exists for front-end
  posts.forEach((p: any) => {
    p.set("views", p.get("views") || p.get("viewsCount") || 0);
  });
  return apiResponse(paginationResponse(posts, total, page, limit), 200);
}

// POST /api/blogs - Create a new blog post (Protected)
async function createBlogPostHandler(
  request: NextRequest,
  { user }: { user: any }
) {
  await connectDB();

  const body = await parseBody(request);

  // Validate required fields
  if (!body.title || !body.content) {
    return apiError("Title and content are required", 400);
  }

  // Generate slug from title if not provided
  let slug = body.slug;
  if (!slug) {
    slug = slugify(body.title, { lower: true, strict: true });
  }

  // Check if slug already exists
  const existingPost = await BlogPost.findOne({ slug });
  if (existingPost) {
    // Append timestamp to make slug unique
    slug = `${slug}-${Date.now()}`;
  }

  // Set publishedAt if publishing
  const publishedAt = body.published ? new Date() : undefined;

  // Ensure content is a string (HTML). Convert if provided as JSON doc.
  if (body.content && typeof body.content !== "string") {
    body.content = docToHtml(body.content as any);
  }

  // Create the post
  const post = await BlogPost.create({
    ...body,
    slug,
    publishedAt,
    viewsCount: 0,
  });

  // Keep backward compatibility with `views` property used in UI
  post.set("views", post.get("views") || post.get("viewsCount") || 0);
  await post.save();

  return apiResponse(post, 201, "Blog post created successfully");
}

export const GET = withErrorHandling(getBlogPostsHandler);
export const POST = withAuth(withErrorHandling(createBlogPostHandler));
