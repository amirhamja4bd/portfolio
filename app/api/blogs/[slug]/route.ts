import {
  apiError,
  apiResponse,
  parseBody,
  withAuth,
  withErrorHandling,
} from "@/lib/api-helpers";
import connectDB from "@/lib/db";
import docToHtml from "@/lib/doc-to-html";
import BlogPost from "@/lib/models/BlogPost";
import Comment from "@/lib/models/Comment";
import PostReaction from "@/lib/models/PostReaction";
import PostView from "@/lib/models/PostView";
import { randomUUID } from "crypto";
import { NextRequest } from "next/server";
import slugify from "slugify";

// GET /api/blogs/[slug] - Returns a single post and sets/reads visitor cookie
async function getBlogPostHandler(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  await connectDB();
  const { slug } = await params;
  const post = await BlogPost.findOne({ slug });
  if (!post) return apiError("Blog post not found", 404);

  // Convert editor content to HTML if needed
  if (post.content && typeof post.content !== "string") {
    try {
      (post as any).content = docToHtml(post.content as any);
    } catch (e) {
      console.error("docToHtml failed:", e);
    }
  }

  // Count unique view per visitorId for published posts
  if (post.published) {
    const visitorCookie = request.cookies.get("visitor-id")?.value;
    const visitorId =
      visitorCookie || request.headers.get("x-visitor-id") || null;
    const userAgent = request.headers.get("user-agent") || "unknown";
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null;
    if (visitorId) {
      const existing = await PostView.findOne({ postId: post._id, visitorId });
      if (!existing) {
        // Try to find a legacy record by IP (older records may not have visitorId).
        const legacyByIp = await PostView.findOne({
          postId: post._id,
          ip,
          visitorId: { $exists: false },
        });
        if (legacyByIp) {
          // Migrate legacy doc to add visitorId without incrementing views.
          try {
            if (!legacyByIp.visitorId) {
              await PostView.updateOne(
                { _id: legacyByIp._id },
                { $set: { visitorId } }
              );
            }
          } catch (e) {
            // ignore errors — continue to create a new record if needed
          }
        } else {
          await PostView.create({
            postId: post._id,
            visitorId,
            userAgent,
            ip:
              request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
              request.headers.get("x-real-ip") ||
              null,
          });
          post.set("viewsCount", (post.get("viewsCount") || 0) + 1);
          post.set("views", post.get("viewsCount"));
          await post.save();
        }
      }
    }
  } else {
    // keep `views` in sync for UI compatibility
    post.set("views", post.get("views") || post.get("viewsCount") || 0);
  }

  // Attach visitorReaction if present
  const visitorCookie = request.cookies.get("visitor-id")?.value;
  let visitorReaction: number | null = null;
  if (visitorCookie) {
    const rel = await PostReaction.findOne({
      postId: post._id,
      visitorId: visitorCookie,
    });
    visitorReaction = rel ? Number(rel.reaction) : null;
  }

  const res = apiResponse({ ...post.toObject(), visitorReaction }, 200);
  if (!visitorCookie) {
    const newVisitorId = randomUUID();
    res.cookies.set("visitor-id", newVisitorId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return res;
}

// PUT/DELETE (Admin) and POST for sub-actions like view, reaction, comment
async function updateBlogPostHandler(
  request: NextRequest,
  { params, user }: { params: Promise<{ slug: string }>; user: any }
) {
  await connectDB();
  const { slug } = await params;
  const body = await parseBody(request);
  const post = await BlogPost.findOne({ slug });
  if (!post) return apiError("Blog post not found", 404);

  if (body.title && body.title !== post.title && !body.slug) {
    const newSlug = slugify(body.title, { lower: true, strict: true });
    const existing = await BlogPost.findOne({ slug: newSlug });
    body.slug =
      existing && String(existing._id) !== String(post._id)
        ? `${newSlug}-${Date.now()}`
        : newSlug;
  }
  if (body.published && !post.published) body.publishedAt = new Date();
  if (body.content && typeof body.content !== "string")
    body.content = docToHtml(body.content as any);
  Object.assign(post, body);
  await post.save();
  return apiResponse(post, 200, "Blog post updated successfully");
}

async function deleteBlogPostHandler(
  request: NextRequest,
  { params, user }: { params: Promise<{ slug: string }>; user: any }
) {
  await connectDB();
  const { slug } = await params;
  const post = await BlogPost.findOneAndDelete({ slug });
  if (!post) return apiError("Blog post not found", 404);
  return apiResponse(null, 200, "Blog post deleted successfully");
}

// POST /api/blogs/[slug] actions: view, reaction, comment
async function postBlogSubActionHandler(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  await connectDB();
  const { slug } = await params;
  const body = await parseBody(request);
  const post = await BlogPost.findOne({ slug });
  if (!post) return apiError("Blog post not found", 404);

  const cookieVisitorId = request.cookies.get("visitor-id")?.value;
  let visitorId = body.visitorId || cookieVisitorId || null;
  let setVisitorCookie = false;
  if (!visitorId) {
    visitorId = randomUUID();
    setVisitorCookie = true;
  }
  const userAgent =
    body.userAgent || request.headers.get("user-agent") || "unknown";
  const ip =
    body.ip ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null;

  const action = body.action;

  if (action === "view") {
    if (visitorId) {
      const existing = await PostView.findOne({ postId: post._id, visitorId });
      if (!existing) {
        // Try to migrate legacy PostView by IP to include visitorId. Only
        // migrate when the visitorId was provided by the client (cookie or
        // explicit body) and not when it was generated just for this request.
        if (ip && !setVisitorCookie) {
          const legacy = await PostView.findOne({
            postId: post._id,
            ip,
            visitorId: { $exists: false },
          });
          if (legacy && !legacy.visitorId) {
            try {
              await PostView.updateOne(
                { _id: legacy._id },
                { $set: { visitorId } }
              );
              // Do not increment view count for migration: the legacy IP-based
              // view already contributed to the views count.
            } catch (e) {
              // ignore this migration error and fall back to creation below
            }
          } else {
            await PostView.create({
              postId: post._id,
              visitorId,
              userAgent,
              ip,
            });
            post.set("viewsCount", (post.get("viewsCount") || 0) + 1);
            post.set("views", post.get("viewsCount"));
            await post.save();
          }
        } else {
          await PostView.create({ postId: post._id, visitorId, userAgent, ip });
          post.set("viewsCount", (post.get("viewsCount") || 0) + 1);
          post.set("views", post.get("viewsCount"));
          await post.save();
        }
      }
    }
    const res = apiResponse(
      { views: post.get("viewsCount") || post.get("views") || 0 },
      200
    );
    if (setVisitorCookie)
      res.cookies.set("visitor-id", visitorId as string, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    return res;
  }

  if (action === "reaction") {
    const reactionVal = Number(body.reaction);
    if (
      !reactionVal ||
      isNaN(reactionVal) ||
      reactionVal < 1 ||
      reactionVal > 5
    )
      return apiError("Invalid reaction type", 400);

    const decCount = async (type: number) => {
      if (!type) return;
      const key = `reactionsCount.${type}`;
      await BlogPost.updateOne({ _id: post._id }, { $inc: { [key]: -1 } });
    };
    const incCount = async (type: number) => {
      if (!type) return;
      const key = `reactionsCount.${type}`;
      await BlogPost.updateOne({ _id: post._id }, { $inc: { [key]: 1 } });
    };

    // Safer read-create-update approach to avoid strict-mode upsert issues.
    let existingReaction = await PostReaction.findOne({
      postId: post._id,
      visitorId,
    });
    // Safer read-create-update approach to avoid strict-mode upsert issues.
    // If there's an existing reaction but it doesn't have visitorId (legacy IP-based record),
    // ensure it's migrated to use the visitorId and keep consistency.
    // Same rule for migrating an existing reaction that lacks visitorId: only
    // add a visitorId if the client provided one (not when we generated it).
    if (existingReaction && !existingReaction.visitorId && !setVisitorCookie) {
      try {
        await PostReaction.updateOne(
          { _id: existingReaction._id },
          { $set: { visitorId } }
        );
        // Re-fetch the updated document so we operate on canonical state below
        existingReaction = await PostReaction.findById(existingReaction._id);
      } catch (e) {
        // ignore migration failures; we'll still attempt to process the reaction below
      }
    }
    if (existingReaction) {
      const prevVal = Number(existingReaction.reaction);
      if (prevVal === reactionVal) {
        // Toggle off
        await PostReaction.deleteOne({ _id: existingReaction._id });
        await decCount(prevVal);
      } else {
        // Update reaction value and ensure we persist visitorId for legacy entries
        const updatePayload: any = { reaction: reactionVal };
        if (!setVisitorCookie) updatePayload.visitorId = visitorId;
        await PostReaction.updateOne(
          { _id: existingReaction._id },
          { $set: updatePayload }
        );
        await decCount(prevVal);
        await incCount(reactionVal);
      }
    } else {
      // Create new reaction; handle race via duplicate key error
      try {
        await PostReaction.create({
          postId: post._id,
          visitorId,
          reaction: reactionVal,
          ip,
        });
        await incCount(reactionVal);
      } catch (err: any) {
        if (err?.code === 11000) {
          // Another process created the reaction concurrently; reload and reconcile
          const reloaded = await PostReaction.findOne({
            postId: post._id,
            visitorId,
          });
          if (reloaded) {
            const prevVal = Number(reloaded.reaction);
            if (prevVal === reactionVal) {
              // the concurrent insert created the same reaction; nothing to do
            } else {
              await PostReaction.updateOne(
                { _id: reloaded._id },
                { $set: { reaction: reactionVal } }
              );
              await decCount(prevVal);
              await incCount(reactionVal);
            }
          }
        } else {
          throw err;
        }
      }
    }

    const updated = await BlogPost.findById(post._id).select("reactionsCount");
    const visitorReaction = visitorId
      ? await PostReaction.findOne({ postId: post._id, visitorId })
      : null;
    const res2 = apiResponse(
      {
        reactionsCount: updated?.reactionsCount || {},
        visitorReaction: visitorReaction
          ? Number(visitorReaction.reaction)
          : null,
      },
      200
    );
    if (setVisitorCookie)
      res2.cookies.set("visitor-id", visitorId as string, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    return res2;
  }

  if (action === "comment") {
    const requiredFields = ["name", "email", "content"];
    for (const f of requiredFields)
      if (!body[f]) return apiError(`${f} is required`, 400);
    const payload: any = {
      postId: post._id,
      parentId: body.parentId || null,
      name: body.name,
      email: body.email.toLowerCase(),
      avatar: body.avatar,
      content: body.content,
      visitorId: visitorId as string,
      userAgent,
      isDeleted: false,
      status: body.status || "pending",
      ip,
    };
    const newComment = await Comment.create(payload);
    const res3 = apiResponse(newComment, 201, "Comment submitted");
    if (setVisitorCookie)
      res3.cookies.set("visitor-id", visitorId as string, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    return res3;
  }

  return apiError("Unsupported action", 400);
}

export const GET = withErrorHandling(getBlogPostHandler);
export const POST = withErrorHandling(postBlogSubActionHandler);
export const PUT = withAuth(withErrorHandling(updateBlogPostHandler));
export const DELETE = withAuth(withErrorHandling(deleteBlogPostHandler));
