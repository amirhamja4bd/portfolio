import { apiError, apiResponse, withErrorHandling } from "@/lib/api-helpers";
import connectDB from "@/lib/db";
import BlogPost from "@/lib/models/BlogPost";
import Comment from "@/lib/models/Comment";
import { NextRequest } from "next/server";

// GET /api/blogs/[slug]/comments - return approved, non-deleted comments
async function getCommentsHandler(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  await connectDB();
  const { slug } = await params;

  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status"); // 'approved' by default
  const includeDeleted = searchParams.get("includeDeleted") === "true";
  const postIdParam = searchParams.get("postId");

  // If a postId query param is provided treat it as the post id or slug
  let post: any = null;
  if (postIdParam) {
    // If it's a 24-character hex string treat as ObjectId, otherwise try as slug
    if (/^[a-fA-F0-9]{24}$/.test(postIdParam)) {
      post = { _id: postIdParam } as any;
    } else {
      post = await BlogPost.findOne({ slug: postIdParam }).select("_id");
    }
  } else {
    post = await BlogPost.findOne({ slug }).select("_id");
  }
  if (!post) return apiError("Blog post not found", 404);

  try {
    const query: any = { postId: post._id };
    if (!includeDeleted) query.isDeleted = false;
    if (statusParam && statusParam !== "all") {
      query.status = statusParam;
    }

    const approvedComments = await Comment.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return apiResponse(approvedComments, 200);
  } catch (err) {
    console.error("Failed to fetch comments for post", slug, err);
    return apiError("Failed to fetch comments", 500);
  }
}

export const GET = withErrorHandling(getCommentsHandler);
