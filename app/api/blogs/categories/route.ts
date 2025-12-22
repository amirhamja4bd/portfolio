import {
  apiResponse,
  getSearchParams,
  withErrorHandling,
} from "@/lib/api-helpers";
import connectDB from "@/lib/db";
import BlogPost from "@/lib/models/BlogPost";
import { NextRequest } from "next/server";

// GET /api/blogs/categories - Return unique categories
async function getCategoriesHandler(request: NextRequest) {
  await connectDB();

  const { published } = getSearchParams(request);

  // Build query for distinct categories
  const query: any = {};
  const { searchParams } = new URL(request.url);
  const showAll = searchParams.get("all") === "true";

  if (!showAll) {
    query.published = true;
  } else if (published !== undefined) {
    query.published = published;
  }

  const categories = await BlogPost.distinct("category", query);
  const sorted = (Array.isArray(categories) ? categories : [])
    .filter(Boolean)
    .map(String)
    .sort();

  return apiResponse(sorted, 200);
}

export const GET = withErrorHandling(getCategoriesHandler);
