import {
  apiResponse,
  getSearchParams,
  withErrorHandling,
} from "@/lib/api-helpers";
import connectDB from "@/lib/db";
import BlogPost from "@/lib/models/BlogPost";
import { NextRequest } from "next/server";

// GET /api/blogs/tags - Return unique tags
async function getTagsHandler(request: NextRequest) {
  await connectDB();

  const { search, category, tag, featured, published } =
    getSearchParams(request);

  // Build query for distinct tags (if admin wants 'all', pass all=true)
  const query: any = {};
  const { searchParams } = new URL(request.url);
  const showAll = searchParams.get("all") === "true";

  if (!showAll) {
    query.published = true;
  } else if (published !== undefined) {
    query.published = published;
  }

  if (category) query.category = category;
  // If specific tag was provided, return tags that match additionally
  if (tag)
    query.tags = String(tag)
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

  const tags = await BlogPost.distinct("tags", query);
  const sorted = (Array.isArray(tags) ? tags : []).map(String).sort();

  return apiResponse(sorted, 200);
}

export const GET = withErrorHandling(getTagsHandler);
