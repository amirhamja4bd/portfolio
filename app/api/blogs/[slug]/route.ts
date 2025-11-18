import {
  apiError,
  apiResponse,
  parseBody,
  withAuth,
  withErrorHandling,
} from "@/lib/api-helpers";
import connectDB from "@/lib/db";
import BlogPost from "@/lib/models/BlogPost";
import { NextRequest } from "next/server";
import slugify from "slugify";

// GET /api/blogs/[slug] - Get a single blog post
async function getBlogPostHandler(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  await connectDB();
  const { slug } = await params;

  const post = await BlogPost.findOne({ slug });

  if (!post) {
    return apiError("Blog post not found", 404);
  }

  // Increment views for published posts
  if (post.published) {
    post.views += 1;
    await post.save();
  }

  return apiResponse(post, 200);
}

// PUT /api/blogs/[slug] - Update a blog post (Protected)
async function updateBlogPostHandler(
  request: NextRequest,
  { params, user }: { params: Promise<{ slug: string }>; user: any }
) {
  await connectDB();
  const { slug } = await params;
  const body = await parseBody(request);

  // Find the post
  const post = await BlogPost.findOne({ slug });

  if (!post) {
    return apiError("Blog post not found", 404);
  }

  // Update slug if title changed
  if (body.title && body.title !== post.title) {
    const newSlug = slugify(body.title, { lower: true, strict: true });
    const existingPost = await BlogPost.findOne({ slug: newSlug });

    if (existingPost && String(existingPost._id) !== String(post._id)) {
      return apiError("A post with this title already exists", 409);
    }

    body.slug = newSlug;
  } // Update publishedAt if publishing for the first time
  if (body.published && !post.published) {
    body.publishedAt = new Date();
  }

  // Update the post
  Object.assign(post, body);
  await post.save();

  return apiResponse(post, 200, "Blog post updated successfully");
}

// DELETE /api/blogs/[slug] - Delete a blog post (Protected)
async function deleteBlogPostHandler(
  request: NextRequest,
  { params, user }: { params: Promise<{ slug: string }>; user: any }
) {
  await connectDB();
  const { slug } = await params;

  const post = await BlogPost.findOneAndDelete({ slug });

  if (!post) {
    return apiError("Blog post not found", 404);
  }

  return apiResponse(null, 200, "Blog post deleted successfully");
}

export const GET = withErrorHandling(getBlogPostHandler);
export const PUT = withAuth(withErrorHandling(updateBlogPostHandler));
export const DELETE = withAuth(withErrorHandling(deleteBlogPostHandler));
