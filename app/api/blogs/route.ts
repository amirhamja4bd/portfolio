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
import BlogPost from "@/lib/models/BlogPost";
import { NextRequest } from "next/server";
import slugify from "slugify";

// GET /api/blogs - Get all blog posts with pagination and filters
async function getBlogPostsHandler(request: NextRequest) {
  await connectDB();

  const { page, limit, skip } = getPaginationParams(request);
  const { search, category, tag, featured, published } =
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
    query.tags = tag;
  }

  if (featured !== undefined) {
    query.featured = featured;
  }

  // Get total count
  const total = await BlogPost.countDocuments(query);

  // Get posts with pagination
  const posts = await BlogPost.find(query)
    .sort({ publishedAt: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("-content"); // Exclude full content from list view

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
  if (!body.title || !body.excerpt || !body.content) {
    return apiError("Title, excerpt, and content are required", 400);
  }

  // Generate slug from title
  const slug = slugify(body.title, { lower: true, strict: true });

  // Check if slug already exists
  const existingPost = await BlogPost.findOne({ slug });
  if (existingPost) {
    return apiError("A post with this title already exists", 409);
  }

  // Calculate reading time based on content
  let wordCount = 0;
  if (body.content?.blocks) {
    body.content.blocks.forEach((block: any) => {
      if (block.data?.text) {
        wordCount += block.data.text.split(/\s+/).length;
      }
    });
  }
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed

  // Set publishedAt if publishing
  const publishedAt = body.published ? new Date() : undefined;

  // Create the post
  const post = await BlogPost.create({
    ...body,
    slug,
    readingTime: `${readingTime} min read`,
    publishedAt,
    views: 0,
  });

  return apiResponse(post, 201, "Blog post created successfully");
}

export const GET = withErrorHandling(getBlogPostsHandler);
export const POST = withAuth(withErrorHandling(createBlogPostHandler));
